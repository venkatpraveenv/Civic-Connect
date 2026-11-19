# CivicConnect (BLR)

> **Tagline**: Report. Resolve. Transform.  
> **Academic Topic**: Public Grievance and Civic Issue Reporting System for Indian Smart Cities  
> **Initial Demonstration Location**: Bengaluru, Karnataka, India  
> **Project Type**: Full-Stack Smart City Civic Management Web Platform

---

## 1. Project Abstract

Rapid urbanization across Indian metropolitan cities like Bengaluru has placed severe stress on municipal infrastructure, leading to frequent road craters, unmanaged solid waste accumulation, street lighting failures, water pipeline bursts, and monsoon storm drain waterlogging. Existing grievance mechanisms often suffer from low public visibility, absence of verifiable completion evidence, duplicate reporting overhead, and lack of community-driven prioritization.

**CivicConnect** is an academic demonstration of a next-generation civic grievance platform that bridges the communication gap between citizens and municipal authorities (such as the Bruhat Bengaluru Mahanagara Palike - BBMP, BESCOM, and BWSSB). Built with React, TypeScript, Tailwind CSS, Node.js, Express, and Supabase PostgreSQL, the system introduces:
1. **Smart Geospatial Duplicate Detection**: Uses the Haversine formula within a 50-metre radius to identify unresolved issues and encourage community upvoting rather than filing duplicates.
2. **Dynamic Priority Scoring**: Dynamically calculates priority based on reported severity (50%), community upvotes (30%), and unresolved duration (20%).
3. **Automated Category-to-Department Routing**: Automatically assigns incoming grievances to the designated municipal department with strict SLA deadlines.
4. **Before-and-After Resolution Verification**: Enforces that municipal officers upload photographic proof and completion remarks, and empowers citizens to either verify and rate the repair or reopen the grievance with justification.
5. **Automated SLA Escalation Worker**: Runs periodic background checks to flag overdue complaints and escalate them to administrative leadership.

*Disclaimer: This platform is developed strictly for academic demonstration and capstone evaluation. It does not falsely represent itself as an official government agency.*

---

## 2. Technology Stack

- **Frontend**: React 18, Vite 5, TypeScript, React Router 6
- **Styling & Design System**: Tailwind CSS v3, Plus Jakarta Sans (Headings), Inter (Body)
- **Maps**: Leaflet.js, React-Leaflet, OpenStreetMap
- **Charts & Data Visualizations**: Recharts
- **Icons & Micro-interactions**: Lucide React
- **Backend API**: Node.js, Express.js (ES Modules)
- **Database & Auth**: Supabase PostgreSQL with Row-Level Security (RLS) policies
- **Verification & Testing**: Automated test suite with 18 verification scenarios

---

## 3. Project Structure

```
CivicConnect/
├── frontend/
│   ├── src/
│   │   ├── components/       # Navbar, Footer, CivicMap, ResolutionVerifier
│   │   ├── pages/            # LandingPage, ExploreIssuesPage, ReportIssuePage,
│   │   │                     # ComplaintDetailPage, CitizenDashboard,
│   │   │                     # OfficerDashboard, AdminDashboard
│   │   ├── contexts/         # AuthContext (Role switching, language, toast system)
│   │   ├── services/         # api.ts (REST client with resilient fallback)
│   │   ├── types/            # TypeScript data models and interfaces
│   │   └── utils/            # i18n dictionaries (English, Kannada, Hindi)
│   ├── tailwind.config.js    # Civic design tokens (#2563EB primary, #0F172A secondary)
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/      # complaintsController, analyticsController, adminController, aiController
│   │   ├── routes/           # api.js REST router
│   │   ├── middleware/       # auth.js, RBAC enforcement
│   │   ├── config/           # supabase.js connection & memory fallback store
│   │   ├── utils/            # priority.js, duplicateDetector.js
│   │   ├── data/             # seedData.js (50 seeded Bengaluru complaints)
│   │   └── index.js          # Server entry & SLA escalation background worker
│   ├── tests/
│   │   └── runTests.js       # 18-point automated verification suite
│   └── package.json
│
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql  # Full PostgreSQL schema with RLS & triggers
│   └── seed.sql              # 6 departments, 13 categories, 27 profiles, 50 complaints
│
├── README.md
├── IMPLEMENTATION_PLAN.md
├── TASKS.md
├── ARCHITECTURE.md
├── DATABASE_SCHEMA.md
├── API_DOCUMENTATION.md
├── TEST_REPORT.md
├── CHANGELOG.md
└── .env.example
```

---

## 4. Quick Start (Running the Application)

### Step 1: Run the Backend Service
In a terminal window:
```powershell
cd "CivicConnect\backend"
node src/index.js
```
The backend starts on port **5001** (or configured `PORT`).

### Step 2: Run the Frontend Development Server
In a second terminal window:
```powershell
cd "CivicConnect\frontend"
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 5. Demonstration Accounts & Seamless Role Switching

CivicConnect includes a **Role Switcher** directly in the top navigation bar, enabling instantaneous switching between all three user roles without re-authenticating:

1. **Citizen (`citizen`)**:
   - **Profile**: Arun Kumar Prasad (`citizen.arun@gmail.demo`)
   - **Locality**: Indiranagar (Ward 80), Bengaluru
   - **Capabilities**: Submit grievances, capture GPS coordinates, review nearby duplicates within 50m, upvote community issues, rate resolutions with 1-5 stars, reopen grievances.
2. **Municipal Officer (`officer`)**:
   - **Profile**: Er. Naveen Chandran (`officer.roads@civicconnect.demo`)
   - **Department**: Road Infrastructure & Maintenance (BBMP-ROAD)
   - **Capabilities**: Access assigned task queue, filter overdue SLA tasks, view departmental field map, commit status changes with mandatory photo proof & remarks.
3. **Administrator (`admin`)**:
   - **Profile**: Rajeshwari Sharma, IAS (`admin@civicconnect.demo`)
   - **Designation**: Chief Municipal Administrator, BBMP Head Office
   - **Capabilities**: Executive dashboard with Recharts trends, city-wide spatial density map, trigger SLA escalation sweeps, export CSV data.

---

## 6. Seeded Bengaluru Dataset

The platform comes pre-populated with:
- **6 Municipal Departments**: Roads, Solid Waste Management, Street Lighting, Water Supply (BWSSB), Stormwater Drainage (SWD), Traffic Signals.
- **13 Civic Issue Categories**: Potholes, Garbage Accumulation, Streetlight Outage, Water Pipeline Leakage, Waterlogging, Illegal Dumping, Public Sanitation, etc.
- **50 Realistic Complaints**: Spread across Indiranagar, Koramangala, Whitefield, Jayanagar, Malleshwaram, HSR Layout, MG Road, Rajajinagar, Electronic City, and Hebbal.
- **Multiple Lifecycle Statuses**: `submitted`, `under_review`, `assigned`, `in_progress`, `resolved`, `closed`, `rejected`, `reopened`, and `escalated`.

---

## 7. Running the Automated Test Suite

To verify algorithms, mathematical formulas, and business rules:
```powershell
node backend/tests/runTests.js
```
Expected output:
```
====================================================
 Test Summary: 18 Passed, 0 Failed
====================================================
```
