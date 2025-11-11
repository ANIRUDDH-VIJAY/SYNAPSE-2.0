import React, { useState, useEffect } from 'react';
import { Send, Search, Star, Archive, Trash2, Sun, Moon, Square, UserCircle, Settings, LogOut, SquarePen, Menu, X, ChevronLeft } from 'lucide-react';
import { ChatController } from '../chat/ChatController';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '../ui/sheet';
import { ChatWindow } from '../chat/ChatWindow';
import { getAuthToken } from '../../utils/auth';
import { postChatMessage } from '../../utils/network';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface Chat {
  id: string;
  text: string;
  time: string;
}

interface ChatPageProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  message: string;
  setMessage: (message: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isGenerating: boolean;
  handleSendOrStop: () => void;
  onResendMessage?: (messageId: string) => void;
  onLogout: () => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  starredChats: Chat[];
  allChats: Chat[];
  onToggleStar: (chatId: string, isStarred: boolean) => void;
  messages?: Array<{ id: string; role: 'user' | 'assistant'; content?: string; timestamp?: string }>;
  currentChatId?: string | null;
  onDeleteChat?: (chatId: string) => void;
  onSelectChat?: (chatId: string) => void;
  user?: { id: string; name: string; email: string } | null;
}

export function ChatPage({
  theme,
  setTheme,
  message,
  setMessage,
  searchQuery,
  setSearchQuery,
  isGenerating,
  handleSendOrStop,
  onLogout,
  onOpenSettings,
  onOpenProfile,
  starredChats,
  allChats,
  onToggleStar,
  messages = [],
  currentChatId,
  onDeleteChat,
  onSelectChat,
  user,
}: ChatPageProps) {
  const isLight = theme === 'light';
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Desktop sidebar open by default
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false); // Mobile drawer closed by default

  // Detect if desktop on mount and set sidebar accordingly
  useEffect(() => {
    const isDesktop = window.innerWidth >= 1024;
    setIsSidebarOpen(isDesktop); // Open on desktop, closed on mobile/tablet
  }, []);

  // Sidebar content component to avoid duplication
  const SidebarContent = () => (
    <>
      {/* Logo Header */}
      <div className={`p-5 border-b flex-shrink-0 ${isLight ? 'border-slate-200' : 'border-slate-800/50'}`}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 blur-${isLight ? 'lg' : 'md'} ${isLight ? 'opacity-30' : 'opacity-75'}`}></div>
              <div className={`relative w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center ${
                isLight ? 'shadow-lg shadow-blue-500/25' : ''
              }`}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.2"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div>
              <h1 className={`text-2xl bg-gradient-to-r ${
                isLight 
                  ? 'from-blue-600 via-indigo-600 to-blue-700' 
                  : 'from-blue-400 via-indigo-400 to-blue-500'
              } bg-clip-text text-transparent tracking-wide`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.02em' }}>
                SYNAPSE 2.0
              </h1>
              <p className={`text-xs tracking-wide ${isLight ? 'text-slate-600' : 'text-slate-500'}`}>
                by Aniruddh Vijayvargia
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isLight ? 'dark' : 'light')}
            className={`rounded-lg ${
              isLight 
                ? 'hover:bg-slate-100 border-2 border-slate-300 shadow-sm'
                : 'hover:bg-slate-800/50 border-2 border-slate-700/50 shadow-lg shadow-blue-500/10'
            }`}
          >
            {isLight ? (
              <Moon className="w-4 h-4 text-slate-700" />
            ) : (
              <Sun className="w-4 h-4 text-blue-400" />
            )}
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative flex gap-2">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
            <Input
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-9 rounded-xl ${
                isLight 
                  ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-500 focus-visible:border-blue-500 focus-visible:ring-blue-500/20'
                  : 'bg-slate-800/50 border-slate-700/50 text-slate-300 placeholder:text-slate-500 focus-visible:border-blue-500/50 focus-visible:ring-blue-500/20'
              }`}
            />
          </div>
          <Button
            size="icon"
            onClick={() => {
              if (onSelectChat) {
                onSelectChat('new');
              }
            }}
            className={`rounded-xl flex-shrink-0 ${
              isLight
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25'
            }`}
            title="New Chat"
          >
            <SquarePen className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Chat Lists - Scrollable area */}
      <div className="flex-1 overflow-hidden flex flex-col p-3">
        {/* Starred Chats Section - Limited height with scroll */}
        <div className="flex flex-col min-h-0 mb-4 max-h-80">
          <div className="flex items-center gap-2 px-3 py-2 flex-shrink-0">
            <Star className={`w-4 h-4 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
            <span className={`text-xs uppercase tracking-wider ${isLight ? 'text-slate-600' : 'text-slate-500'}`}>Starred</span>
            <span className={`text-xs ${isLight ? 'text-slate-400' : 'text-slate-600'}`}>({starredChats.length})</span>
          </div>
          {starredChats.length > 0 ? (
            <ScrollArea className="flex-1 min-h-0 overflow-auto">
              <div className="space-y-1 pr-3">
                {starredChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => onSelectChat && onSelectChat(chat.id)}
                    className={`group px-3 py-3 rounded-xl cursor-pointer border relative transition-all ${
                      currentChatId === chat.id
                        ? isLight
                          ? 'bg-blue-100 border-blue-400 shadow-md'
                          : 'bg-slate-800/80 border-blue-500/50'
                        : isLight 
                          ? 'bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-blue-200/50 hover:border-blue-400/50 shadow-sm'
                          : 'bg-slate-800/30 hover:bg-slate-800/60 border-slate-700/30 hover:border-blue-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-2 pr-14">
                      <Star className={`w-3 h-3 mt-1 flex-shrink-0 ${
                        isLight ? 'text-blue-500 fill-blue-500' : 'text-blue-400 fill-blue-400'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm line-clamp-2 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>{chat.text}</p>
                        <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-600'}`}>{chat.time}</p>
                      </div>
                    </div>
                    <div className="absolute right-2 top-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => callToggleStar(chat.id, true)}
                        className={`p-1 rounded hover:bg-slate-200/50 ${isLight ? '' : 'hover:bg-slate-700/50'}`}
                        title="Unstar"
                      >
                        <Star className={`w-3 h-3 ${isLight ? 'text-blue-500 fill-blue-500' : 'text-blue-400 fill-blue-400'}`} />
                      </button>
                      <button 
                        onClick={() => onDeleteChat && onDeleteChat(chat.id)}
                        className={`p-1 rounded hover:bg-slate-200/50 ${isLight ? '' : 'hover:bg-slate-700/50'}`}
                        title="Delete chat"
                      >
                        <Trash2 className={`w-3 h-3 ${isLight ? 'text-slate-400 hover:text-red-500' : 'text-slate-500 hover:text-red-400'}`} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className={`px-3 py-4 text-center ${isLight ? 'text-slate-400' : 'text-slate-600'}`}>
              <p className="text-xs">No starred chats yet</p>
            </div>
          )}
        </div>
        
        {/* All Chats Section */}
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center gap-2 px-3 py-2 flex-shrink-0">
            <Archive className={`w-4 h-4 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
            <span className={`text-xs uppercase tracking-wider ${isLight ? 'text-slate-600' : 'text-slate-500'}`}>All Chats</span>
            <span className={`text-xs ${isLight ? 'text-slate-400' : 'text-slate-600'}`}>({allChats.length})</span>
          </div>
          <ScrollArea className="flex-1 min-h-0">
            <div className="space-y-1 pr-3">
              {allChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => onSelectChat && onSelectChat(chat.id)}
                  className={`group px-3 py-3 rounded-xl cursor-pointer border relative transition-all ${
                    currentChatId === chat.id
                      ? isLight
                        ? 'bg-blue-100 border-blue-400 shadow-md'
                        : 'bg-slate-800/80 border-blue-500/50'
                      : isLight 
                        ? 'hover:bg-slate-100 border-transparent hover:border-slate-300'
                        : 'hover:bg-slate-800/50 border-transparent hover:border-slate-700/50'
                  }`}
                >
                  <div className="pr-14">
                    <p className={`text-sm line-clamp-2 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>{chat.text}</p>
                    <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-600'}`}>{chat.time}</p>
                  </div>
                  <div className="absolute right-2 top-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => callToggleStar(chat.id, false)}
                      className={`p-1 rounded hover:bg-slate-200/50 ${isLight ? '' : 'hover:bg-slate-700/50'}`}
                      title="Star chat"
                    >
                      <Star className={`w-3 h-3 ${isLight ? 'text-slate-400 hover:text-blue-500' : 'text-slate-500 hover:text-blue-400'}`} />
                    </button>
                    <button 
                      onClick={() => onDeleteChat && onDeleteChat(chat.id)}
                      className={`p-1 rounded hover:bg-slate-200/50 ${isLight ? '' : 'hover:bg-slate-700/50'}`}
                      title="Delete chat"
                    >
                      <Trash2 className={`w-3 h-3 ${isLight ? 'text-slate-400 hover:text-red-500' : 'text-slate-500 hover:text-red-400'}`} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
      
      {/* Bottom Section */}
      <div className={`p-4 border-t flex-shrink-0 ${
        isLight ? 'border-slate-200 bg-slate-50/50' : 'border-slate-800/50'
      }`}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors border ${
              isLight 
                ? 'hover:bg-white border-transparent hover:border-slate-200'
                : 'hover:bg-slate-800/50 border-transparent'
            }`}>
              <Avatar className={`w-10 h-10 border-2 ${isLight ? 'border-blue-200' : 'border-blue-500/30'}`}>
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                  {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 text-left">
                <p className={`text-sm truncate ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>{user?.name || 'User'}</p>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Free Plan</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={`w-56 mb-2 ml-4 ${
            isLight ? '' : 'bg-slate-800 border-slate-700'
          }`} align="start">
            <DropdownMenuItem 
              className={`cursor-pointer ${
                isLight ? '' : 'text-slate-200 focus:bg-slate-700 focus:text-slate-100'
              }`}
              onClick={onOpenProfile}
            >
              <UserCircle className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem 
              className={`cursor-pointer ${
                isLight ? '' : 'text-slate-200 focus:bg-slate-700 focus:text-slate-100'
              }`}
              onClick={onOpenSettings}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className={isLight ? '' : 'bg-slate-700'} />
            <DropdownMenuItem 
              className={`cursor-pointer ${
                isLight ? 'text-red-600' : 'text-red-400 focus:bg-slate-700 focus:text-red-300'
              }`}
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );

  // Adapter for star toggle: keep backward compatibility with Sidebar's onToggleStar(id)
  const callToggleStar = (id: string, isStarred?: boolean) => {
    try {
      if (typeof onToggleStar !== 'function') return;
      // If the provided handler expects a single argument (legacy Sidebar)
      if ((onToggleStar as any).length === 1) {
        (onToggleStar as any)(id);
      } else {
        onToggleStar(id, Boolean(isStarred));
      }
    } catch (e) {
      console.error('Error calling onToggleStar adapter', e);
    }
  };

  // Send message to backend using VITE_BACKEND_URL and auth token
  const sendMessageToBackend = async (text: string, chatId?: string) => {
    try {
      await postChatMessage(text, chatId);
    } catch (err) {
      console.error('Failed to send message to backend', err);
    }
  };

  // Local wrapper used by UI - calls existing local handler, then posts to backend
  const handleSendWrapper = () => {
    try {
      handleSendOrStop();
    } catch (e) {
      console.error('local handleSendOrStop error', e);
    }

    // Post message to backend as a best-effort background action
    const text = (message || '').trim();
    if (text) sendMessageToBackend(text, currentChatId || undefined);
  };

  return (
    <div className={`flex h-screen ${isLight ? 'bg-gradient-to-br from-blue-50 via-white to-indigo-50' : 'bg-slate-950'}`}>
      {/* Desktop Sidebar - Collapsible */}
      <aside className={`hidden lg:flex flex-col border-r transition-all duration-300 ${
        isSidebarOpen ? 'w-80' : 'w-0'
      } ${
        isLight 
          ? 'bg-white/80 backdrop-blur-xl border-slate-200 shadow-xl'
          : 'bg-slate-900/50 backdrop-blur-xl border-slate-800/50'
      } ${isSidebarOpen ? 'overflow-visible' : 'overflow-hidden'}`}>
        {isSidebarOpen && <SidebarContent />}
      </aside>

      {/* Mobile Drawer */}
      <Sheet open={isMobileDrawerOpen} onOpenChange={setIsMobileDrawerOpen}>
        <SheetContent 
          side="left" 
          className={`w-80 p-0 ${
            isLight 
              ? 'bg-white/95 backdrop-blur-xl border-slate-200'
              : 'bg-slate-900/95 backdrop-blur-xl border-slate-800/50'
          }`}
        >
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SheetDescription className="sr-only">
            Access your chat history, starred conversations, and account settings
          </SheetDescription>
          <div className="flex flex-col h-full">
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className={`h-14 lg:h-16 border-b flex items-center justify-between px-4 lg:px-8 flex-shrink-0 ${
          isLight 
            ? 'border-slate-200 bg-white/60 backdrop-blur-sm shadow-sm'
            : 'border-slate-800/50 bg-slate-900/30 backdrop-blur-sm'
        }`}>
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileDrawerOpen(true)}
            >
              <Menu className={`w-5 h-5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`} />
            </Button>

            {/* Desktop Sidebar Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? (
                <ChevronLeft className={`w-5 h-5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`} />
              ) : (
                <Menu className={`w-5 h-5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`} />
              )}
            </Button>

            <div>
              <h2 className={`text-sm lg:text-base ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>New Conversation</h2>
              <p className={`text-xs hidden lg:block ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Chat with Synapse AI • Text Model</p>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg ${
            isLight ? 'bg-blue-50 border border-blue-200' : 'bg-slate-800/50 border border-slate-700/50'
          }`}>
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            <span className={`text-xs ${isLight ? 'text-blue-700' : 'text-slate-400'}`}>Active</span>
          </div>
        </header>

        {/* Chat Window or Empty State */}
        {messages.length > 0 ? (
          <React.Fragment>
            <ChatWindow
              theme={theme}
              messages={messages || []}
              message={message}
              onMessageChange={setMessage}
              onSendMessage={handleSendWrapper}
              onResendMessage={handleSendWrapper}
              onStopGeneration={handleSendWrapper}
              isGenerating={isGenerating}
              error={undefined}
              onDismissError={() => {}}
              placeholder="Type your message here..."
            />
          </React.Fragment>
        ) : (
          <div className={`flex-1 overflow-y-auto ${
            isLight ? '' : 'bg-gradient-to-b from-slate-950 to-slate-900'
          }`}>
            <div className="min-h-full flex items-center justify-center p-4 lg:p-8">
            <div className="text-center max-w-3xl w-full py-8">
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
              
              <h1 className={`mb-2 lg:mb-3 text-xl lg:text-2xl ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>How can I help you today?</h1>
              <p className={`mb-8 lg:mb-12 text-sm lg:text-base ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Ask me anything, and I'll provide detailed responses using advanced language understanding.</p>
              
              {/* Suggestion Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4 mb-8 lg:mb-10">
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
              <div className="space-y-3">
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-600'}`}>Example prompts:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['Explain quantum computing', 'Write a professional email', 'Summarize a concept', 'Help me brainstorm ideas'].map((prompt, i) => (
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
        )}
        
        {/* Input Area - Only show when no messages */}
        {messages.length === 0 && (
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
                      handleSendWrapper();
                    }
                  }}
                />
                <Button 
                  size="icon" 
                  onClick={handleSendWrapper}
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
              <p className={`text-xs text-center sm:text-left ${isLight ? 'text-slate-500' : 'text-slate-600'}`}>
                Synapse may produce inaccurate information. Verify important details.
              </p>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-600'}`}>
                Press <kbd className={`px-1.5 py-0.5 rounded ${
                  isLight ? 'bg-slate-100 border border-slate-300 text-slate-700' : 'bg-slate-800 border border-slate-700 text-slate-400'
                }`}>Enter</kbd> to send
              </p>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
