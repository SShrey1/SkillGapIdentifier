import React, { useEffect, useRef } from 'react';
import { SkillGap } from '../types';

interface SkillMapProps {
  skillGaps: SkillGap[];
  animated?: boolean;
}

export function SkillMap({ skillGaps, animated = true }: SkillMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      canvas.width = container.clientWidth;
      canvas.height = Math.min(400, container.clientWidth * 0.6);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const drawSkillMap = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxRadius = Math.min(centerX, centerY) - 50;
      
      // Draw skill circles
      skillGaps.forEach((gap, index) => {
        const angle = (index / skillGaps.length) * 2 * Math.PI;
        const radius = 60 + (gap.required - 1) * 15;
        const x = centerX + Math.cos(angle) * (maxRadius * 0.7);
        const y = centerY + Math.sin(angle) * (maxRadius * 0.7);
        
        // Skill circle
        const completionRatio = gap.current / gap.required;
        const skillRadius = Math.max(20, radius / 3);
        
        // Background circle
        ctx.beginPath();
        ctx.arc(x, y, skillRadius, 0, 2 * Math.PI);
        ctx.fillStyle = gap.gap === 0 ? '#10b981' : gap.priority === 'high' ? '#ef4444' : gap.priority === 'medium' ? '#f59e0b' : '#6b7280';
        ctx.globalAlpha = 0.3;
        ctx.fill();
        
        // Completion circle
        ctx.beginPath();
        ctx.arc(x, y, skillRadius * completionRatio, 0, 2 * Math.PI);
        ctx.fillStyle = gap.gap === 0 ? '#10b981' : gap.priority === 'high' ? '#ef4444' : gap.priority === 'medium' ? '#f59e0b' : '#6b7280';
        ctx.globalAlpha = 0.8;
        ctx.fill();
        
        ctx.globalAlpha = 1;
        
        // Skill name
        ctx.fillStyle = '#374151';
        ctx.font = '12px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText(gap.skill, x, y + skillRadius + 20);
        
        // Level indicators
        ctx.fillStyle = gap.gap === 0 ? '#10b981' : '#6b7280';
        ctx.font = '10px system-ui';
        ctx.fillText(`${gap.current}/${gap.required}`, x, y + skillRadius + 35);
      });
    };

    if (animated) {
      let animationFrame = 0;
      const animate = () => {
        animationFrame++;
        drawSkillMap();
        if (animationFrame < 60) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    } else {
      drawSkillMap();
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [skillGaps, animated]);

  return (
    <div className="w-full bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
        Skill Map Visualization
      </h3>
      
      <div className="flex justify-center mb-4 space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-600">Proficient</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="text-gray-600">Medium Gap</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-gray-600">High Priority</span>
        </div>
      </div>
      
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          className="max-w-full border border-gray-200 rounded-lg"
        />
      </div>
    </div>
  );
}