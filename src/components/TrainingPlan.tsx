import React from 'react';
import { BookOpen, ExternalLink, Download, Volume2, Star, Clock, Award } from 'lucide-react';
import { TrainingPlan as TrainingPlanType } from '../types';

interface TrainingPlanProps {
  trainingPlan: TrainingPlanType;
  onDownloadPlan: () => void;
  onSpeakPlan?: () => void;
}

export function TrainingPlan({ trainingPlan, onDownloadPlan, onSpeakPlan }: TrainingPlanProps) {
  const getPriorityColor = (priority: number) => {
    if (priority <= 2) return 'from-red-500 to-pink-500';
    if (priority <= 4) return 'from-yellow-500 to-orange-500';
    return 'from-green-500 to-emerald-500';
  };

  const getPriorityBadge = (priority: number) => {
    if (priority <= 2) return { text: 'High Priority', color: 'bg-red-500/20 text-red-300 border-red-500/30' };
    if (priority <= 4) return { text: 'Medium Priority', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' };
    return { text: 'Low Priority', color: 'bg-green-500/20 text-green-300 border-green-500/30' };
  };

  return (
    <div className="w-full bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 p-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Award className="w-6 h-6 text-white" />
              <h3 className="text-2xl font-bold text-white">AI-Generated Training Plan</h3>
            </div>
            <p className="text-purple-100">Your personalized roadmap to career success</p>
          </div>

          <div className="flex items-center space-x-3">
            {onSpeakPlan && (
              <button 
                onClick={onSpeakPlan} 
                className="flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-all duration-300 hover:scale-105"
              >
                <Volume2 className="w-4 h-4" />
                <span>Listen</span>
              </button>
            )}
            <button 
              onClick={onDownloadPlan} 
              className="flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-all duration-300 hover:scale-105"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Plan Overview */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-4">Plan Overview</h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Readiness Score</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-white/20 rounded-full h-2">
                      <div 
                        className={`bg-gradient-to-r ${
                          trainingPlan.readinessScore >= 80 ? 'from-green-500 to-emerald-500' :
                          trainingPlan.readinessScore >= 60 ? 'from-yellow-500 to-orange-500' : 'from-red-500 to-pink-500'
                        } h-2 rounded-full transition-all duration-1000`}
                        style={{ width: `${trainingPlan.readinessScore}%` }}
                      ></div>
                    </div>
                    <span className="text-white font-semibold">{trainingPlan.readinessScore}%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Timeline</span>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span className="text-white font-semibold">{trainingPlan.timeline}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Courses</span>
                  <span className="text-white font-semibold">{trainingPlan.recommendations.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="lg:col-span-2">
            <h4 className="text-lg font-semibold text-white mb-6">Recommended Learning Path</h4>
            
            <div className="space-y-4">
              {trainingPlan.recommendations.map((course, idx) => {
                const badge = getPriorityBadge(course.priority);
                
                return (
                  <div key={idx} className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-r ${getPriorityColor(course.priority)} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <span className="font-bold text-white">#{course.priority}</span>
                        </div>
                        <div className="flex-1">
                          <h5 className="text-lg font-semibold text-white mb-1">{course.course}</h5>
                          <p className="text-gray-300 text-sm mb-2">{course.provider}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{course.duration}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs border ${badge.color}`}>
                          {badge.text}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-gray-300">Recommended for your skill level</span>
                      </div>
                      
                      <a 
                        href={course.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-sm hover:from-purple-700 hover:to-blue-700 transition-all duration-300 hover:scale-105"
                      >
                        <span>Start Learning</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}