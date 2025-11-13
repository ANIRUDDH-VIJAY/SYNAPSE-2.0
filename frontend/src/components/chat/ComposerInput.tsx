import React from 'react';
import { Input } from '../ui/input';

interface ComposerInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSend: () => void;
  disabled?: boolean;
  theme: 'light' | 'dark';
}

export const ComposerInput = React.forwardRef<HTMLInputElement, ComposerInputProps>(
  ({ onSend, disabled, theme, ...props }, ref) => {
    const isLight = theme === 'light';
    
    return (
      <Input
        ref={ref}
        {...props}
        className={`flex-1 border-0 focus-visible:ring-0 bg-transparent px-2 min-h-[40px] lg:min-h-[44px] text-sm lg:text-base ${
          isLight ? 'text-slate-900 placeholder:text-slate-500' : 'text-slate-200 placeholder:text-slate-500'
        }`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!disabled) {
              onSend();
            }
          }
        }}
      />
    );
  }
);