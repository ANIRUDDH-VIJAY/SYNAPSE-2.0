import { useState, useEffect } from 'react';
import { User, Mail, Calendar, CreditCard, X, Users, MessageSquare } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { useIsMobile } from '../ui/use-mobile';
import { ScrollArea } from '../ui/scroll-area';
import { Textarea } from '../ui/textarea';
import { authAPI, adminAPI, feedbackAPI } from '../../services/api';

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  user?: { id: string; name: string; email: string } | null;
  onUpdateUser?: (user: { id: string; name: string; email: string }) => void;
}

export function ProfileModal({ open, onClose, theme, user, onUpdateUser }: ProfileModalProps) {
  const isLight = theme === 'light';
  const isMobile = useIsMobile();
  const [name, setName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [userCount, setUserCount] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  useEffect(() => {
    if (open) {
      // Load user count
      adminAPI.getUserCount()
        .then(res => {
          if (res.data && typeof res.data.count === 'number') {
            setUserCount(res.data.count);
          }
        })
        .catch(err => {
          console.error('Error loading user count:', err);
          setUserCount(0); // Set to 0 on error
        });
    }
  }, [open]);

  const handleSave = async () => {
    if (!name.trim() || name.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }

    if (!user) return;

    setIsSaving(true);
    setError('');

    try {
      const response = await authAPI.updateProfile(name.trim());
      if (onUpdateUser) {
        onUpdateUser(response.data);
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) {
      alert('Please enter your feedback before submitting.');
      return;
    }

    setIsSubmittingFeedback(true);
    setFeedbackSuccess(false);

    try {
      const response = await feedbackAPI.submitFeedback(feedback.trim());
      console.log('Feedback response:', response);
      
      if (response.data.success) {
        setFeedbackSuccess(true);
        setFeedback('');
        setTimeout(() => setFeedbackSuccess(false), 3000);
      } else {
        throw new Error('Feedback submission failed');
      }
    } catch (err: any) {
      console.error('Error submitting feedback:', err);
      const errorMsg = err.response?.data?.error || err.message || 'Failed to submit feedback. Please try again.';
      alert(errorMsg);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  // Note: We don't have createdAt in user object, so we'll show a placeholder
  const memberSince = 'Recently';

  // Mobile full-screen view
  if (isMobile && open) {
    return (
      <div className={`fixed inset-0 z-50 ${
        isLight ? 'bg-white' : 'bg-slate-900'
      }`}>
        {/* Header with close button */}
        <div className={`sticky top-0 z-10 flex items-center justify-between p-4 border-b ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
        }`}>
          <h2 className={`text-xl ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Profile</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isLight 
                ? 'hover:bg-slate-100 text-red-500 hover:text-red-600' 
                : 'hover:bg-slate-800 text-red-400 hover:text-red-300'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <ScrollArea className="h-[calc(100vh-65px)]">
          <div className="p-4 space-y-6">
            {/* Avatar & Basic Info */}
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20 border-4 border-blue-500/30">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xl">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className={`text-lg ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{user?.name || 'User'}</h3>
                <Badge variant="outline" className={`mt-1 ${
                  isLight ? 'border-blue-300 text-blue-700' : 'border-blue-500/50 text-blue-400'
                }`}>
                  Free Plan
                </Badge>
              </div>
            </div>

            {/* Profile Details */}
            <div className="space-y-4">
              {error && (
                <div className={`p-3 rounded-lg ${isLight ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-red-950/20 text-red-400 border border-red-800/50'}`}>
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label className={`flex items-center gap-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  <User className="w-4 h-4" />
                  Full Name
                </Label>
                <Input 
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError('');
                  }}
                  className={isLight ? '' : 'bg-slate-800 border-slate-700 text-slate-200'}
                />
              </div>

              <div className="space-y-2">
                <Label className={`flex items-center gap-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input 
                  type="email" 
                  value={user?.email || ''}
                  disabled 
                  className={isLight ? 'bg-slate-50' : 'bg-slate-800/50 border-slate-700 text-slate-400'}
                />
              </div>

              <div className="space-y-2">
                <Label className={`flex items-center gap-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  <Calendar className="w-4 h-4" />
                  Member Since
                </Label>
                <Input 
                  value={memberSince}
                  disabled 
                  className={isLight ? 'bg-slate-50' : 'bg-slate-800/50 border-slate-700 text-slate-400'}
                />
              </div>
            </div>

            {/* Plan Information */}
            <div className={`p-4 rounded-xl border ${
              isLight ? 'bg-blue-50 border-blue-200' : 'bg-slate-800/50 border-slate-700'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-4 h-4 text-blue-500" />
                <h4 className={`text-sm ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>Current Plan: Free</h4>
              </div>
              <p className={`text-xs mb-3 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Unlimited messages • Single model access • Basic features
              </p>
              <Button 
                size="sm" 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Upgrade to Pro
              </Button>
            </div>

            {/* User Count */}
            <div className={`p-4 rounded-xl border ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/50 border-slate-700'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isLight ? 'bg-blue-100' : 'bg-blue-500/20'}`}>
                  <Users className={`w-5 h-5 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
                </div>
                <div>
                  <p className={`text-2xl font-semibold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                    {userCount !== null ? userCount.toLocaleString() : '...'}
                  </p>
                  <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Total Users</p>
                </div>
              </div>
            </div>

            {/* Feedback Form */}
            <div className={`p-4 rounded-xl border ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/50 border-slate-700'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className={`w-4 h-4 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
                <Label className={isLight ? 'text-slate-700' : 'text-slate-300'}>Send Feedback</Label>
              </div>
              <p className={`text-xs mb-3 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Share your thoughts, suggestions, or report issues. Only admins can view your feedback.
              </p>
              {feedbackSuccess && (
                <div className={`p-2 mb-3 rounded-lg ${isLight ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-green-950/20 text-green-400 border border-green-800/50'}`}>
                  ✓ Feedback submitted successfully!
                </div>
              )}
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Type your feedback here..."
                rows={4}
                className={`mb-3 ${isLight ? '' : 'bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500'}`}
              />
              <Button
                onClick={handleSubmitFeedback}
                disabled={!feedback.trim() || isSubmittingFeedback}
                size="sm"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50"
              >
                {isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}
              </Button>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={onClose}
                disabled={isSaving}
                className={`flex-1 ${isLight ? '' : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'}`}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={isSaving || !name.trim()}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  // Desktop dialog view
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-[500px] max-h-[90vh] overflow-hidden flex flex-col ${
        isLight ? 'bg-white' : 'bg-slate-900 border-slate-800 text-slate-200'
      }`}>
        <DialogHeader>
          <DialogTitle className={isLight ? 'text-slate-900' : 'text-slate-100'}>Profile</DialogTitle>
          <DialogDescription className={isLight ? 'text-slate-600' : 'text-slate-400'}>
            Manage your account information and preferences
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="space-y-6 py-4">
            {/* Avatar & Basic Info */}
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20 border-4 border-blue-500/30">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className={`text-lg ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{user?.name || 'User'}</h3>
              <Badge variant="outline" className={`mt-1 ${
                isLight ? 'border-blue-300 text-blue-700' : 'border-blue-500/50 text-blue-400'
              }`}>
                Free Plan
              </Badge>
            </div>
          </div>

          {/* Profile Details */}
          <div className="space-y-4">
            {error && (
              <div className={`p-3 rounded-lg ${isLight ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-red-950/20 text-red-400 border border-red-800/50'}`}>
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label className={`flex items-center gap-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                <User className="w-4 h-4" />
                Full Name
              </Label>
              <Input 
                value={name}
                disabled
                className={`${isLight ? '' : 'bg-slate-800 border-slate-700 text-slate-200'} ${!onUpdateUser ? 'opacity-50' : ''}`}
              />
            </div>

            <div className="space-y-2">
              <Label className={`flex items-center gap-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input 
                type="email" 
                value={user?.email || ''}
                disabled 
                className={isLight ? 'bg-slate-50' : 'bg-slate-800/50 border-slate-700 text-slate-400'}
              />
            </div>

            <div className="space-y-2">
              <Label className={`flex items-center gap-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                <Calendar className="w-4 h-4" />
                Member Since
              </Label>
              <Input 
                value={memberSince}
                disabled 
                className={isLight ? 'bg-slate-50' : 'bg-slate-800/50 border-slate-700 text-slate-400'}
              />
            </div>
          </div>

          {/* Plan Information */}
          <div className={`p-4 rounded-xl border ${
            isLight ? 'bg-blue-50 border-blue-200' : 'bg-slate-800/50 border-slate-700'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4 text-blue-500" />
              <h4 className={`text-sm ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>Current Plan: Free</h4>
            </div>
            <p className={`text-xs mb-3 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Unlimited messages • Single model access • Basic features
            </p>
            <Button 
              size="sm" 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Upgrade to Pro
            </Button>
          </div>

          {/* User Count */}
          <div className={`p-4 rounded-xl border ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/50 border-slate-700'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isLight ? 'bg-blue-100' : 'bg-blue-500/20'}`}>
                <Users className={`w-5 h-5 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
              </div>
              <div>
                <p className={`text-2xl font-semibold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                  {userCount !== null ? userCount.toLocaleString() : '...'}
                </p>
                <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Total Users</p>
              </div>
            </div>
          </div>

          {/* Feedback Form */}
          <div className={`p-4 rounded-xl border ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/50 border-slate-700'
          }`}>
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className={`w-4 h-4 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
              <Label className={isLight ? 'text-slate-700' : 'text-slate-300'}>Send Feedback</Label>
            </div>
            <p className={`text-xs mb-3 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Share your thoughts, suggestions, or report issues. Only admins can view your feedback.
            </p>
            {feedbackSuccess && (
              <div className={`p-2 mb-3 rounded-lg ${isLight ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-green-950/20 text-green-400 border border-green-800/50'}`}>
                ✓ Feedback submitted successfully!
              </div>
            )}
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Type your feedback here..."
              rows={4}
              className={`mb-3 ${isLight ? '' : 'bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500'}`}
            />
            <Button
              onClick={handleSubmitFeedback}
              disabled={!feedback.trim() || isSubmittingFeedback}
              size="sm"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50"
            >
              {isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </div>
          </div>
          </ScrollArea>

          <div className="flex-shrink-0 flex justify-end gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isSaving}
              className={
                isLight ? '' : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
              }
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving || !name.trim()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
  );
}
