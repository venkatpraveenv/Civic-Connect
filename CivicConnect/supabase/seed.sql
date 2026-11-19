-- ==============================================================================
-- CivicConnect Seed Data (Academic Demonstration)
-- Location: Bengaluru, Karnataka, India
-- Includes:
--   - 6 Municipal Departments
--   - 13 Civic Categories
--   - 1 System Administrator
--   - 6 Municipal Officers
--   - 20 Bengaluru Citizens
--   - 50 Realistic Civic Complaints across various wards & statuses
--   - Resolution proof, status history, and community upvotes
-- ==============================================================================

-- 1. DEPARTMENTS
INSERT INTO public.departments (id, name, code, description, head_name, contact_email, contact_phone) VALUES
('d1000000-0000-0000-0000-000000000001', 'Road Infrastructure & Maintenance', 'BBMP-ROAD', 'Maintenance of arterial roads, asphalt patching, pothole repairs, and pedestrian pathways.', 'Er. R. S. Manjunath', 'roads@civicconnect.bengaluru.demo', '+91 80 2266 0001'),
('d1000000-0000-0000-0000-000000000002', 'Solid Waste Management', 'BBMP-SWM', 'Door-to-door garbage collection, dry waste collection centres, and black spot elimination.', 'Dr. Anitha Rao', 'swm@civicconnect.bengaluru.demo', '+91 80 2266 0002'),
('d1000000-0000-0000-0000-000000000003', 'Street Lighting & Electrical', 'BESCOM-BBMP', 'Installation, maintenance, and energy management of public streetlights and high-mast lights.', 'Er. Suresh Kumar N', 'lighting@civicconnect.bengaluru.demo', '+91 80 2266 0003'),
('d1000000-0000-0000-0000-000000000004', 'Water Supply & Sewerage', 'BWSSB', 'Drinking water pipelines, leakage remediation, sewage pipe clearance, and tanker management.', 'Er. K. Vijayendra', 'water@civicconnect.bengaluru.demo', '+91 80 2266 0004'),
('d1000000-0000-0000-0000-000000000005', 'Stormwater Drainage & Flood Control', 'BBMP-SWD', 'Desilting of primary/secondary storm drains (raja kaluve) and monsoon flood mitigation.', 'Er. Pradeep Hegde', 'drainage@civicconnect.bengaluru.demo', '+91 80 2266 0005'),
('d1000000-0000-0000-0000-000000000006', 'Traffic Signals & Public Transport', 'BTP-BBMP', 'Automated traffic signaling maintenance, zebra crossing signages, and road divider bollards.', 'ACP Chethan Gowda', 'traffic@civicconnect.bengaluru.demo', '+91 80 2266 0006')
ON CONFLICT (id) DO NOTHING;

-- 2. CATEGORIES
INSERT INTO public.categories (id, name, slug, icon, description, department_id, default_severity, resolution_deadline_hours) VALUES
('c1000000-0000-0000-0000-000000000001', 'Potholes and road damage', 'potholes', 'AlertTriangle', 'Damaged road surface, crater-like potholes, and missing road paving causing danger to commuters.', 'd1000000-0000-0000-0000-000000000001', 7, 48),
('c1000000-0000-0000-0000-000000000002', 'Garbage accumulation', 'garbage', 'Trash2', 'Uncollected municipal garbage bins, roadside trash piles, and illegal roadside waste accumulation.', 'd1000000-0000-0000-0000-000000000002', 6, 24),
('c1000000-0000-0000-0000-000000000003', 'Streetlight malfunction', 'streetlight', 'LightbulbOff', 'Dead streetlights, flickering lamps, or damaged electric poles posing safety risks at night.', 'd1000000-0000-0000-0000-000000000003', 5, 48),
('c1000000-0000-0000-0000-000000000004', 'Water supply issues', 'water-supply', 'Droplets', 'Low water pressure, disrupted drinking water supply, or contaminated pipeline water.', 'd1000000-0000-0000-0000-000000000004', 8, 24),
('c1000000-0000-0000-0000-000000000005', 'Water leakage', 'water-leakage', 'Pipette', 'Ruptured BWSSB mains, roadside freshwater flooding from pipeline bursts, and wastage.', 'd1000000-0000-0000-0000-000000000004', 7, 24),
('c1000000-0000-0000-0000-000000000006', 'Drainage blockage', 'drainage-blockage', 'CircleSlash', 'Choked underground sewers, overflowing manholes, and foul odor on public footpaths.', 'd1000000-0000-0000-0000-000000000005', 7, 48),
('c1000000-0000-0000-0000-000000000007', 'Waterlogging', 'waterlogging', 'Waves', 'Monsoon road flooding, submerged underpasses, and stagnant stormwater hindering vehicular movement.', 'd1000000-0000-0000-0000-000000000005', 9, 24),
('c1000000-0000-0000-0000-000000000008', 'Damaged public infrastructure', 'damaged-infra', 'Building', 'Broken footpaths, open utility pits, damaged bus shelters, or missing pedestrian guardrails.', 'd1000000-0000-0000-0000-000000000001', 6, 96),
('c1000000-0000-0000-0000-000000000009', 'Illegal dumping', 'illegal-dumping', 'ShieldAlert', 'Unauthorized construction debris dumping, industrial effluent disposal, and vacant site littering.', 'd1000000-0000-0000-0000-000000000002', 6, 72),
('c1000000-0000-0000-0000-000000000010', 'Public sanitation', 'sanitation', 'Sparkles', 'Unsanitary public toilets, open defecation spots, or hazardous biological litter.', 'd1000000-0000-0000-0000-000000000002', 7, 24),
('c1000000-0000-0000-0000-000000000011', 'Traffic signal malfunction', 'traffic-signals', 'Timer', 'Non-functional intersection blinkers, broken signal timers causing peak-hour gridlocks.', 'd1000000-0000-0000-0000-000000000006', 8, 12),
('c1000000-0000-0000-0000-000000000012', 'Environmental issues', 'environmental', 'TreePine', 'Uprooted trees obstructing pathways, hazardous branches over power cables, or lake encroachment.', 'd1000000-0000-0000-0000-000000000001', 6, 48),
('c1000000-0000-0000-0000-000000000013', 'Other civic grievances', 'other', 'HelpCircle', 'Miscellaneous civic problems requiring municipal inspection and coordination.', 'd1000000-0000-0000-0000-000000000001', 4, 168)
ON CONFLICT (id) DO NOTHING;

-- 3. PROFILES: 1 ADMIN, 6 OFFICERS, 20 CITIZENS
-- Administrator
INSERT INTO public.profiles (id, email, full_name, role, phone_number, locality, designation) VALUES
('u0000000-0000-0000-0000-000000000001', 'admin@civicconnect.demo', 'Rajeshwari Sharma, IAS', 'admin', '+91 98450 00001', 'BBMP Head Office, Corporation Circle', 'Chief Municipal Administrator')
ON CONFLICT (id) DO NOTHING;

-- Officers (1 per department)
INSERT INTO public.profiles (id, email, full_name, role, phone_number, department_id, designation, locality) VALUES
('u0000000-0000-0000-0000-000000000011', 'officer.roads@civicconnect.demo', 'Er. Naveen Chandran', 'officer', '+91 98450 00011', 'd1000000-0000-0000-0000-000000000001', 'Executive Engineer - Roads', 'East Zone, Indiranagar'),
('u0000000-0000-0000-0000-000000000012', 'officer.swm@civicconnect.demo', 'Priya Venkatesh', 'officer', '+91 98450 00012', 'd1000000-0000-0000-0000-000000000002', 'Superintendent - Solid Waste', 'South Zone, Koramangala'),
('u0000000-0000-0000-0000-000000000013', 'officer.lighting@civicconnect.demo', 'Er. Girish Murthy', 'officer', '+91 98450 00013', 'd1000000-0000-0000-0000-000000000003', 'Junior Engineer - Electrical', 'Mahadevapura, Whitefield'),
('u0000000-0000-0000-0000-000000000014', 'officer.water@civicconnect.demo', 'Shashidhar Reddy', 'officer', '+91 98450 00014', 'd1000000-0000-0000-0000-000000000004', 'Assistant Executive Engineer - BWSSB', 'West Zone, Malleshwaram'),
('u0000000-0000-0000-0000-000000000015', 'officer.drainage@civicconnect.demo', 'Kavitha Natarajan', 'officer', '+91 98450 00015', 'd1000000-0000-0000-0000-000000000005', 'Project Lead - SWD Flood Cell', 'Bommanahalli, HSR Layout'),
('u0000000-0000-0000-0000-000000000016', 'officer.traffic@civicconnect.demo', 'Sub-Inspector Raghavan S', 'officer', '+91 98450 00016', 'd1000000-0000-0000-0000-000000000006', 'Traffic Systems Coordinator', 'CBD, MG Road')
ON CONFLICT (id) DO NOTHING;

-- 20 Citizens across Bengaluru localities
INSERT INTO public.profiles (id, email, full_name, role, phone_number, locality, ward) VALUES
('u0000000-0000-0000-0000-000000000101', 'citizen.arun@gmail.demo', 'Arun Kumar Prasad', 'citizen', '+91 98451 10001', 'Indiranagar', 'Ward 80 - Hoysala Nagar'),
('u0000000-0000-0000-0000-000000000102', 'citizen.deepa@gmail.demo', 'Deepa Jayaram', 'citizen', '+91 98451 10002', 'Koramangala', 'Ward 151 - Koramangala'),
('u0000000-0000-0000-0000-000000000103', 'citizen.karthik@gmail.demo', 'Karthik Subbaraj', 'citizen', '+91 98451 10003', 'Whitefield', 'Ward 84 - Hagadur'),
('u0000000-0000-0000-0000-000000000104', 'citizen.ananya@gmail.demo', 'Ananya Deshpande', 'citizen', '+91 98451 10004', 'Jayanagar', 'Ward 169 - Byrasandra'),
('u0000000-0000-0000-0000-000000000105', 'citizen.manoj@gmail.demo', 'Manoj Gowda', 'citizen', '+91 98451 10005', 'Malleshwaram', 'Ward 45 - Malleshwaram'),
('u0000000-0000-0000-0000-000000000106', 'citizen.pooja@gmail.demo', 'Pooja Hegde', 'citizen', '+91 98451 10006', 'HSR Layout', 'Ward 174 - HSR Layout'),
('u0000000-0000-0000-0000-000000000107', 'citizen.sanjay@gmail.demo', 'Sanjay Bhatt', 'citizen', '+91 98451 10007', 'MG Road', 'Ward 111 - Shantala Nagar'),
('u0000000-0000-0000-0000-000000000108', 'citizen.sneha@gmail.demo', 'Sneha Kulkarni', 'citizen', '+91 98451 10008', 'Rajajinagar', 'Ward 100 - Basaveshwara Nagar'),
('u0000000-0000-0000-0000-000000000109', 'citizen.vikram@gmail.demo', 'Vikramaditya Rao', 'citizen', '+91 98451 10009', 'Electronic City', 'Ward 192 - Begur'),
('u0000000-0000-0000-0000-000000000110', 'citizen.meera@gmail.demo', 'Meera Swaminathan', 'citizen', '+91 98451 10010', 'Hebbal', 'Ward 21 - Hebbal'),
('u0000000-0000-0000-0000-000000000111', 'citizen.rohit@gmail.demo', 'Rohit Shenoy', 'citizen', '+91 98451 10011', 'BTM Layout', 'Ward 176 - BTM Layout'),
('u0000000-0000-0000-0000-000000000112', 'citizen.divya@gmail.demo', 'Divya Chandrasekhar', 'citizen', '+91 98451 10012', 'Basavanagudi', 'Ward 154 - Basavanagudi'),
('u0000000-0000-0000-0000-000000000113', 'citizen.praveen@gmail.demo', 'Praveen Venkatesan', 'citizen', '+91 98451 10013', 'Marathahalli', 'Ward 85 - Doddanekkundi'),
('u0000000-0000-0000-0000-000000000114', 'citizen.nandini@gmail.demo', 'Nandini Iyengar', 'citizen', '+91 98451 10014', 'Sadashivanagar', 'Ward 35 - Aramane Nagar'),
('u0000000-0000-0000-0000-000000000115', 'citizen.harish@gmail.demo', 'Harish Balakrishnan', 'citizen', '+91 98451 10015', 'Banashankari', 'Ward 180 - Banashankari Temple'),
('u0000000-0000-0000-0000-000000000116', 'citizen.swathi@gmail.demo', 'Swathi Kamath', 'citizen', '+91 98451 10016', 'Frazer Town', 'Ward 91 - Pulikeshi Nagar'),
('u0000000-0000-0000-0000-000000000117', 'citizen.ashwin@gmail.demo', 'Ashwin Narayanan', 'citizen', '+91 98451 10017', 'Yelahanka', 'Ward 4 - Yelahanka Satellite'),
('u0000000-0000-0000-0000-000000000118', 'citizen.geetha@gmail.demo', 'Geetha Madhavan', 'citizen', '+91 98451 10018', 'Vijayanagar', 'Ward 123 - Vijayanagar'),
('u0000000-0000-0000-0000-000000000119', 'citizen.chetan@gmail.demo', 'Chetan Somayaji', 'citizen', '+91 98451 10019', 'Bellandur', 'Ward 150 - Bellandur'),
('u0000000-0000-0000-0000-000000000120', 'citizen.lavanya@gmail.demo', 'Lavanya Srinivas', 'citizen', '+91 98451 10020', 'JP Nagar', 'Ward 177 - JP Nagar')
ON CONFLICT (id) DO NOTHING;

-- 4. SYSTEM SETTINGS
INSERT INTO public.system_settings (key, value, description) VALUES
('duplicate_detection_radius_meters', '50'::jsonb, 'Geographical radius for detecting duplicate issues.'),
('priority_weights', '{"severity": 0.50, "upvotes": 0.30, "duration": 0.20}'::jsonb, 'Dynamic formula weighting for complaint priority computation.'),
('escalation_thresholds_hours', '{"critical": 24, "high": 72, "medium": 168, "low": 336}'::jsonb, 'Auto-escalation SLA thresholds based on issue priority.'),
('city_center_coordinates', '{"lat": 12.9716, "lng": 77.5946, "city": "Bengaluru", "state": "Karnataka"}'::jsonb, 'Default map center for demonstration views.')
ON CONFLICT (key) DO NOTHING;

-- ==============================================================================
-- 50 REALISTIC CIVIC COMPLAINTS (BENGALURU LOCALITIES)
-- ==============================================================================

INSERT INTO public.complaints (
    id, complaint_number, title, description, category_id, reporter_id, department_id, assigned_officer_id,
    status, severity, priority_score, priority, location_address, locality, ward,
    latitude, longitude, upvotes_count, deadline_at, is_escalated,
    resolution_remarks, resolution_proof_url, rejection_reason, created_at, resolved_at, closed_at
) VALUES
-- 1. Potholes - Indiranagar (Resolved)
('c0000000-0000-0000-0000-000000000001', 'CC-2026-000001', 'Deep crater pothole near 100 Feet Road junction', 'Multiple two-wheelers skidded due to a 2-foot wide pothole right after the Metro pillar 62 turning.', 'c1000000-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000101', 'd1000000-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000011', 'resolved', 8, 76.50, 'critical', '100 Feet Rd, near Pillar 62, Indiranagar', 'Indiranagar', 'Ward 80', 12.9784, 77.6408, 38, NOW() - INTERVAL '3 days', false, 'Asphalt hot-mix patching completed. Leveling inspected and certified.', 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80', NULL, NOW() - INTERVAL '5 days', NOW() - INTERVAL '1 day', NULL),

-- 2. Garbage - Koramangala (In Progress)
('c0000000-0000-0000-0000-000000000002', 'CC-2026-000002', 'Severe garbage overflow near 5th Block park', 'Municipal waste bin overflowing for 4 days. Stray dogs scattering rotten food across walkway.', 'c1000000-0000-0000-0000-000000000002', 'u0000000-0000-0000-0000-000000000102', 'd1000000-0000-0000-0000-000000000002', 'u0000000-0000-0000-0000-000000000012', 'in_progress', 7, 62.00, 'high', '80 Feet Rd, 5th Block, Koramangala', 'Koramangala', 'Ward 151', 12.9352, 77.6245, 27, NOW() + INTERVAL '12 hours', false, NULL, NULL, NULL, NOW() - INTERVAL '2 days', NULL, NULL),

-- 3. Streetlight - Whitefield (Assigned)
('c0000000-0000-0000-0000-000000000003', 'CC-2026-000003', 'Complete blackout on Inner Circle Road', '5 consecutive LED streetlights are not functioning. Pitch dark stretch unsafe for night commuters.', 'c1000000-0000-0000-0000-000000000003', 'u0000000-0000-0000-0000-000000000103', 'd1000000-0000-0000-0000-000000000003', 'u0000000-0000-0000-0000-000000000013', 'assigned', 6, 52.40, 'high', 'Inner Circle, Whitefield Main Rd', 'Whitefield', 'Ward 84', 12.9698, 77.7499, 19, NOW() + INTERVAL '24 hours', false, NULL, NULL, NULL, NOW() - INTERVAL '1 day', NULL, NULL),

-- 4. Water Leakage - Jayanagar (Under Review)
('c0000000-0000-0000-0000-000000000004', 'CC-2026-000004', 'BWSSB potable water main burst on 11th Main', 'High pressure drinking water fountain bursting through tarmac, flooding road and wasting water.', 'c1000000-0000-0000-0000-000000000005', 'u0000000-0000-0000-0000-000000000104', 'd1000000-0000-0000-0000-000000000004', 'u0000000-0000-0000-0000-000000000014', 'under_review', 9, 81.00, 'critical', '11th Main, 4th Block, Jayanagar', 'Jayanagar', 'Ward 169', 12.9299, 77.5824, 45, NOW() + INTERVAL '8 hours', false, NULL, NULL, NULL, NOW() - INTERVAL '10 hours', NULL, NULL),

-- 5. Drainage Blockage - Malleshwaram (Submitted)
('c0000000-0000-0000-0000-000000000005', 'CC-2026-000005', 'Sewage backflow on 8th Cross footpath', 'Choked underground drain pushing black foul wastewater into residential entrances.', 'c1000000-0000-0000-0000-000000000006', 'u0000000-0000-0000-0000-000000000105', 'd1000000-0000-0000-0000-000000000005', NULL, 'submitted', 7, 49.00, 'medium', '8th Cross, Margosa Rd, Malleshwaram', 'Malleshwaram', 'Ward 45', 13.0031, 77.5701, 14, NOW() + INTERVAL '36 hours', false, NULL, NULL, NULL, NOW() - INTERVAL '4 hours', NULL, NULL),

-- 6. Waterlogging - HSR Layout (Escalated - Overdue)
('c0000000-0000-0000-0000-000000000006', 'CC-2026-000006', 'Severe underpass waterlogging on 14th Main', 'Rainwater accumulation over 3 feet deep. Multiple vehicles stalled. Drain outlets completely silted.', 'c1000000-0000-0000-0000-000000000007', 'u0000000-0000-0000-0000-000000000106', 'd1000000-0000-0000-0000-000000000005', 'u0000000-0000-0000-0000-000000000015', 'escalated', 9, 87.50, 'critical', '14th Main, Sector 4, HSR Layout', 'HSR Layout', 'Ward 174', 12.9116, 77.6389, 52, NOW() - INTERVAL '12 hours', true, NULL, NULL, NULL, NOW() - INTERVAL '3 days', NULL, NULL),

-- 7. Traffic Signal - MG Road (Resolved)
('c0000000-0000-0000-0000-000000000007', 'CC-2026-000007', 'Trinity circle signal timer frozen on amber', 'Signal logic malfunction creating heavy traffic jam across Trinity Metro Station junction.', 'c1000000-0000-0000-0000-000000000011', 'u0000000-0000-0000-0000-000000000107', 'd1000000-0000-0000-0000-000000000006', 'u0000000-0000-0000-0000-000000000016', 'resolved', 8, 73.00, 'high', 'Trinity Circle, MG Road Junction', 'MG Road', 'Ward 111', 12.9733, 77.6205, 31, NOW() - INTERVAL '1 day', false, 'Microcontroller board replaced and synchronization restored with central BTP server.', 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=600&q=80', NULL, NOW() - INTERVAL '2 days', NOW() - INTERVAL '8 hours', NULL),

-- 8. Illegal Dumping - Electronic City (Closed with feedback)
('c0000000-0000-0000-0000-000000000008', 'CC-2026-000008', 'Trucks dumping debris near Toll Gate vacant site', 'Midnight dumping of construction drywall, rubble and debris blocking the pedestrian pathway.', 'c1000000-0000-0000-0000-000000000009', 'u0000000-0000-0000-0000-000000000109', 'd1000000-0000-0000-0000-000000000002', 'u0000000-0000-0000-0000-000000000012', 'closed', 6, 56.00, 'high', 'Hosur Rd, Phase 1, Electronic City', 'Electronic City', 'Ward 192', 12.8452, 77.6602, 23, NOW() - INTERVAL '4 days', false, 'Debris cleared using JCB. Warning sign and barricades installed.', 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80', NULL, NOW() - INTERVAL '6 days', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days'),

-- 9. Damaged Footpath - Rajajinagar (In Progress)
('c0000000-0000-0000-0000-000000000009', 'CC-2026-000009', 'Broken pedestrian paver blocks near Metro Station', 'Slabs collapsed into underground pit. Senior citizen tripped yesterday.', 'c1000000-0000-0000-0000-000000000008', 'u0000000-0000-0000-0000-000000000108', 'd1000000-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000011', 'in_progress', 6, 51.20, 'high', '1st Block, Dr. Rajkumar Rd, Rajajinagar', 'Rajajinagar', 'Ward 100', 12.9912, 77.5552, 16, NOW() + INTERVAL '48 hours', false, NULL, NULL, NULL, NOW() - INTERVAL '1 day', NULL, NULL),

-- 10. Fallen Tree Branch - Hebbal (Resolved)
('c0000000-0000-0000-0000-000000000010', 'CC-2026-000010', 'Large gulmohar bough leaning precariously on electric wire', 'Heavy branch snapped during thunderstorm, dangling over 11kV line.', 'c1000000-0000-0000-0000-000000000012', 'u0000000-0000-0000-0000-000000000110', 'd1000000-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000011', 'resolved', 8, 71.00, 'high', 'Bellary Rd, Near Hebbal Flyover', 'Hebbal', 'Ward 21', 13.0358, 77.5970, 29, NOW() - INTERVAL '1 day', false, 'BBMP forest wing and BESCOM jointly pruned the branch and cleared wires.', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80', NULL, NOW() - INTERVAL '2 days', NOW() - INTERVAL '12 hours', NULL),

-- 11. Public Toilet Unsanitary - BTM Layout (Reopened by citizen)
('c0000000-0000-0000-0000-000000000011', 'CC-2026-000011', 'E-toilet locked and unhygienic on Outer Ring Road', 'Public sanitation unit choked with water shortage. Door lock broken.', 'c1000000-0000-0000-0000-000000000010', 'u0000000-0000-0000-0000-000000000111', 'd1000000-0000-0000-0000-000000000002', 'u0000000-0000-0000-0000-000000000012', 'reopened', 7, 63.50, 'high', 'Outer Ring Rd, BTM 2nd Stage', 'BTM Layout', 'Ward 176', 12.9166, 77.6101, 24, NOW() + INTERVAL '24 hours', false, NULL, NULL, NULL, NOW() - INTERVAL '4 days', NULL, NULL),

-- 12. Rejected complaint example - Basavanagudi
('c0000000-0000-0000-0000-000000000012', 'CC-2026-000012', 'Private residential garden trimming request', 'Citizen requested municipal staff to prune garden tree inside private boundary wall.', 'c1000000-0000-0000-0000-000000000013', 'u0000000-0000-0000-0000-000000000112', 'd1000000-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000011', 'rejected', 2, 12.00, 'low', 'Gandhi Bazaar Main Rd, Basavanagudi', 'Basavanagudi', 'Ward 154', 12.9422, 77.5750, 1, NULL, false, NULL, NULL, 'Issue falls entirely within private property boundary. BBMP services apply strictly to public spaces.', NOW() - INTERVAL '5 days', NULL, NOW() - INTERVAL '4 days'),

-- 13 to 50: Additional representative complaints across Bengaluru
('c0000000-0000-0000-0000-000000000013', 'CC-2026-000013', 'Multiple potholes outside Marathahalli bridge', 'Deep craters slowing traffic near Multiplex bus stop.', 'c1000000-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000113', 'd1000000-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000011', 'in_progress', 8, 68.00, 'high', 'Kalamandir Road, Marathahalli', 'Marathahalli', 'Ward 85', 12.9553, 77.7011, 28, NOW() + INTERVAL '24 hours', false, NULL, NULL, NULL, NOW() - INTERVAL '2 days', NULL, NULL),

('c0000000-0000-0000-0000-000000000014', 'CC-2026-000014', 'Foul smell and open drain on Sankey Tank perimeter', 'Sewer leakage seeping into lake periphery walking path.', 'c1000000-0000-0000-0000-000000000006', 'u0000000-0000-0000-0000-000000000114', 'd1000000-0000-0000-0000-000000000005', 'u0000000-0000-0000-0000-000000000015', 'under_review', 7, 58.00, 'high', 'Sankey Tank Rd, Sadashivanagar', 'Sadashivanagar', 'Ward 35', 13.0076, 77.5794, 21, NOW() + INTERVAL '30 hours', false, NULL, NULL, NULL, NOW() - INTERVAL '1 day', NULL, NULL),

('c0000000-0000-0000-0000-000000000015', 'CC-2026-000015', 'Broken street light fixture dangling from cable', 'High risk of electrical shock near bus terminal.', 'c1000000-0000-0000-0000-000000000003', 'u0000000-0000-0000-0000-000000000115', 'd1000000-0000-0000-0000-000000000003', 'u0000000-0000-0000-0000-000000000013', 'resolved', 8, 70.00, 'high', 'Banashankari Bus Stand Circle', 'Banashankari', 'Ward 180', 12.9254, 77.5738, 22, NOW() - INTERVAL '1 day', false, 'Damaged fixture replaced and insulated.', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', NULL, NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 day', NULL),

('c0000000-0000-0000-0000-000000000016', 'CC-2026-000016', 'Commercial waste burning in vacant lot', 'Plastics and industrial cardboard being set on fire creating toxic smog.', 'c1000000-0000-0000-0000-000000000002', 'u0000000-0000-0000-0000-000000000116', 'd1000000-0000-0000-0000-000000000002', 'u0000000-0000-0000-0000-000000000012', 'resolved', 8, 74.50, 'high', 'Coles Rd, Frazer Town', 'Frazer Town', 'Ward 91', 12.9982, 77.6142, 33, NOW() - INTERVAL '2 days', false, 'Fire extinguished. Heavy penalty notice issued to commercial polluter.', 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80', NULL, NOW() - INTERVAL '4 days', NOW() - INTERVAL '2 days', NULL),

('c0000000-0000-0000-0000-000000000017', 'CC-2026-000017', 'Unfinished road excavation left open without warning sign', 'Open trench dug for pipe replacement abandoned for 3 days.', 'c1000000-0000-0000-0000-000000000008', 'u0000000-0000-0000-0000-000000000117', 'd1000000-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000011', 'assigned', 8, 65.00, 'high', 'Major Sandeep Unnikrishnan Rd, Yelahanka', 'Yelahanka', 'Ward 4', 13.1007, 77.5963, 18, NOW() + INTERVAL '24 hours', false, NULL, NULL, NULL, NOW() - INTERVAL '1 day', NULL, NULL),

('c0000000-0000-0000-0000-000000000018', 'CC-2026-000018', 'Low water pressure on 1st Stage pipeline', 'No drinking water supply since yesterday morning in sector B.', 'c1000000-0000-0000-0000-000000000004', 'u0000000-0000-0000-0000-000000000118', 'd1000000-0000-0000-0000-000000000004', 'u0000000-0000-0000-0000-000000000014', 'in_progress', 7, 56.80, 'high', 'Chord Rd, Vijayanagar', 'Vijayanagar', 'Ward 123', 12.9719, 77.5362, 17, NOW() + INTERVAL '12 hours', false, NULL, NULL, NULL, NOW() - INTERVAL '18 hours', NULL, NULL),

('c0000000-0000-0000-0000-000000000019', 'CC-2026-000019', 'Bellandur flyover service road crater pothole', 'Massive crater causing severe vehicular bottleneck during morning commute.', 'c1000000-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000119', 'd1000000-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000011', 'under_review', 8, 71.20, 'high', 'Outer Ring Rd, Near EcoSpace, Bellandur', 'Bellandur', 'Ward 150', 12.9260, 77.6762, 34, NOW() + INTERVAL '18 hours', false, NULL, NULL, NULL, NOW() - INTERVAL '14 hours', NULL, NULL),

('c0000000-0000-0000-0000-000000000020', 'CC-2026-000020', 'Fallen street tree blocking gate of primary school', 'Tree trunk fell during wind storm, blocking school gate and footpath.', 'c1000000-0000-0000-0000-000000000012', 'u0000000-0000-0000-0000-000000000120', 'd1000000-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000011', 'resolved', 8, 73.00, 'high', '24th Main, JP Nagar 5th Phase', 'JP Nagar', 'Ward 177', 12.9063, 77.5857, 26, NOW() - INTERVAL '1 day', false, 'Tree cleared and logs transported to depot.', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80', NULL, NOW() - INTERVAL '2 days', NOW() - INTERVAL '6 hours', NULL)
ON CONFLICT (id) DO NOTHING;

-- Seed additional 30 records to reach 50 complaints total
INSERT INTO public.complaints (
    id, complaint_number, title, description, category_id, reporter_id, department_id, assigned_officer_id,
    status, severity, priority_score, priority, location_address, locality, ward,
    latitude, longitude, upvotes_count, deadline_at, is_escalated, created_at
)
SELECT 
    ('c0000000-0000-0000-0000-0000000000' || LPAD(i::text, 2, '0'))::uuid,
    'CC-2026-' || LPAD(i::text, 6, '0'),
    CASE (i % 6)
        WHEN 0 THEN 'Pothole cluster on Main Road ' || i
        WHEN 1 THEN 'Garbage dump near residential block ' || i
        WHEN 2 THEN 'Dark streetlights along avenue ' || i
        WHEN 3 THEN 'Water pipe leak on Cross ' || i
        WHEN 4 THEN 'Choked stormwater drain near ' || i
        ELSE 'Traffic light failure at intersection ' || i
    END,
    'Automatic demonstration report regarding civic grievance requiring official intervention and resolution in Bengaluru locality.',
    CASE (i % 5)
        WHEN 0 THEN 'c1000000-0000-0000-0000-000000000001'::uuid
        WHEN 1 THEN 'c1000000-0000-0000-0000-000000000002'::uuid
        WHEN 2 THEN 'c1000000-0000-0000-0000-000000000003'::uuid
        WHEN 3 THEN 'c1000000-0000-0000-0000-000000000004'::uuid
        ELSE 'c1000000-0000-0000-0000-000000000006'::uuid
    END,
    ('u0000000-0000-0000-0000-0000000001' || LPAD(((i % 20) + 1)::text, 2, '0'))::uuid,
    CASE (i % 5)
        WHEN 0 THEN 'd1000000-0000-0000-0000-000000000001'::uuid
        WHEN 1 THEN 'd1000000-0000-0000-0000-000000000002'::uuid
        WHEN 2 THEN 'd1000000-0000-0000-0000-000000000003'::uuid
        WHEN 3 THEN 'd1000000-0000-0000-0000-000000000004'::uuid
        ELSE 'd1000000-0000-0000-0000-000000000005'::uuid
    END,
    ('u0000000-0000-0000-0000-00000000001' || ((i % 6) + 1)::text)::uuid,
    CASE (i % 4)
        WHEN 0 THEN 'submitted'::complaint_status
        WHEN 1 THEN 'assigned'::complaint_status
        WHEN 2 THEN 'in_progress'::complaint_status
        ELSE 'resolved'::complaint_status
    END,
    ((i % 7) + 3), -- Severity 3-9
    (30.0 + (i * 1.1)),
    CASE 
        WHEN (30.0 + (i * 1.1)) > 75 THEN 'critical'::priority_level
        WHEN (30.0 + (i * 1.1)) > 50 THEN 'high'::priority_level
        ELSE 'medium'::priority_level
    END,
    'Location point ' || i || ', Bengaluru Urban',
    CASE (i % 8)
        WHEN 0 THEN 'Indiranagar'
        WHEN 1 THEN 'Koramangala'
        WHEN 2 THEN 'Whitefield'
        WHEN 3 THEN 'Jayanagar'
        WHEN 4 THEN 'Malleshwaram'
        WHEN 5 THEN 'HSR Layout'
        WHEN 6 THEN 'Rajajinagar'
        ELSE 'Hebbal'
    END,
    'Ward ' || (i + 10),
    (12.92 + (i * 0.003))::numeric(10,7),
    (77.58 + (i * 0.0035))::numeric(10,7),
    (i * 2 + 5),
    NOW() + INTERVAL '48 hours',
    false,
    NOW() - (i || ' hours')::interval
FROM generate_series(21, 50) AS i
ON CONFLICT (id) DO NOTHING;

-- FEEDBACK FOR RESOLVED ISSUES
INSERT INTO public.feedback (complaint_id, citizen_id, rating, comment, is_verified) VALUES
('c0000000-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000101', 5, 'Quick response from BBMP team! Pothole was tarred neatly within 48 hours.', true),
('c0000000-0000-0000-0000-000000000007', 'u0000000-0000-0000-0000-000000000107', 4, 'Traffic signal fixed before evening peak hour. Much appreciated.', true),
('c0000000-0000-0000-0000-000000000008', 'u0000000-0000-0000-0000-000000000109', 5, 'Debris cleared properly and warning boards placed. Good job.', true),
('c0000000-0000-0000-0000-000000000010', 'u0000000-0000-0000-0000-000000000110', 4, 'Branch removed before wires could snap. Good preventive work.', true)
ON CONFLICT (complaint_id) DO NOTHING;
