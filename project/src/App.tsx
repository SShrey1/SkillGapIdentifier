import React, { useState, useEffect, useMemo } from 'react';
import { FileUpload } from './components/FileUpload';
import { RoleSelector } from './components/RoleSelector';
import { ReadinessScore } from './components/ReadinessScore';
import { SkillMap } from './components/SkillMap';
import { TrainingPlan } from './components/TrainingPlan';
import { MentorAvatar } from './components/MentorAvatar';
import { roleSkillsets } from './data/roleSkillsets';
import { generateTrainingPlan, calculateSkillGaps } from './utils/skillAnalysis';
import { parseResume } from './utils/resumeParser';
import { predictBestRoles, RolePrediction } from './utils/rolePredictor';
import { generateTrainingPlanPDF } from './utils/pdfGenerator';
import { TextToSpeechService } from './utils/textToSpeech';
import { RoleRequirement, AnalysisResult, UserProfile } from './types';
import { Brain, Target, TrendingUp, Users } from 'lucide-react';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedRole, setSelectedRole] = useState<RoleRequirement | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const [roleCandidates, setRoleCandidates] = useState<RolePrediction[]>([]);
  const tts = useMemo(() => new TextToSpeechService(), []);

  useEffect(() => {
    // If user manually picks a role, recompute training plan using last extracted skills
    if (selectedRole && extractedSkills.length > 0) {
      const userProfile = buildUserProfileFromSkills(extractedSkills);
      const gaps = calculateSkillGaps(userProfile, selectedRole);
      const plan = generateTrainingPlan(gaps, selectedRole);
      setAnalysisResult({
        userProfile,
        targetRole: selectedRole,
        trainingPlan: plan
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRole]);

  function buildUserProfileFromSkills(skills: string[]): UserProfile {
    // No proficiency data from text extraction -> assume moderate level 3
    const userSkills = skills.map(s => ({
      name: s,
      level: 3,
      category: 'Inferred'
    }));
    return {
      currentRole: 'Inferred from resume',
      experience: 0,
      skills: userSkills
    };
  }

  async function handleFileSelect(file: File) {
    setSelectedFile(file);
    setIsAnalyzing(true);
    try {
      const { text, skills } = await parseResume(file);
      setExtractedSkills(skills);

      // predict best roles
      const predictions = predictBestRoles(skills, roleSkillsets, 3);
      setRoleCandidates(predictions);

      const bestRole = predictions[0]?.role || roleSkillsets[0];
      setSelectedRole(bestRole);

      // create a quick user profile and analyze
      const userProfile = buildUserProfileFromSkills(skills);
      const gaps = calculateSkillGaps(userProfile, bestRole);
      const plan = generateTrainingPlan(gaps, bestRole);
      setAnalysisResult({
        userProfile,
        targetRole: bestRole,
        trainingPlan: plan
      });
    } catch (err) {
      console.error('Error analyzing file', err);
    } finally {
      setIsAnalyzing(false);
    }
  }

  function handleDownloadPlan() {
    if (!analysisResult) return;
    // pdf generator expects (trainingPlan, userProfile, targetRole)
    generateTrainingPlanPDF(
      analysisResult.trainingPlan,
      analysisResult.userProfile,
      analysisResult.targetRole
    );
  }

  async function handleSpeakPlan() {
    if (!analysisResult) return;
    try {
      setIsSpeaking(true);
      const t = `Training plan for role ${analysisResult.targetRole.title}. Readiness score ${analysisResult.trainingPlan.readinessScore} percent. Recommended timeline ${analysisResult.trainingPlan.timeline}. Top recommendations: ${analysisResult.trainingPlan.recommendations.slice(0,3).map(r => r.course + ' by ' + r.provider).join('; ')}.`;
      await tts.speak(t, { rate: 1 });
    } catch (err) {
      console.error('TTS error', err);
    } finally {
      setIsSpeaking(false);
    }
  }

  // Mentor message speak handler for MentorAvatar's onSpeak
  const handleMentorSpeak = async (text: string) => {
    try {
      setIsSpeaking(true);
      await tts.speak(text, { rate: 1 });
    } catch (err) {
      console.error('Mentor TTS error', err);
    } finally {
      setIsSpeaking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Upload Resume</h3>
            <FileUpload onFileSelect={handleFileSelect} loading={isAnalyzing} />
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Role Suggestions</h3>
            <div className="space-y-2">
              {roleCandidates.length === 0 && <p className="text-sm text-gray-500">No suggestions yet — upload a resume to get role fits.</p>}
              {roleCandidates.map((c: any) => (
                <div key={c.role.id} className="p-2 border rounded flex items-center justify-between">
                  <div>
                    <div className="font-medium">{c.role.title}</div>
                    <div className="text-xs text-gray-500">{Math.round(c.score*10)/10} pts — matched: {c.matchedSkills.join(', ') || '—'}</div>
                  </div>
                  <button onClick={() => setSelectedRole(c.role)} className="text-sm px-2 py-1 bg-blue-50 text-blue-700 rounded">Use</button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Mentor</h3>
            {/* ensure message is always a string, pass required onSpeak and isSpeaking */}
            <MentorAvatar
              message={analysisResult?.trainingPlan?.mentorMessage ?? 'Upload a resume to get personalized guidance.'}
              onSpeak={handleMentorSpeak}
              isSpeaking={isSpeaking}
            />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">Skill Gap Identifier</h2>
                <p className="text-sm text-gray-500">Automated skill gap detection and personalized training plans.</p>
              </div>
              <div className="text-sm text-gray-600">{selectedFile ? selectedFile.name : 'No file'}</div>
            </div>
          </div>

          {analysisResult ? (
            <>
              <div className="bg-white p-4 rounded-lg shadow">
                <ReadinessScore score={analysisResult.trainingPlan.readinessScore} />
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <RoleSelector roles={roleSkillsets} selectedRole={selectedRole} onRoleSelect={(r) => setSelectedRole(r)} />
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                {/* SkillMap expects skillGaps: SkillGap[] */}
                <SkillMap skillGaps={calculateSkillGaps(analysisResult.userProfile, analysisResult.targetRole)} />
              </div>

              <TrainingPlan trainingPlan={analysisResult.trainingPlan} onDownloadPlan={handleDownloadPlan} onSpeakPlan={handleSpeakPlan} />
            </>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow text-gray-500">Upload a resume to get a skill analysis and training plan.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
