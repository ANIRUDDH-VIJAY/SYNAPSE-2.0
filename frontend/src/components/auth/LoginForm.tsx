import { Mail, Lock } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface LoginFormProps {
  theme: 'light' | 'dark';
  email: string;
  password: string;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onSwitchToSignup: () => void;
  loading?: boolean;
  error?: string;
}

export function LoginForm({
  theme,
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onSwitchToSignup,
  loading = false,
  error,
}: LoginFormProps) {
  const isLight = theme === 'light';

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className={isLight ? 'text-slate-700' : 'text-slate-300'}>
          Email
        </Label>
        <div className="relative">
          <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
            isLight ? 'text-slate-400' : 'text-slate-500'
          }`} />
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="you@example.com"
            required
            disabled={loading}
            autoComplete="email"
            className={`pl-10 ${
              isLight ? '' : 'bg-slate-800 border-slate-700 text-slate-200'
            }`}
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password" className={isLight ? 'text-slate-700' : 'text-slate-300'}>
          Password
        </Label>
        <div className="relative">
          <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
            isLight ? 'text-slate-400' : 'text-slate-500'
          }`} />
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="••••••••"
            required
            disabled={loading}
            autoComplete="current-password"
            className={`pl-10 ${
              isLight ? '' : 'bg-slate-800 border-slate-700 text-slate-200'
            }`}
          />
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Submit button */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
      >
        {loading ? 'Logging in...' : 'Login'}
      </Button>

      {/* Switch to signup */}
      <p className={`text-center text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToSignup}
          disabled={loading}
          className={`hover:underline ${
            isLight ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'
          }`}
        >
          Sign up
        </button>
      </p>
    </form>
  );
}
