export type UserRole = 'citizen' | 'officer' | 'admin';

export type ComplaintStatus =
  | 'submitted'
  | 'under_review'
  | 'assigned'
  | 'in_progress'
  | 'resolved'
  | 'closed'
  | 'rejected'
  | 'reopened'
  | 'escalated';

export type PriorityLevel = 'low' | 'medium' | 'high' | 'critical';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phoneNumber?: string;
  departmentId?: string;
  departmentName?: string;
  designation?: string;
  locality?: string;
  ward?: string;
  avatarUrl?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  headName: string;
  contactEmail: string;
  contactPhone: string;
  activeComplaintsCount?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  departmentId: string;
  defaultSeverity: number;
  resolutionDeadlineHours: number;
}

export interface Complaint {
  id: string;
  complaint_number: string;
  title: string;
  description: string;
  category_id: string;
  category?: Category;
  department_id?: string;
  department?: Department;
  reporter_id: string;
  reporter_name?: string;
  assigned_officer_id?: string | null;
  assigned_officer_name?: string | null;
  status: ComplaintStatus;
  severity: number;
  priority_score: number;
  priority: PriorityLevel;
  location_address: string;
  locality: string;
  ward: string;
  latitude: number;
  longitude: number;
  upvotes_count: number;
  deadline_at?: string;
  is_escalated?: boolean;
  evidence_image_url?: string;
  resolution_remarks?: string | null;
  resolution_proof_url?: string | null;
  rejection_reason?: string | null;
  reopen_reason?: string | null;
  created_at: string;
  updated_at?: string;
  resolved_at?: string | null;
  closed_at?: string | null;
  hasVoted?: boolean;
  timeline?: ComplaintTimelineItem[];
  feedback?: ComplaintFeedback;
}

export interface ComplaintTimelineItem {
  status: ComplaintStatus;
  label: string;
  timestamp: string;
  actor: string;
  remarks: string;
  proofUrl?: string | null;
}

export interface ComplaintFeedback {
  rating: number;
  comment?: string;
  is_verified?: boolean;
  reopen_requested?: boolean;
}

export interface PlatformSummary {
  totalComplaints: number;
  activeComplaints: number;
  resolvedComplaints: number;
  criticalComplaints: number;
  overdueComplaints: number;
  escalatedComplaints: number;
  totalCitizens: number;
  totalOfficers: number;
  averageResolutionHours: number;
  resolutionRate: number;
}

export interface NotificationItem {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}
