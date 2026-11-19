import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Clock,
  ThumbsUp,
  AlertTriangle,
  Building,
  CheckCircle2,
  Share2,
  Calendar,
  User,
  ShieldCheck,
  Edit3
} from 'lucide-react';
import { api } from '../services/api';
import type { Complaint, ComplaintStatus } from '../types';
import { CivicMap } from '../components/CivicMap';
import { ResolutionVerifier } from '../components/ResolutionVerifier';
import { useAuth } from '../contexts/AuthContext';

export const ComplaintDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, role, showToast } = useAuth();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);

  // Status update modal for Officer/Admin
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [targetStatus, setTargetStatus] = useState<ComplaintStatus>('in_progress');
  const [remarks, setRemarks] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) loadComplaint(id);
  }, [id]);

  const loadComplaint = async (complaintId: string) => {
    setLoading(true);
    const data = await api.getComplaintById(complaintId);
    setComplaint(data);
    setLoading(false);
  };

  const handleVote = async () => {
    if (!complaint) return;
    try {
      const res = await api.toggleVote(complaint.id);
      setComplaint((prev) =>
        prev ? { ...prev, upvotes_count: res.upvotesCount, hasVoted: res.voted } : null
      );
      showToast(res.voted ? 'Upvoted! Priority score adjusted.' : 'Upvote removed.', 'info');
    } catch (e) {
      showToast('Could not register vote.', 'error');
    }
  };

  const handleUpdateStatus = async () => {
    if (!complaint) return;
    if (targetStatus === 'resolved' && (!remarks.trim() || !proofUrl.trim())) {
      showToast('Resolution remarks and photographic proof are mandatory.', 'warning');
      return;
    }
    if (targetStatus === 'rejected' && !rejectionReason.trim()) {
      showToast('Please state official rejection reason.', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      const updated = await api.updateStatus(complaint.id, {
        newStatus: targetStatus,
        remarks,
        resolutionProofUrl: proofUrl,
        rejectionReason
      });
      setComplaint(updated);
      setShowStatusModal(false);
      showToast(`Complaint status updated to ${targetStatus.toUpperCase()}!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update status.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-16 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-slate-500">Loading grievance record...</p>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen bg-background py-16 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-slate-200">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Complaint Record Not Found</h2>
          <p className="text-xs text-slate-500 mb-4">The requested ID does not exist or has been archived.</p>
          <Link to="/explore" className="text-xs font-bold text-primary-600 hover:underline">
            ← Return to Explorer
          </Link>
        </div>
      </div>
    );
  }

  const isOfficerOrAdmin = role === 'officer' || role === 'admin';

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Back Navigation & Action Bar */}
        <div className="flex items-center justify-between">
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Explorer</span>
          </Link>

          <div className="flex items-center gap-2">
            {isOfficerOrAdmin && (
              <button
                onClick={() => setShowStatusModal(true)}
                className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Edit3 className="w-4 h-4" />
                <span>Update Lifecycle Status</span>
              </button>
            )}

            <button
              onClick={handleVote}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border shadow-sm transition-colors ${
                complaint.hasVoted
                  ? 'bg-primary-50 border-primary-300 text-primary-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-primary-400'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${complaint.hasVoted ? 'fill-primary-600' : ''}`} />
              <span>{complaint.upvotes_count || 0} Upvotes</span>
            </button>
          </div>
        </div>

        {/* Main Details Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-extrabold px-3 py-1 rounded-lg bg-slate-900 text-white">
                {complaint.complaint_number}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-primary-700 border border-blue-200">
                {complaint.category?.name || 'Civic Defect'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-md font-bold uppercase tracking-wider bg-slate-100 text-slate-800 border">
                Status: {complaint.status.replace('_', ' ')}
              </span>
              <span className="px-2.5 py-1 rounded-md font-bold uppercase tracking-wider bg-red-100 text-red-800 border border-red-200">
                Priority: {complaint.priority} ({complaint.priority_score})
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-secondary-900 font-heading mb-4">
            {complaint.title}
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed mb-6 font-body">
            {complaint.description}
          </p>

          {/* Metadata Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Location</span>
              <span className="font-bold text-slate-800">{complaint.locality} ({complaint.ward})</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Department</span>
              <span className="font-bold text-slate-800">{complaint.department?.name || 'BBMP Division'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Reported On</span>
              <span className="font-bold text-slate-800">{new Date(complaint.created_at).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Assigned Officer</span>
              <span className="font-bold text-slate-800">{complaint.assigned_officer_name || 'Pending Allocation'}</span>
            </div>
          </div>
        </div>

        {/* Before and After Verification (If resolved or closed) */}
        {(complaint.status === 'resolved' || complaint.status === 'closed') && (
          <ResolutionVerifier
            complaint={complaint}
            onUpdated={(updated) => setComplaint(updated)}
          />
        )}

        {/* Visual Chronological Timeline */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 font-heading mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary-600" />
            <span>Complaint Lifecycle & Audit Trail</span>
          </h3>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {complaint.timeline && complaint.timeline.length > 0 ? (
              complaint.timeline.map((step, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white border-4 border-primary-600"></div>
                  <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm font-heading">{step.label}</span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {new Date(step.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{step.remarks}</p>
                    <div className="pt-1 text-[11px] text-primary-700 font-semibold">
                      Responsible Actor: {step.actor}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-500">Timeline records will populate as status updates occur.</div>
            )}
          </div>
        </div>

        {/* Incident Geo-Location Map */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-red-500" />
              <span>Incident Location Coordinates</span>
            </span>
            <span className="text-slate-500 font-mono">
              {complaint.latitude?.toFixed(5)}° N, {complaint.longitude?.toFixed(5)}° E
            </span>
          </div>

          <CivicMap
            complaints={[complaint]}
            center={[Number(complaint.latitude), Number(complaint.longitude)]}
            zoom={15}
            height="320px"
          />
        </div>

        {/* Update Lifecycle Modal for Officers / Admins */}
        {showStatusModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                Update Status: {complaint.complaint_number}
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Status *
                </label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value as ComplaintStatus)}
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl bg-white"
                >
                  <option value="under_review">Under Review</option>
                  <option value="assigned">Assigned to Field Team</option>
                  <option value="in_progress">Work In Progress</option>
                  <option value="resolved">Mark as Resolved (Requires Proof)</option>
                  <option value="rejected">Reject Complaint</option>
                </select>
              </div>

              {targetStatus === 'resolved' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Resolution Remarks *
                    </label>
                    <textarea
                      rows={3}
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="e.g., Asphalt patching completed with hot-mix bitumen, roller compaction done."
                      className="w-full text-xs p-3 border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Photographic Proof URL *
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

              {targetStatus === 'rejected' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Official Rejection Reason *
                  </label>
                  <textarea
                    rows={3}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="State reason: private property, duplicate, or out of municipal jurisdiction..."
                    className="w-full text-xs p-3 border border-slate-300 rounded-xl"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleUpdateStatus}
                  className="px-6 py-2 text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow"
                >
                  {submitting ? 'Updating...' : 'Commit Status Change'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
