import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Search,
  Filter,
  ThumbsUp,
  Map,
  LayoutGrid,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building
} from 'lucide-react';
import { api } from '../services/api';
import type { Complaint, Category } from '../types';
import { CivicMap } from '../components/CivicMap';
import { useAuth } from '../contexts/AuthContext';

export const ExploreIssuesPage: React.FC = () => {
  const { showToast, t } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [viewMode, setViewMode] = useState<'map' | 'grid'>('grid');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedLocality, setSelectedLocality] = useState('all');

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadComplaints();
  }, [search, selectedCategory, selectedStatus, selectedPriority, selectedLocality]);

  const loadCategories = async () => {
    const list = await api.getCategories();
    setCategories(list);
  };

  const loadComplaints = async () => {
    setLoading(true);
    const params: any = { limit: 50 };
    if (search) params.search = search;
    if (selectedCategory !== 'all') params.category_id = selectedCategory;
    if (selectedStatus !== 'all') params.status = selectedStatus;
    if (selectedPriority !== 'all') params.priority = selectedPriority;
    if (selectedLocality !== 'all') params.locality = selectedLocality;

    const data = await api.getComplaints(params);
    setComplaints(data.complaints);
    setLoading(false);
  };

  const handleVote = async (complaintId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await api.toggleVote(complaintId);
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === complaintId
            ? { ...c, upvotes_count: res.upvotesCount, hasVoted: res.voted }
            : c
        )
      );
      showToast(
        res.voted ? 'Upvoted! Community priority score boosted.' : 'Upvote removed.',
        'info'
      );
    } catch (err: any) {
      showToast('Could not register vote.', 'error');
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    if (priority === 'critical') return 'bg-red-100 text-red-800 border-red-200';
    if (priority === 'high') return 'bg-amber-100 text-amber-800 border-amber-200';
    if (priority === 'medium') return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  };

  const getStatusBadgeClass = (status: string) => {
    if (status === 'resolved' || status === 'closed') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (status === 'escalated') return 'bg-red-50 text-red-700 border-red-200 animate-pulse';
    if (status === 'in_progress') return 'bg-blue-50 text-blue-700 border-blue-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold font-heading text-secondary-900 tracking-tight">
              Bengaluru Civic Issue Explorer
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Browse public complaints, monitor municipal progress, and upvote critical neighborhood repairs.
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm self-start md:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Cards View</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'map'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>Map View</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
          {/* Top Search Input */}
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by issue ID, description, road name, or landmark..."
              className="w-full pl-11 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>

          {/* Filter Dropdowns Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white text-slate-700"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white text-slate-700"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
              <option value="escalated">Escalated</option>
            </select>

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white text-slate-700"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {/* Locality Filter */}
            <select
              value={selectedLocality}
              onChange={(e) => setSelectedLocality(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white text-slate-700"
            >
              <option value="all">All Bengaluru Localities</option>
              {['Indiranagar', 'Koramangala', 'Whitefield', 'Jayanagar', 'Malleshwaram', 'HSR Layout', 'MG Road', 'Rajajinagar', 'Electronic City', 'Hebbal', 'Bellandur', 'Marathahalli'].map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Content View: MAP or GRID */}
        {viewMode === 'map' ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>Showing {complaints.length} geo-tagged civic points across Bengaluru</span>
              <span className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-600"></span> Critical</span>
                <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> High</span>
                <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Medium</span>
                <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Resolved</span>
              </span>
            </div>
            <CivicMap
              complaints={complaints}
              height="620px"
              center={[12.9716, 77.5946]}
              zoom={12}
            />
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-4 px-1">
              <span>Found <strong>{complaints.length}</strong> complaints matching filters</span>
              <span>Sorted by latest activity</span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-64 rounded-2xl bg-white animate-pulse border border-slate-200"></div>
                ))}
              </div>
            ) : complaints.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-base">No complaints match your filters</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try clearing search terms or selecting 'All Categories' to view public issues.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {complaints.map((item) => {
                  const cat = categories.find((c) => c.id === item.category_id);
                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group"
                    >
                      <div>
                        {/* Card Image */}
                        <div className="relative aspect-video bg-slate-100 overflow-hidden">
                          <img
                            src={
                              item.evidence_image_url ||
                              'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80'
                            }
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 left-3 flex items-center gap-1.5">
                            <span className="font-mono font-bold text-[10px] px-2 py-0.5 rounded bg-slate-900/80 text-white backdrop-blur-sm">
                              {item.complaint_number}
                            </span>
                          </div>
                          <div className="absolute top-3 right-3">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded border backdrop-blur-md uppercase tracking-wider ${getPriorityBadgeClass(
                                item.priority
                              )}`}
                            >
                              {item.priority}
                            </span>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-5 space-y-2.5">
                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <span className="font-semibold text-primary-600">{cat?.name || 'Civic Issue'}</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(item.created_at).toLocaleDateString()}
                            </span>
                          </div>

                          <h3 className="font-bold text-sm text-slate-900 font-heading line-clamp-2 leading-snug">
                            {item.title}
                          </h3>

                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>

                          <div className="flex items-center gap-1.5 text-xs text-slate-600 pt-1">
                            <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                            <span className="truncate">{item.location_address} ({item.locality})</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                        {/* Status Badge */}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${getStatusBadgeClass(
                            item.status
                          )}`}
                        >
                          {item.status.replace('_', ' ')}
                        </span>

                        {/* Upvote & View Details */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => handleVote(item.id, e)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-colors ${
                              item.hasVoted
                                ? 'bg-primary-50 border-primary-300 text-primary-700'
                                : 'bg-white border-slate-200 text-slate-600 hover:border-primary-400'
                            }`}
                          >
                            <ThumbsUp className={`w-3.5 h-3.5 ${item.hasVoted ? 'fill-primary-600' : ''}`} />
                            <span>{item.upvotes_count || 0}</span>
                          </button>

                          <Link
                            to={`/complaints/${item.id}`}
                            className="text-xs font-bold text-primary-600 hover:text-primary-700 hover:underline flex items-center gap-0.5 pl-1"
                          >
                            <span>Details</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
