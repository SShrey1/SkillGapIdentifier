/**
 * rolePredictor.ts
 * Lightweight role scorer based on overlap between extracted skills and role skill requirements.
 */

import { RoleRequirement } from '../types';

export interface RolePrediction {
  role: RoleRequirement;
  score: number;
  matchedSkills: string[];
}

export function predictBestRoles(extractedSkills: string[], roles: RoleRequirement[], topN = 3): RolePrediction[] {
  const skillSet = new Set(extractedSkills.map(s => s.toLowerCase()));
  const scored = roles.map(role => {
    let matched = 0;
    let weight = 0;
    const matchedSkills: string[] = [];

    role.skills.forEach(s => {
      if (skillSet.has(s.name.toLowerCase())) {
        matched++;
        weight += s.level; // give more weight to higher required levels
        matchedSkills.push(s.name);
      }
    });

    // score is simple: matched count + scaled weight
    const score = matched + weight / 10;
    return { role, score, matchedSkills };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, topN);
}
