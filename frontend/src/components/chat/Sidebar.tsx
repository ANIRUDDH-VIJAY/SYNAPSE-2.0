import { Search, SquarePen } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ChatList } from './ChatList';

export interface Chat {
  id: string;
  text: string;
  time: string;
  isStarred?: boolean;
}

interface SidebarProps {
  theme: 'light' | 'dark';
  searchQuery: string;
  onSearchChange: (query: string) => void;
  starredChats: Chat[];
  allChats: Chat[];
  onToggleStar: (chatId: string, isStarred: boolean) => void;
  onNewChat: () => void;
  onChatSelect?: (chatId: string) => void;
  activeChatId?: string;
}

export function Sidebar({
  theme,
  searchQuery,
  onSearchChange,
  starredChats,
  allChats,
  onToggleStar,
  onNewChat,
  onChatSelect,
  activeChatId,
}: SidebarProps) {
  const isLight = theme === 'light';

  return (
    <div className={`h-full flex flex-col ${
      isLight 
        ? 'bg-gradient-to-br from-blue-50 via-indigo-50 to-white border-r border-blue-200' 
        : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700'
    }`}>
      {/* Header */}
      <div className="flex-shrink-0 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-2 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white">S</span>
            </div>
            <span>Synapse</span>
          </div>
          <Button
            onClick={onNewChat}
            size="icon"
            variant="ghost"
            className={`rounded-xl ${
              isLight 
                ? 'hover:bg-blue-100 text-blue-600' 
                : 'hover:bg-slate-700 text-blue-400'
            }`}
            title="New Chat"
          >
            <SquarePen className="w-4 h-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
            isLight ? 'text-slate-400' : 'text-slate-500'
          }`} />
          <Input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`pl-10 ${
              isLight 
                ? 'bg-white border-blue-200 focus:border-blue-400' 
                : 'bg-slate-800/50 border-slate-700 focus:border-blue-500 text-slate-200 placeholder:text-slate-500'
            }`}
          />
        </div>
      </div>

      {/* Chat Lists */}
      <div className="flex-1 overflow-hidden p-3">
        <ChatList
          theme={theme}
          starredChats={starredChats}
          allChats={allChats}
          onToggleStar={onToggleStar}
          onChatSelect={onChatSelect}
          activeChatId={activeChatId}
        />
      </div>
    </div>
  );
}
