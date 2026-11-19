/**
 * Intelligent Priority Scoring Algorithm for CivicConnect
 * Master Specification Section 13:
 * - Issue severity: 50%
 * - Community upvotes: 30%
 * - Unresolved duration: 20%
 * 
 * Formula:
 * Priority Score = (Severity × 5) + (Min(Upvotes, 50) × 0.6) + (Min(Days Unresolved, 10) × 2)
 * Severity: 1 - 10
 * Classifications:
 * 0–24: Low
 * 25–49: Medium
 * 50–74: High
 * 75–100: Critical
 */

export function calculatePriorityScore(severity = 5, upvotes = 0, createdAt = new Date()) {
  const sev = Math.max(1, Math.min(10, Number(severity) || 5));
  const votes = Math.max(0, Number(upvotes) || 0);

  const createdTime = new Date(createdAt).getTime();
  const now = Date.now();
  const daysUnresolved = Math.max(0, (now - createdTime) / (1000 * 60 * 60 * 24));

  const severityComponent = sev * 5; // Max 50
  const upvoteComponent = Math.min(votes, 50) * 0.6; // Max 30
  const durationComponent = Math.min(daysUnresolved, 10) * 2; // Max 20

  const rawScore = severityComponent + upvoteComponent + durationComponent;
  const score = Math.min(100, Math.max(0, parseFloat(rawScore.toFixed(2))));

  let level = 'low';
  if (score >= 75) {
    level = 'critical';
  } else if (score >= 50) {
    level = 'high';
  } else if (score >= 25) {
    level = 'medium';
  }

  return {
    score,
    level,
    breakdown: {
      severityComponent,
      upvoteComponent: parseFloat(upvoteComponent.toFixed(2)),
      durationComponent: parseFloat(durationComponent.toFixed(2)),
      daysUnresolved: parseFloat(daysUnresolved.toFixed(1))
    }
  };
}
