import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  MapPin,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Clock,
  ShieldCheck,
  Users,
  Search,
  ThumbsUp,
  Sparkles,
  ChevronDown,
  Building
} from 'lucide-react';
import { api } from '../services/api';
import type { PlatformSummary, Category, Complaint } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { ResolutionVerifier } from '../components/ResolutionVerifier';

export const LandingPage: React.FC = () => {
  const { t } = useAuth();
  const [stats, setStats] = useState<PlatformSummary | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);
  const [featuredResolved, setFeaturedResolved] = useState<Complaint | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [summary, cats, complaintsRes] = await Promise.all([
      api.getPlatformSummary(),
      api.getCategories(),
      api.getComplaints({ limit: 6 })
    ]);
    setStats(summary);
    setCategories(cats);
    setRecentComplaints(complaintsRes.complaints);

    const resolved = complaintsRes.complaints.find((c) => c.status === 'resolved' && c.resolution_proof_url);
    if (resolved) setFeaturedResolved(resolved);
  };

  const faqs = [
    {
      q: 'How does CivicConnect detect duplicate complaints in my area?',
      a: 'When you submit an issue, our intelligent geospatial algorithm calculates the Haversine distance between your coordinates and existing active complaints. If an issue of the same category exists within a 50-metre radius, it highlights it so you can upvote it instead of filing duplicates.'
    },
    {
      q: 'How is complaint priority calculated dynamically?',
      a: 'Priority is computed using a multi-factor formula: Issue Severity (50%), Community Upvotes (30%), and Unresolved Duration (20%). High-impact issues with high community backing are automatically highlighted to municipal department heads.'
    },
    {
      q: 'What happens when a municipal resolution deadline is exceeded?',
      a: 'The system runs an automatic background SLA escalation worker. When a grievance passes its resolution deadline (e.g. 24 hours for critical water bursts or 48 hours for arterial potholes), it is flagged as overdue, marked as escalated, and notifications are sent to the departmental administrator.'
    },
    {
      q: 'Is this an official Bruhat Bengaluru Mahanagara Palike (BBMP) service?',
      a: 'No. This application is an academic capstone demonstration designed for Indian smart cities using Bengaluru as the initial showcase location. It demonstrates next-generation civic technology without representing an official government body.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-background pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-primary-700 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-primary-600 animate-ping"></span>
                <span>Bengaluru Smart Civic Governance Initiative</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-secondary-900 tracking-tight leading-[1.15]">
                Building Better Communities, <br className="hidden sm:block" />
                <span className="text-primary-600 bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
                  One Report at a Time.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-body">
                {t.heroSubtext} Bridging Indian citizens and municipal authorities with transparent geo-tracking, smart community prioritization, and verified resolutions.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/report"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm shadow-lg shadow-primary-600/25 hover:shadow-primary-600/35 transition-all flex items-center justify-center gap-2 group"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{t.reportIssue}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/explore"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-300 shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-primary-600" />
                  <span>{t.exploreIssues}</span>
                </Link>
              </div>

              {/* Verified Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Interactive Map & GPS</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Smart Duplicate Detection</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Photo Resolution Proof</span>
                </div>
              </div>
            </div>

            {/* Right Graphic / Interactive Showcase Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200/80 backdrop-blur-xl">
                {/* Floating Notification Badge */}
                <div className="absolute -top-4 -right-4 bg-emerald-600 text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5 animate-bounce">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Pothole Resolved Today!</span>
                </div>

                <div className="rounded-2xl overflow-hidden mb-4 border border-slate-200 relative aspect-video bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80"
                    alt="Bengaluru Smart City Aerial View"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent flex items-end p-4">
                    <span className="text-white text-xs font-semibold flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-400" />
                      <span>Indiranagar 100ft Road, Bengaluru</span>
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-500 font-bold">CC-2026-000001</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold uppercase text-[10px]">
                      Verified by Citizen
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm font-heading">
                    Deep crater pothole near 100 Feet Road junction
                  </h3>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                    <span>Department: <strong>Road Works (BBMP)</strong></span>
                    <span className="text-primary-600 font-semibold">38 Upvotes 👍</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE PLATFORM METRICS */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-3xl sm:text-4xl font-extrabold text-secondary-900 font-heading mb-1">
                {stats?.totalComplaints || 50}
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-600">{t.totalReports}</p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-heading mb-1">
                {stats?.resolutionRate || 72}%
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-600">{t.resolvedRate}</p>
            </div>
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
              <div className="text-3xl sm:text-4xl font-extrabold text-primary-600 font-heading mb-1">
                {stats?.activeComplaints || 36}
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-600">{t.activeIssues}</p>
            </div>
            <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100">
              <div className="text-3xl sm:text-4xl font-extrabold text-purple-600 font-heading mb-1">
                198
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-600">{t.bengaluruWards}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. POPULAR CIVIC CATEGORIES */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600">Categories</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-secondary-900 mt-1 mb-3">
              {t.popularCategories}
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Civic grievances automatically route to responsible internal departments with designated resolution deadlines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.slice(0, 6).map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary-600 flex items-center justify-center mb-4 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                    <Building className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 mb-1.5 font-heading">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">
                    {cat.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">SLA: {cat.resolutionDeadlineHours} Hours</span>
                  <Link
                    to={`/report?category=${cat.id}`}
                    className="text-primary-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1"
                  >
                    <span>Report</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700"
            >
              <span>Explore all 13 categories and Bengaluru issues</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="py-16 sm:py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600">Process</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-secondary-900 mt-1 mb-3">
              {t.howItWorks}
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Four streamlined steps from identifying a defect on the road to verifying its completion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-primary-600 text-white font-bold text-lg flex items-center justify-center mx-auto shadow-lg shadow-primary-600/20">
                1
              </div>
              <h3 className="font-bold text-base text-slate-900 font-heading">Spot & Snap</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Take a photograph of the pothole, trash overflow, or broken light and upload directly.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-primary-600 text-white font-bold text-lg flex items-center justify-center mx-auto shadow-lg shadow-primary-600/20">
                2
              </div>
              <h3 className="font-bold text-base text-slate-900 font-heading">Pin Location</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Allow browser GPS or pick the exact incident location on our interactive Bengaluru map.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-primary-600 text-white font-bold text-lg flex items-center justify-center mx-auto shadow-lg shadow-primary-600/20">
                3
              </div>
              <h3 className="font-bold text-base text-slate-900 font-heading">Prioritize & Assign</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Neighbors upvote, dynamic priority scores increase, and the department officer is notified.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white font-bold text-lg flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/20">
                4
              </div>
              <h3 className="font-bold text-base text-slate-900 font-heading">Verify Resolution</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Inspect official completion photo evidence, rate the repair, and close the complaint.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURED RESOLUTION VERIFICATION SHOWCASE */}
      {featuredResolved && (
        <section className="py-16 sm:py-20 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Verification</span>
              <h2 className="text-3xl font-bold font-heading text-secondary-900 mt-1 mb-2">
                {t.beforeAndAfter}
              </h2>
              <p className="text-sm text-slate-600">
                Slide horizontally to compare reported condition with completed municipal repair.
              </p>
            </div>

            <ResolutionVerifier
              complaint={featuredResolved}
              onUpdated={(updated) => setFeaturedResolved(updated)}
            />
          </div>
        </section>
      )}

      {/* 6. FAQ ACCORDION */}
      <section className="py-16 sm:py-20 bg-white border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600">FAQ</span>
            <h2 className="text-3xl font-bold font-heading text-secondary-900 mt-1 mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-600">
              Important details about CivicConnect architecture and demonstration setup.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-heading font-semibold text-sm sm:text-base text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${
                      activeFaq === idx ? 'rotate-180 text-primary-600' : ''
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION BANNER */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-blue-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading">
            Notice a civic issue in your neighborhood?
          </h2>
          <p className="text-base text-blue-100 max-w-xl mx-auto">
            Take 60 seconds to file a complaint with photo evidence and map coordinates. Track the progress in real time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/report"
              className="px-8 py-3.5 rounded-xl bg-white text-primary-700 font-bold text-sm shadow-xl hover:bg-slate-100 transition-colors"
            >
              Report an Issue Now
            </Link>
            <Link
              to="/explore"
              className="px-8 py-3.5 rounded-xl bg-primary-700/60 hover:bg-primary-700 text-white font-semibold text-sm border border-white/20 transition-colors"
            >
              Explore Public Issues
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
