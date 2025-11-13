import React from 'react';
import { Send, Square } from 'lucide-react';
import { Button } from '../ui/button';
import { ComposerInput } from './ComposerInput';
import { ErrorBanner, ErrorDetails } from './ErrorBanner';

interface ChatComposerProps {
  message: string;
  onMessageChange: (message: string) => void;
  onSend: () => void;
  isGenerating?: boolean;
  disabled?: boolean;
  theme: 'light' | 'dark';
  placeholder?: string;
  error?: ErrorDetails;
  remainingMessages?: number;
}

export function ChatComposer({
  message,
  onMessageChange,
  onSend,
  isGenerating = false,
  disabled = false,
  theme,
  placeholder = 'Type your message here...',
  error,
  remainingMessages
}: ChatComposerProps) {
  const isLight = theme === 'light';
  const composerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  // Auto-resize input height
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      const scrollHeight = inputRef.current.scrollHeight;
      // Cap at 200px
      inputRef.current.style.height = Math.min(scrollHeight, 200) + 'px';
    }
  }, [message]);

  return (
    <div 
      ref={composerRef}
      className={`sticky bottom-0 p-3 lg:p-6 border-t flex-shrink-0 ${
        isLight 
          ? 'bg-white/80 backdrop-blur-xl border-slate-200 shadow-lg'
          : 'bg-slate-900/50 backdrop-blur-xl border-slate-800/50'
      }`}
    >
      <div className="max-w-4xl mx-auto">
        {error && <ErrorBanner error={error} theme={theme} />}
        
        <div className="relative">
          {!isLight && <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 opacity-20 blur-sm"></div>}
          <div className={`relative flex items-end gap-2 lg:gap-3 rounded-xl lg:rounded-2xl p-2 lg:p-3 transition-all ${
            isLight 
              ? 'bg-white border-2 border-slate-300 focus-within:border-blue-500 focus-within:shadow-lg focus-within:shadow-blue-500/10'
              : 'bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 focus-within:border-blue-500/50'
          }`}>
            <ComposerInput
              ref={inputRef}
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              onSend={onSend}
              disabled={disabled || isGenerating}
              placeholder={placeholder}
              theme={theme}
              aria-label="Message input"
            />
            
            <Button 
              size="icon" 
              onClick={onSend}
              disabled={disabled || !message.trim()}
              className={`h-10 w-10 lg:h-11 lg:w-11 rounded-xl flex-shrink-0 transition-all ${
                isGenerating 
                  ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/25' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label={isGenerating ? "Stop generating" : "Send message"}
            >
              {isGenerating ? <Square className="w-4 h-4" fill="currentColor" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between mt-2 lg:mt-3 px-1 gap-2 sm:gap-0">
          {remainingMessages !== undefined ? (
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-600'}`}>
              {remainingMessages} messages remaining today
            </p>
          ) : (
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-600'}`}>
              Synapse may produce inaccurate information. Verify important details.
            </p>
          )}
          <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-600'}`}>
            Press <kbd className={`px-1.5 py-0.5 rounded ${
              isLight ? 'bg-slate-100 border border-slate-300 text-slate-700' : 'bg-slate-800 border border-slate-700 text-slate-400'
            }`}>Enter</kbd> to send
          </p>
        </div>
      </div>
    </div>
  );
}