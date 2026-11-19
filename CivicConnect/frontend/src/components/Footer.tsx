import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, Heart, MapPin, Mail, Phone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Footer: React.FC = () => {
  const { t } = useAuth();

  return (
    <footer className="bg-secondary-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold font-heading text-white">Civic<span className="text-primary-500">Connect</span></span>
            </div>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              Civic grievance and municipal resolution management platform bridging citizens and civic officers for a smarter Bengaluru.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Transparent Public Accountability</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-heading">Civic Action</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/report" className="hover:text-white transition-colors">{t.reportIssue}</Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-white transition-colors">{t.exploreIssues}</Link>
              </li>
              <li>
                <Link to="/citizen" className="hover:text-white transition-colors">Citizen Dashboard</Link>
              </li>
              <li>
                <Link to="/officer" className="hover:text-white transition-colors">Municipal Officer Portal</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors">Admin Governance Suite</Link>
              </li>
            </ul>
          </div>

          {/* Target Demonstration City */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-heading">Demonstration City</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
                <span>Bengaluru Urban District, Karnataka, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary-500 shrink-0" />
                <span>support@civicconnect.bengaluru.demo</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary-500 shrink-0" />
                <span>Toll-Free Demo Helpline: 1800-425-DEMO</span>
              </li>
            </ul>
          </div>

          {/* Academic Transparency Note */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-heading">Academic Project</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Developed as a full-stack smart city capstone project demonstrating modern civic technology, dynamic priority scoring, and transparent resolution verification.
            </p>
            <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700 text-[11px] text-amber-300">
              <strong>Notice:</strong> This is an educational demonstration and does not falsely represent itself as an official government agency.
            </div>
          </div>
        </div>

        {/* Bottom copyright and disclaimer */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 CivicConnect Project. Built for Indian Smart Cities.</p>
          <p className="flex items-center gap-1">
            <span>Designed for transparency and civic participation</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
};
