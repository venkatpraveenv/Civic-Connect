/**
 * Smart Duplicate Complaint Detection Algorithm
 * Master Specification Section 12:
 * 1. Identify unresolved complaints in same or related category.
 * 2. Calculate geographical distance using the Haversine formula.
 * 3. Default radius: 50 meters (configurable).
 * 4. Text similarity matching for titles and descriptions.
 */

// Haversine formula to compute distance in meters between two lat/lng coordinates
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
}

// Basic Jaccard word token similarity for text comparison without paid AI
export function calculateTextSimilarity(textA = '', textB = '') {
  const tokenize = (str) =>
    new Set(
      str
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter((w) => w.length > 2)
    );

  const setA = tokenize(textA);
  const setB = tokenize(textB);

  if (setA.size === 0 || setB.size === 0) return 0;

  let intersectionCount = 0;
  for (const token of setA) {
    if (setB.has(token)) intersectionCount++;
  }

  const unionCount = new Set([...setA, ...setB]).size;
  return unionCount === 0 ? 0 : intersectionCount / unionCount;
}

/**
 * Finds potential duplicates among a list of existing active complaints
 */
export function findPotentialDuplicates(targetComplaint, existingComplaints, radiusMeters = 50) {
  const targetLat = Number(targetComplaint.latitude);
  const targetLng = Number(targetComplaint.longitude);
  const targetCategory = targetComplaint.categoryId;
  const targetTitle = targetComplaint.title || '';
  const targetDesc = targetComplaint.description || '';

  if (isNaN(targetLat) || isNaN(targetLng)) {
    return [];
  }

  const duplicates = [];

  for (const item of existingComplaints) {
    // Only check active/unresolved complaints
    const isUnresolved = !['resolved', 'closed', 'rejected'].includes(item.status);
    if (!isUnresolved) continue;

    const itemLat = Number(item.latitude);
    const itemLng = Number(item.longitude);
    if (isNaN(itemLat) || isNaN(itemLng)) continue;

    const distance = calculateHaversineDistance(targetLat, targetLng, itemLat, itemLng);

    // If within radius or category match with high text similarity
    const sameCategory = !targetCategory || item.category_id === targetCategory;
    const titleSim = calculateTextSimilarity(targetTitle, item.title || '');
    const descSim = calculateTextSimilarity(targetDesc, item.description || '');
    const maxSim = Math.max(titleSim, descSim);

    const isGeographicMatch = distance <= radiusMeters;
    const isTextMatch = maxSim > 0.35;

    if ((isGeographicMatch && sameCategory) || (distance <= 200 && isTextMatch)) {
      duplicates.push({
        id: item.id,
        complaintNumber: item.complaint_number,
        title: item.title,
        status: item.status,
        distanceMeters: Math.round(distance),
        similarityScore: Math.round(maxSim * 100),
        locality: item.locality,
        createdAt: item.created_at,
        upvotesCount: item.upvotes_count || 0
      });
    }
  }

  return duplicates.sort((a, b) => a.distanceMeters - b.distanceMeters);
}
