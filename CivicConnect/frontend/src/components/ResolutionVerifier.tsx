import React, { useState } from 'react';
import { CheckCircle2, RotateCcw, Star, ShieldCheck, AlertTriangle } from 'lucide-react';
import type { Complaint } from '../types';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface ResolutionVerifierProps {
  complaint: Complaint;
  onUpdated: (updatedComplaint: Complaint) => void;
}

export const ResolutionVerifier: React.FC<ResolutionVerifierProps> = ({
  complaint,
  onUpdated
}) => {
  const { showToast } = useAuth();
  const [sliderPosition, setSliderPosition] = useState(50);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reopenReason, setReopenReason] = useState('');
  const [showReopenModal, setShowReopenModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const originalPhoto = complaint.evidence_image_url || 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80';
  const resolutionPhoto = complaint.resolution_proof_url || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80';

  const handleVerifyResolution = async () => {
    try {
      setSubmitting(true);
      const updated = await api.submitFeedback(complaint.id, {
        rating,
        comment,
        isVerified: true
      });
      showToast('Resolution accepted. Grievance closed with satisfaction feedback!', 'success');
      onUpdated(updated);
    } catch (err: any) {
      showToast(err.message || 'Failed to verify resolution.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReopenComplaint = async () => {
    if (!reopenReason.trim()) {
      showToast('Please provide a valid reason for reopening.', 'warning');
      return;
    }
    try {
      setSubmitting(true);
      const updated = await api.submitFeedback(complaint.id, {
        rating: 1,
        reopenRequested: true,
        reopenReason
      });
      showToast('Complaint has been reopened and escalated to department.', 'info');
      setShowReopenModal(false);
      onUpdated(updated);
    } catch (err: any) {
      showToast(err.message || 'Failed to reopen complaint.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Before & After Resolution Verification</span>
          </h3>
          <p className="text-xs text-slate-500">
            Compare original defect evidence against official municipal resolution proof.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
          Official Proof Uploaded
        </span>
      </div>

      {/* Interactive Visual Split View */}
      <div className="relative h-72 sm:h-96 rounded-xl overflow-hidden mb-4 select-none border border-slate-200">
        {/* Before Image (Left / Base) */}
        <div className="absolute inset-0">
          <img
            src={originalPhoto}
            alt="Original reported issue"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 bg-red-600/90 text-white text-xs font-bold px-2.5 py-1 rounded-md backdrop-blur-sm shadow">
            BEFORE (Reported)
          </div>
        </div>

        {/* After Image (Right / Clipped by slider) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
        >
          <img
            src={resolutionPhoto}
            alt="Official resolution proof"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3 bg-emerald-600/90 text-white text-xs font-bold px-2.5 py-1 rounded-md backdrop-blur-sm shadow">
            AFTER (Resolved)
          </div>
        </div>

        {/* Divider Bar */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-ew-resize flex items-center justify-center"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="w-8 h-8 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-slate-600 text-[10px] font-bold">
            ↔
          </div>
        </div>

        {/* Range slider input overlay */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPosition}
          onChange={(e) => setSliderPosition(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
          aria-label="Comparison slider"
        />
      </div>

      {/* Official Remarks */}
      {complaint.resolution_remarks && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Official Resolution Remarks:
          </div>
          <p className="text-sm text-slate-800 leading-relaxed italic">
            "{complaint.resolution_remarks}"
          </p>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-2">
            <span>Verified Officer: {complaint.assigned_officer_name || 'BBMP Field Engineer'}</span>
            <span>•</span>
            <span>Resolved on: {complaint.resolved_at ? new Date(complaint.resolved_at).toLocaleDateString() : 'Recent'}</span>
          </div>
        </div>
      )}

      {/* Citizen Feedback & Action Controls */}
      {complaint.status === 'resolved' && (
        <div className="pt-4 border-t border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Citizen Satisfaction Rating:
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-semibold text-slate-600 ml-2">
                  {rating === 5 ? 'Excellent Work' : rating === 4 ? 'Good' : rating === 3 ? 'Satisfactory' : 'Needs Improvement'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowReopenModal(true)}
                className="px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reopen Grievance</span>
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleVerifyResolution}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify & Close Complaint</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reopen Modal */}
      {showReopenModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2 text-red-600 mb-3 font-heading font-bold text-base">
              <AlertTriangle className="w-5 h-5" />
              <span>Reopen Grievance: {complaint.complaint_number}</span>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Please state why the resolution provided is inadequate or incomplete. This will alert the department supervisor.
            </p>
            <textarea
              rows={4}
              value={reopenReason}
              onChange={(e) => setReopenReason(e.target.value)}
              placeholder="e.g., Pothole was only partially filled and loose stones remain hazardous for traffic..."
              className="w-full text-xs p-3 border border-slate-300 rounded-xl mb-4 focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowReopenModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleReopenComplaint}
                className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow"
              >
                Confirm Reopen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
