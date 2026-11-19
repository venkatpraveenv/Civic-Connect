import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  BarChart3,
  Download,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Layers,
  Settings,
  FileText,
  UserCheck,
  Search,
  RefreshCw,
  MapPin
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { api } from '../services/api';
import type { Complaint, Department, Category, PlatformSummary } from '../types';
import { CivicMap } from '../components/CivicMap';
import { useAuth } from '../contexts/AuthContext';

export const AdminDashboard: React.FC = () => {
  const { user, showToast } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'complaints' | 'departments' | 'officers' | 'analytics' | 'escalations'>('overview');
  const [stats, setStats] = useState<PlatformSummary | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [officers, setOfficers] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkingEscalations, setCheckingEscalations] = useState(false);

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const loadAllAdminData = async () => {
    setLoading(true);
    const [summary, compRes, depts, cats, offList, analRes] = await Promise.all([
      api.getPlatformSummary(),
      api.getComplaints({ limit: 50 }),
      api.getDepartments(),
      api.getCategories(),
      fetch('http://localhost:5001/api/officers').then((r) => r.json()).catch(() => []),
      api.getAnalytics()
    ]);
    setStats(summary);
    setComplaints(compRes.complaints);
    setDepartments(depts);
    setCategories(cats);
    setOfficers(offList);
    setAnalytics(analRes);
    setLoading(false);
  };

  const handleRunEscalationCheck = async () => {
    try {
      setCheckingEscalations(true);
      const res = await fetch('http://localhost:5001/api/escalations/check', { method: 'POST' }).then((r) => r.json());
      showToast(`Escalation sweep completed. Overdue issues flagged!`, 'info');
      loadAllAdminData();
    } catch (e) {
      showToast('Could not run automated escalation check.', 'error');
    } finally {
      setCheckingEscalations(false);
    }
  };

  const handleExportCsv = () => {
    window.open('http://localhost:5001/api/export/csv', '_blank');
    showToast('Exporting complaints dataset as CSV...', 'success');
  };

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#dc2626', '#8b5cf6', '#ec4899'];

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Admin Header */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold border border-blue-500/30">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Municipal Control Center • BBMP Headquarters</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading">
              Grievance Administration Suite
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Admin: <strong className="text-white">{user.fullName}</strong> • Central Governance Node, Bengaluru
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRunEscalationCheck}
              disabled={checkingEscalations}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-slate-700 flex items-center gap-1.5 shadow transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${checkingEscalations ? 'animate-spin' : ''}`} />
              <span>Run SLA Escalation Check</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* 8 Core Admin Metrics Grid (Section 16) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
            <span className="text-[11px] text-slate-400 block font-medium">Total Reports</span>
            <div className="text-xl font-extrabold text-secondary-900 font-heading">{stats?.totalComplaints || 50}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
            <span className="text-[11px] text-slate-400 block font-medium">Active</span>
            <div className="text-xl font-extrabold text-primary-600 font-heading">{stats?.activeComplaints || 36}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
            <span className="text-[11px] text-slate-400 block font-medium">Resolved</span>
            <div className="text-xl font-extrabold text-emerald-600 font-heading">{stats?.resolvedComplaints || 14}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
            <span className="text-[11px] text-slate-400 block font-medium">Critical</span>
            <div className="text-xl font-extrabold text-red-600 font-heading">{stats?.criticalComplaints || 9}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
            <span className="text-[11px] text-slate-400 block font-medium">Overdue</span>
            <div className="text-xl font-extrabold text-amber-600 font-heading">{stats?.overdueComplaints || 3}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
            <span className="text-[11px] text-slate-400 block font-medium">Resolution Rate</span>
            <div className="text-xl font-extrabold text-emerald-600 font-heading">{stats?.resolutionRate || 72}%</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
            <span className="text-[11px] text-slate-400 block font-medium">Avg Resolution</span>
            <div className="text-xl font-extrabold text-slate-800 font-heading">{stats?.averageResolutionHours || 36}h</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
            <span className="text-[11px] text-slate-400 block font-medium">Registered Citizens</span>
            <div className="text-xl font-extrabold text-secondary-900 font-heading">{stats?.totalCitizens || 21}</div>
          </div>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-sm flex flex-wrap gap-1">
          {[
            { id: 'overview', label: 'Executive Overview', icon: BarChart3 },
            { id: 'complaints', label: 'All Complaints (50)', icon: FileText },
            { id: 'departments', label: 'Departments (6)', icon: Building2 },
            { id: 'officers', label: 'Municipal Officers', icon: UserCheck },
            { id: 'escalations', label: 'SLA Escalations', icon: AlertTriangle }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: EXECUTIVE OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Grievance Resolution Trend */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900 font-heading">
                    6-Month Grievance Volume vs Resolutions
                  </h3>
                  <span className="text-xs text-slate-400">Monthly Trends</span>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics?.monthlyTrend || []}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="reports" stroke="#2563eb" fill="#dbeafe" name="Incoming Reports" />
                      <Area type="monotone" dataKey="resolved" stroke="#10b981" fill="#d1fae5" name="Resolved" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Status Distribution */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900 font-heading">
                    Grievance Lifecycle Distribution
                  </h3>
                  <span className="text-xs text-slate-400">Current Active</span>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics?.statusDistribution || []}
                        cx="50%"
                        cy="50%"
                        outerRadius={85}
                        innerRadius={50}
                        dataKey="count"
                        nameKey="status"
                        label
                      >
                        {(analytics?.statusDistribution || []).map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Bengaluru Grievance Geographic Distribution Map */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 font-heading">
                    City-Wide Spatial Grievance Density
                  </h3>
                  <p className="text-xs text-slate-500">Live coordinates across Bengaluru Urban divisions.</p>
                </div>
                <span className="text-xs font-mono font-bold text-primary-600 bg-blue-50 px-2.5 py-1 rounded-md">
                  50 Geotagged Defects
                </span>
              </div>
              <CivicMap complaints={complaints} height="480px" />
            </div>
          </div>
        )}

        {/* TAB 2: ALL COMPLAINTS TABLE */}
        {activeTab === 'complaints' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 font-heading">Complete Grievances Roster</h3>
                <p className="text-xs text-slate-500">Full audit register of citizen complaints in Bengaluru.</p>
              </div>
              <button
                onClick={handleExportCsv}
                className="px-3 py-1.5 text-xs font-bold text-primary-600 hover:bg-blue-50 rounded-lg border border-primary-200"
              >
                Export CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px]">
                    <th className="py-3.5 px-4">Complaint ID</th>
                    <th className="py-3.5 px-4">Title</th>
                    <th className="py-3.5 px-4">Locality</th>
                    <th className="py-3.5 px-3">Status</th>
                    <th className="py-3.5 px-3">Priority</th>
                    <th className="py-3.5 px-3">Upvotes</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {complaints.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-primary-600">{c.complaint_number}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs truncate">{c.title}</td>
                      <td className="py-3.5 px-4 text-slate-600">{c.locality} ({c.ward})</td>
                      <td className="py-3.5 px-3 uppercase text-[10px] font-bold">{c.status.replace('_', ' ')}</td>
                      <td className="py-3.5 px-3 uppercase text-[10px] font-bold text-red-600">{c.priority}</td>
                      <td className="py-3.5 px-3 font-semibold text-slate-700">👍 {c.upvotes_count || 0}</td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/complaints/${c.id}`}
                          className="text-xs font-bold text-primary-600 hover:underline"
                        >
                          Audit Details →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: DEPARTMENTS */}
        {activeTab === 'departments' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => (
              <div key={dept.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs px-2.5 py-1 rounded bg-slate-100 text-slate-800">
                    {dept.code}
                  </span>
                  <span className="text-xs font-bold text-primary-600 bg-blue-50 px-2 py-0.5 rounded">
                    Active Tasks: {dept.activeComplaintsCount || 0}
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 font-heading">{dept.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{dept.description}</p>
                <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                  <div>Department Head: <strong>{dept.headName}</strong></div>
                  <div>Contact: {dept.contactEmail}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: MUNICIPAL OFFICERS */}
        {activeTab === 'officers' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 font-heading">
                Designated Field Officers & Engineers
              </h3>
              <p className="text-xs text-slate-500">6 internal municipal officers handling assigned departments.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px]">
                    <th className="py-3 px-4">Officer Name</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Designation</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Active Queue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {officers.map((off) => (
                    <tr key={off.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{off.fullName}</td>
                      <td className="py-3.5 px-4 font-semibold text-primary-700">{off.departmentName}</td>
                      <td className="py-3.5 px-4 text-slate-600">{off.designation}</td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono">{off.phoneNumber}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">{off.assignedCount} Tasks</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: SLA ESCALATIONS */}
        {activeTab === 'escalations' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900 font-heading flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span>SLA Breached & Escalated Complaints</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Issues flagged by the automatic escalation worker when resolution SLAs are exceeded.
                </p>
              </div>
              <button
                onClick={handleRunEscalationCheck}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow"
              >
                Trigger Check Now
              </button>
            </div>

            <div className="space-y-3">
              {complaints
                .filter((c) => c.is_escalated || c.status === 'escalated')
                .map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-red-50/60 border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-red-700">{item.complaint_number}</span>
                        <span className="bg-red-200 text-red-900 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                          SLA Breached
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                      <p className="text-slate-600">
                        Location: {item.location_address} • Locality: {item.locality}
                      </p>
                    </div>

                    <Link
                      to={`/complaints/${item.id}`}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shrink-0 self-start sm:self-auto shadow-sm"
                    >
                      Inspect & Expedite →
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
