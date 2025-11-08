import React from 'react';
import { Loader2 } from 'lucide-react';

interface ThinkingBubbleProps {
  theme: 'light' | 'dark';
}

export function ThinkingBubble({ theme }: ThinkingBubbleProps) {
  const isLight = theme === 'light';

  return (
    <div className="flex gap-3 justify-start animate-pulse">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
        isLight ? 'border-blue-200 bg-blue-50' : 'border-blue-500/30 bg-blue-950/30'
      }`}>
        <Loader2 className={`w-4 h-4 animate-spin ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
      </div>
      <div className={`px-4 py-3 rounded-2xl ${
        isLight 
          ? 'bg-slate-100 border border-slate-200' 
          : 'bg-slate-800/50 border border-slate-700/50'
      }`}>
        <span className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
          Thinking<span className="animate-[ellipsis_1.5s_infinite]">...</span>
        </span>
      </div>
    </div>
  );
}

// Add the ellipsis animation to tailwind config
const style = document.createElement('style');
style.textContent = `
  @keyframes ellipsis {
    0% { content: ''; }
    25% { content: '.'; }
    50% { content: '..'; }
    75% { content: '...'; }
    100% { content: ''; }
  }
`;
document.head.appendChild(style);