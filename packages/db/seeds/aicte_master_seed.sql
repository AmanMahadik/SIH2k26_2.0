-- aicte_master_seed.sql
-- Master Institution Registry Seed Data for AICTE Verification Engine

INSERT INTO institutions (id, legal_name, permanent_id, address, state, region, approved_intake)
VALUES 
  ('inst-delhi-001', 'Delhi Institute of Engineering and Technology', '1-10492817', 'Plot 4, Sector 12, Dwarka, New Delhi 110078', 'Delhi', 'North', 480),
  ('inst-pune-002', 'Apex Institute of Technology and Management', '1-29481729', 'Survey No 14/2, Hinjawadi Phase 1, Pune 411057', 'Maharashtra', 'West', 360),
  ('inst-bengaluru-003', 'National College of Engineering & Research', '1-38291044', 'Ring Road, Bellandur, Bengaluru 560103', 'Karnataka', 'South', 600)
ON CONFLICT (permanent_id) DO NOTHING;
