import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MapPin,
  Calendar,
  Filter,
  Search,
  ArrowRight,
  ShieldAlert,
  Camera,
  CheckSquare
} from 'lucide-react';
import { api } from '../services/api';
import type { Complaint, ComplaintStatus } from '../types';
import { CivicMap } from '../components/CivicMap';
import { useAuth } from '../contexts/AuthContext';

export const OfficerDashboard: React.FC = () => {
  const { user, showToast } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'assigned' | 'map'>('assigned');
  const [statusFilter, setStatusFilter] = useState('all');

  // Status update modal state
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [targetStatus, setTargetStatus] = useState<ComplaintStatus>('in_progress');
  const [remarks, setRemarks] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadDepartmentTasks();
  }, [user]);

  const loadDepartmentTasks = async () => {
    setLoading(true);
    const res = await api.getComplaints({ view: 'officer', limit: 50 });
    setComplaints(res.complaints);
    setLoading(false);
  };

  const assignedCount = complaints.length;
  const inProgressCount = complaints.filter((c) => c.status === 'in_progress').length;
  const completedCount = complaints.filter((c) => ['resolved', 'closed'].includes(c.status)).length;
  const criticalCount = complaints.filter((c) => c.priority === 'critical' && !['resolved', 'closed'].includes(c.status)).length;
  const overdueCount = complaints.filter(
    (c) => !['resolved', 'closed'].includes(c.status) && c.deadline_at && new Date(c.deadline_at).getTime() < Date.now()
  ).length;

  const filtered = complaints.filter((c) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'overdue') {
      return !['resolved', 'closed'].includes(c.status) && c.deadline_at && new Date(c.deadline_at).getTime() < Date.now();
    }
    return c.status === statusFilter;
  });

  const handleOpenUpdate = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setTargetStatus(complaint.status === 'submitted' ? 'in_progress' : 'resolved');
    setRemarks('');
    setProofUrl('');
  };

  const handleSubmitStatus = async () => {
    if (!selectedComplaint) return;
    if (targetStatus === 'resolved' && (!remarks.trim() || !proofUrl.trim())) {
      showToast('Master Requirement: Resolution remarks and photographic evidence are mandatory.', 'warning');
      return;
    }

    try {
      setUpdating(true);
      const updated = await api.updateStatus(selectedComplaint.id, {
        newStatus: targetStatus,
        remarks,
        resolutionProofUrl: proofUrl
      });
      setComplaints((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      setSelectedComplaint(null);
      showToast(`Complaint ${updated.complaint_number} updated to ${targetStatus.toUpperCase()}!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update task.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Officer Header */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
              <Building2 className="w-3.5 h-3.5" />
              <span>{user.designation || 'Executive Engineer'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading">
              {user.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Department: <strong className="text-white">{user.departmentName || 'Road Infrastructure'}</strong> • Zone: <strong className="text-white">{user.locality || 'East Zone, Indiranagar'}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Active Shift:</span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-emerald-400 text-xs font-mono font-bold border border-slate-700">
              ON-DUTY
            </span>
          </div>
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs text-slate-400 font-medium">Assigned Tasks</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-secondary-900 font-heading">{assignedCount}</div>
            <span className="text-[11px] text-slate-500">In department queue</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs text-slate-400 font-medium">Active In Progress</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-primary-600 font-heading">{inProgressCount}</div>
            <span className="text-[11px] text-slate-500">Crew deployed</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs text-slate-400 font-medium">Completed</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-heading">{completedCount}</div>
            <span className="text-[11px] text-slate-500">Verified & closed</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs text-slate-400 font-medium">Critical Priority</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-red-600 font-heading">{criticalCount}</div>
            <span className="text-[11px] text-slate-500">High public hazard</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1 col-span-2 sm:col-span-1">
            <span className="text-xs text-slate-400 font-medium">Overdue (SLA)</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 font-heading">{overdueCount}</div>
            <span className="text-[11px] text-slate-500">Past target SLA</span>
          </div>
        </div>

        {/* Toggle & Filter Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('assigned')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'assigned'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Task Queue ({filtered.length})
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'map'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Department Field Map
            </button>
          </div>

          {activeTab === 'assigned' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Filter Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white"
              >
                <option value="all">All Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="overdue">Overdue Deadlines</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        {activeTab === 'map' ? (
          <div className="space-y-3">
            <div className="text-xs text-slate-500">
              Displaying all incident locations assigned to your departmental jurisdiction in Bengaluru.
            </div>
            <CivicMap complaints={complaints} height="580px" />
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-heading font-bold text-[11px]">
                    <th className="py-4 px-5">ID & Title</th>
                    <th className="py-4 px-4">Locality & Ward</th>
                    <th className="py-4 px-3">Priority</th>
                    <th className="py-4 px-3">Status</th>
                    <th className="py-4 px-4">SLA Deadline</th>
                    <th className="py-4 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">Loading department queue...</td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">No complaints matching filter.</td>
                    </tr>
                  ) : (
                    filtered.map((item) => {
                      const isOverdue =
                        !['resolved', 'closed'].includes(item.status) &&
                        item.deadline_at &&
                        new Date(item.deadline_at).getTime() < Date.now();

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-5">
                            <div className="font-mono font-bold text-[11px] text-primary-600 mb-0.5">
                              {item.complaint_number}
                            </div>
                            <div className="font-bold text-slate-900 text-xs max-w-sm line-clamp-1">
                              {item.title}
                            </div>
                            <span className="text-[10px] text-slate-400">
                              Reported: {new Date(item.created_at).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-slate-700">
                            <div className="font-semibold">{item.locality}</div>
                            <div className="text-[11px] text-slate-400">{item.ward}</div>
                          </td>
                          <td className="py-4 px-3">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                                item.priority === 'critical'
                                  ? 'bg-red-100 text-red-800 border-red-200'
                                  : item.priority === 'high'
                                  ? 'bg-amber-100 text-amber-800 border-amber-200'
                                  : 'bg-blue-100 text-blue-800 border-blue-200'
                              }`}
                            >
                              {item.priority}
                            </span>
                          </td>
                          <td className="py-4 px-3">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                                item.status === 'resolved'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-blue-50 text-blue-700 border-blue-200'
                              }`}
                            >
                              {item.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            {isOverdue ? (
                              <span className="text-red-600 font-bold text-[11px] flex items-center gap-1">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                <span>OVERDUE</span>
                              </span>
                            ) : (
                              <span className="text-slate-600 text-[11px]">
                                {item.deadline_at ? new Date(item.deadline_at).toLocaleDateString() : 'Active SLA'}
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-5 text-right space-x-2">
                            <button
                              type="button"
                              onClick={() => handleOpenUpdate(item)}
                              className="px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-sm transition-colors"
                            >
                              Update Status
                            </button>
                            <Link
                              to={`/complaints/${item.id}`}
                              className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition-colors inline-block"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Status Update Modal with Resolution Evidence Enforcement */}
        {selectedComplaint && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 font-heading">
                  Field Progress Update: {selectedComplaint.complaint_number}
                </h3>
                <span className="text-xs font-mono text-slate-400">Officer Action</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Change Complaint Lifecycle Status:
                </label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value as ComplaintStatus)}
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl bg-white"
                >
                  <option value="in_progress">Work In Progress (Team on site)</option>
                  <option value="resolved">Mark as Resolved (Requires Evidence)</option>
                </select>
              </div>

              {targetStatus === 'resolved' && (
                <>
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                    <strong>Mandatory Verification Rule:</strong>
                    <p>Per municipal guidelines, complaints cannot be resolved without field remarks and photo proof.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Resolution Remarks *
                    </label>
                    <textarea
                      rows={3}
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Detail the materials used, work completion steps, and inspection findings..."
                      className="w-full text-xs p-3 border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Photographic Completion Proof URL *
                    </label>
                    <input
                      type="url"
                      value={proofUrl}
                      onChange={(e) => setProofUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full text-xs p-3 border border-slate-300 rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setProofUrl(
                          'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80'
                        )
                      }
                      className="text-[11px] text-primary-600 hover:underline mt-1 block"
                    >
                      Fill sample resolution proof image
                    </button>
                  </div>
                </>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedComplaint(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={updating}
                  onClick={handleSubmitStatus}
                  className="px-6 py-2 text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow"
                >
                  {updating ? 'Updating...' : 'Commit Status Update'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
