import React, { useEffect, useRef } from 'react';
import { SkillGap } from '../types';
import { Map } from 'lucide-react';

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
      
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = Math.min(500, rect.width * 0.6);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const drawSkillMap = (animationProgress = 1) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxRadius = Math.min(centerX, centerY) - 80;
      
      // Draw connecting lines first
      skillGaps.forEach((gap, index) => {
        const angle = (index / skillGaps.length) * 2 * Math.PI;
        const distance = maxRadius * 0.8;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = 'rgba(147, 51, 234, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });
      
      // Draw center hub
      ctx.beginPath();
      ctx.arc(centerX, centerY, 30 * animationProgress, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(147, 51, 234, 0.8)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(147, 51, 234, 1)';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Draw skill nodes
      skillGaps.forEach((gap, index) => {
        const angle = (index / skillGaps.length) * 2 * Math.PI;
        const distance = maxRadius * 0.8;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        const completionRatio = gap.current / gap.required;
        const nodeRadius = Math.max(25, 15 + gap.required * 3) * animationProgress;
        
        // Outer ring (required level)
        ctx.beginPath();
        ctx.arc(x, y, nodeRadius, 0, 2 * Math.PI);
        const outerColor = gap.gap === 0 ? 'rgba(34, 197, 94, 0.3)' : 
                          gap.priority === 'high' ? 'rgba(239, 68, 68, 0.3)' : 
                          gap.priority === 'medium' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(107, 114, 128, 0.3)';
        ctx.fillStyle = outerColor;
        ctx.fill();
        
        // Inner circle (current level)
        ctx.beginPath();
        ctx.arc(x, y, nodeRadius * completionRatio, 0, 2 * Math.PI);
        const innerColor = gap.gap === 0 ? 'rgba(34, 197, 94, 0.8)' : 
                          gap.priority === 'high' ? 'rgba(239, 68, 68, 0.8)' : 
                          gap.priority === 'medium' ? 'rgba(245, 158, 11, 0.8)' : 'rgba(107, 114, 128, 0.8)';
        ctx.fillStyle = innerColor;
        ctx.fill();
        
        // Border
        ctx.beginPath();
        ctx.arc(x, y, nodeRadius, 0, 2 * Math.PI);
        ctx.strokeStyle = gap.gap === 0 ? '#22c55e' : 
                         gap.priority === 'high' ? '#ef4444' : 
                         gap.priority === 'medium' ? '#f59e0b' : '#6b7280';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Skill name
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText(gap.skill, x, y + nodeRadius + 20);
        
        // Level indicators
        ctx.fillStyle = '#d1d5db';
        ctx.font = '10px system-ui';
        ctx.fillText(`${gap.current}/${gap.required}`, x, y + nodeRadius + 35);
      });
    };

    if (animated) {
      let animationFrame = 0;
      const totalFrames = 60;
      
      const animate = () => {
        const progress = Math.min(animationFrame / totalFrames, 1);
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        
        drawSkillMap(easeOutCubic);
        
        if (animationFrame < totalFrames) {
          animationFrame++;
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
    <div className="w-full">
      <div className="flex items-center space-x-3 mb-6">
        <Map className="w-5 h-5 text-blue-400" />
        <h3 className="text-xl font-bold text-white">Interactive Skill Map</h3>
      </div>
      
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <div className="flex justify-center mb-6 space-x-8 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-gray-300">Proficient</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-300">Medium Gap</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-gray-300">High Priority</span>
          </div>
        </div>
        
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            className="max-w-full rounded-xl"
            style={{ background: 'rgba(0, 0, 0, 0.2)' }}
          />
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Interactive visualization of your skill gaps. Larger circles indicate higher skill requirements.
          </p>
        </div>
      </div>
    </div>
  );
}