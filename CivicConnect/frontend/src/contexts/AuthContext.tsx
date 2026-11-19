import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile, UserRole } from '../types';
import { api } from '../services/api';
import { translations } from '../utils/i18n';
import type { Language } from '../utils/i18n';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface AuthContextType {
  user: UserProfile;
  role: UserRole;
  language: Language;
  t: (typeof translations)['en'];
  setLanguage: (lang: Language) => void;
  switchRole: (role: UserRole) => void;
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const profiles = api.getProfiles();
  const [role, setRole] = useState<UserRole>('citizen');
  const [user, setUser] = useState<UserProfile>(profiles[0]);
  const [language, setLanguage] = useState<Language>('en');
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const matched = profiles.find((p) => p.role === role) || profiles[0];
    setUser(matched);
    api.setRole(role);
  }, [role]);

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    showToast(`Switched active view to ${newRole.toUpperCase()} mode.`, 'info');
  };

  const showToast = (message: string, type: Toast['type'] = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const t = translations[language] || translations.en;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        language,
        t,
        setLanguage,
        switchRole,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
