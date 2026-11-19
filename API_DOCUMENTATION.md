# CivicConnect REST API Documentation

This document describes the REST API endpoints provided by the CivicConnect Express backend.

**Base URL**: `http://localhost:5001/api`  
**Authentication**: Bearer token via `Authorization: Bearer <token>` or demonstration header `X-Dev-Role: citizen | officer | admin`.

---

## 1. Health & Demonstration Summary

### `GET /api/health`
Returns system status, location focus, and mode.
- **Response**: `200 OK`
```json
{
  "status": "healthy",
  "service": "CivicConnect Grievance Management API",
  "location": "Bengaluru, India",
  "mode": "Academic Demonstration"
}
```

### `GET /api/stats/summary`
Live municipal platform grievance metrics.
- **Response**: `200 OK`
```json
{
  "totalComplaints": 50,
  "activeComplaints": 36,
  "resolvedComplaints": 14,
  "criticalComplaints": 9,
  "overdueComplaints": 3,
  "escalatedComplaints": 1,
  "totalCitizens": 21,
  "totalOfficers": 6,
  "averageResolutionHours": 36,
  "resolutionRate": 72
}
```

---

## 2. Civic Complaints

### `GET /api/complaints`
Retrieve complaints list with filtering, searching, and pagination.
- **Query Parameters**:
  - `status`: e.g. `submitted`, `in_progress`, `resolved`, `closed`
  - `category_id`: UUID
  - `locality`: e.g. `Indiranagar`, `Koramangala`, `Whitefield`
  - `priority`: `low`, `medium`, `high`, `critical`
  - `search`: Keyword for title, description, or complaint ID
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 20)
  - `view`: `citizen` (filters to reporter) or `officer` (filters to department)
- **Response**: `200 OK`

### `GET /api/complaints/:id`
Retrieve comprehensive details of a single complaint, including full chronological timeline history, category metadata, coordinates, and feedback.
- **Response**: `200 OK`

### `POST /api/complaints`
Submit a new civic complaint.
- **Request Body**:
```json
{
  "title": "Deep crater pothole near 100 Feet Road junction",
  "description": "2-foot wide pothole causing two-wheelers to skid",
  "categoryId": "c1000000-0000-0000-0000-000000000001",
  "severity": 8,
  "locationAddress": "100 Feet Rd, Indiranagar, Bengaluru",
  "locality": "Indiranagar",
  "ward": "Ward 80",
  "latitude": 12.9784,
  "longitude": 77.6408,
  "imageUrl": "https://..."
}
```
- **Response**: `201 Created`

### `POST /api/complaints/check-duplicate`
Geospatial Haversine calculation within 50m radius + text similarity check.
- **Request Body**:
```json
{
  "title": "Pothole on 100 Feet Road",
  "description": "Road surface defect",
  "categoryId": "c1000000-0000-0000-0000-000000000001",
  "latitude": 12.9785,
  "longitude": 77.6409,
  "radiusMeters": 50
}
```
- **Response**: `200 OK`
```json
{
  "hasDuplicates": true,
  "count": 1,
  "duplicates": [
    {
      "id": "c0000000-0000-0000-0000-000000000001",
      "complaintNumber": "CC-2026-000001",
      "title": "Deep crater pothole near 100 Feet Road junction",
      "distanceMeters": 24,
      "similarityScore": 68
    }
  ]
}
```

### `PATCH /api/complaints/:id/status`
Update complaint status with lifecycle transition validation.
- **Request Body**:
```json
{
  "newStatus": "resolved",
  "remarks": "Asphalt hot-mix patching completed and inspected.",
  "resolutionProofUrl": "https://..."
}
```
*Note*: Marking as resolved strictly requires both `remarks` and `resolutionProofUrl`.

### `POST /api/complaints/:id/vote`
Toggle upvote for a complaint (1 vote per user). Automatically recalculates priority score.
- **Response**: `200 OK`
```json
{
  "success": true,
  "voted": true,
  "upvotesCount": 39,
  "priority": "critical",
  "priorityScore": 76.5
}
```

### `POST /api/complaints/:id/feedback`
Submit citizen verification rating (1-5 stars) or request reopening.
- **Request Body**:
```json
{
  "rating": 5,
  "comment": "Prompt action by BBMP!",
  "isVerified": true
}
```

---

## 3. Analytics, Export & Admin

### `GET /api/analytics`
Returns status distribution, category breakdown, 6-month trends, and departmental resolution rates.

### `GET /api/export/csv`
Downloads full complaint dataset as CSV.

### `POST /api/escalations/check`
Executes background sweep for overdue complaints past their deadline and creates escalation notifications.

### `POST /api/ai/classify`
Suggests complaint category and default severity based on image heuristics or external Python microservice.
