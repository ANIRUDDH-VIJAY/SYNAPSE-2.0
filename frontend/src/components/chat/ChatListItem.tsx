import { Star, Trash2 } from 'lucide-react';
import type { Chat } from './Sidebar';

interface ChatListItemProps {
  chat: Chat;
  theme: 'light' | 'dark';
  isStarred: boolean;
  isActive?: boolean;
  onToggleStar: () => void; // Wrapper - actual handler receives (chatId, isStarred)
  onSelect?: () => void;
  onDelete?: () => void;
}

export function ChatListItem({
  chat,
  theme,
  isStarred,
  isActive,
  onToggleStar,
  onSelect,
  onDelete,
}: ChatListItemProps) {
  const isLight = theme === 'light';

  return (
    <div
      onClick={onSelect}
      className={`group px-3 py-3 rounded-xl cursor-pointer border relative transition-all ${
        isStarred
          ? isLight
            ? 'bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-blue-200/50 hover:border-blue-400/50 shadow-sm'
            : 'bg-slate-800/30 hover:bg-slate-800/60 border-slate-700/30 hover:border-blue-500/30'
          : isLight
          ? 'hover:bg-slate-100 border-transparent hover:border-slate-300'
          : 'hover:bg-slate-800/50 border-transparent hover:border-slate-700/50'
      } ${
        isActive
          ? isLight
            ? 'bg-blue-100 border-blue-400'
            : 'bg-slate-800/60 border-blue-500/50'
          : ''
      }`}
    >
      <div className={`flex items-start gap-2 ${isStarred ? 'pr-14' : 'pr-14'}`}>
        {isStarred && (
          <Star
            className={`w-3 h-3 mt-1 flex-shrink-0 ${
              isLight ? 'text-blue-500 fill-blue-500' : 'text-blue-400 fill-blue-400'
            }`}
          />
        )}
        <div className="flex-1 min-w-0">
          <p className={`text-sm line-clamp-2 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
            {chat.text}
          </p>
          <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-600'}`}>
            {chat.time}
          </p>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="absolute right-2 top-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleStar();
          }}
          className={`p-1 rounded hover:bg-slate-200/50 ${isLight ? '' : 'hover:bg-slate-700/50'}`}
          title={isStarred ? 'Unstar' : 'Star'}
        >
          <Star
            className={`w-3 h-3 ${
              isStarred
                ? isLight
                  ? 'text-blue-500 fill-blue-500'
                  : 'text-blue-400 fill-blue-400'
                : isLight
                ? 'text-slate-400'
                : 'text-slate-500'
            }`}
          />
        </button>
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className={`p-1 rounded hover:bg-slate-200/50 ${isLight ? '' : 'hover:bg-slate-700/50'}`}
            title="Delete"
          >
            <Trash2
              className={`w-3 h-3 ${
                isLight ? 'text-slate-400 hover:text-red-500' : 'text-slate-500 hover:text-red-400'
              }`}
            />
          </button>
        )}
      </div>
    </div>
  );
}
