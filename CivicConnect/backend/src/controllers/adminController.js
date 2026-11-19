import { store } from '../config/supabase.js';

// Get all departments
export async function getDepartments(req, res) {
  try {
    const list = store.departments.map(dept => {
      const activeCount = store.complaints.filter(c => c.department_id === dept.id && !['resolved', 'closed', 'rejected'].includes(c.status)).length;
      return {
        ...dept,
        activeComplaintsCount: activeCount
      };
    });
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch departments.' });
  }
}

// Get all categories
export async function getCategories(req, res) {
  try {
    res.json(store.categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories.' });
  }
}

// Get all municipal officers
export async function getOfficers(req, res) {
  try {
    const officers = store.profiles.filter(p => p.role === 'officer').map(officer => {
      const dept = store.departments.find(d => d.id === officer.departmentId);
      const assignedCount = store.complaints.filter(c => c.assigned_officer_id === officer.id && !['resolved', 'closed'].includes(c.status)).length;
      return {
        ...officer,
        departmentName: dept?.name || 'Unassigned',
        assignedCount
      };
    });
    res.json(officers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch officers.' });
  }
}

// Check and trigger automatic escalations (Section 17)
export async function checkEscalations(req, res) {
  try {
    const now = Date.now();
    let escalatedCount = 0;

    for (const complaint of store.complaints) {
      if (['resolved', 'closed', 'rejected'].includes(complaint.status)) continue;

      if (complaint.deadline_at && new Date(complaint.deadline_at).getTime() < now) {
        if (!complaint.is_escalated) {
          complaint.is_escalated = true;
          complaint.status = 'escalated';
          escalatedCount++;

          // Create notification for admin and officer
          store.addNotification({
            userId: 'u0000000-0000-0000-0000-000000000001', // Admin
            title: `Complaint Escalated: ${complaint.complaint_number}`,
            message: `Resolution deadline exceeded for ${complaint.title} (${complaint.locality}).`,
            type: 'escalation',
            link: `/complaints/${complaint.id}`
          });
        }
      }
    }

    res.json({
      success: true,
      newEscalations: escalatedCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to run escalation check.' });
  }
}

// In-app Notifications
export async function getNotifications(req, res) {
  try {
    const userId = req.user?.id || 'u0000000-0000-0000-0000-000000000101';
    const notifs = store.notifications.filter(n => n.userId === userId || !n.userId);
    res.json(notifs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications.' });
  }
}

export async function markNotificationRead(req, res) {
  try {
    const { id } = req.params;
    const notif = store.notifications.find(n => n.id === id);
    if (notif) notif.isRead = true;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notification.' });
  }
}

export async function markAllNotificationsRead(req, res) {
  try {
    const userId = req.user?.id || 'u0000000-0000-0000-0000-000000000101';
    store.notifications.forEach(n => {
      if (n.userId === userId) n.isRead = true;
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notifications.' });
  }
}
