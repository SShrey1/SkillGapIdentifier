import { UserProfile, RoleRequirement, SkillGap, TrainingPlan } from "../types";

/**
 * Calculate skill gaps: for each required skill, determine user's level and gap.
 */
export function calculateSkillGaps(
  userProfile: UserProfile,
  targetRole: RoleRequirement
): SkillGap[] {
  const userSkillsMap = new Map(
    userProfile.skills.map((skill) => [skill.name.toLowerCase(), skill.level])
  );

  return targetRole.skills.map((requiredSkill) => {
    const currentLevel =
      userSkillsMap.get(requiredSkill.name.toLowerCase()) || 0;
    const gap = Math.max(0, requiredSkill.level - currentLevel);

    let priority: "high" | "medium" | "low" = "low";
    if (gap >= 3) priority = "high";
    else if (gap >= 2) priority = "medium";

    return {
      skill: requiredSkill.name,
      required: requiredSkill.level,
      current: currentLevel,
      gap,
      priority,
    } as SkillGap;
  });
}

/**
 * Create a training plan from skill gaps and role meta.
 */
export function generateTrainingPlan(
  skillGaps: SkillGap[],
  targetRole: RoleRequirement
): TrainingPlan {
  const readinessScore = calculateReadinessScore(skillGaps);

  const recommendations = skillGaps
    .filter((g) => g.gap > 0)
    .sort((a, b) => {
      const order = { high: 3, medium: 2, low: 1 } as any;
      return order[b.priority] - order[a.priority] || b.gap - a.gap;
    })
    .map((gap, index) => {
      const courseInfo = getProviderForSkill(gap.skill);
      return {
        course: `Master ${gap.skill}`,
        provider: courseInfo.provider,
        duration: getDurationForGap(gap.gap),
        priority: index + 1,
        url: courseInfo.url,
      };
    });

  return {
    title: `Training plan for ${targetRole.title}`,
    subtitle: `Focused plan to close skill gaps for ${targetRole.title}`,
    mentorMessage: generateMentorMessage(readinessScore, targetRole.title),
    readinessScore,
    skillGaps, // Include skill gaps in the training plan
    recommendations,
    timeline: generateTimeline(recommendations.length, readinessScore),
  } as TrainingPlan;
}

/* ----------------- Helpers ----------------- */

function calculateReadinessScore(skillGaps: SkillGap[]): number {
  if (!skillGaps || skillGaps.length === 0) return 100;
  // base score 100, subtract per-gap penalty
  const totalPossible = skillGaps.reduce((acc, g) => acc + g.required, 0) || 1;
  const totalGap = skillGaps.reduce((acc, g) => acc + g.gap, 0);
  const raw = Math.max(0, 100 - Math.round((totalGap / totalPossible) * 100));
  return raw;
}

function getProviderForSkill(skill: string): { provider: string; url: string } {
  const map: Record<string, { provider: string; url: string }> = {
    React: { provider: "React Official Docs", url: "https://react.dev/" },
    JavaScript: {
      provider: "MDN Web Docs",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    },
    TypeScript: {
      provider: "TypeScript Handbook",
      url: "https://www.typescriptlang.org/docs/",
    },
    Python: {
      provider: "Python Docs",
      url: "https://docs.python.org/3/tutorial/",
    },
    "Node.js": {
      provider: "Node.js Guides",
      url: "https://nodejs.org/en/docs/guides/",
    },
    AWS: { provider: "AWS Training", url: "https://aws.amazon.com/training/" },
    Docker: {
      provider: "Docker Getting Started",
      url: "https://docs.docker.com/get-started/",
    },
    Kubernetes: {
      provider: "Kubernetes Docs",
      url: "https://kubernetes.io/docs/home/",
    },
    "Machine Learning": {
      provider: "Coursera - ML",
      url: "https://www.coursera.org/learn/machine-learning",
    },
    "Data Science": {
      provider: "Kaggle Learn",
      url: "https://www.kaggle.com/learn",
    },
    Figma: {
      provider: "Figma Learn",
      url: "https://help.figma.com/hc/en-us/articles/360040514913-Learn-design-in-Figma",
    },
    HTML: {
      provider: "MDN HTML Guide",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTML",
    },
    CSS: {
      provider: "MDN CSS Guide",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS",
    },
    "Tailwind CSS": {
      provider: "Tailwind Docs",
      url: "https://tailwindcss.com/docs",
    },
    Git: { provider: "Git Docs", url: "https://git-scm.com/doc" },
    SQL: {
      provider: "Mode SQL Tutorial",
      url: "https://mode.com/sql-tutorial/",
    },
  };

  const direct = map[skill];
  if (direct) return direct;

  const lower = skill.toLowerCase();
  for (const k of Object.keys(map)) {
    if (k.toLowerCase().includes(lower) || lower.includes(k.toLowerCase())) {
      return map[k];
    }
  }

  return { provider: "Coursera", url: "https://www.coursera.org/" };
}

function getDurationForGap(gap: number): string {
  if (gap <= 1) return "2-3 weeks";
  if (gap === 2) return "4-6 weeks";
  if (gap === 3) return "2-3 months";
  return "3-6 months";
}

function generateTimeline(courseCount: number, readinessScore: number): string {
  if (readinessScore >= 80) return "2-3 months";
  if (readinessScore >= 60) return "4-6 months";
  if (readinessScore >= 40) return "6-9 months";
  return "9-12 months";
}

/* Enhanced mentor message generator with more detailed feedback */
function generateMentorMessage(
  readinessScore: number,
  targetRole: string
): string {
  if (readinessScore >= 85) {
    return `🎉 Excellent! With a ${readinessScore}% readiness score for ${targetRole}, you're already well-prepared. Focus on polishing your portfolio and practicing interviews. You could start applying to positions right now!`;
  } else if (readinessScore >= 70) {
    return `👍 Great progress! Your ${readinessScore}% readiness for ${targetRole} shows a solid foundation. Focus on closing the remaining skill gaps through hands-on projects. You're closer than you think!`;
  } else if (readinessScore >= 50) {
    return `📚 You're on the right track! At ${readinessScore}% readiness for ${targetRole}, you have good fundamentals. Work systematically through the high-priority skills and build projects to demonstrate your abilities.`;
  } else {
    return `🚀 Every expert was once a beginner! Your ${readinessScore}% readiness for ${targetRole} shows potential. Start with the foundation skills and take it step by step. With consistent effort, you'll see significant progress in 3-6 months.`;
  }
}
