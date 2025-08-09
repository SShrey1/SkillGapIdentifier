import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  Circle,
  Clock,
  Target,
  Star,
  Book,
  Trophy,
  Calendar,
} from "lucide-react";
import { TrainingPlan, SkillGap } from "../types";

interface RoadmapPhase {
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

interface RoadmapProps {
  trainingPlan: TrainingPlan;
  skillGaps: SkillGap[];
  targetRole: string;
  currentReadiness: number;
}

export function Roadmap({
  trainingPlan,
  skillGaps,
  targetRole,
  currentReadiness,
}: RoadmapProps) {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"timeline" | "phases">("timeline");

  // Generate roadmap phases based on skill gaps and training plan
  const generateRoadmapPhases = (): RoadmapPhase[] => {
    const phases: RoadmapPhase[] = [];

    // Phase 1: Foundation (High Priority Skills)
    const highPriorityGaps = skillGaps.filter(
      (gap) => gap.priority === "high" && gap.gap > 0
    );
    if (highPriorityGaps.length > 0) {
      phases.push({
        id: "foundation",
        title: "Foundation Building",
        description: "Master the core skills essential for the role",
        duration: "6-8 weeks",
        skills: highPriorityGaps.map((gap) => gap.skill),
        courses: trainingPlan.recommendations
          .filter((rec) => rec.priority <= 2)
          .map((rec) => rec.course),
        milestones: [
          "Complete fundamental courses",
          "Build first practice project",
          "Pass foundational assessments",
        ],
        status: "current",
        priority: "high",
      });
    }

    // Phase 2: Intermediate Skills
    const mediumPriorityGaps = skillGaps.filter(
      (gap) => gap.priority === "medium" && gap.gap > 0
    );
    if (mediumPriorityGaps.length > 0) {
      phases.push({
        id: "intermediate",
        title: "Skill Development",
        description: "Develop intermediate skills and practical experience",
        duration: "8-10 weeks",
        skills: mediumPriorityGaps.map((gap) => gap.skill),
        courses: trainingPlan.recommendations
          .filter((rec) => rec.priority > 2 && rec.priority <= 4)
          .map((rec) => rec.course),
        milestones: [
          "Complete intermediate projects",
          "Contribute to open source",
          "Network with professionals",
        ],
        status: highPriorityGaps.length === 0 ? "current" : "upcoming",
        priority: "medium",
      });
    }

    // Phase 3: Advanced & Specialization
    const lowPriorityGaps = skillGaps.filter(
      (gap) => gap.priority === "low" && gap.gap > 0
    );
    phases.push({
      id: "advanced",
      title: "Specialization & Polish",
      description: "Advanced skills and role-specific expertise",
      duration: "4-6 weeks",
      skills: lowPriorityGaps.map((gap) => gap.skill),
      courses: trainingPlan.recommendations
        .filter((rec) => rec.priority > 4)
        .map((rec) => rec.course),
      milestones: [
        "Build portfolio project",
        "Practice technical interviews",
        "Get industry certifications",
      ],
      status: "upcoming",
      priority: "low",
    });

    // Phase 4: Job Ready
    phases.push({
      id: "job-ready",
      title: "Job Application Ready",
      description: "Final preparation and job search",
      duration: "2-4 weeks",
      skills: ["Interview Skills", "Portfolio Optimization", "Networking"],
      courses: ["Interview Preparation", "Resume Optimization"],
      milestones: [
        "Update resume and LinkedIn",
        "Apply to target positions",
        "Prepare for interviews",
      ],
      status: "upcoming",
      priority: "high",
    });

    return phases;
  };

  const [roadmapPhases, setRoadmapPhases] = useState<RoadmapPhase[]>([]);

  useEffect(() => {
    setRoadmapPhases(generateRoadmapPhases());
  }, [trainingPlan, skillGaps]);

  const getPriorityColor = (priority: string, isSelected?: boolean) => {
    const colors = {
      high: isSelected
        ? "bg-red-500 text-white"
        : "bg-red-100 text-red-800 border-red-300",
      medium: isSelected
        ? "bg-yellow-500 text-white"
        : "bg-yellow-100 text-yellow-800 border-yellow-300",
      low: isSelected
        ? "bg-blue-500 text-white"
        : "bg-blue-100 text-blue-800 border-blue-300",
    };
    return colors[priority as keyof typeof colors];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "current":
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const totalDuration = roadmapPhases.reduce((acc, phase) => {
    const weeks = parseInt(
      phase.duration.split("-")[1] || phase.duration.split("-")[0]
    );
    return acc + weeks;
  }, 0);

  return (
    <div className="w-full bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold flex items-center">
              <Target className="w-6 h-6 mr-2" />
              Learning Roadmap
            </h3>
            <p className="text-sm opacity-90 mt-1">
              Your personalized path to becoming a {targetRole}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90">Total Duration</div>
            <div className="text-lg font-semibold">
              {totalDuration - 8}-{totalDuration} weeks
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="mt-4 bg-white/20 rounded-lg p-3">
          <div className="flex items-center justify-between text-sm mb-2">
            <span>Current Readiness</span>
            <span>{currentReadiness}%</span>
          </div>
          <div className="w-full bg-white/30 rounded-full h-2">
            <div
              className="bg-white rounded-full h-2 transition-all duration-500"
              style={{ width: `${currentReadiness}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setViewMode("timeline")}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              viewMode === "timeline"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Timeline View
          </button>
          <button
            onClick={() => setViewMode("phases")}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              viewMode === "phases"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Phase Details
          </button>
        </div>
      </div>

      <div className="p-6">
        {viewMode === "timeline" ? (
          /* Timeline View */
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>

            <div className="space-y-8">
              {roadmapPhases.map((phase, index) => (
                <div
                  key={phase.id}
                  className="relative flex items-start space-x-6"
                >
                  {/* Timeline node */}
                  <div
                    className={`relative z-10 flex-shrink-0 w-16 h-16 rounded-full border-4 flex items-center justify-center ${
                      phase.status === "completed"
                        ? "bg-green-500 border-green-500"
                        : phase.status === "current"
                        ? "bg-blue-500 border-blue-500"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    {phase.status === "completed" ? (
                      <CheckCircle className="w-8 h-8 text-white" />
                    ) : phase.status === "current" ? (
                      <Clock className="w-8 h-8 text-white" />
                    ) : (
                      <span className="text-lg font-bold text-gray-400">
                        {index + 1}
                      </span>
                    )}
                  </div>

                  {/* Phase content */}
                  <div className="flex-1 min-w-0">
                    <div
                      className={`bg-white rounded-lg border-2 p-4 cursor-pointer transition-all hover:shadow-md ${
                        selectedPhase === phase.id
                          ? "border-blue-500 shadow-lg"
                          : "border-gray-200"
                      }`}
                      onClick={() =>
                        setSelectedPhase(
                          selectedPhase === phase.id ? null : phase.id
                        )
                      }
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {phase.title}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(
                              phase.priority
                            )}`}
                          >
                            {phase.priority} priority
                          </span>
                          <span className="text-sm text-gray-500">
                            {phase.duration}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-3">
                        {phase.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h5 className="font-medium text-gray-700 mb-2 flex items-center">
                            <Star className="w-4 h-4 mr-1" />
                            Key Skills ({phase.skills.length})
                          </h5>
                          <div className="space-y-1">
                            {phase.skills.slice(0, 3).map((skill, idx) => (
                              <div
                                key={idx}
                                className="text-xs bg-gray-100 px-2 py-1 rounded"
                              >
                                {skill}
                              </div>
                            ))}
                            {phase.skills.length > 3 && (
                              <div className="text-xs text-gray-500">
                                +{phase.skills.length - 3} more
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium text-gray-700 mb-2 flex items-center">
                            <Book className="w-4 h-4 mr-1" />
                            Courses ({phase.courses.length})
                          </h5>
                          <div className="space-y-1">
                            {phase.courses.slice(0, 2).map((course, idx) => (
                              <div
                                key={idx}
                                className="text-xs bg-blue-50 px-2 py-1 rounded text-blue-700"
                              >
                                {course}
                              </div>
                            ))}
                            {phase.courses.length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{phase.courses.length - 2} more
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium text-gray-700 mb-2 flex items-center">
                            <Trophy className="w-4 h-4 mr-1" />
                            Milestones
                          </h5>
                          <div className="space-y-1">
                            {phase.milestones
                              .slice(0, 2)
                              .map((milestone, idx) => (
                                <div
                                  key={idx}
                                  className="text-xs bg-green-50 px-2 py-1 rounded text-green-700"
                                >
                                  {milestone}
                                </div>
                              ))}
                            {phase.milestones.length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{phase.milestones.length - 2} more
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Phase Details View */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roadmapPhases.map((phase, index) => (
              <div
                key={phase.id}
                className="border rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(phase.status)}
                    <h4 className="font-semibold text-gray-900">
                      {phase.title}
                    </h4>
                  </div>
                  <span className="text-sm text-gray-500">
                    {phase.duration}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  {phase.description}
                </p>

                <div className="space-y-3">
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">
                      Skills to Master
                    </h5>
                    <div className="flex flex-wrap gap-1">
                      {phase.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">
                      Recommended Courses
                    </h5>
                    <div className="space-y-1">
                      {phase.courses.map((course, idx) => (
                        <div
                          key={idx}
                          className="text-xs bg-gray-50 p-2 rounded flex items-center"
                        >
                          <Book className="w-3 h-3 mr-2 text-gray-500" />
                          {course}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">
                      Key Milestones
                    </h5>
                    <div className="space-y-1">
                      {phase.milestones.map((milestone, idx) => (
                        <div
                          key={idx}
                          className="text-xs text-gray-600 flex items-center"
                        >
                          <Trophy className="w-3 h-3 mr-2 text-yellow-500" />
                          {milestone}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
