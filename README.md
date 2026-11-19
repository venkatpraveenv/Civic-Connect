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

## 2. Quick Start

### Backend Service (Port 5001)
```powershell
cd CivicConnect\backend
node src/index.js
```

### Frontend Development Server (Port 5173)
```powershell
cd CivicConnect\frontend
npm run dev
```

### Automated Verification Test Suite
```powershell
node CivicConnect\backend\tests\runTests.js
```

---

## 3. Demonstration Roles (Instant Navbar Switcher)
- **Citizen**: Arun Kumar Prasad (`citizen.arun@gmail.demo`) - Indiranagar (Ward 80)
- **Municipal Officer**: Er. Naveen Chandran (`officer.roads@civicconnect.demo`) - Road Infrastructure & Maintenance
- **Administrator**: Rajeshwari Sharma, IAS (`admin@civicconnect.demo`) - Chief Municipal Administrator
