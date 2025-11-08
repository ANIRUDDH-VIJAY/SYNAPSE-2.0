import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../ui/dialog';
import { LoginForm } from '../auth/LoginForm';
import { SignupForm } from '../auth/SignupForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { authAPI } from '../../services/api';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<void>;
  onSignup: (name: string, email: string, password: string) => Promise<void>;
  theme: 'light' | 'dark';
}

export function AuthModal({ open, onClose, onLogin, onSignup, theme }: AuthModalProps) {
  const isLight = theme === 'light';
  
  // Tab state
  const [activeTab, setActiveTab] = useState('login');
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Signup state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      await onLogin(loginEmail, loginPassword);
      onClose();
      // Reset form
      setLoginEmail('');
      setLoginPassword('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      
      // If user not found, switch to signup and carry forward email/password
      if (errorMessage === 'USER_NOT_FOUND') {
        setActiveTab('signup');
        setSignupEmail(loginEmail);
        setSignupPassword(loginPassword);
        setSignupConfirmPassword(loginPassword);
        setLoginError('');
      } else {
        setLoginError(errorMessage);
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');

    // Validate passwords match
    if (signupPassword !== signupConfirmPassword) {
      setSignupError('Passwords do not match');
      return;
    }

    // Validate password length
    if (signupPassword.length < 8) {
      setSignupError('Password must be at least 8 characters');
      return;
    }

    setSignupLoading(true);

    try {
      await onSignup(signupName, signupEmail, signupPassword);
      onClose();
      // Reset form
      setSignupName('');
      setSignupEmail('');
      setSignupPassword('');
      setSignupConfirmPassword('');
    } catch (error) {
      setSignupError(error instanceof Error ? error.message : 'Signup failed');
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-[480px] p-0 gap-0 ${
        isLight ? 'bg-white' : 'bg-slate-900 border-slate-800'
      }`}>
        <DialogTitle className="sr-only">Authentication</DialogTitle>
        <DialogDescription className="sr-only">
          Login to your account or create a new one to access Synapse AI
        </DialogDescription>
        
        {/* Header with Logo */}
        <div className={`p-6 pb-4 border-b ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.2"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className={`text-2xl bg-gradient-to-r ${
              isLight ? 'from-blue-600 via-indigo-600 to-blue-700' : 'from-blue-400 via-indigo-400 to-blue-500'
            } bg-clip-text text-transparent tracking-wide`} style={{ letterSpacing: '0.02em' }}>
              SYNAPSE
            </h1>
          </div>
          <p className={`text-center text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Welcome to Synapse AI
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`w-full rounded-none border-b h-14 p-0 gap-0 ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-800/50 border-slate-700'
          }`}>
            <TabsTrigger 
              value="login" 
              className={`flex-1 h-full rounded-none border-b-2 transition-all ${
                isLight 
                  ? 'text-slate-700 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:bg-white border-transparent data-[state=active]:font-medium' 
                  : 'text-slate-300 data-[state=active]:text-blue-400 data-[state=active]:border-blue-400 data-[state=active]:bg-slate-900 border-transparent data-[state=active]:font-medium'
              }`}
            >
              Login
            </TabsTrigger>
            <TabsTrigger 
              value="signup" 
              className={`flex-1 h-full rounded-none border-b-2 transition-all ${
                isLight 
                  ? 'text-slate-700 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:bg-white border-transparent data-[state=active]:font-medium' 
                  : 'text-slate-300 data-[state=active]:text-blue-400 data-[state=active]:border-blue-400 data-[state=active]:bg-slate-900 border-transparent data-[state=active]:font-medium'
              }`}
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login" className="p-6 mt-0">
            {/* OAuth Buttons */}
            <div className="space-y-3 mb-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => authAPI.googleLogin()}
                className={`w-full ${
                  isLight 
                    ? 'border-slate-300 hover:bg-slate-50' 
                    : 'border-slate-700 hover:bg-slate-800'
                }`}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => authAPI.githubLogin()}
                className={`w-full ${
                  isLight 
                    ? 'border-slate-300 hover:bg-slate-50' 
                    : 'border-slate-700 hover:bg-slate-800'
                }`}
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Continue with GitHub
              </Button>
            </div>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className={`w-full border-t ${isLight ? 'border-slate-300' : 'border-slate-700'}`}></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className={`px-2 ${isLight ? 'bg-white text-slate-500' : 'bg-slate-900 text-slate-400'}`}>
                  Or continue with email
                </span>
              </div>
            </div>

            <LoginForm
              theme={theme}
              email={loginEmail}
              password={loginPassword}
              onEmailChange={setLoginEmail}
              onPasswordChange={setLoginPassword}
              onSubmit={handleLogin}
              onSwitchToSignup={() => {
                // Carry forward email/password when switching to signup
                setSignupEmail(loginEmail);
                setSignupPassword(loginPassword);
                setSignupConfirmPassword(loginPassword);
                setActiveTab('signup');
              }}
              loading={loginLoading}
              error={loginError}
            />
          </TabsContent>

          {/* Sign Up Tab */}
          <TabsContent value="signup" className="p-6 mt-0">
            {/* OAuth Buttons */}
            <div className="space-y-3 mb-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => authAPI.googleLogin()}
                className={`w-full ${
                  isLight 
                    ? 'border-slate-300 hover:bg-slate-50' 
                    : 'border-slate-700 hover:bg-slate-800'
                }`}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => authAPI.githubLogin()}
                className={`w-full ${
                  isLight 
                    ? 'border-slate-300 hover:bg-slate-50' 
                    : 'border-slate-700 hover:bg-slate-800'
                }`}
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Continue with GitHub
              </Button>
            </div>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className={`w-full border-t ${isLight ? 'border-slate-300' : 'border-slate-700'}`}></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className={`px-2 ${isLight ? 'bg-white text-slate-500' : 'bg-slate-900 text-slate-400'}`}>
                  Or continue with email
                </span>
              </div>
            </div>

            <SignupForm
              theme={theme}
              name={signupName}
              email={signupEmail}
              password={signupPassword}
              confirmPassword={signupConfirmPassword}
              onNameChange={setSignupName}
              onEmailChange={setSignupEmail}
              onPasswordChange={setSignupPassword}
              onConfirmPasswordChange={setSignupConfirmPassword}
              onSubmit={handleSignup}
              onSwitchToLogin={() => {
                // Carry forward email/password when switching to login
                setLoginEmail(signupEmail);
                setLoginPassword(signupPassword);
                setActiveTab('login');
              }}
              loading={signupLoading}
              error={signupError}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
