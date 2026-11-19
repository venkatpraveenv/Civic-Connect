# Changelog

All notable changes to the **CivicConnect** project are documented here.

## [1.0.0] - 2026-11-16

### Initial Complete Academic Demonstration Release

#### Architecture & Foundation
- Established monorepo layout: `frontend/`, `backend/`, `supabase/migrations/`, `docs/`, `backend/tests/`.
- Configured Vite with React 18, TypeScript, Tailwind CSS, Lucide icons, and Leaflet maps.
- Configured Express backend with modular controllers, routes, and middleware.

#### Database & Schema
- Authored `001_initial_schema.sql` supporting tables: `departments`, `profiles`, `categories`, `complaints`, `complaint_images`, `complaint_status_history`, `complaint_assignments`, `complaint_votes`, `complaint_comments`, `feedback`, `notifications`, `escalations`, `audit_logs`, and `system_settings`.
- Enforced PostgreSQL Row-Level Security (RLS) policies.
- Formatted reference number generator trigger: `CC-YYYY-XXXXXX`.
- Authored `seed.sql` with 6 departments, 13 categories, 27 user profiles (1 Admin, 6 Officers, 20 Citizens), and 50 realistic Bengaluru civic complaints.

#### Core Modules
- **Landing Page**: Modern hero section, live platform statistics from database, 13 categories showcase, 4-step workflow, FAQ accordion, before/after resolution verification highlight.
- **Citizen Dashboard**: Live grievance summary cards, status ratio pie chart, action reminders, filterable submitted complaints table.
- **Complaint Submission Wizard**: Multi-step reporting flow with issue details, image upload, AI category recommendation assistant, Leaflet interactive map with draggable marker and GPS capture, review and duplicate detection summary.
- **Smart Duplicate Detection**: Haversine distance formula (50m radius) combined with text similarity to detect nearby matching unresolved grievances.
- **Dynamic Priority Scoring**: Implementation of `(Severity * 5) + (Min(Upvotes, 50) * 0.6) + (Min(Days, 10) * 2)`.
- **Public Civic Explorer**: Dual view toggle (Interactive Leaflet Map pins vs Card grid), search, filters for category, status, priority, and Bengaluru localities.
- **Before-and-After Resolution Verification**: Interactive horizontal slider component comparing reported condition with completed municipal repair; citizen satisfaction rating (1-5 stars) and reopen dispute mechanism.
- **Officer Dashboard**: Departmental task queue, field incident map, status update modal with mandatory completion remarks and resolution proof image.
- **Admin Dashboard**: Executive suite with Recharts monthly grievance volume trends, lifecycle pie charts, spatial density map, department performance table, CSV dataset export, and SLA escalation sweep.
- **Automatic SLA Escalations**: Background worker scanning overdue complaint deadlines and dispatching high-priority alerts.
- **Multilingual Support**: Dictionary-based localization for English, Kannada (ಕನ್ನಡ), and Hindi (हिंदी).
- **Automated Verification Test Suite**: 18 unit and integration tests covering scoring, duplicates, lifecycle transitions, upvotes, notifications, and data completeness.
