import { ReactNode } from "react";

export interface Skill {
  name: string;
  level: number; // 1-5 scale
  category: string;
}

export interface UserProfile {
  currentRole: string;
  skills: Skill[];
  experience: number;
}

export interface RoleRequirement {
  id: string;
  title: string;
  description: string;
  skills: Skill[];
  category: string;
}

export interface SkillGap {
  skill: string;
  required: number;
  current: number;
  gap: number;
  priority: "high" | "medium" | "low";
}

export interface TrainingRecommendation {
  course: string;
  provider: string;
  duration: string;
  priority: number;
  url: string;
}

export interface TrainingPlan {
  mentorMessage: ReactNode;
  subtitle: ReactNode;
  title: ReactNode;
  readinessScore: number;
  skillGaps: SkillGap[];
  recommendations: TrainingRecommendation[];
  timeline: string;
}

export interface AnalysisResult {
  userProfile: UserProfile;
  targetRole: RoleRequirement;
  trainingPlan: TrainingPlan;
}

// Roadmap specific types
export interface RoadmapPhase {
  id: string;
  title: string;
  description: string;
  duration: string;
  skills: string[];
  courses: string[];
  milestones: string[];
  status: "completed" | "current" | "upcoming";
  priority: "high" | "medium" | "low";
}

export interface RoadmapMilestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: Date;
  skills: string[];
}
