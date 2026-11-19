import type {
  Complaint,
  Category,
  Department,
  PlatformSummary,
  NotificationItem,
  UserProfile
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

class ApiService {
  private currentRole: string = 'citizen';

  setRole(role: string) {
    this.currentRole = role;
  }

  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'X-Dev-Role': this.currentRole
    };
  }

  async getPlatformSummary(): Promise<PlatformSummary> {
    try {
      const res = await fetch(`${API_BASE}/stats/summary`, { headers: this.getHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API unavailable, returning seed summary.');
    }
    return {
      totalComplaints: 50,
      activeComplaints: 36,
      resolvedComplaints: 14,
      criticalComplaints: 9,
      overdueComplaints: 3,
      escalatedComplaints: 1,
      totalCitizens: 21,
      totalOfficers: 6,
      averageResolutionHours: 36,
      resolutionRate: 72
    };
  }

  async getCategories(): Promise<Category[]> {
    try {
      const res = await fetch(`${API_BASE}/categories`, { headers: this.getHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API unavailable, using fallback categories.');
    }
    return [
      { id: 'c1000000-0000-0000-0000-000000000001', name: 'Potholes and road damage', slug: 'potholes', icon: 'AlertTriangle', description: 'Damaged road surface, crater-like potholes, and missing road paving causing danger to commuters.', departmentId: 'd1000000-0000-0000-0000-000000000001', defaultSeverity: 7, resolutionDeadlineHours: 48 },
      { id: 'c1000000-0000-0000-0000-000000000002', name: 'Garbage accumulation', slug: 'garbage', icon: 'Trash2', description: 'Uncollected municipal garbage bins, roadside trash piles, and illegal roadside waste accumulation.', departmentId: 'd1000000-0000-0000-0000-000000000002', defaultSeverity: 6, resolutionDeadlineHours: 24 },
      { id: 'c1000000-0000-0000-0000-000000000003', name: 'Streetlight malfunction', slug: 'streetlight', icon: 'LightbulbOff', description: 'Dead streetlights, flickering lamps, or damaged electric poles posing safety risks at night.', departmentId: 'd1000000-0000-0000-0000-000000000003', defaultSeverity: 5, resolutionDeadlineHours: 48 },
      { id: 'c1000000-0000-0000-0000-000000000004', name: 'Water supply issues', slug: 'water-supply', icon: 'Droplets', description: 'Low water pressure, disrupted drinking water supply, or contaminated pipeline water.', departmentId: 'd1000000-0000-0000-0000-000000000004', defaultSeverity: 8, resolutionDeadlineHours: 24 },
      { id: 'c1000000-0000-0000-0000-000000000005', name: 'Water leakage', slug: 'water-leakage', icon: 'Pipette', description: 'Ruptured BWSSB mains, roadside freshwater flooding from pipeline bursts, and wastage.', departmentId: 'd1000000-0000-0000-0000-000000000004', defaultSeverity: 7, resolutionDeadlineHours: 24 },
      { id: 'c1000000-0000-0000-0000-000000000006', name: 'Drainage blockage', slug: 'drainage-blockage', icon: 'CircleSlash', description: 'Choked underground sewers, overflowing manholes, and foul odor on public footpaths.', departmentId: 'd1000000-0000-0000-0000-000000000005', defaultSeverity: 7, resolutionDeadlineHours: 48 },
      { id: 'c1000000-0000-0000-0000-000000000007', name: 'Waterlogging', slug: 'waterlogging', icon: 'Waves', description: 'Monsoon road flooding, submerged underpasses, and stagnant stormwater hindering vehicular movement.', departmentId: 'd1000000-0000-0000-0000-000000000005', defaultSeverity: 9, resolutionDeadlineHours: 24 },
      { id: 'c1000000-0000-0000-0000-000000000008', name: 'Damaged public infrastructure', slug: 'damaged-infra', icon: 'Building', description: 'Broken footpaths, open utility pits, damaged bus shelters, or missing pedestrian guardrails.', departmentId: 'd1000000-0000-0000-0000-000000000001', defaultSeverity: 6, resolutionDeadlineHours: 96 },
      { id: 'c1000000-0000-0000-0000-000000000009', name: 'Illegal dumping', slug: 'illegal-dumping', icon: 'ShieldAlert', description: 'Unauthorized construction debris dumping, industrial effluent disposal, and vacant site littering.', departmentId: 'd1000000-0000-0000-0000-000000000002', defaultSeverity: 6, resolutionDeadlineHours: 72 },
      { id: 'c1000000-0000-0000-0000-000000000010', name: 'Public sanitation', slug: 'sanitation', icon: 'Sparkles', description: 'Unsanitary public toilets, open defecation spots, or hazardous biological litter.', departmentId: 'd1000000-0000-0000-0000-000000000002', defaultSeverity: 7, resolutionDeadlineHours: 24 },
      { id: 'c1000000-0000-0000-0000-000000000011', name: 'Traffic signal malfunction', slug: 'traffic-signals', icon: 'Timer', description: 'Non-functional intersection blinkers, broken signal timers causing peak-hour gridlocks.', departmentId: 'd1000000-0000-0000-0000-000000000006', defaultSeverity: 8, resolutionDeadlineHours: 12 },
      { id: 'c1000000-0000-0000-0000-000000000012', name: 'Environmental issues', slug: 'environmental', icon: 'TreePine', description: 'Uprooted trees obstructing pathways, hazardous branches over power cables, or lake encroachment.', departmentId: 'd1000000-0000-0000-0000-000000000001', defaultSeverity: 6, resolutionDeadlineHours: 48 },
      { id: 'c1000000-0000-0000-0000-000000000013', name: 'Other civic grievances', slug: 'other', icon: 'HelpCircle', description: 'Miscellaneous civic problems requiring municipal inspection and coordination.', departmentId: 'd1000000-0000-0000-0000-000000000001', defaultSeverity: 4, resolutionDeadlineHours: 168 }
    ];
  }

  async getDepartments(): Promise<Department[]> {
    try {
      const res = await fetch(`${API_BASE}/departments`, { headers: this.getHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API unavailable, returning departments fallback.');
    }
    return [
      { id: 'd1000000-0000-0000-0000-000000000001', name: 'Road Infrastructure & Maintenance', code: 'BBMP-ROAD', description: 'Road maintenance, patching, asphalt works and footpath repairs.', headName: 'Er. R. S. Manjunath', contactEmail: 'roads@civicconnect.bengaluru.demo', contactPhone: '+91 80 2266 0001' },
      { id: 'd1000000-0000-0000-0000-000000000002', name: 'Solid Waste Management', code: 'BBMP-SWM', description: 'Door-to-door collection, dry waste processing and sanitation.', headName: 'Dr. Anitha Rao', contactEmail: 'swm@civicconnect.bengaluru.demo', contactPhone: '+91 80 2266 0002' },
      { id: 'd1000000-0000-0000-0000-000000000003', name: 'Street Lighting & Electrical', code: 'BESCOM-BBMP', description: 'Streetlight maintenance, high mast lamps and safety lines.', headName: 'Er. Suresh Kumar N', contactEmail: 'lighting@civicconnect.bengaluru.demo', contactPhone: '+91 80 2266 0003' },
      { id: 'd1000000-0000-0000-0000-000000000004', name: 'Water Supply & Sewerage', code: 'BWSSB', description: 'Potable water distribution, mains leakage and sewage lines.', headName: 'Er. K. Vijayendra', contactEmail: 'water@civicconnect.bengaluru.demo', contactPhone: '+91 80 2266 0004' },
      { id: 'd1000000-0000-0000-0000-000000000005', name: 'Stormwater Drainage & Flood Control', code: 'BBMP-SWD', description: 'Desilting of primary drains and flood control mitigation.', headName: 'Er. Pradeep Hegde', contactEmail: 'drainage@civicconnect.bengaluru.demo', contactPhone: '+91 80 2266 0005' },
      { id: 'd1000000-0000-0000-0000-000000000006', name: 'Traffic Signals & Public Transport', code: 'BTP-BBMP', description: 'Traffic signals, crossing signs and intersection coordination.', headName: 'ACP Chethan Gowda', contactEmail: 'traffic@civicconnect.bengaluru.demo', contactPhone: '+91 80 2266 0006' }
    ];
  }

  async getComplaints(params: Record<string, string | number> = {}): Promise<{ complaints: Complaint[]; total: number }> {
    try {
      const qs = new URLSearchParams(params as Record<string, string>).toString();
      const res = await fetch(`${API_BASE}/complaints?${qs}`, { headers: this.getHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API unavailable, returning local seed complaints.');
    }
    return { complaints: [], total: 0 };
  }

  async getComplaintById(id: string): Promise<Complaint | null> {
    try {
      const res = await fetch(`${API_BASE}/complaints/${id}`, { headers: this.getHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error('Error fetching complaint:', e);
    }
    return null;
  }

  async checkDuplicates(payload: {
    title: string;
    description: string;
    categoryId: string;
    latitude: number;
    longitude: number;
  }): Promise<{ hasDuplicates: boolean; count: number; duplicates: any[] }> {
    try {
      const res = await fetch(`${API_BASE}/complaints/check-duplicate`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Duplicate check API failed, proceeding gracefully.');
    }
    return { hasDuplicates: false, count: 0, duplicates: [] };
  }

  async createComplaint(payload: any): Promise<Complaint> {
    const res = await fetch(`${API_BASE}/complaints`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to submit complaint.');
    }
    return await res.json();
  }

  async toggleVote(complaintId: string): Promise<{ voted: boolean; upvotesCount: number }> {
    const res = await fetch(`${API_BASE}/complaints/${complaintId}/vote`, {
      method: 'POST',
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error('Failed to update vote.');
    return await res.json();
  }

  async updateStatus(
    complaintId: string,
    payload: { newStatus: string; remarks?: string; resolutionProofUrl?: string; rejectionReason?: string }
  ): Promise<Complaint> {
    const res = await fetch(`${API_BASE}/complaints/${complaintId}/status`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update complaint status.');
    }
    return await res.json();
  }

  async submitFeedback(
    complaintId: string,
    payload: { rating: number; comment?: string; isVerified?: boolean; reopenRequested?: boolean; reopenReason?: string }
  ): Promise<Complaint> {
    const res = await fetch(`${API_BASE}/complaints/${complaintId}/feedback`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to record feedback.');
    return await res.json();
  }

  async getNotifications(): Promise<NotificationItem[]> {
    try {
      const res = await fetch(`${API_BASE}/notifications`, { headers: this.getHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Notifications endpoint unreachable.');
    }
    return [];
  }

  async markNotificationRead(id: string): Promise<void> {
    await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: this.getHeaders()
    }).catch(() => {});
  }

  async markAllNotificationsRead(): Promise<void> {
    await fetch(`${API_BASE}/notifications/read-all`, {
      method: 'PATCH',
      headers: this.getHeaders()
    }).catch(() => {});
  }

  async getAnalytics(): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/analytics`, { headers: this.getHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Analytics endpoint unreachable.');
    }
    return null;
  }

  async suggestAiCategory(payload: { fileName: string; imageUrl?: string }): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/ai/classify`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('AI endpoint unreachable.');
    }
    return null;
  }

  getProfiles(): UserProfile[] {
    return [
      {
        id: 'u0000000-0000-0000-0000-000000000101',
        email: 'citizen.arun@gmail.demo',
        fullName: 'Arun Kumar Prasad',
        role: 'citizen',
        phoneNumber: '+91 98451 10001',
        locality: 'Indiranagar',
        ward: 'Ward 80 - Hoysala Nagar'
      },
      {
        id: 'u0000000-0000-0000-0000-000000000011',
        email: 'officer.roads@civicconnect.demo',
        fullName: 'Er. Naveen Chandran',
        role: 'officer',
        phoneNumber: '+91 98450 00011',
        departmentId: 'd1000000-0000-0000-0000-000000000001',
        departmentName: 'Road Infrastructure & Maintenance',
        designation: 'Executive Engineer - Roads',
        locality: 'East Zone, Indiranagar'
      },
      {
        id: 'u0000000-0000-0000-0000-000000000001',
        email: 'admin@civicconnect.demo',
        fullName: 'Rajeshwari Sharma, IAS',
        role: 'admin',
        phoneNumber: '+91 98450 00001',
        locality: 'BBMP Head Office',
        designation: 'Chief Municipal Administrator'
      }
    ];
  }
}

export const api = new ApiService();
