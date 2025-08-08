import React from 'react';

import { BookOpen, ExternalLink, Download } from 'lucide-react';
import { TrainingPlan as TrainingPlanType } from '../types';

interface TrainingPlanProps {
  trainingPlan: TrainingPlanType;
  onDownloadPlan: () => void;
  onSpeakPlan?: () => void;
}

export function TrainingPlan({ trainingPlan, onDownloadPlan, onSpeakPlan }: TrainingPlanProps) {
  const getPriorityColor = (priority: number) => {
    if (priority <= 2) return 'bg-red-100 text-red-800 border-red-200';
    if (priority <= 4) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Personalized Training Plan</h3>
            <p className="text-sm opacity-90 mt-1">Recommendations & timeline to get role-ready.</p>
          </div>

          <div className="flex items-center space-x-3">
            {onSpeakPlan && (
              <button onClick={onSpeakPlan} className="px-3 py-1 rounded-md bg-indigo-600 text-white text-sm flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>Read Plan</span>
              </button>
            )}
            <button onClick={onDownloadPlan} className="px-3 py-1 rounded-md bg-blue-600 text-white text-sm flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold">{trainingPlan.title}</h4>
            <p className="text-sm text-gray-500">{trainingPlan.subtitle}</p>
          </div>
          <div className="text-sm text-gray-600">Timeline: {trainingPlan.timeline}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Top recommendations</h5>
            <div className="space-y-3">
              {trainingPlan.recommendations.map((course, idx) => (
                <div key={idx} className="p-3 border rounded flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getPriorityColor(course.priority)}`}>
                      <span className="font-semibold text-sm">{course.priority}</span>
                    </div>
                    <div>
                      <div className="font-medium">{course.course}</div>
                      <div className="text-xs text-gray-500">{course.provider} • {course.duration}</div>
                      <a href={course.url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 inline-flex items-center mt-1">
                        Open resource <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Priority</div>
                    <div className="mt-1 text-sm font-semibold">#{course.priority}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h5 className="font-medium text-gray-700 mb-2">Summary & tips</h5>
            <div className="text-sm text-gray-600 space-y-2">
              <p>Estimated readiness score: <span className="font-semibold">{trainingPlan.readinessScore}%</span></p>
              <p className="text-xs">{trainingPlan.mentorMessage}</p>
            </div>

            <div className="mt-4">
              <h6 className="font-medium text-gray-700 mb-2">Skill gaps</h6>
              {trainingPlan.recommendations.map((course, idx) => (
                <div key={idx} className="mb-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">{course.course}</div>
                    <div className="text-xs text-gray-500">{course.duration}</div>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full mt-1">
                    <div style={{ width: `${100 - (course.priority * 10)}%` }} className={`h-2 rounded-full ${getPriorityColor(course.priority)}`}></div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
