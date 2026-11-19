import { supabase, isSupabaseConfigured, store } from '../config/supabase.js';

/**
 * Authentication Middleware
 * Validates Supabase JWT Bearer token or development role headers
 */
export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const devRole = req.headers['x-dev-role']; // For instant demonstration testing

    // 1. If dev role header is supplied in demonstration mode
    if (devRole && ['citizen', 'officer', 'admin'].includes(devRole)) {
      const mockProfile = store.profiles.find(p => p.role === devRole) || store.profiles[0];
      req.user = mockProfile;
      return next();
    }

    // 2. Bearer token provided
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];

      // Check if it's one of our mock demo tokens
      if (token.startsWith('demo-token-')) {
        const role = token.replace('demo-token-', '');
        const mockProfile = store.profiles.find(p => p.role === role) || store.profiles[0];
        req.user = mockProfile;
        return next();
      }

      // If live Supabase is configured, verify token
      if (isSupabaseConfigured && supabase) {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user) {
          return res.status(401).json({ error: 'Invalid or expired authentication token.' });
        }
        
        // Fetch matching profile
        const profile = store.profiles.find(p => p.email === user.email || p.id === user.id) || {
          id: user.id,
          email: user.email,
          role: 'citizen',
          fullName: user.user_metadata?.full_name || 'Citizen'
        };
        req.user = profile;
        return next();
      }
    }

    // Default demo citizen user if unauthenticated in academic demo mode
    req.user = store.profiles.find(p => p.role === 'citizen');
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ error: 'Internal authentication error.' });
  }
}

/**
 * Role-Based Access Control (RBAC) middleware
 * Ensures user has at least one of the allowed roles
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required for this operation.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied. Requires one of: [${allowedRoles.join(', ')}]. Your role: ${req.user.role}.`
      });
    }

    next();
  };
}
