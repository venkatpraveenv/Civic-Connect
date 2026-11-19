/**
 * Seed dataset for local development & demonstration fallback
 * Mirrors supabase/seed.sql exactly
 */

export const departments = [
  {
    id: 'd1000000-0000-0000-0000-000000000001',
    name: 'Road Infrastructure & Maintenance',
    code: 'BBMP-ROAD',
    description: 'Maintenance of arterial roads, asphalt patching, pothole repairs, and pedestrian pathways.',
    headName: 'Er. R. S. Manjunath',
    contactEmail: 'roads@civicconnect.bengaluru.demo',
    contactPhone: '+91 80 2266 0001'
  },
  {
    id: 'd1000000-0000-0000-0000-000000000002',
    name: 'Solid Waste Management',
    code: 'BBMP-SWM',
    description: 'Door-to-door garbage collection, dry waste collection centres, and black spot elimination.',
    headName: 'Dr. Anitha Rao',
    contactEmail: 'swm@civicconnect.bengaluru.demo',
    contactPhone: '+91 80 2266 0002'
  },
  {
    id: 'd1000000-0000-0000-0000-000000000003',
    name: 'Street Lighting & Electrical',
    code: 'BESCOM-BBMP',
    description: 'Installation, maintenance, and energy management of public streetlights and high-mast lights.',
    headName: 'Er. Suresh Kumar N',
    contactEmail: 'lighting@civicconnect.bengaluru.demo',
    contactPhone: '+91 80 2266 0003'
  },
  {
    id: 'd1000000-0000-0000-0000-000000000004',
    name: 'Water Supply & Sewerage',
    code: 'BWSSB',
    description: 'Drinking water pipelines, leakage remediation, sewage pipe clearance, and tanker management.',
    headName: 'Er. K. Vijayendra',
    contactEmail: 'water@civicconnect.bengaluru.demo',
    contactPhone: '+91 80 2266 0004'
  },
  {
    id: 'd1000000-0000-0000-0000-000000000005',
    name: 'Stormwater Drainage & Flood Control',
    code: 'BBMP-SWD',
    description: 'Desilting of primary/secondary storm drains (raja kaluve) and monsoon flood mitigation.',
    headName: 'Er. Pradeep Hegde',
    contactEmail: 'drainage@civicconnect.bengaluru.demo',
    contactPhone: '+91 80 2266 0005'
  },
  {
    id: 'd1000000-0000-0000-0000-000000000006',
    name: 'Traffic Signals & Public Transport',
    code: 'BTP-BBMP',
    description: 'Automated traffic signaling maintenance, zebra crossing signages, and road divider bollards.',
    headName: 'ACP Chethan Gowda',
    contactEmail: 'traffic@civicconnect.bengaluru.demo',
    contactPhone: '+91 80 2266 0006'
  }
];

export const categories = [
  {
    id: 'c1000000-0000-0000-0000-000000000001',
    name: 'Potholes and road damage',
    slug: 'potholes',
    icon: 'AlertTriangle',
    description: 'Damaged road surface, crater-like potholes, and missing road paving causing danger to commuters.',
    departmentId: 'd1000000-0000-0000-0000-000000000001',
    defaultSeverity: 7,
    resolutionDeadlineHours: 48
  },
  {
    id: 'c1000000-0000-0000-0000-000000000002',
    name: 'Garbage accumulation',
    slug: 'garbage',
    icon: 'Trash2',
    description: 'Uncollected municipal garbage bins, roadside trash piles, and illegal roadside waste accumulation.',
    departmentId: 'd1000000-0000-0000-0000-000000000002',
    defaultSeverity: 6,
    resolutionDeadlineHours: 24
  },
  {
    id: 'c1000000-0000-0000-0000-000000000003',
    name: 'Streetlight malfunction',
    slug: 'streetlight',
    icon: 'LightbulbOff',
    description: 'Dead streetlights, flickering lamps, or damaged electric poles posing safety risks at night.',
    departmentId: 'd1000000-0000-0000-0000-000000000003',
    defaultSeverity: 5,
    resolutionDeadlineHours: 48
  },
  {
    id: 'c1000000-0000-0000-0000-000000000004',
    name: 'Water supply issues',
    slug: 'water-supply',
    icon: 'Droplets',
    description: 'Low water pressure, disrupted drinking water supply, or contaminated pipeline water.',
    departmentId: 'd1000000-0000-0000-0000-000000000004',
    defaultSeverity: 8,
    resolutionDeadlineHours: 24
  },
  {
    id: 'c1000000-0000-0000-0000-000000000005',
    name: 'Water leakage',
    slug: 'water-leakage',
    icon: 'Pipette',
    description: 'Ruptured BWSSB mains, roadside freshwater flooding from pipeline bursts, and wastage.',
    departmentId: 'd1000000-0000-0000-0000-000000000004',
    defaultSeverity: 7,
    resolutionDeadlineHours: 24
  },
  {
    id: 'c1000000-0000-0000-0000-000000000006',
    name: 'Drainage blockage',
    slug: 'drainage-blockage',
    icon: 'CircleSlash',
    description: 'Choked underground sewers, overflowing manholes, and foul odor on public footpaths.',
    departmentId: 'd1000000-0000-0000-0000-000000000005',
    defaultSeverity: 7,
    resolutionDeadlineHours: 48
  },
  {
    id: 'c1000000-0000-0000-0000-000000000007',
    name: 'Waterlogging',
    slug: 'waterlogging',
    icon: 'Waves',
    description: 'Monsoon road flooding, submerged underpasses, and stagnant stormwater hindering vehicular movement.',
    departmentId: 'd1000000-0000-0000-0000-000000000005',
    defaultSeverity: 9,
    resolutionDeadlineHours: 24
  },
  {
    id: 'c1000000-0000-0000-0000-000000000008',
    name: 'Damaged public infrastructure',
    slug: 'damaged-infra',
    icon: 'Building',
    description: 'Broken footpaths, open utility pits, damaged bus shelters, or missing pedestrian guardrails.',
    departmentId: 'd1000000-0000-0000-0000-000000000001',
    defaultSeverity: 6,
    resolutionDeadlineHours: 96
  },
  {
    id: 'c1000000-0000-0000-0000-000000000009',
    name: 'Illegal dumping',
    slug: 'illegal-dumping',
    icon: 'ShieldAlert',
    description: 'Unauthorized construction debris dumping, industrial effluent disposal, and vacant site littering.',
    departmentId: 'd1000000-0000-0000-0000-000000000002',
    defaultSeverity: 6,
    resolutionDeadlineHours: 72
  },
  {
    id: 'c1000000-0000-0000-0000-000000000010',
    name: 'Public sanitation',
    slug: 'sanitation',
    icon: 'Sparkles',
    description: 'Unsanitary public toilets, open defecation spots, or hazardous biological litter.',
    departmentId: 'd1000000-0000-0000-0000-000000000002',
    defaultSeverity: 7,
    resolutionDeadlineHours: 24
  },
  {
    id: 'c1000000-0000-0000-0000-000000000011',
    name: 'Traffic signal malfunction',
    slug: 'traffic-signals',
    icon: 'Timer',
    description: 'Non-functional intersection blinkers, broken signal timers causing peak-hour gridlocks.',
    departmentId: 'd1000000-0000-0000-0000-000000000006',
    defaultSeverity: 8,
    resolutionDeadlineHours: 12
  },
  {
    id: 'c1000000-0000-0000-0000-000000000012',
    name: 'Environmental issues',
    slug: 'environmental',
    icon: 'TreePine',
    description: 'Uprooted trees obstructing pathways, hazardous branches over power cables, or lake encroachment.',
    departmentId: 'd1000000-0000-0000-0000-000000000001',
    defaultSeverity: 6,
    resolutionDeadlineHours: 48
  },
  {
    id: 'c1000000-0000-0000-0000-000000000013',
    name: 'Other civic grievances',
    slug: 'other',
    icon: 'HelpCircle',
    description: 'Miscellaneous civic problems requiring municipal inspection and coordination.',
    departmentId: 'd1000000-0000-0000-0000-000000000001',
    defaultSeverity: 4,
    resolutionDeadlineHours: 168
  }
];

export const demoProfiles = [
  // Admin
  {
    id: 'u0000000-0000-0000-0000-000000000001',
    email: 'admin@civicconnect.demo',
    fullName: 'Rajeshwari Sharma, IAS',
    role: 'admin',
    phoneNumber: '+91 98450 00001',
    locality: 'BBMP Head Office',
    designation: 'Chief Municipal Administrator'
  },
  // Officers
  {
    id: 'u0000000-0000-0000-0000-000000000011',
    email: 'officer.roads@civicconnect.demo',
    fullName: 'Er. Naveen Chandran',
    role: 'officer',
    phoneNumber: '+91 98450 00011',
    departmentId: 'd1000000-0000-0000-0000-000000000001',
    designation: 'Executive Engineer - Roads',
    locality: 'East Zone, Indiranagar'
  },
  {
    id: 'u0000000-0000-0000-0000-000000000012',
    email: 'officer.swm@civicconnect.demo',
    fullName: 'Priya Venkatesh',
    role: 'officer',
    phoneNumber: '+91 98450 00012',
    departmentId: 'd1000000-0000-0000-0000-000000000002',
    designation: 'Superintendent - Solid Waste',
    locality: 'South Zone, Koramangala'
  },
  {
    id: 'u0000000-0000-0000-0000-000000000013',
    email: 'officer.lighting@civicconnect.demo',
    fullName: 'Er. Girish Murthy',
    role: 'officer',
    phoneNumber: '+91 98450 00013',
    departmentId: 'd1000000-0000-0000-0000-000000000003',
    designation: 'Junior Engineer - Electrical',
    locality: 'Mahadevapura, Whitefield'
  },
  {
    id: 'u0000000-0000-0000-0000-000000000014',
    email: 'officer.water@civicconnect.demo',
    fullName: 'Shashidhar Reddy',
    role: 'officer',
    phoneNumber: '+91 98450 00014',
    departmentId: 'd1000000-0000-0000-0000-000000000004',
    designation: 'Assistant Executive Engineer - BWSSB',
    locality: 'West Zone, Malleshwaram'
  },
  {
    id: 'u0000000-0000-0000-0000-000000000015',
    email: 'officer.drainage@civicconnect.demo',
    fullName: 'Kavitha Natarajan',
    role: 'officer',
    phoneNumber: '+91 98450 00015',
    departmentId: 'd1000000-0000-0000-0000-000000000005',
    designation: 'Project Lead - SWD Flood Cell',
    locality: 'Bommanahalli, HSR Layout'
  },
  {
    id: 'u0000000-0000-0000-0000-000000000016',
    email: 'officer.traffic@civicconnect.demo',
    fullName: 'Sub-Inspector Raghavan S',
    role: 'officer',
    phoneNumber: '+91 98450 00016',
    departmentId: 'd1000000-0000-0000-0000-000000000006',
    designation: 'Traffic Systems Coordinator',
    locality: 'CBD, MG Road'
  },
  // Default Citizen
  {
    id: 'u0000000-0000-0000-0000-000000000101',
    email: 'citizen.arun@gmail.demo',
    fullName: 'Arun Kumar Prasad',
    role: 'citizen',
    phoneNumber: '+91 98451 10001',
    locality: 'Indiranagar',
    ward: 'Ward 80 - Hoysala Nagar'
  }
];

export const initialComplaints = [
  {
    id: 'c0000000-0000-0000-0000-000000000001',
    complaint_number: 'CC-2026-000001',
    title: 'Deep crater pothole near 100 Feet Road junction',
    description: 'Multiple two-wheelers skidded due to a 2-foot wide pothole right after the Metro pillar 62 turning.',
    category_id: 'c1000000-0000-0000-0000-000000000001',
    reporter_id: 'u0000000-0000-0000-0000-000000000101',
    reporter_name: 'Arun Kumar Prasad',
    department_id: 'd1000000-0000-0000-0000-000000000001',
    assigned_officer_id: 'u0000000-0000-0000-0000-000000000011',
    assigned_officer_name: 'Er. Naveen Chandran',
    status: 'resolved',
    severity: 8,
    priority_score: 76.5,
    priority: 'critical',
    location_address: '100 Feet Rd, near Pillar 62, Indiranagar',
    locality: 'Indiranagar',
    ward: 'Ward 80',
    latitude: 12.9784,
    longitude: 77.6408,
    upvotes_count: 38,
    deadline_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    is_escalated: false,
    resolution_remarks: 'Asphalt hot-mix patching completed. Leveling inspected and certified.',
    resolution_proof_url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    evidence_image_url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=600&q=80',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    resolved_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    feedback: {
      rating: 5,
      comment: 'Quick response from BBMP team! Pothole was tarred neatly within 48 hours.',
      is_verified: true
    }
  },
  {
    id: 'c0000000-0000-0000-0000-000000000002',
    complaint_number: 'CC-2026-000002',
    title: 'Severe garbage overflow near 5th Block park',
    description: 'Municipal waste bin overflowing for 4 days. Stray dogs scattering rotten food across walkway.',
    category_id: 'c1000000-0000-0000-0000-000000000002',
    reporter_id: 'u0000000-0000-0000-0000-000000000101',
    reporter_name: 'Deepa Jayaram',
    department_id: 'd1000000-0000-0000-0000-000000000002',
    assigned_officer_id: 'u0000000-0000-0000-0000-000000000012',
    assigned_officer_name: 'Priya Venkatesh',
    status: 'in_progress',
    severity: 7,
    priority_score: 62.0,
    priority: 'high',
    location_address: '80 Feet Rd, 5th Block, Koramangala',
    locality: 'Koramangala',
    ward: 'Ward 151',
    latitude: 12.9352,
    longitude: 77.6245,
    upvotes_count: 27,
    deadline_at: new Date(Date.now() + 12 * 3600000).toISOString(),
    is_escalated: false,
    evidence_image_url: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=600&q=80',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 'c0000000-0000-0000-0000-000000000003',
    complaint_number: 'CC-2026-000003',
    title: 'Complete blackout on Inner Circle Road',
    description: '5 consecutive LED streetlights are not functioning. Pitch dark stretch unsafe for night commuters.',
    category_id: 'c1000000-0000-0000-0000-000000000003',
    reporter_id: 'u0000000-0000-0000-0000-000000000101',
    reporter_name: 'Karthik Subbaraj',
    department_id: 'd1000000-0000-0000-0000-000000000003',
    assigned_officer_id: 'u0000000-0000-0000-0000-000000000013',
    assigned_officer_name: 'Er. Girish Murthy',
    status: 'assigned',
    severity: 6,
    priority_score: 52.4,
    priority: 'high',
    location_address: 'Inner Circle, Whitefield Main Rd',
    locality: 'Whitefield',
    ward: 'Ward 84',
    latitude: 12.9698,
    longitude: 77.7499,
    upvotes_count: 19,
    deadline_at: new Date(Date.now() + 24 * 3600000).toISOString(),
    is_escalated: false,
    evidence_image_url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80',
    created_at: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    id: 'c0000000-0000-0000-0000-000000000004',
    complaint_number: 'CC-2026-000004',
    title: 'BWSSB potable water main burst on 11th Main',
    description: 'High pressure drinking water fountain bursting through tarmac, flooding road and wasting water.',
    category_id: 'c1000000-0000-0000-0000-000000000005',
    reporter_id: 'u0000000-0000-0000-0000-000000000101',
    reporter_name: 'Ananya Deshpande',
    department_id: 'd1000000-0000-0000-0000-000000000004',
    assigned_officer_id: 'u0000000-0000-0000-0000-000000000014',
    assigned_officer_name: 'Shashidhar Reddy',
    status: 'under_review',
    severity: 9,
    priority_score: 81.0,
    priority: 'critical',
    location_address: '11th Main, 4th Block, Jayanagar',
    locality: 'Jayanagar',
    ward: 'Ward 169',
    latitude: 12.9299,
    longitude: 77.5824,
    upvotes_count: 45,
    deadline_at: new Date(Date.now() + 8 * 3600000).toISOString(),
    is_escalated: false,
    evidence_image_url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=600&q=80',
    created_at: new Date(Date.now() - 10 * 3600000).toISOString()
  },
  {
    id: 'c0000000-0000-0000-0000-000000000005',
    complaint_number: 'CC-2026-000005',
    title: 'Sewage backflow on 8th Cross footpath',
    description: 'Choked underground drain pushing black foul wastewater into residential entrances.',
    category_id: 'c1000000-0000-0000-0000-000000000006',
    reporter_id: 'u0000000-0000-0000-0000-000000000101',
    reporter_name: 'Manoj Gowda',
    department_id: 'd1000000-0000-0000-0000-000000000005',
    assigned_officer_id: null,
    status: 'submitted',
    severity: 7,
    priority_score: 49.0,
    priority: 'medium',
    location_address: '8th Cross, Margosa Rd, Malleshwaram',
    locality: 'Malleshwaram',
    ward: 'Ward 45',
    latitude: 13.0031,
    longitude: 77.5701,
    upvotes_count: 14,
    deadline_at: new Date(Date.now() + 36 * 3600000).toISOString(),
    is_escalated: false,
    evidence_image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    created_at: new Date(Date.now() - 4 * 3600000).toISOString()
  },
  {
    id: 'c0000000-0000-0000-0000-000000000006',
    complaint_number: 'CC-2026-000006',
    title: 'Severe underpass waterlogging on 14th Main',
    description: 'Rainwater accumulation over 3 feet deep. Multiple vehicles stalled. Drain outlets completely silted.',
    category_id: 'c1000000-0000-0000-0000-000000000007',
    reporter_id: 'u0000000-0000-0000-0000-000000000101',
    reporter_name: 'Pooja Hegde',
    department_id: 'd1000000-0000-0000-0000-000000000005',
    assigned_officer_id: 'u0000000-0000-0000-0000-000000000015',
    assigned_officer_name: 'Kavitha Natarajan',
    status: 'escalated',
    severity: 9,
    priority_score: 87.5,
    priority: 'critical',
    location_address: '14th Main, Sector 4, HSR Layout',
    locality: 'HSR Layout',
    ward: 'Ward 174',
    latitude: 12.9116,
    longitude: 77.6389,
    upvotes_count: 52,
    deadline_at: new Date(Date.now() - 12 * 3600000).toISOString(),
    is_escalated: true,
    evidence_image_url: 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?auto=format&fit=crop&w=600&q=80',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    id: 'c0000000-0000-0000-0000-000000000007',
    complaint_number: 'CC-2026-000007',
    title: 'Trinity circle signal timer frozen on amber',
    description: 'Signal logic malfunction creating heavy traffic jam across Trinity Metro Station junction.',
    category_id: 'c1000000-0000-0000-0000-000000000011',
    reporter_id: 'u0000000-0000-0000-0000-000000000101',
    reporter_name: 'Sanjay Bhatt',
    department_id: 'd1000000-0000-0000-0000-000000000006',
    assigned_officer_id: 'u0000000-0000-0000-0000-000000000016',
    assigned_officer_name: 'Sub-Inspector Raghavan S',
    status: 'resolved',
    severity: 8,
    priority_score: 73.0,
    priority: 'high',
    location_address: 'Trinity Circle, MG Road Junction',
    locality: 'MG Road',
    ward: 'Ward 111',
    latitude: 12.9733,
    longitude: 77.6205,
    upvotes_count: 31,
    deadline_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    is_escalated: false,
    resolution_remarks: 'Microcontroller board replaced and synchronization restored with central BTP server.',
    resolution_proof_url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=600&q=80',
    evidence_image_url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    resolved_at: new Date(Date.now() - 8 * 3600000).toISOString(),
    feedback: {
      rating: 4,
      comment: 'Traffic signal fixed before evening peak hour. Much appreciated.',
      is_verified: true
    }
  },
  {
    id: 'c0000000-0000-0000-0000-000000000008',
    complaint_number: 'CC-2026-000008',
    title: 'Trucks dumping debris near Toll Gate vacant site',
    description: 'Midnight dumping of construction drywall, rubble and debris blocking the pedestrian pathway.',
    category_id: 'c1000000-0000-0000-0000-000000000009',
    reporter_id: 'u0000000-0000-0000-0000-000000000101',
    reporter_name: 'Vikramaditya Rao',
    department_id: 'd1000000-0000-0000-0000-000000000002',
    assigned_officer_id: 'u0000000-0000-0000-0000-000000000012',
    assigned_officer_name: 'Priya Venkatesh',
    status: 'closed',
    severity: 6,
    priority_score: 56.0,
    priority: 'high',
    location_address: 'Hosur Rd, Phase 1, Electronic City',
    locality: 'Electronic City',
    ward: 'Ward 192',
    latitude: 12.8452,
    longitude: 77.6602,
    upvotes_count: 23,
    deadline_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    is_escalated: false,
    resolution_remarks: 'Debris cleared using JCB. Warning sign and barricades installed.',
    resolution_proof_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
    evidence_image_url: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80',
    created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
    resolved_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    closed_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    feedback: {
      rating: 5,
      comment: 'Debris cleared properly and warning boards placed. Good job.',
      is_verified: true
    }
  }
];

// Generate 42 more complaints to reach 50 records
const localities = [
  { name: 'Indiranagar', ward: 'Ward 80', lat: 12.9784, lng: 77.6408 },
  { name: 'Koramangala', ward: 'Ward 151', lat: 12.9352, lng: 77.6245 },
  { name: 'Whitefield', ward: 'Ward 84', lat: 12.9698, lng: 77.7499 },
  { name: 'Jayanagar', ward: 'Ward 169', lat: 12.9299, lng: 77.5824 },
  { name: 'Malleshwaram', ward: 'Ward 45', lat: 13.0031, lng: 77.5701 },
  { name: 'HSR Layout', ward: 'Ward 174', lat: 12.9116, lng: 77.6389 },
  { name: 'Rajajinagar', ward: 'Ward 100', lat: 12.9912, lng: 77.5552 },
  { name: 'Hebbal', ward: 'Ward 21', lat: 13.0358, lng: 77.5970 }
];

const titles = [
  'Hazardous pothole cluster near school bus stop',
  'Commercial wet garbage piled on sidewalk',
  'Intermittent high-mast light blinking and wire sparks',
  'Underground freshwater pipeline seepage',
  'Stormwater culvert choked with plastic debris',
  'Submerged cross-junction after brief shower',
  'Pedestrian walkway pavement slabs caved in',
  'Night dumping of hotel waste into vacant plot',
  'Broken traffic signal controller box',
  'Dangerous dry branch hanging over electric cable'
];

for (let i = 9; i <= 50; i++) {
  const loc = localities[i % localities.length];
  const cat = categories[i % categories.length];
  const title = titles[i % titles.length] + ' in ' + loc.name;
  const severity = (i % 6) + 4;
  const upvotes = (i * 3 + 7) % 45;
  const daysAgo = (i % 8) + 1;
  const createdAt = new Date(Date.now() - daysAgo * 86400000).toISOString();
  
  const statusList = ['submitted', 'under_review', 'assigned', 'in_progress', 'resolved', 'closed'];
  const status = statusList[i % statusList.length];

  const assignedOfficer = demoProfiles.find(p => p.role === 'officer' && p.departmentId === cat.departmentId) || demoProfiles[1];

  initialComplaints.push({
    id: `c0000000-0000-0000-0000-0000000000${i.toString().padStart(2, '0')}`,
    complaint_number: `CC-2026-${i.toString().padStart(6, '0')}`,
    title,
    description: `Reported civic defect requiring inspection and resolution by ${cat.name} division at ${loc.name}.`,
    category_id: cat.id,
    reporter_id: 'u0000000-0000-0000-0000-000000000101',
    reporter_name: 'Bengaluru Citizen',
    department_id: cat.departmentId,
    assigned_officer_id: status !== 'submitted' ? assignedOfficer.id : null,
    assigned_officer_name: status !== 'submitted' ? assignedOfficer.fullName : null,
    status,
    severity,
    priority_score: Math.min(95, 30 + severity * 4 + upvotes * 0.4),
    priority: severity >= 8 ? 'critical' : severity >= 6 ? 'high' : 'medium',
    location_address: `${loc.name} Main Rd, ${loc.ward}, Bengaluru`,
    locality: loc.name,
    ward: loc.ward,
    latitude: loc.lat + ((i % 5) - 2) * 0.002,
    longitude: loc.lng + ((i % 5) - 2) * 0.002,
    upvotes_count: upvotes,
    deadline_at: new Date(Date.now() + 48 * 3600000).toISOString(),
    is_escalated: status === 'escalated',
    evidence_image_url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    resolution_remarks: status === 'resolved' || status === 'closed' ? 'Field inspection completed and defect rectified per standard municipal specifications.' : null,
    resolution_proof_url: status === 'resolved' || status === 'closed' ? 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80' : null,
    created_at: createdAt,
    resolved_at: status === 'resolved' || status === 'closed' ? new Date(Date.now() - 12 * 3600000).toISOString() : null,
    closed_at: status === 'closed' ? new Date(Date.now() - 6 * 3600000).toISOString() : null
  });
}
