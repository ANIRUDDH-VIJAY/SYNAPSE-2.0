import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Send, Square } from 'lucide-react';

interface LandingPageProps {
  theme: 'light' | 'dark';
  message: string;
  setMessage: (message: string) => void;
  isGenerating: boolean;
  handleSendOrStop: () => void;
  onOpenAuth: () => void;
}

export function LandingPage({ theme, message, setMessage, isGenerating, handleSendOrStop, onOpenAuth }: LandingPageProps) {
  const isLight = theme === 'light';

  return (
    <div className={`flex h-screen ${isLight ? 'bg-gradient-to-br from-blue-50 via-white to-indigo-50' : 'bg-slate-950'}`}>
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className={`h-14 lg:h-16 border-b flex items-center justify-between px-4 lg:px-8 flex-shrink-0 ${
          isLight 
            ? 'border-slate-200 bg-white/60 backdrop-blur-sm shadow-sm' 
            : 'border-slate-800/50 bg-slate-900/30 backdrop-blur-sm'
        }`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.2"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className={`text-lg lg:text-xl bg-gradient-to-r ${
              isLight 
                ? 'from-blue-600 via-indigo-600 to-blue-700' 
                : 'from-blue-400 via-indigo-400 to-blue-500'
            } bg-clip-text text-transparent tracking-wide`} style={{ letterSpacing: '0.02em' }}>
              SYNAPSE 2.0
            </h1>
          </div>
          <Button 
            onClick={onOpenAuth}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 text-xs lg:text-sm px-3 lg:px-4 h-9 lg:h-10"
          >
            Login / Sign Up
          </Button>
        </header>

        {/* Hero Section - Made scrollable */}
        <div className={`flex-1 overflow-y-auto ${
          isLight ? '' : 'bg-gradient-to-b from-slate-950 to-slate-900'
        }`}>
          <div className="min-h-full flex items-center justify-center p-4 lg:p-8">
            <div className="text-center max-w-3xl w-full py-8">
              {/* Logo */}
              <div className="relative inline-block mb-6 lg:mb-8">
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-${isLight ? '400' : '500'} to-indigo-${isLight ? '500' : '600'} blur-${isLight ? '3xl' : '2xl'} ${isLight ? 'opacity-20' : 'opacity-40'}`}></div>
                <div className={`relative w-16 h-16 lg:w-24 lg:h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto ${
                  isLight ? 'shadow-2xl shadow-blue-500/30' : ''
                }`}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-white lg:w-12 lg:h-12">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.3"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              
              <h1 className={`${isLight ? 'text-slate-900' : 'text-slate-100'} mb-2 lg:mb-3 text-xl lg:text-2xl`}>
                How can I help you today?
              </h1>
              <p className={`${isLight ? 'text-slate-600' : 'text-slate-400'} mb-8 lg:mb-12 text-sm lg:text-base px-4`}>
                Ask me anything, and I'll provide detailed responses using advanced language understanding.
              </p>
              
              {/* Suggestion Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4 mb-8 lg:mb-10 px-4">
                {isLight ? [
                  { icon: '💡', title: 'Ask Questions', desc: 'Get answers to anything', color: 'from-amber-100 to-yellow-100 border-amber-300' },
                  { icon: '✍️', title: 'Write Content', desc: 'Essays, emails, stories', color: 'from-blue-100 to-indigo-100 border-blue-300' },
                  { icon: '📚', title: 'Learn & Explain', desc: 'Understand concepts', color: 'from-purple-100 to-pink-100 border-purple-300' },
                ].map((item, i) => (
                  <button
                    key={i}
                    className={`group p-4 lg:p-6 rounded-2xl bg-gradient-to-br ${item.color} border hover:shadow-lg transition-all`}
                  >
                    <div className="text-2xl lg:text-3xl mb-2 lg:mb-3">{item.icon}</div>
                    <p className="text-sm text-slate-800">{item.title}</p>
                    <p className="text-xs text-slate-600 mt-1">{item.desc}</p>
                  </button>
                )) : [
                  { icon: '💡', title: 'Ask Questions', desc: 'Get answers to anything' },
                  { icon: '✍️', title: 'Write Content', desc: 'Essays, emails, stories' },
                  { icon: '📚', title: 'Learn & Explain', desc: 'Understand concepts' },
                ].map((item, i) => (
                  <button
                    key={i}
                    className="group p-4 lg:p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 hover:border-blue-500/50 hover:bg-slate-800/50 transition-all backdrop-blur-sm"
                  >
                    <div className="text-2xl lg:text-3xl mb-2 lg:mb-3">{item.icon}</div>
                    <p className="text-sm text-slate-200 mb-1">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </button>
                ))}
              </div>

              {/* Example Prompts */}
              <div className="space-y-3 px-4">
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-600'}`}>Example prompts:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    'Explain quantum computing',
                    'Write a professional email',
                    'Summarize a concept',
                    'Help me brainstorm ideas'
                  ].map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => setMessage(prompt)}
                      className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded-full text-xs lg:text-sm transition-all ${
                        isLight 
                          ? 'bg-white border border-slate-300 hover:border-blue-400 hover:bg-blue-50 text-slate-700 hover:text-blue-700 shadow-sm'
                          : 'bg-slate-800/40 border border-slate-700/50 hover:border-blue-500/50 hover:bg-slate-800/60 text-slate-400 hover:text-blue-400'
                      }`}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className={`p-3 lg:p-6 border-t flex-shrink-0 ${
          isLight 
            ? 'bg-white/80 backdrop-blur-xl border-slate-200 shadow-lg' 
            : 'bg-slate-900/50 backdrop-blur-xl border-slate-800/50'
        }`}>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {!isLight && <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 opacity-20 blur-sm"></div>}
              <div className={`relative flex items-end gap-2 lg:gap-3 rounded-xl lg:rounded-2xl p-2 lg:p-3 transition-all ${
                isLight 
                  ? 'bg-white border-2 border-slate-300 focus-within:border-blue-500 focus-within:shadow-lg focus-within:shadow-blue-500/10'
                  : 'bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 focus-within:border-blue-500/50'
              }`}>
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className={`flex-1 border-0 focus-visible:ring-0 bg-transparent px-2 min-h-[40px] lg:min-h-[44px] text-sm lg:text-base ${
                    isLight ? 'text-slate-900 placeholder:text-slate-500' : 'text-slate-200 placeholder:text-slate-500'
                  }`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendOrStop();
                    }
                  }}
                />
                <Button 
                  size="icon" 
                  onClick={handleSendOrStop}
                  className={`h-10 w-10 lg:h-11 lg:w-11 rounded-xl flex-shrink-0 transition-all ${
                    isGenerating 
                      ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/25' 
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25'
                  }`}
                >
                  {isGenerating ? <Square className="w-4 h-4" fill="currentColor" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between mt-2 lg:mt-3 px-1 gap-2 sm:gap-0">
              <div className="flex flex-col items-center sm:items-start gap-1">
                <p className={`text-xs text-center sm:text-left ${isLight ? 'text-slate-500' : 'text-slate-600'}`}>
                  Synapse may produce inaccurate information. Verify important details.
                </p>
                <p className={`text-xs text-center sm:text-left ${isLight ? 'text-slate-400' : 'text-slate-600'}`}>
                  Created by <span className={isLight ? 'text-blue-600' : 'text-blue-400'}>Aniruddh Vijayvargia</span>
                </p>
              </div>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-600'}`}>
                Press <kbd className={`px-1.5 py-0.5 rounded ${
                  isLight ? 'bg-slate-100 border border-slate-300 text-slate-700' : 'bg-slate-800 border border-slate-700 text-slate-400'
                }`}>Enter</kbd> to send
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
