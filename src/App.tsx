import React, { useState, useEffect, useMemo } from 'react';
import { FileUpload } from './components/FileUpload';
import { RoleSelector } from './components/RoleSelector';
import { ReadinessScore } from './components/ReadinessScore';
import { SkillMap } from './components/SkillMap';
import { TrainingPlan } from './components/TrainingPlan';
import { MentorAvatar } from './components/MentorAvatar';
import { HeroSection } from './components/HeroSection';
import { StatsOverview } from './components/StatsOverview';
import { roleSkillsets } from './data/roleSkillsets';
import { generateTrainingPlan, calculateSkillGaps } from './utils/skillAnalysis';
import { parseResume } from './utils/resumeParser';
import { predictBestRoles, RolePrediction } from './utils/rolePredictor';
import { generateTrainingPlanPDF } from './utils/pdfGenerator';
import { TextToSpeechService } from './utils/textToSpeech';
import { RoleRequirement, AnalysisResult, UserProfile } from './types';
import { Brain, Target, TrendingUp, Users, Sparkles, Zap, Award } from 'lucide-react';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedRole, setSelectedRole] = useState<RoleRequirement | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const [roleCandidates, setRoleCandidates] = useState<RolePrediction[]>([]);
  const [showResults, setShowResults] = useState(false);
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
    setShowResults(false);
    
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

      // Smooth transition to results
      setTimeout(() => {
        setShowResults(true);
      }, 500);
    } catch (err) {
      console.error('Error analyzing file', err);
    } finally {
      setIsAnalyzing(false);
    }
  }

  function handleDownloadPlan() {
    if (!analysisResult) return;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {!showResults ? (
          <div className="min-h-screen flex flex-col">
            <HeroSection />
            
            <div className="flex-1 flex items-center justify-center px-6 pb-12">
              <div className="w-full max-w-2xl">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mb-4">
                      <Brain className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Upload Your Resume</h2>
                    <p className="text-gray-300">Let AI analyze your skills and create a personalized career roadmap</p>
                  </div>
                  
                  <FileUpload onFileSelect={handleFileSelect} loading={isAnalyzing} />
                  
                  {isAnalyzing && (
                    <div className="mt-8 text-center">
                      <div className="inline-flex items-center space-x-3 text-white">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                        <span className="text-lg">Analyzing your skills with AI...</span>
                      </div>
                      <div className="mt-4 w-full bg-white/20 rounded-full h-2">
                        <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="min-h-screen p-6">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-white">AI Skill Gap Analyzer</h1>
                      <p className="text-gray-300">Personalized career development powered by AI</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-300">Analyzing</div>
                    <div className="text-white font-medium">{selectedFile?.name}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Role Suggestions */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center space-x-3 mb-4">
                    <Target className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-semibold text-white">Role Matches</h3>
                  </div>
                  <div className="space-y-3">
                    {roleCandidates.map((c: any, idx) => (
                      <div key={c.role.id} className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 cursor-pointer ${
                        selectedRole?.id === c.role.id 
                          ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-400/50' 
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`} onClick={() => setSelectedRole(c.role)}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-white">{c.role.title}</div>
                          <div className="flex items-center space-x-1">
                            <Award className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm text-yellow-400">{Math.round(c.score*10)/10}</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-300 mb-2">{c.matchedSkills.slice(0, 3).join(', ')}</div>
                        <div className="w-full bg-white/20 rounded-full h-1">
                          <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-1 rounded-full" style={{ width: `${Math.min(100, c.score * 20)}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Mentor */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center space-x-3 mb-4">
                    <Users className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">AI Career Mentor</h3>
                  </div>
                  <MentorAvatar
                    message={analysisResult?.trainingPlan?.mentorMessage ?? 'Upload a resume to get personalized guidance.'}
                    onSpeak={handleMentorSpeak}
                    isSpeaking={isSpeaking}
                  />
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3 space-y-6">
                {analysisResult && (
                  <>
                    {/* Stats Overview */}
                    <StatsOverview 
                      readinessScore={analysisResult.trainingPlan.readinessScore}
                      skillsMatched={extractedSkills.length}
                      timeline={analysisResult.trainingPlan.timeline}
                      recommendations={analysisResult.trainingPlan.recommendations.length}
                    />

                    {/* Readiness Score */}
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
                      <ReadinessScore score={analysisResult.trainingPlan.readinessScore} />
                    </div>

                    {/* Role Selector */}
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                      <RoleSelector 
                        roles={roleSkillsets} 
                        selectedRole={selectedRole} 
                        onRoleSelect={(r) => setSelectedRole(r)} 
                      />
                    </div>

                    {/* Skill Map */}
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                      <SkillMap skillGaps={calculateSkillGaps(analysisResult.userProfile, analysisResult.targetRole)} />
                    </div>

                    {/* Training Plan */}
                    <TrainingPlan 
                      trainingPlan={analysisResult.trainingPlan} 
                      onDownloadPlan={handleDownloadPlan} 
                      onSpeakPlan={handleSpeakPlan} 
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;