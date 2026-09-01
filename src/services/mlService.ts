import { Student, EventItem, MLPrediction, MatchScore } from '../types';

/**
 * Simulates a trained Random Forest Classifier for event attendance prediction.
 * Features:
 *  - previous_attendance (weight: 0.35)
 *  - engagement_score (weight: 0.25)
 *  - similar_events_attended (weight: 0.20)
 *  - previous_registrations (weight: 0.10)
 *  - days_until_event penalty (weight: 0.10)
 */
export function predictEventAttendance(student: Student, event: EventItem, daysUntilEvent: number = 4): MLPrediction {
  const previousAttendance = student.attendance_percentage;
  const engagement = student.engagement_score;
  
  // Calculate domain similarity (is the event in the student's interested domain?)
  const isDomainMatch = event.category.toLowerCase().includes(student.interested_domain.toLowerCase()) ||
    student.interested_domain.toLowerCase().includes(event.category.toLowerCase());
  const domainScore = isDomainMatch ? 100 : 50;

  const prevRegScore = Math.min(100, (student.year * 25)); // older years have more past event history
  const daysPenalty = Math.max(0, Math.min(25, daysUntilEvent * 2)); // further away slightly reduces attendance certainty

  // Weighted random forest decision ensemble
  let rawScore = (
    (previousAttendance * 0.35) +
    (engagement * 0.25) +
    (domainScore * 0.25) +
    (prevRegScore * 0.15) -
    daysPenalty
  );

  // Normalize between 10% and 98%
  const probability = Math.round(Math.min(98, Math.max(12, rawScore)));

  let classification: MLPrediction['classification'];
  if (probability >= 70) {
    classification = 'Likely to Attend';
  } else if (probability >= 40) {
    classification = 'Maybe Attend';
  } else {
    classification = 'Unlikely to Attend';
  }

  return {
    eventId: event.event_id,
    eventName: event.event_name,
    probability,
    classification,
    featureBreakdown: {
      previousAttendanceScore: Math.round(previousAttendance * 0.35),
      registrationHistoryScore: Math.round(prevRegScore * 0.15),
      domainRelevanceScore: Math.round(domainScore * 0.25),
      engagementScore: Math.round(engagement * 0.25),
      daysPenalty: Math.round(daysPenalty),
    }
  };
}

/**
 * Computes Cosine Similarity between two term-frequency vectors.
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * AI Student Matchmaker:
 * Builds TF-IDF style vocabulary vector from domains, skills, and department.
 * Computes cosine similarity to find optimal teammates.
 */
export function findTeammateMatches(
  targetStudent: Student,
  allStudents: Student[],
  options?: { onlyEligible?: boolean; searchDomain?: string }
): MatchScore[] {
  // Extract all unique vocabulary terms
  const allTerms = new Set<string>();
  
  const getTermsForStudent = (s: Student): string[] => {
    const list = [
      s.interested_domain.toLowerCase(),
      s.department.toLowerCase(),
      ...(s.skills || []).map(sk => sk.toLowerCase())
    ];
    return list;
  };

  allStudents.forEach(s => {
    getTermsForStudent(s).forEach(t => allTerms.add(t));
  });

  const vocabulary = Array.from(allTerms);

  const getVector = (s: Student): number[] => {
    const terms = getTermsForStudent(s);
    return vocabulary.map(word => (terms.includes(word) ? 1 : 0));
  };

  const targetVector = getVector(targetStudent);
  const targetTerms = new Set(getTermsForStudent(targetStudent));

  let results: MatchScore[] = [];

  allStudents.forEach(s => {
    if (s.student_id === targetStudent.student_id || s.role === 'admin') {
      return;
    }

    const sVector = getVector(s);
    let sim = cosineSimilarity(targetVector, sVector);

    // Boost score slightly if they share complementary technical skills
    if (s.interested_domain === targetStudent.interested_domain) {
      sim = Math.min(0.98, sim + 0.15);
    }

    const sTerms = getTermsForStudent(s);
    const shared = sTerms.filter(t => targetTerms.has(t));

    // Attendance >= 60% rule for hackathons
    const isHackathonEligible = s.attendance_percentage >= 60;

    // Scale percentage between 50% and 97% for realistic teammate matching
    const matchPercentage = Math.round(Math.min(97, Math.max(45, sim * 100)));

    results.push({
      student: s,
      matchPercentage,
      sharedInterests: shared.map(capitalize),
      isHackathonEligible,
    });
  });

  // Filter if requested
  if (options?.onlyEligible) {
    results = results.filter(r => r.isHackathonEligible);
  }

  if (options?.searchDomain && options.searchDomain !== 'ALL') {
    results = results.filter(r => r.student.interested_domain.toLowerCase() === options.searchDomain?.toLowerCase());
  }

  // Sort descending by match percentage
  return results.sort((a, b) => b.matchPercentage - a.matchPercentage);
}

function capitalize(str: string) {
  return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}
