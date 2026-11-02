-- db/migrations/002_evc_inspections.sql
-- Phase 5: Production EVC Tables, Labs Centroids, Officers RBAC, and Media

CREATE TABLE IF NOT EXISTS officers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL, -- 'College' | 'EVC Officer' | 'Auditor' | 'Admin'
  assigned_campus TEXT,
  clearance_level TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS labs (
  id TEXT PRIMARY KEY,
  institution_id TEXT NOT NULL,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  building TEXT NOT NULL,
  clause TEXT NOT NULL,
  centroid_lat NUMERIC(9, 6) NOT NULL,
  centroid_lng NUMERIC(9, 6) NOT NULL,
  radius_meters INT NOT NULL,
  carpet_area_sqm INT NOT NULL,
  approved_intake_ratio TEXT,
  equipment_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inspections (
  id TEXT PRIMARY KEY,
  institute_id TEXT NOT NULL,
  campus_name TEXT NOT NULL,
  lab_id TEXT,
  lab_name TEXT NOT NULL,
  lab_code TEXT NOT NULL,
  statutory_clause TEXT NOT NULL,
  officer_id TEXT NOT NULL,
  officer_name TEXT NOT NULL,
  latitude NUMERIC(9, 6) NOT NULL,
  longitude NUMERIC(9, 6) NOT NULL,
  accuracy NUMERIC(5, 2) NOT NULL,
  altitude NUMERIC(7, 2),
  distance_meters NUMERIC(7, 2) NOT NULL,
  client_geofence_status TEXT NOT NULL,
  server_geofence_status TEXT NOT NULL,
  is_mocked BOOLEAN DEFAULT FALSE,
  sha256_hash TEXT NOT NULL UNIQUE,
  decision_status TEXT NOT NULL DEFAULT 'PENDING_VERIFICATION',
  admin_notes TEXT,
  decision_by TEXT,
  decision_at TIMESTAMPTZ,
  captured_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inspections_inst_captured ON inspections(institute_id, captured_at DESC);
CREATE INDEX IF NOT EXISTS idx_inspections_officer ON inspections(officer_id);
CREATE INDEX IF NOT EXISTS idx_inspections_status ON inspections(decision_status);

CREATE TABLE IF NOT EXISTS inspection_media (
  id TEXT PRIMARY KEY,
  inspection_id TEXT REFERENCES inspections(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL DEFAULT 'image/jpeg',
  blob_url TEXT NOT NULL,
  sha256_hash TEXT NOT NULL,
  watermarked BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed authoritative labs for MITAOE campus if not present
INSERT INTO labs (id, institution_id, name, code, building, clause, centroid_lat, centroid_lng, radius_meters, carpet_area_sqm, equipment_summary)
VALUES
  ('lab-comp-center', '1-23111191', 'Computer Center (540 PCs)', 'LAB-CC-03', 'Main Academic Building, Wing A, Floor 2', 'APH 2024-27 §4.4.1 (1:4 Student-PC Ratio)', 18.675620, 73.896710, 35, 520, 'Core i7 16GB, Dual 1 Gbps Leased Line, 40 kVA Online UPS'),
  ('lab-robotics-ai', '1-23111191', 'Robotics & AI Center of Excellence', 'LAB-AI-01', 'School of Mechanical Annex, Floor 1', 'APH 2024-27 §4.4.3 (Emerging Tech Labs)', 18.675810, 73.896920, 30, 480, '6-DOF Robotic Arms, NVIDIA Jetson Orin Clusters, LIDAR SLAM Testbed'),
  ('lab-wheelchair-ramp', '1-23111191', 'Barrier-Free Wheelchair Ramp Portal', 'RAMP-PORTAL-01', 'Main Academic Complex Entry A', 'APH 2024-27 §4.2.2 (RPwD Act 2016)', 18.675380, 73.896620, 20, 85, '1:12 Gradient Slope, Tactile Guiding Surface, Continuous Handrails')
ON CONFLICT (id) DO UPDATE SET
  centroid_lat = EXCLUDED.centroid_lat,
  centroid_lng = EXCLUDED.centroid_lng,
  radius_meters = EXCLUDED.radius_meters;

-- Seed EVC Officer Dr. Priya Sharma
INSERT INTO officers (id, name, email, role, assigned_campus, clearance_level)
VALUES
  ('1-23111191', 'Dr. Priya Sharma', 'priya.sharma@aicte-india.org', 'EVC Officer', 'MIT Academy of Engineering (MITAOE)', 'L2 - Field Scrutiny & EVC Inspection')
ON CONFLICT (id) DO NOTHING;
