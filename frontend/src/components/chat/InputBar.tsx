import { Send, Square } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

interface InputBarProps {
  theme: 'light' | 'dark';
  message: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onStopGeneration?: () => void;
  isGenerating?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export function InputBar({
  theme,
  message,
  onMessageChange,
  onSendMessage,
  onStopGeneration,
  isGenerating = false,
  placeholder = 'Type your message...',
  disabled = false,
}: InputBarProps) {
  const isLight = theme === 'light';

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isGenerating && message.trim()) {
        onSendMessage();
      }
    }
  };

  const handleClick = () => {
    if (isGenerating && onStopGeneration) {
      onStopGeneration();
    } else if (message.trim()) {
      onSendMessage();
    }
  };

  return (
    <div className={`flex-shrink-0 border-t p-4 ${
      isLight ? 'bg-white/50 backdrop-blur-sm border-slate-200' : 'bg-slate-900/50 backdrop-blur-sm border-slate-700'
    }`}>
      <div className="max-w-4xl mx-auto flex gap-2">
        <Textarea
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isGenerating}
          className={`min-h-[60px] max-h-[200px] resize-none ${
            isLight 
              ? 'bg-white border-slate-300 focus:border-blue-400' 
              : 'bg-slate-800 border-slate-700 focus:border-blue-500 text-slate-200 placeholder:text-slate-500'
          }`}
        />
        <Button
          onClick={handleClick}
          disabled={disabled || (!isGenerating && !message.trim())}
          className={`self-end h-[60px] px-6 ${
            isGenerating
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
          }`}
          title={isGenerating ? 'Stop generating' : 'Send message'}
        >
          {isGenerating ? (
            <Square className="w-4 h-4" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
