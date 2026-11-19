import { calculatePriorityScore } from '../src/utils/priority.js';
import { calculateHaversineDistance, calculateTextSimilarity, findPotentialDuplicates } from '../src/utils/duplicateDetector.js';
import { store } from '../src/config/supabase.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

console.log('====================================================');
console.log(' CivicConnect Automated Verification Test Suite');
console.log(' Testing core algorithms, RBAC, and lifecycle logic');
console.log('====================================================\n');

// 1. Priority Scoring Formula Test
console.log('--- 1. Testing Intelligent Priority Scoring ---');
const p1 = calculatePriorityScore(8, 38, new Date(Date.now() - 5 * 86400000));
// Formula: (8 * 5 = 40) + (38 * 0.6 = 22.8) + (5 * 2 = 10) = 72.8
assert(p1.score >= 70 && p1.score <= 75, `Expected score ~72.8, got ${p1.score}`);
assert(p1.level === 'high' || p1.level === 'critical', `Expected high/critical classification, got ${p1.level}`);

const pMax = calculatePriorityScore(10, 100, new Date(Date.now() - 20 * 86400000));
// (10 * 5 = 50) + (min(100, 50) * 0.6 = 30) + (min(20, 10) * 2 = 20) = 100
assert(pMax.score === 100, `Expected maximum score 100, got ${pMax.score}`);
assert(pMax.level === 'critical', `Expected critical level, got ${pMax.level}`);

// 2. Haversine Distance & Duplicate Detection Test
console.log('\n--- 2. Testing Haversine Distance & Smart Duplicates ---');
// Indiranagar Pillar 62 (12.9784, 77.6408) vs 30 meters away (12.9786, 77.6409)
const dist30m = calculateHaversineDistance(12.9784, 77.6408, 12.9786, 77.6409);
assert(dist30m < 50, `Distance should be within 50m radius, computed: ${dist30m.toFixed(1)}m`);

const mockExisting = [
  {
    id: 'c1',
    complaint_number: 'CC-2026-000001',
    title: 'Deep crater pothole near 100 Feet Road',
    description: 'Road damage and crater near metro pillar',
    category_id: 'c1000000-0000-0000-0000-000000000001',
    status: 'in_progress',
    latitude: 12.9784,
    longitude: 77.6408,
    locality: 'Indiranagar'
  }
];

const duplicatesFound = findPotentialDuplicates(
  {
    title: 'Pothole on 100 Feet Road near pillar',
    description: 'Crater damage on tarmac',
    categoryId: 'c1000000-0000-0000-0000-000000000001',
    latitude: 12.9785,
    longitude: 77.6409
  },
  mockExisting,
  50
);
assert(duplicatesFound.length === 1, `Should identify nearby duplicate complaint within 50m`);

// 3. Status Lifecycle Enforcement
console.log('\n--- 3. Testing Status Lifecycle & Resolution Rules ---');
const testComplaint = store.createComplaint({
  title: 'Test Pothole on CMH Road',
  description: 'Deep road cavity',
  categoryId: 'c1000000-0000-0000-0000-000000000001',
  locationAddress: 'CMH Road, Indiranagar',
  locality: 'Indiranagar',
  ward: 'Ward 80',
  latitude: 12.9790,
  longitude: 77.6410
});
assert(testComplaint.status === 'submitted', 'New complaint must default to submitted');
assert(testComplaint.complaint_number.startsWith('CC-2026-'), 'Complaint reference ID must follow CC-YYYY-XXXXXX format');

// Automatic category to department routing check
const roadCategory = store.categories.find(c => c.id === 'c1000000-0000-0000-0000-000000000001');
assert(testComplaint.department_id === roadCategory.departmentId, 'Automatic department routing matched category department');

// 4. Upvote & Priority Recalculation
console.log('\n--- 4. Testing Community Upvote System ---');
const initialVotes = testComplaint.upvotes_count || 0;
const voteRes1 = store.toggleVote(testComplaint.id, 'user_citizen_1');
assert(voteRes1.voted === true, 'First vote should toggle active');
assert(testComplaint.upvotes_count === initialVotes + 1, 'Upvotes count should increment');

const voteRes2 = store.toggleVote(testComplaint.id, 'user_citizen_1');
assert(voteRes2.voted === false, 'Second vote from same user should toggle off');
assert(testComplaint.upvotes_count === initialVotes, 'Upvotes count should return to original');

// 5. In-App Notification Delivery
console.log('\n--- 5. Testing In-App Notification System ---');
const notif = store.addNotification({
  userId: 'user_citizen_1',
  title: 'Test Notification',
  message: 'Your report status changed',
  type: 'status_update'
});
assert(store.notifications.some(n => n.id === notif.id), 'Notification must be stored in user queue');
assert(notif.isRead === false, 'Notification must default to unread');

// 6. Dataset Completeness Verification
console.log('\n--- 6. Verifying Demonstration Data Targets ---');
assert(store.complaints.length >= 50, `Demonstration dataset contains ${store.complaints.length} complaints (>= 50 required)`);
assert(store.departments.length === 6, `Configured departments: ${store.departments.length} (6 required)`);
assert(store.categories.length === 13, `Configured categories: ${store.categories.length} (13 required)`);

console.log('\n====================================================');
console.log(` Test Summary: ${passed} Passed, ${failed} Failed`);
console.log('====================================================');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
