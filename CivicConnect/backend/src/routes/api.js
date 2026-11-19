import { Router } from 'express';
import {
  getComplaints,
  getComplaintById,
  createComplaint,
  checkDuplicate,
  updateStatus,
  voteComplaint,
  submitFeedback
} from '../controllers/complaintsController.js';
import {
  getPlatformSummary,
  getAnalyticsData,
  exportCsv
} from '../controllers/analyticsController.js';
import {
  getDepartments,
  getCategories,
  getOfficers,
  checkEscalations,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead
} from '../controllers/adminController.js';
import { classifyCivicImage } from '../controllers/aiController.js';
import { authenticate } from '../middleware/auth.js';
import { store } from '../config/supabase.js';

const router = Router();

// Public / Summary endpoints
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'CivicConnect Grievance Management API',
    location: 'Bengaluru, India',
    mode: 'Academic Demonstration'
  });
});

router.get('/stats/summary', getPlatformSummary);
router.get('/analytics', getAnalyticsData);
router.get('/export/csv', exportCsv);
router.get('/departments', getDepartments);
router.get('/categories', getCategories);
router.get('/officers', getOfficers);

// Complaints endpoints
router.get('/complaints', authenticate, getComplaints);
router.get('/complaints/:id', authenticate, getComplaintById);
router.post('/complaints', authenticate, createComplaint);
router.post('/complaints/check-duplicate', checkDuplicate);
router.patch('/complaints/:id/status', authenticate, updateStatus);
router.post('/complaints/:id/vote', authenticate, voteComplaint);
router.post('/complaints/:id/feedback', authenticate, submitFeedback);

// Notifications & Escalation endpoints
router.get('/notifications', authenticate, getNotifications);
router.patch('/notifications/read-all', authenticate, markAllNotificationsRead);
router.patch('/notifications/:id/read', authenticate, markNotificationRead);
router.post('/escalations/check', checkEscalations);

// AI Image Classification
router.post('/ai/classify', classifyCivicImage);

// Demo Role Switching Endpoint
router.get('/auth/profiles', (req, res) => {
  res.json(store.profiles);
});

export default router;
