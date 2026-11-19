import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { departments, categories, demoProfiles, initialComplaints } from '../data/seedData.js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  (supabaseServiceKey || supabaseAnonKey)
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey)
  : null;

/**
 * Robust in-memory / persistent mock store for demonstration
 * Ensures seamless local development and presentation even without an active Supabase project
 */
class MemoryDataStore {
  constructor() {
    this.departments = [...departments];
    this.categories = [...categories];
    this.profiles = [...demoProfiles];
    this.complaints = [...initialComplaints];
    this.votes = new Set(['c0000000-0000-0000-0000-000000000001:u0000000-0000-0000-0000-000000000101']);
    this.notifications = [
      {
        id: 'n1',
        userId: 'u0000000-0000-0000-0000-000000000101',
        title: 'Complaint Resolved',
        message: 'Your report CC-2026-000001 (Indiranagar Pothole) has been resolved by Er. Naveen Chandran.',
        type: 'status_update',
        link: '/complaints/c0000000-0000-0000-0000-000000000001',
        isRead: false,
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'n2',
        userId: 'u0000000-0000-0000-0000-000000000101',
        title: 'Status Updated to In Progress',
        message: 'Report CC-2026-000002 has been taken up by Solid Waste Management division.',
        type: 'status_update',
        link: '/complaints/c0000000-0000-0000-0000-000000000002',
        isRead: true,
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];
    this.auditLogs = [];
  }

  // Get single or list of complaints
  getComplaints(filters = {}) {
    let result = [...this.complaints];

    if (filters.status && filters.status !== 'all') {
      result = result.filter(c => c.status === filters.status);
    }
    if (filters.category_id && filters.category_id !== 'all') {
      result = result.filter(c => c.category_id === filters.category_id);
    }
    if (filters.locality && filters.locality !== 'all') {
      result = result.filter(c => c.locality.toLowerCase().includes(filters.locality.toLowerCase()));
    }
    if (filters.priority && filters.priority !== 'all') {
      result = result.filter(c => c.priority === filters.priority);
    }
    if (filters.reporter_id) {
      result = result.filter(c => c.reporter_id === filters.reporter_id);
    }
    if (filters.assigned_officer_id) {
      result = result.filter(c => c.assigned_officer_id === filters.assigned_officer_id);
    }
    if (filters.department_id) {
      result = result.filter(c => c.department_id === filters.department_id);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.complaint_number.toLowerCase().includes(q) ||
        c.location_address.toLowerCase().includes(q)
      );
    }

    return result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  getComplaintById(id) {
    return this.complaints.find(c => c.id === id || c.complaint_number === id);
  }

  createComplaint(complaintData) {
    const seq = (this.complaints.length + 1).toString().padStart(6, '0');
    const matchedCategory = this.categories.find(c => c.id === complaintData.categoryId);
    const departmentId = complaintData.departmentId || matchedCategory?.departmentId || 'd1000000-0000-0000-0000-000000000001';

    const newComplaint = {
      id: `c0000000-0000-0000-0000-${Date.now().toString(16).padStart(12, '0')}`,
      complaint_number: `CC-2026-${seq}`,
      title: complaintData.title,
      description: complaintData.description,
      category_id: complaintData.categoryId,
      reporter_id: complaintData.reporterId || 'u0000000-0000-0000-0000-000000000101',
      reporter_name: complaintData.reporterName || 'Bengaluru Citizen',
      department_id: departmentId,
      assigned_officer_id: complaintData.assignedOfficerId || null,
      status: 'submitted',
      severity: complaintData.severity || 5,
      priority_score: complaintData.priorityScore || 25,
      priority: complaintData.priority || 'medium',
      location_address: complaintData.locationAddress,
      locality: complaintData.locality || 'Indiranagar',
      ward: complaintData.ward || 'Ward 80',
      latitude: Number(complaintData.latitude),
      longitude: Number(complaintData.longitude),
      upvotes_count: 0,
      deadline_at: new Date(Date.now() + 72 * 3600000).toISOString(),
      is_escalated: false,
      evidence_image_url: complaintData.imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
      created_at: new Date().toISOString()
    };

    this.complaints.unshift(newComplaint);
    return newComplaint;
  }

  updateComplaint(id, updates) {
    const index = this.complaints.findIndex(c => c.id === id);
    if (index === -1) return null;

    this.complaints[index] = {
      ...this.complaints[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    return this.complaints[index];
  }

  toggleVote(complaintId, userId) {
    const key = `${complaintId}:${userId}`;
    const complaint = this.getComplaintById(complaintId);
    if (!complaint) return null;

    if (this.votes.has(key)) {
      this.votes.delete(key);
      complaint.upvotes_count = Math.max(0, (complaint.upvotes_count || 1) - 1);
      return { voted: false, upvotesCount: complaint.upvotes_count };
    } else {
      this.votes.add(key);
      complaint.upvotes_count = (complaint.upvotes_count || 0) + 1;
      return { voted: true, upvotesCount: complaint.upvotes_count };
    }
  }

  hasVoted(complaintId, userId) {
    return this.votes.has(`${complaintId}:${userId}`);
  }

  addNotification(notification) {
    const newNotif = {
      id: `n_${Date.now()}`,
      isRead: false,
      createdAt: new Date().toISOString(),
      ...notification
    };
    this.notifications.unshift(newNotif);
    return newNotif;
  }
}

export const store = new MemoryDataStore();
