# DATABASE_SCHEMA.md

This document describes the relational schema for **CivicConnect**. The definitive schema lives in the Supabase migration files under `supabase/migrations/`. The tables are:

| Table | Primary Key | Important Columns | Description |
|-------|-------------|-------------------|-------------|
| profiles | `id` (uuid) | `user_id` (uuid), `role` (enum), `name`, `email`, `avatar_url` | Stores citizen, officer, and admin user profiles. |
| departments | `id` (uuid) | `name`, `description` | Municipal departments (Road, Waste, etc.). |
| categories | `id` (uuid) | `name`, `icon`, `description`, `department_id`, `default_severity`, `resolution_deadline_days` | Issue categories. |
| complaints | `id` (uuid) | `title`, `description`, `category_id`, `status` (enum), `severity`, `priority_score`, `reporter_id`, `assigned_officer_id`, `location_lat`, `location_lng`, `ward`, `created_at` | Core grievance record. |
| complaint_images | `id` (uuid) | `complaint_id`, `url`, `uploaded_at` | Image evidence stored in Supabase Storage. |
| complaint_assignments | `id` (uuid) | `complaint_id`, `officer_id`, `assigned_at` | Historical assignment log. |
| complaint_status_history | `id` (uuid) | `complaint_id`, `previous_status`, `new_status`, `changed_by`, `changed_at`, `remarks` | Full audit of status changes. |
| complaint_votes | `id` (uuid) | `complaint_id`, `voter_id`, `voted_at` (unique on (`complaint_id`,`voter_id`)) | Up‑votes from citizens. |
| notifications | `id` (uuid) | `user_id`, `type`, `payload` (json), `read_at`, `created_at` | In‑app notifications. |
| escalations | `id` (uuid) | `complaint_id`, `escalated_at`, `reason` | Records when a complaint passes its deadline. |
| feedback | `id` (uuid) | `complaint_id`, `user_id`, `rating` (1‑5), `comment`, `created_at` | Satisfaction feedback after resolution. |
| audit_logs | `id` (uuid) | `user_id`, `action`, `details` (json), `created_at` | Critical admin actions (role changes, department edits, etc.). |
| system_settings | `key` (text PK) | `value` (json) | Global configuration (e.g., duplicate radius, priority weights). |

All tables include `created_at`/`updated_at` timestamps, appropriate foreign‑key constraints, and **row‑level security (RLS)** policies that restrict access based on the `role` column in `profiles`.
