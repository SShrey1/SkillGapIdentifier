import React from 'react';
import { TrendingUp, Target, Clock, BookOpen, Zap } from 'lucide-react';

interface StatsOverviewProps {
  readinessScore: number;
  skillsMatched: number;
  timeline: string;
  recommendations: number;
}

export function StatsOverview({ readinessScore, skillsMatched, timeline, recommendations }: StatsOverviewProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 bg-gradient-to-r ${getScoreColor(readinessScore)} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{readinessScore}%</div>
            <div className="text-xs text-gray-300">Readiness</div>
          </div>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div 
            className={`bg-gradient-to-r ${getScoreColor(readinessScore)} h-2 rounded-full transition-all duration-1000 ease-out`}
            style={{ width: `${readinessScore}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{skillsMatched}</div>
            <div className="text-xs text-gray-300">Skills Found</div>
          </div>
        </div>
        <div className="text-sm text-gray-300">Skills identified from your resume</div>
      </div>

      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-white">{timeline}</div>
            <div className="text-xs text-gray-300">Timeline</div>
          </div>
        </div>
        <div className="text-sm text-gray-300">Estimated learning time</div>
      </div>

      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{recommendations}</div>
            <div className="text-xs text-gray-300">Courses</div>
          </div>
        </div>
        <div className="text-sm text-gray-300">Personalized recommendations</div>
      </div>
    </div>
  );
}