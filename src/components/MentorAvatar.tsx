// src/components/MentorAvatar.tsx
import React from 'react';
import { Bot, Volume2, Sparkles } from 'lucide-react';

interface MentorAvatarProps {
  message: React.ReactNode; // allow string or JSX
  onSpeak?: (text: string) => Promise<void> | void;
  isSpeaking?: boolean;
}

function nodeToPlainText(node: React.ReactNode): string {
  if (node == null) return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);

  // If it's an array of nodes, join them
  if (Array.isArray(node)) {
    return node.map(n => nodeToPlainText(n)).join(' ');
  }

  // If it's an element with children, try to extract children
  // (works for simple cases)
  const anyNode = node as any;
  if (anyNode && anyNode.props && anyNode.props.children) {
    return nodeToPlainText(anyNode.props.children);
  }

  // fallback - JSON stringify may be noisy but prevents runtime error
  try {
    return JSON.stringify(node);
  } catch {
    return String(node);
  }
}

export function MentorAvatar({ message, onSpeak, isSpeaking = false }: MentorAvatarProps) {
  const plain = nodeToPlainText(message);

  const handleSpeak = async () => {
    if (!onSpeak) return;
    try {
      // pass a plain string to the TTS handler
      await onSpeak(plain);
    } catch (e) {
      // swallow - parent can handle logging
    }
  };

  return (
    <div className="relative">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl blur-xl"></div>
      
      <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 relative">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            {isSpeaking && (
              <div className="absolute -top-1 -right-1">
                <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="font-medium text-white text-sm">AI Career Mentor</div>
              {onSpeak && (
                <button
                  onClick={handleSpeak}
                  disabled={isSpeaking}
                  className="inline-flex items-center space-x-1 px-3 py-1 text-xs rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 disabled:opacity-60 transition-all duration-200 hover:scale-105"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>{isSpeaking ? 'Speaking...' : 'Listen'}</span>
                </button>
              )}
            </div>
            
            <div className="text-sm text-gray-300 leading-relaxed">
              {message}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MentorAvatar;