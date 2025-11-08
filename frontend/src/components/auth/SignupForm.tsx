import { Mail, Lock, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface SignupFormProps {
  theme: 'light' | 'dark';
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  onNameChange: (name: string) => void;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onSwitchToLogin: () => void;
  loading?: boolean;
  error?: string;
}

export function SignupForm({
  theme,
  name,
  email,
  password,
  confirmPassword,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  onSwitchToLogin,
  loading = false,
  error,
}: SignupFormProps) {
  const isLight = theme === 'light';

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className={isLight ? 'text-slate-700' : 'text-slate-300'}>
          Full Name
        </Label>
        <div className="relative">
          <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
            isLight ? 'text-slate-400' : 'text-slate-500'
          }`} />
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="John Doe"
            required
            disabled={loading}
            className={`pl-10 ${
              isLight ? '' : 'bg-slate-800 border-slate-700 text-slate-200'
            }`}
          />
        </div>
      </div>

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
            autoComplete="new-password"
            className={`pl-10 ${
              isLight ? '' : 'bg-slate-800 border-slate-700 text-slate-200'
            }`}
          />
        </div>
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirm-password" className={isLight ? 'text-slate-700' : 'text-slate-300'}>
          Confirm Password
        </Label>
        <div className="relative">
          <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
            isLight ? 'text-slate-400' : 'text-slate-500'
          }`} />
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
            placeholder="••••••••"
            required
            disabled={loading}
            autoComplete="new-password"
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
        {loading ? 'Creating account...' : 'Sign Up'}
      </Button>

      {/* Switch to login */}
      <p className={`text-center text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          disabled={loading}
          className={`hover:underline ${
            isLight ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'
          }`}
        >
          Login
        </button>
      </p>
    </form>
  );
}
