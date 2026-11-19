import { store } from '../config/supabase.js';
import { calculatePriorityScore } from '../utils/priority.js';
import { findPotentialDuplicates } from '../utils/duplicateDetector.js';

// Get list of complaints with comprehensive filtering
export async function getComplaints(req, res) {
  try {
    const { status, category_id, locality, priority, search, page = 1, limit = 20, view } = req.query;

    const filters = { status, category_id, locality, priority, search };

    // Role-specific filtering
    if (req.user) {
      if (view === 'officer' && req.user.role === 'officer') {
        filters.department_id = req.user.departmentId;
      } else if (view === 'citizen' && req.user.role === 'citizen') {
        filters.reporter_id = req.user.id;
      }
    }

    const allMatching = store.getComplaints(filters);

    // Pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = allMatching.slice(startIndex, startIndex + limitNum);

    // Sanitize public view: hide personal phone numbers and emails
    const sanitized = paginated.map(item => ({
      ...item,
      reporter_phone: req.user?.role === 'admin' ? item.reporter_phone : undefined,
      reporter_email: req.user?.role === 'admin' ? item.reporter_email : undefined,
      hasVoted: req.user ? store.hasVoted(item.id, req.user.id) : false
    }));

    res.json({
      complaints: sanitized,
      total: allMatching.length,
      page: pageNum,
      totalPages: Math.ceil(allMatching.length / limitNum)
    });
  } catch (error) {
    console.error('Error in getComplaints:', error);
    res.status(500).json({ error: 'Failed to fetch complaints.' });
  }
}

// Get single complaint with full details and timeline
export async function getComplaintById(req, res) {
  try {
    const { id } = req.params;
    const complaint = store.getComplaintById(id);

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found.' });
    }

    // Include category & department metadata
    const category = store.categories.find(c => c.id === complaint.category_id);
    const department = store.departments.find(d => d.id === complaint.department_id);

    const hasVoted = req.user ? store.hasVoted(complaint.id, req.user.id) : false;

    // Timeline history
    const timeline = [
      {
        status: 'submitted',
        label: 'Complaint Submitted',
        timestamp: complaint.created_at,
        actor: complaint.reporter_name || 'Citizen',
        remarks: 'Issue registered into the CivicConnect system.'
      }
    ];

    if (complaint.status !== 'submitted') {
      timeline.push({
        status: 'under_review',
        label: 'Under Municipal Review',
        timestamp: new Date(new Date(complaint.created_at).getTime() + 1800000).toISOString(),
        actor: 'Municipal Control Cell',
        remarks: 'Location and jurisdictional department validated.'
      });
    }

    if (['assigned', 'in_progress', 'resolved', 'closed'].includes(complaint.status)) {
      timeline.push({
        status: 'assigned',
        label: 'Officer Assigned',
        timestamp: new Date(new Date(complaint.created_at).getTime() + 3600000).toISOString(),
        actor: department?.name || 'Department Officer',
        remarks: `Assigned to field engineer: ${complaint.assigned_officer_name || 'Field Officer'}`
      });
    }

    if (['in_progress', 'resolved', 'closed'].includes(complaint.status)) {
      timeline.push({
        status: 'in_progress',
        label: 'Work in Progress',
        timestamp: new Date(new Date(complaint.created_at).getTime() + 7200000).toISOString(),
        actor: complaint.assigned_officer_name || 'Field Team',
        remarks: 'Crew deployed to location with necessary machinery and materials.'
      });
    }

    if (['resolved', 'closed'].includes(complaint.status)) {
      timeline.push({
        status: 'resolved',
        label: 'Resolved by Department',
        timestamp: complaint.resolved_at || new Date().toISOString(),
        actor: complaint.assigned_officer_name || 'Field Officer',
        remarks: complaint.resolution_remarks || 'Inspection completed and repair finalized.',
        proofUrl: complaint.resolution_proof_url
      });
    }

    if (complaint.status === 'closed') {
      timeline.push({
        status: 'closed',
        label: 'Verified & Closed',
        timestamp: complaint.closed_at || new Date().toISOString(),
        actor: complaint.reporter_name || 'Citizen',
        remarks: 'Citizen verified resolution and recorded feedback.'
      });
    }

    if (complaint.status === 'rejected') {
      timeline.push({
        status: 'rejected',
        label: 'Rejected',
        timestamp: complaint.updated_at || new Date().toISOString(),
        actor: 'Municipal Review Committee',
        remarks: complaint.rejection_reason || 'Does not qualify for municipal resolution.'
      });
    }

    if (complaint.status === 'reopened') {
      timeline.push({
        status: 'reopened',
        label: 'Reopened by Citizen',
        timestamp: complaint.updated_at || new Date().toISOString(),
        actor: complaint.reporter_name || 'Citizen',
        remarks: complaint.reopen_reason || 'Citizen reported inadequate or incomplete resolution.'
      });
    }

    res.json({
      ...complaint,
      category,
      department,
      timeline,
      hasVoted
    });
  } catch (error) {
    console.error('Error in getComplaintById:', error);
    res.status(500).json({ error: 'Failed to retrieve complaint.' });
  }
}

// Check for potential duplicate complaints
export async function checkDuplicate(req, res) {
  try {
    const { title, description, categoryId, latitude, longitude, radiusMeters = 50 } = req.body;

    const duplicates = findPotentialDuplicates(
      { title, description, categoryId, latitude, longitude },
      store.complaints,
      radiusMeters
    );

    res.json({
      hasDuplicates: duplicates.length > 0,
      count: duplicates.length,
      duplicates
    });
  } catch (error) {
    console.error('Error in checkDuplicate:', error);
    res.status(500).json({ error: 'Failed to check duplicates.' });
  }
}

// Create new civic complaint
export async function createComplaint(req, res) {
  try {
    const {
      title,
      description,
      categoryId,
      severity = 5,
      locationAddress,
      locality,
      ward,
      latitude,
      longitude,
      imageUrl
    } = req.body;

    if (!title || !description || !categoryId || !locationAddress || !latitude || !longitude) {
      return res.status(400).json({ error: 'Missing required complaint fields.' });
    }

    // 1. Automatic Department Assignment based on category
    const category = store.categories.find(c => c.id === categoryId);
    const departmentId = category?.departmentId || 'd1000000-0000-0000-0000-000000000001';

    // 2. Calculate dynamic priority
    const priorityCalc = calculatePriorityScore(severity, 0, new Date());

    // 3. Find default officer for department
    const assignedOfficer = store.profiles.find(p => p.role === 'officer' && p.departmentId === departmentId);

    // 4. Create complaint
    const newComplaint = store.createComplaint({
      title,
      description,
      categoryId,
      departmentId,
      assignedOfficerId: assignedOfficer?.id || null,
      assignedOfficerName: assignedOfficer?.fullName || null,
      severity: Number(severity),
      priorityScore: priorityCalc.score,
      priority: priorityCalc.level,
      locationAddress,
      locality: locality || 'Bengaluru',
      ward: ward || 'Ward Central',
      latitude: Number(latitude),
      longitude: Number(longitude),
      imageUrl,
      reporterId: req.user?.id,
      reporterName: req.user?.fullName
    });

    // 5. Send notification to citizen
    if (req.user) {
      store.addNotification({
        userId: req.user.id,
        title: 'Complaint Registered Successfully',
        message: `Your grievance ${newComplaint.complaint_number} has been logged and assigned to ${category?.name || 'Municipal Department'}.`,
        type: 'complaint_submitted',
        link: `/complaints/${newComplaint.id}`
      });
    }

    res.status(201).json(newComplaint);
  } catch (error) {
    console.error('Error in createComplaint:', error);
    res.status(500).json({ error: 'Failed to submit complaint.' });
  }
}

// Update complaint status (with lifecycle enforcement)
export async function updateStatus(req, res) {
  try {
    const { id } = req.params;
    const { newStatus, remarks, resolutionProofUrl, rejectionReason } = req.body;

    const complaint = store.getComplaintById(id);
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found.' });
    }

    // Master spec Section 15: "A complaint cannot be marked as resolved without resolution remarks and photographic evidence"
    if (newStatus === 'resolved' && (!remarks || !resolutionProofUrl)) {
      return res.status(400).json({
        error: 'A complaint cannot be marked as resolved without official remarks and photographic proof.'
      });
    }

    if (newStatus === 'rejected' && !rejectionReason) {
      return res.status(400).json({
        error: 'Rejected complaints must include an official reason.'
      });
    }

    const updates = {
      status: newStatus,
      updated_at: new Date().toISOString()
    };

    if (newStatus === 'resolved') {
      updates.resolution_remarks = remarks;
      updates.resolution_proof_url = resolutionProofUrl;
      updates.resolved_at = new Date().toISOString();
    } else if (newStatus === 'rejected') {
      updates.rejection_reason = rejectionReason;
    } else if (newStatus === 'closed') {
      updates.closed_at = new Date().toISOString();
    }

    const updated = store.updateComplaint(id, updates);

    // Notify citizen
    if (complaint.reporter_id) {
      store.addNotification({
        userId: complaint.reporter_id,
        title: `Complaint Status Updated: ${newStatus.toUpperCase()}`,
        message: `Your complaint ${complaint.complaint_number} status changed to ${newStatus}. ${remarks ? `Remarks: ${remarks}` : ''}`,
        type: 'status_update',
        link: `/complaints/${complaint.id}`
      });
    }

    res.json(updated);
  } catch (error) {
    console.error('Error in updateStatus:', error);
    res.status(500).json({ error: 'Failed to update status.' });
  }
}

// Upvote complaint
export async function voteComplaint(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user?.id || 'u0000000-0000-0000-0000-000000000101';

    const result = store.toggleVote(id, userId);
    if (!result) {
      return res.status(404).json({ error: 'Complaint not found.' });
    }

    // Recalculate priority score
    const complaint = store.getComplaintById(id);
    const priorityCalc = calculatePriorityScore(complaint.severity, complaint.upvotes_count, complaint.created_at);
    store.updateComplaint(id, {
      priority_score: priorityCalc.score,
      priority: priorityCalc.level
    });

    res.json({
      success: true,
      voted: result.voted,
      upvotesCount: result.upvotesCount,
      priority: priorityCalc.level,
      priorityScore: priorityCalc.score
    });
  } catch (error) {
    console.error('Error in voteComplaint:', error);
    res.status(500).json({ error: 'Failed to register vote.' });
  }
}

// Submit resolution feedback or verification
export async function submitFeedback(req, res) {
  try {
    const { id } = req.params;
    const { rating, comment, isVerified, reopenRequested, reopenReason } = req.body;

    const complaint = store.getComplaintById(id);
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found.' });
    }

    const updates = {
      feedback: {
        rating: Number(rating) || 5,
        comment: comment || '',
        is_verified: Boolean(isVerified)
      }
    };

    if (reopenRequested) {
      updates.status = 'reopened';
      updates.reopen_reason = reopenReason || 'Citizen disputed the resolution quality.';
    } else if (isVerified) {
      updates.status = 'closed';
      updates.closed_at = new Date().toISOString();
    }

    const updated = store.updateComplaint(id, updates);
    res.json(updated);
  } catch (error) {
    console.error('Error in submitFeedback:', error);
    res.status(500).json({ error: 'Failed to submit feedback.' });
  }
}
