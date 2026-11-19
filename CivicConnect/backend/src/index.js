import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';
import { store } from './config/supabase.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Dev-Role']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount API routes
app.use('/api', apiRoutes);

// Root informational endpoint
app.get('/', (req, res) => {
  res.json({
    app: 'CivicConnect',
    tagline: 'Report. Resolve. Transform.',
    role: 'Academic Demonstration Civic Grievance Management Platform',
    city: 'Bengaluru, Karnataka, India',
    apiDocs: '/api/health',
    version: '1.0.0'
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    error: 'Internal server error occurred.',
    message: err.message
  });
});

// Scheduled Background Worker for SLA Escalation Checks (Section 17)
// Runs every 5 minutes (300,000 ms)
const ESCALATION_INTERVAL_MS = 5 * 60 * 1000;
function runEscalationWorker() {
  try {
    const now = Date.now();
    let escalatedCount = 0;

    for (const complaint of store.complaints) {
      if (['resolved', 'closed', 'rejected'].includes(complaint.status)) continue;

      if (complaint.deadline_at && new Date(complaint.deadline_at).getTime() < now) {
        if (!complaint.is_escalated) {
          complaint.is_escalated = true;
          complaint.status = 'escalated';
          escalatedCount++;

          store.addNotification({
            userId: 'u0000000-0000-0000-0000-000000000001',
            title: `Deadline Exceeded: ${complaint.complaint_number}`,
            message: `Complaint ${complaint.title} has exceeded resolution SLA. Auto-escalated to administrator.`,
            type: 'escalation',
            link: `/complaints/${complaint.id}`
          });
        }
      }
    }
    if (escalatedCount > 0) {
      console.log(`[Escalation Worker] Auto-escalated ${escalatedCount} overdue complaints.`);
    }
  } catch (err) {
    console.error('[Escalation Worker] Error executing SLA check:', err);
  }
}

// Start periodic worker
setInterval(runEscalationWorker, ESCALATION_INTERVAL_MS);

// Start server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` CivicConnect Backend Service Running`);
  console.log(` Port: ${PORT}`);
  console.log(` City Focus: Bengaluru, Karnataka, India`);
  console.log(` Mode: Academic Demonstration Platform`);
  console.log(` SLA Escalation Worker: Active (Interval: 5 min)`);
  console.log(`====================================================`);
});
