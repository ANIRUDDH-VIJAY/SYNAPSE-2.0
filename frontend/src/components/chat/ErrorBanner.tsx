import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { AlertCircle } from 'lucide-react';

export interface ErrorDetails {
  title: string;
  what: string;
  action: string;
  code?: string;
}

interface ErrorBannerProps {
  error: ErrorDetails;
  theme: 'light' | 'dark';
  onDismiss?: () => void;
}

export const ERROR_MESSAGES: { [key: string]: ErrorDetails } = {
  NETWORK_FAILURE: {
    title: 'Network error — unable to reach server.',
    what: 'Request failed or timed out.',
    action: 'Check your internet connection. Retry.',
    code: 'NETWORK_FAILURE'
  },
  AUTH_EXPIRED: {
    title: 'Session expired — please sign in again.',
    what: 'Authentication token invalid or expired.',
    action: 'Re-login. Your draft is saved.',
    code: 'AUTH_EXPIRED'
  },
  AUTH_INVALID_CREDENTIALS: {
    title: 'Login failed — incorrect email or password.',
    what: 'Credentials rejected.',
    action: 'Verify credentials or reset password.',
    code: 'AUTH_INVALID_CREDENTIALS'
  },
  RATE_LIMIT: {
    title: 'API limit reached — try again later.',
    what: 'Server/LLM quota exceeded.',
    action: 'Wait 1 hour or contact admin.',
    code: 'RATE_LIMIT'
  },
  DAILY_MESSAGE_LIMIT: {
    title: 'Daily message limit reached (20).',
    what: 'You hit the per-day message quota.',
    action: 'Try again tomorrow or contact support to increase limit.',
    code: 'DAILY_MESSAGE_LIMIT'
  },
  LLM_TIMEOUT: {
    title: 'AI service error — try again.',
    what: 'Model request timed out or failed.',
    action: "Retry or use 'Retry with fallback model'.",
    code: 'LLM_TIMEOUT'
  },
  DUPLICATE_MESSAGE: {
    title: 'Duplicate message blocked.',
    what: 'Same clientMessageId received twice.',
    action: 'If you meant to resend, modify and resend.',
    code: 'DUPLICATE_MESSAGE'
  },
  MESSAGE_TOO_LONG: {
    title: 'Message too long — split and retry.',
    what: 'Payload exceeded max length.',
    action: 'Break message into smaller chunks.',
    code: 'MESSAGE_TOO_LONG'
  },
  SERVER_ERROR: {
    title: 'Server error — something went wrong.',
    what: 'Unexpected backend failure.',
    action: 'Retry. If persists, contact support.',
    code: 'SERVER_ERROR'
  },
  CONFIG_ERROR: {
    title: 'Configuration error — contact dev.',
    what: 'Missing env or CORS misconfigured.',
    action: 'Check VITE_BACKEND_URL and BACKEND CORS.',
    code: 'CONFIG_ERROR'
  }
};

export function ErrorBanner({ error, theme, onDismiss }: ErrorBannerProps) {
  const isLight = theme === 'light';
  
  return (
    <Alert 
      className={`mb-4 ${
        isLight 
          ? 'bg-red-50 border-red-200 text-red-800'
          : 'bg-red-900/20 border-red-800/50 text-red-300'
      }`}
    >
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="text-sm font-medium">{error.title}</AlertTitle>
      <AlertDescription className="mt-2 text-sm">
        <ul className="list-inside space-y-1">
          <li>• What happened: {error.what}</li>
          <li>• What you can do: {error.action}</li>
          {error.code && <li>• Error code: {error.code}</li>}
        </ul>
      </AlertDescription>
    </Alert>
  );
}