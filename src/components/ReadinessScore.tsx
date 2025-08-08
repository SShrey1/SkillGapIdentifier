import React, { useEffect, useState } from 'react';
import { TrendingUp, Target, Award, Zap } from 'lucide-react';

interface ReadinessScoreProps {
  score: number;
  animated?: boolean;
}

export function ReadinessScore({ score, animated = true }: ReadinessScoreProps) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);

  useEffect(() => {
    if (animated) {
      const duration = 2000;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        setDisplayScore(Math.floor(score * easeOutCubic));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      animate();
    }
  }, [score, animated]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Excellent match! You\'re well-prepared for this role.';
    if (score >= 60) return 'Good foundation. Focus on a few key skills to reach your goal.';
    return 'Significant skill gaps identified. Consider a structured learning plan.';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <Award className="w-10 h-10" />;
    if (score >= 60) return <Target className="w-10 h-10" />;
    return <TrendingUp className="w-10 h-10" />;
  };

  return (
    <div className="text-center">
      <div className="mb-6">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Zap className="w-6 h-6 text-purple-400" />
          <h3 className="text-2xl font-bold text-white">Role Readiness Score</h3>
        </div>
        <p className="text-gray-300">AI-powered analysis of your skill alignment</p>
      </div>

      <div className="relative mb-8">
        {/* Circular progress */}
        <div className="relative w-48 h-48 mx-auto">
          <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - displayScore / 100)}`}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" className={score >= 80 ? 'stop-green-500' : score >= 60 ? 'stop-yellow-500' : 'stop-red-500'} />
                <stop offset="100%" className={score >= 80 ? 'stop-emerald-500' : score >= 60 ? 'stop-orange-500' : 'stop-pink-500'} />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`mb-2 ${getScoreTextColor(displayScore)}`}>
              {getScoreIcon(displayScore)}
            </div>
            <div className={`text-5xl font-bold mb-1 ${getScoreTextColor(displayScore)}`}>
              {displayScore}%
            </div>
            <div className="text-sm text-gray-300">Ready</div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <p className="text-gray-300 leading-relaxed">
          {getScoreMessage(displayScore)}
        </p>
        
        <div className="mt-4 flex justify-center space-x-6 text-sm">
          <div className="text-center">
            <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mb-1"></div>
            <span className="text-gray-400">80-100%</span>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mx-auto mb-1"></div>
            <span className="text-gray-400">60-79%</span>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mx-auto mb-1"></div>
            <span className="text-gray-400">0-59%</span>
          </div>
        </div>
      </div>
    </div>
  );
}