import React, { useEffect, useState } from 'react';
import { TrendingUp, Target, Award } from 'lucide-react';

interface ReadinessScoreProps {
  score: number;
  animated?: boolean;
}

export function ReadinessScore({ score, animated = true }: ReadinessScoreProps) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);

  useEffect(() => {
    if (animated) {
      const duration = 1500;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        setDisplayScore(Math.floor(score * progress));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      animate();
    }
  }, [score, animated]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 border-green-200';
    if (score >= 60) return 'bg-yellow-100 border-yellow-200';
    return 'bg-red-100 border-red-200';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Excellent match! You\'re well-prepared for this role.';
    if (score >= 60) return 'Good foundation. Focus on a few key skills to reach your goal.';
    return 'Significant skill gaps identified. Consider a structured learning plan.';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <Award className="w-8 h-8" />;
    if (score >= 60) return <Target className="w-8 h-8" />;
    return <TrendingUp className="w-8 h-8" />;
  };

  return (
    <div className={`w-full max-w-md mx-auto bg-white rounded-xl p-8 shadow-lg border-2 ${getScoreBgColor(score)}`}>
      <div className="text-center">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${getScoreColor(score)} ${getScoreBgColor(score)}`}>
          {getScoreIcon(displayScore)}
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Role Readiness Score
        </h3>
        
        <div className={`text-6xl font-bold mb-4 ${getScoreColor(displayScore)}`}>
          {displayScore}%
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div
            className={`h-3 rounded-full transition-all duration-1000 ease-out ${
              displayScore >= 80 ? 'bg-green-500' :
              displayScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${displayScore}%` }}
          ></div>
        </div>
        
        <p className="text-sm text-gray-600 leading-relaxed">
          {getScoreMessage(displayScore)}
        </p>
      </div>
    </div>
  );
}