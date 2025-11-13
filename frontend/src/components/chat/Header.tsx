import { Menu, Sun, Moon, ChevronLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { UserMenu } from './UserMenu';

interface HeaderProps {
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  onMenuClick?: () => void;
  onBackClick?: () => void;
  showBackButton?: boolean;
  showMenuButton?: boolean;
  userName?: string;
  userEmail?: string;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogout?: () => void;
}

export function Header({
  theme,
  onThemeToggle,
  onMenuClick,
  onBackClick,
  showBackButton = false,
  showMenuButton = false,
  userName = 'User',
  userEmail = 'user@example.com',
  onProfileClick,
  onSettingsClick,
  onLogout,
}: HeaderProps) {
  const isLight = theme === 'light';

  return (
    <div className={`flex-shrink-0 border-b px-4 py-3 flex items-center justify-between ${
      isLight ? 'bg-white/50 backdrop-blur-sm border-slate-200' : 'bg-slate-900/50 backdrop-blur-sm border-slate-700'
    }`}>
      {/* Left side */}
      <div className="flex items-center gap-2">
        {showBackButton && (
          <Button
            onClick={onBackClick}
            variant="ghost"
            size="icon"
            className={`md:hidden ${isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-800'}`}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        )}
        {showMenuButton && (
          <Button
            onClick={onMenuClick}
            variant="ghost"
            size="icon"
            className={`md:hidden ${isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-800'}`}
          >
            <Menu className="w-5 h-5" />
          </Button>
        )}
        <h1 className={`text-lg ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
          Chat
        </h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <Button
          onClick={onThemeToggle}
          variant="ghost"
          size="icon"
          className={`rounded-xl ${
            isLight 
              ? 'hover:bg-slate-100 text-amber-600' 
              : 'hover:bg-slate-800 text-blue-400'
          }`}
          title={`Switch to ${isLight ? 'dark' : 'light'} mode`}
        >
          {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </Button>

        {/* User menu */}
        <UserMenu
          theme={theme}
          userName={userName}
          userEmail={userEmail}
          onProfileClick={onProfileClick}
          onSettingsClick={onSettingsClick}
          onLogout={onLogout}
        />
      </div>
    </div>
  );
}
