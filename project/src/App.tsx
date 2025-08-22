import React, { useState, useEffect, useMemo } from "react";
import { FileUpload } from "./components/FileUpload";
import { RoleSelector } from "./components/RoleSelector";
import { ReadinessScore } from "./components/ReadinessScore";
import { SkillMap } from "./components/SkillMap";
import { TrainingPlan } from "./components/TrainingPlan";
import { Roadmap } from "./components/Roadmap";
import { MentorAvatar } from "./components/MentorAvatar";
import { roleSkillsets } from "./data/roleSkillsets";
import {
  generateTrainingPlan,
  calculateSkillGaps,
} from "./utils/skillAnalysis";
import { parseResume } from "./utils/resumeParser";
import { predictBestRoles, RolePrediction } from "./utils/rolePredictor";
import { TextToSpeechService } from "./utils/textToSpeech";
import { RoleRequirement, AnalysisResult, UserProfile } from "./types";
import jsPDF from "jspdf";
import "jspdf-autotable";

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedRole, setSelectedRole] = useState<RoleRequirement | null>(
    null
  );
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const [roleCandidates, setRoleCandidates] = useState<RolePrediction[]>([]);
  const [activeTab, setActiveTab] = useState<
    "overview" | "skillmap" | "roadmap" | "training"
  >("overview");

  const tts = useMemo(() => new TextToSpeechService(), []);

  useEffect(() => {
    if (selectedRole && extractedSkills.length > 0) {
      const userProfile = buildUserProfileFromSkills(extractedSkills);
      const gaps = calculateSkillGaps(userProfile, selectedRole);
      const plan = generateTrainingPlan(gaps, selectedRole);
      setAnalysisResult({
        userProfile,
        targetRole: selectedRole,
        trainingPlan: plan,
      });
    }
  }, [selectedRole, extractedSkills]);

  function buildUserProfileFromSkills(skills: string[]): UserProfile {
    const userSkills = skills.map((s) => ({
      name: s,
      level: 3,
      category: "Inferred",
    }));
    return {
      currentRole: "Inferred from resume",
      experience: 0,
      skills: userSkills,
    };
  }

  async function handleFileSelect(file: File) {
    setSelectedFile(file);
    setIsAnalyzing(true);
    try {
      const { text, skills } = await parseResume(file);
      setExtractedSkills(skills);

      const predictions = predictBestRoles(skills, roleSkillsets, 3);
      setRoleCandidates(predictions);

      const bestRole = predictions[0]?.role || roleSkillsets[0];
      setSelectedRole(bestRole);

      const userProfile = buildUserProfileFromSkills(skills);
      const gaps = calculateSkillGaps(userProfile, bestRole);
      const plan = generateTrainingPlan(gaps, bestRole);
      setAnalysisResult({
        userProfile,
        targetRole: bestRole,
        trainingPlan: plan,
      });
    } catch (err) {
      console.error("Error analyzing file", err);
    } finally {
      setIsAnalyzing(false);
    }
  }

  function handleDownloadPlan() {
    if (!analysisResult) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Personalized Training Plan", 14, 20);
    doc.text(`Role: ${analysisResult.targetRole.title}`, 14, 30);
    doc.text(
      `Readiness Score: ${analysisResult.trainingPlan.readinessScore}%`,
      14,
      40
    );
    doc.text(`Timeline: ${analysisResult.trainingPlan.timeline}`, 14, 50);

    const tableData = analysisResult.trainingPlan.recommendations.map(
      (item) => [item.course, item.provider, item.duration, item.priority]
    );

    (doc as any).autoTable({
      head: [["Course", "Provider", "Duration", "Priority"]],
      body: tableData,
      startY: 60,
    });

    doc.save("training_plan.pdf");
  }

  async function handleSpeakPlan() {
    if (!analysisResult) return;
    try {
      setIsSpeaking(true);
      const t = `Training plan for role ${
        analysisResult.targetRole.title
      }. Readiness score ${
        analysisResult.trainingPlan.readinessScore
      } percent. Recommended timeline ${
        analysisResult.trainingPlan.timeline
      }. Top recommendations: ${analysisResult.trainingPlan.recommendations
        .slice(0, 3)
        .map((r) => r.course + " by " + r.provider)
        .join("; ")}.`;
      await tts.speak(t, { rate: 1 });
    } catch (err) {
      console.error("TTS error", err);
    } finally {
      setIsSpeaking(false);
    }
  }

  const handleMentorSpeak = async (text: string) => {
    try {
      setIsSpeaking(true);
      await tts.speak(text, { rate: 1 });
    } catch (err) {
      console.error("Mentor TTS error", err);
    } finally {
      setIsSpeaking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Upload */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Upload Resume</h3>
            <FileUpload onFileSelect={handleFileSelect} loading={isAnalyzing} />
          </div>

          {/* Role Suggestions */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Role Suggestions</h3>
            <div className="space-y-2">
              {roleCandidates.length === 0 && (
                <p className="text-sm text-gray-500">
                  No suggestions yet — upload a resume to get role fits.
                </p>
              )}
              {roleCandidates.map((c: any) => (
                <div
                  key={c.role.id}
                  className="p-2 border rounded flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium">{c.role.title}</div>
                    <div className="text-xs text-gray-500">
                      {Math.round(c.score * 10) / 10} pts — matched:{" "}
                      {c.matchedSkills.join(", ") || "—"}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedRole(c.role)}
                    className="text-sm px-2 py-1 bg-blue-50 text-blue-700 rounded"
                  >
                    Use
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Mentor */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Mentor</h3>
            <MentorAvatar
              message={
                analysisResult?.trainingPlan?.mentorMessage ??
                "Upload a resume to get personalized guidance."
              }
              onSpeak={handleMentorSpeak}
              isSpeaking={isSpeaking}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Header */}
          <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Skill Gap Identifier</h2>
              <p className="text-sm text-gray-500">
                Automated skill gap detection and personalized training plans.
              </p>
            </div>
            <div className="text-sm text-gray-600">
              {selectedFile ? selectedFile.name : "No file"}
            </div>
          </div>

          {analysisResult ? (
            <div className="bg-white rounded-lg shadow">
              {/* Tabs */}
              <nav
                className="flex gap-3 p-3 bg-gray-50 rounded-t-lg"
                aria-label="Tabs"
              >
                {[
                  { id: "overview", name: "Overview", icon: "📊" },
                  { id: "roadmap", name: "Roadmap", icon: "🗺️" },
                  { id: "skillmap", name: "Skill Map", icon: "🎯" },
                  { id: "training", name: "Training Plan", icon: "📚" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                      activeTab === tab.id
                        ? "bg-blue-600 text-white shadow"
                        : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="bg-white rounded-lg shadow p-4">
                      <ReadinessScore
                        score={analysisResult.trainingPlan.readinessScore}
                      />
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                      <RoleSelector
                        roles={roleSkillsets}
                        selectedRole={selectedRole}
                        onRoleSelect={(r) => setSelectedRole(r)}
                      />
                    </div>
                  </div>
                )}

                {activeTab === "roadmap" && (
                  <div className="bg-white rounded-lg shadow p-4">
                    <Roadmap
                      trainingPlan={analysisResult.trainingPlan}
                      skillGaps={calculateSkillGaps(
                        analysisResult.userProfile,
                        analysisResult.targetRole
                      )}
                      targetRole={analysisResult.targetRole.title}
                      currentReadiness={
                        analysisResult.trainingPlan.readinessScore
                      }
                    />
                  </div>
                )}

                {activeTab === "skillmap" && (
                  <div className="bg-white rounded-lg shadow p-4">
                    <SkillMap
                      skillGaps={calculateSkillGaps(
                        analysisResult.userProfile,
                        analysisResult.targetRole
                      )}
                    />
                  </div>
                )}

                {activeTab === "training" && (
                  <div className="bg-white rounded-lg shadow p-4">
                    <TrainingPlan
                      trainingPlan={analysisResult.trainingPlan}
                      onDownloadPlan={handleDownloadPlan}
                      onSpeakPlan={handleSpeakPlan}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow text-gray-500">
              Upload a resume to get a skill analysis and training plan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
