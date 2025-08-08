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
  priority: 'high' | 'medium' | 'low';
}

export interface TrainingPlan {
  mentorMessage: ReactNode;
  subtitle: ReactNode;
  title: ReactNode;
  readinessScore: number;
  skillGaps: SkillGap[];
  recommendations: {
    course: string;
    provider: string;
    duration: string;
    priority: number;
    url: string;
  }[];
  timeline: string;
}

export interface AnalysisResult {
  userProfile: UserProfile;
  targetRole: RoleRequirement;
  trainingPlan: TrainingPlan;
}