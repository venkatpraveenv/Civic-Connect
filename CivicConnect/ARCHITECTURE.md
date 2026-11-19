# ARCHITECTURE.md

## High‑Level Overview

```
+-------------------+        +-------------------+        +-------------------+
|   Frontend (React) |<----->|  Backend (Node.js) |<----->| Supabase (PostgreSQL) |
+-------------------+        +-------------------+        +-------------------+
      ^   ^   ^                     ^   ^   ^
      |   |   |                     |   |   |
      |   |   +--- Auth (Supabase Auth)      |
      |   +------- Storage (Supabase Storage)
      +----------- Maps (Leaflet + OSM)
```

- **Frontend**: Vite + React + TypeScript, Tailwind CSS for styling, Lucide icons, Recharts for charts, Framer Motion for micro‑animations, React‑Hook‑Form + Zod for validation, Leaflet for interactive maps.
- **Backend**: Express REST API, validates Supabase JWTs, enforces RBAC, handles complaint lifecycle, notification creation, and scheduled escalation checks.
- **Database**: Supabase PostgreSQL with row‑level security (RLS) policies for each role.
- **File Storage**: Supabase Storage holds uploaded images.
- **Optional AI Service**: Exposed via a separate Python micro‑service (placeholder).

The architecture is deliberately modular so each layer can be swapped or independently deployed (frontend → Vercel, backend → Render).
