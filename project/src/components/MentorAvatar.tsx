// src/components/MentorAvatar.tsx
import React from 'react';
import { User, Volume2 } from 'lucide-react';

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
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white">
          <User className="w-6 h-6" />
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm text-gray-700">{message}</div>
          </div>

          {onSpeak && (
            <button
              onClick={handleSpeak}
              disabled={isSpeaking}
              className="ml-3 inline-flex items-center px-2 py-1 text-xs rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100 disabled:opacity-60"
            >
              <Volume2 className="w-4 h-4 mr-1" />
              <span>{isSpeaking ? 'Speaking...' : 'Read'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MentorAvatar;
