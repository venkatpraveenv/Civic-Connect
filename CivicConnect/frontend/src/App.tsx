import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { ExploreIssuesPage } from './pages/ExploreIssuesPage';
import { ReportIssuePage } from './pages/ReportIssuePage';
import { ComplaintDetailPage } from './pages/ComplaintDetailPage';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { OfficerDashboard } from './pages/OfficerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

// Floating Toast Notification Stack
const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAuth();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let bg = 'bg-slate-900 text-white';
        let Icon = Info;
        if (toast.type === 'success') {
          bg = 'bg-emerald-600 text-white shadow-emerald-600/20';
          Icon = CheckCircle2;
        } else if (toast.type === 'error') {
          bg = 'bg-red-600 text-white shadow-red-600/20';
          Icon = AlertTriangle;
        } else if (toast.type === 'warning') {
          bg = 'bg-amber-600 text-white shadow-amber-600/20';
          Icon = AlertTriangle;
        }

        return (
          <div
            key={toast.id}
            className={`${bg} px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between text-xs font-medium pointer-events-auto transition-all animate-in slide-in-from-bottom-2`}
          >
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4 shrink-0" />
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:opacity-75 transition-opacity"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-background font-body text-slate-800 antialiased selection:bg-primary-100 selection:text-primary-700">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/explore" element={<ExploreIssuesPage />} />
              <Route path="/report" element={<ReportIssuePage />} />
              <Route path="/complaints/:id" element={<ComplaintDetailPage />} />
              <Route path="/citizen" element={<CitizenDashboard />} />
              <Route path="/officer" element={<OfficerDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <ToastContainer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
