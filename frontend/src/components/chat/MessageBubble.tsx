// src/components/chat/MessageBubble.tsx
import React from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { RefreshCcw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Message } from "./ChatWindow";
import { getSafeMarkdownString } from '../../lib/sanitize';

interface MessageBubbleProps {
  message: Message;
  theme: 'light' | 'dark';
  userName?: string;
  userAvatar?: string;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onRetry?: () => void;
}

export function MessageBubble({
  message,
  theme,
  userName = "You",
  userAvatar,
  isExpanded = false,
  onToggleExpand,
  onRetry,
}: MessageBubbleProps) {
  const isLight = theme === "light";
  const isUser = message.role === "user";
  const isFailed = message.status === 'failed';

  // Process message content
  const content = message.status === 'streaming'
    ? message.partialContent || ''  // Empty string while waiting for first chunk
    : message.content || '';
  
  const safeContent = getSafeMarkdownString(content);

  // Show "Thinking..." only when streaming and no content yet
  const displayContent = message.status === 'streaming' && !content.trim()
    ? 'Thinking...'
    : safeContent;

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {/* Assistant Avatar */}
      {!isUser && (
        <Avatar className="w-8 h-8 flex-shrink-0 border-2 border-blue-500/30">
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs">S</AvatarFallback>
        </Avatar>
      )}

      <div className={`max-w-[80%] ${isUser ? "order-first" : ""}`}>
        <div className={`px-4 py-3 rounded-2xl ${
          isUser
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
            : isLight
            ? "bg-slate-100 border border-slate-200 text-slate-800"
            : "bg-slate-800/50 border border-slate-700/50 text-slate-200"
        }`}>
          {isUser ? (
            <p className="text-sm whitespace-pre-wrap break-words">
              {displayContent}
            </p>
          ) : (
            <div className={`text-sm prose prose-sm max-w-none ${isLight ? "prose-slate" : "prose-invert"}`}>
              <div className="markdown-content">
                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'inherit', background: 'transparent', border: 'none' }}>
                  {isExpanded || displayContent.length <= 1000 
                    ? displayContent
                    : `${displayContent.slice(0, 1000)}...`
                  }
                </pre>
                {displayContent.length > 1000 && (
                  <button
                    onClick={onToggleExpand}
                    className={`mt-2 text-xs font-medium ${
                      isLight ? "text-blue-600" : "text-blue-400"
                    } hover:underline focus:outline-none`}
                  >
                    {isExpanded ? "Show less" : "Show more"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {message.timestamp && (
          <p className={`text-xs mt-1 ${isUser ? "text-right" : "text-left"} ${isLight ? "text-slate-400" : "text-slate-600"}`}>
            {message.timestamp}
          </p>
        )}
        
        {isFailed && onRetry && (
          <div className="mt-2 flex justify-start">
            <button
              onClick={onRetry}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                isLight 
                  ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                  : 'bg-red-900/20 text-red-400 hover:bg-red-900/30'
              }`}
            >
              <RefreshCcw className="w-3 h-3" />
              Retry
            </button>
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <Avatar className="w-8 h-8 flex-shrink-0 border-2 border-blue-500/30">
          {userAvatar ? (
            <img src={userAvatar} alt={userName} />
          ) : (
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs">
              {userName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
      )}
    </div>
  );
}

export default MessageBubble;
