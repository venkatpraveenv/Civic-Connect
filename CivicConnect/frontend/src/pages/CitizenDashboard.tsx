import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  Clock,
  CheckCircle2,
  Hourglass,
  PlusCircle,
  ThumbsUp,
  MapPin,
  Calendar,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip
} from 'recharts';
import { api } from '../services/api';
import type { Complaint } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const CitizenDashboard: React.FC = () => {
  const { user, t } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadUserComplaints();
  }, [user]);

  const loadUserComplaints = async () => {
    setLoading(true);
    // In demonstration mode, load complaints or user-specific records
    const res = await api.getComplaints({ limit: 50, view: 'citizen' });
    setComplaints(res.complaints);
    setLoading(false);
  };

  const total = complaints.length;
  const inProgress = complaints.filter((c) => c.status === 'in_progress').length;
  const resolved = complaints.filter((c) => ['resolved', 'closed'].includes(c.status)).length;
  const pending = total - inProgress - resolved;

  // Pie chart data
  const chartData = [
    { name: 'Resolved', value: resolved || 1, color: '#10b981' },
    { name: 'In Progress', value: inProgress || 1, color: '#2563eb' },
    { name: 'Pending Review', value: pending || 1, color: '#f59e0b' }
  ];

  const filtered = complaints.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.complaint_number.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-primary-600 via-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Registered Bengaluru Citizen</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading">
              Welcome back, {user.fullName}!
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
              Locality: <strong>{user.locality || 'Indiranagar'}</strong> • Ward: <strong>{user.ward || 'Ward 80'}</strong>
            </p>
          </div>

          <Link
            to="/report"
            className="px-6 py-3 rounded-2xl bg-white text-primary-700 font-bold text-xs shadow-md hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 self-start md:self-auto shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report New Civic Grievance</span>
          </Link>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Total Submitted</span>
              <AlertCircle className="w-4 h-4 text-primary-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-secondary-900 font-heading">{total}</div>
            <span className="text-[11px] text-slate-500">Tracked in system</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Pending Review</span>
              <Hourglass className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 font-heading">{pending}</div>
            <span className="text-[11px] text-slate-500">Awaiting officer action</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Work in Progress</span>
              <Clock className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-primary-600 font-heading">{inProgress}</div>
            <span className="text-[11px] text-slate-500">Field team deployed</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Resolved Issues</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-heading">{resolved}</div>
            <span className="text-[11px] text-slate-500">Ready for citizen sign-off</span>
          </div>
        </div>

        {/* Charts & Status Breakdown Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <h3 className="font-bold text-sm text-slate-900 font-heading mb-4">
              My Grievance Status Ratio
            </h3>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-4 text-xs pt-2 border-t border-slate-100">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Resolved</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary-600"></span> Active</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Pending</span>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 font-heading">
              Quick Civic Action & Verification Reminders
            </h3>
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold text-emerald-900 block">Indiranagar 100ft Road Pothole Fixed</span>
                    <span className="text-emerald-700">Official proof is available. Review and verify completion.</span>
                  </div>
                </div>
                <Link
                  to="/complaints/c0000000-0000-0000-0000-000000000001"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 shrink-0"
                >
                  Verify Now
                </Link>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary-600 shrink-0" />
                  <div>
                    <span className="font-bold text-blue-900 block">Koramangala 5th Block Garbage Collection</span>
                    <span className="text-blue-700">Solid Waste Management truck is en route.</span>
                  </div>
                </div>
                <Link
                  to="/complaints/c0000000-0000-0000-0000-000000000002"
                  className="px-3 py-1.5 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 shrink-0"
                >
                  Track
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Complaints List Table with Filters */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 font-heading">
                My Submitted Complaints
              </h3>
              <p className="text-xs text-slate-500">Live records registered from this account.</p>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search complaints..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="submitted">Submitted</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading records...</div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-600">No complaints found</p>
                <Link
                  to="/report"
                  className="inline-block px-4 py-2 rounded-xl bg-primary-600 text-white text-xs font-semibold"
                >
                  Report an Issue Now
                </Link>
              </div>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.id}
                  className="p-5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={
                        item.evidence_image_url ||
                        'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80'
                      }
                      alt={item.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {item.complaint_number}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            item.status === 'resolved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {item.status.replace('_', ' ')}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 font-heading">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{item.location_address} ({item.locality})</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                    <span className="text-xs text-slate-500 font-medium">
                      👍 {item.upvotes_count || 0} Upvotes
                    </span>
                    <Link
                      to={`/complaints/${item.id}`}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-primary-600 hover:text-white text-slate-700 text-xs font-semibold transition-all flex items-center gap-1"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
