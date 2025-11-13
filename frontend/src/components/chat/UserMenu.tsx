import { UserCircle, Settings, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface UserMenuProps {
  theme: 'light' | 'dark';
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogout?: () => void;
}

export function UserMenu({
  theme,
  userName = 'User',
  userEmail = 'user@example.com',
  userAvatar,
  onProfileClick,
  onSettingsClick,
  onLogout,
}: UserMenuProps) {
  const isLight = theme === 'light';
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`flex items-center gap-2 px-2 py-1 rounded-xl transition-colors ${
            isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-800'
          }`}
        >
          <Avatar className="w-8 h-8 border-2 border-blue-500/30">
            {userAvatar ? (
              <img src={userAvatar} alt={userName} />
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs">
                {initials}
              </AvatarFallback>
            )}
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={`w-56 ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-800 border-slate-700'
        }`}
      >
        <div className="px-2 py-2">
          <p className={`text-sm ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
            {userName}
          </p>
          <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            {userEmail}
          </p>
        </div>
        <DropdownMenuSeparator className={isLight ? 'bg-slate-200' : 'bg-slate-700'} />
        <DropdownMenuItem
          onClick={onProfileClick}
          className={`cursor-pointer ${
            isLight ? 'focus:bg-slate-100' : 'focus:bg-slate-700 text-slate-200'
          }`}
        >
          <UserCircle className="w-4 h-4 mr-2" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onSettingsClick}
          className={`cursor-pointer ${
            isLight ? 'focus:bg-slate-100' : 'focus:bg-slate-700 text-slate-200'
          }`}
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator className={isLight ? 'bg-slate-200' : 'bg-slate-700'} />
        <DropdownMenuItem
          onClick={onLogout}
          className={`cursor-pointer text-red-600 focus:text-red-700 ${
            isLight ? 'focus:bg-red-50' : 'focus:bg-red-950/20'
          }`}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
