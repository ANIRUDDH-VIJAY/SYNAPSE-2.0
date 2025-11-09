import { Star, Archive } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { ChatListItem } from './ChatListItem';
import type { Chat } from './Sidebar';

interface ChatListProps {
  theme: 'light' | 'dark';
  starredChats: Chat[];
  allChats: Chat[];
  onToggleStar: (chatId: string, isStarred: boolean) => void;
  onChatSelect?: (chatId: string) => void;
  activeChatId?: string;
  onDeleteChat?: (chatId: string) => void;
}

export function ChatList({
  theme,
  starredChats,
  allChats,
  onToggleStar,
  onChatSelect,
  activeChatId,
  onDeleteChat,
}: ChatListProps) {
  const isLight = theme === 'light';

  return (
    <div className="flex flex-col h-full">
      {/* Starred Chats Section */}
      <div className="flex flex-col min-h-0 mb-4 max-h-80">
        <div className="flex items-center gap-2 px-3 py-2 flex-shrink-0">
          <Star className={`w-4 h-4 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
          <span className={`text-xs uppercase tracking-wider ${isLight ? 'text-slate-600' : 'text-slate-500'}`}>
            Starred
          </span>
          <span className={`text-xs ${isLight ? 'text-slate-400' : 'text-slate-600'}`}>
            ({starredChats.length})
          </span>
        </div>
        
        {starredChats.length > 0 ? (
          <ScrollArea className="flex-1 min-h-0 overflow-auto">
            <div className="space-y-1 pr-3">
              {starredChats.map((chat) => (
                <ChatListItem
                  key={chat.id}
                  chat={chat}
                  theme={theme}
                  isStarred
                  isActive={activeChatId === chat.id}
                  onToggleStar={() => onToggleStar(chat.id, true)}
                  onSelect={() => onChatSelect?.(chat.id)}
                  onDelete={() => onDeleteChat?.(chat.id)}
                />
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
          <span className={`text-xs uppercase tracking-wider ${isLight ? 'text-slate-600' : 'text-slate-500'}`}>
            All Chats
          </span>
          <span className={`text-xs ${isLight ? 'text-slate-400' : 'text-slate-600'}`}>
            ({allChats.length})
          </span>
        </div>
        
        <ScrollArea className="flex-1 min-h-0">
          {allChats.length > 0 ? (
            <div className="space-y-1 pr-3">
              {allChats.map((chat) => (
                <ChatListItem
                  key={chat.id}
                  chat={chat}
                  theme={theme}
                  isStarred={false}
                  isActive={activeChatId === chat.id}
                  onToggleStar={() => onToggleStar(chat.id, false)}
                  onSelect={() => onChatSelect?.(chat.id)}
                  onDelete={() => onDeleteChat?.(chat.id)}
                />
              ))}
            </div>
          ) : (
            <div className={`px-3 py-4 text-center ${isLight ? 'text-slate-400' : 'text-slate-600'}`}>
              <p className="text-xs">No chats yet</p>
              <p className="text-xs mt-1">Start a new conversation to get started</p>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
