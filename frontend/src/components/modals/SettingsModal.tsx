import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useIsMobile } from '../ui/use-mobile';
import { ScrollArea } from '../ui/scroll-area';

import { useState } from 'react';
import { chatAPI } from '../../services/api';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  onClearHistory?: () => void;
}

export function SettingsModal({ open, onClose, theme, onClearHistory }: SettingsModalProps) {
  const isLight = theme === 'light';
  const isMobile = useIsMobile();
  const [isClearing, setIsClearing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
          <h2 className={`text-xl ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Chat Settings</h2>
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
            {/* Model Selection */}
            <div className="space-y-2">
              <Label className={isLight ? 'text-slate-700' : 'text-slate-300'}>AI Model</Label>
              <Select defaultValue="synapse-v1">
                <SelectTrigger className={isLight ? '' : 'bg-slate-800 border-slate-700 text-slate-200'}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={isLight ? '' : 'bg-slate-800 border-slate-700'}>
                  <SelectItem value="synapse-v1">Synapse v1 (Text)</SelectItem>
                </SelectContent>
              </Select>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                Single text-based model for all conversations
              </p>
            </div>

            {/* Response Length */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className={isLight ? 'text-slate-700' : 'text-slate-300'}>Response Length</Label>
                <span className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Medium</span>
              </div>
              <Slider defaultValue={[50]} max={100} step={1} className="w-full" />
              <div className="flex justify-between text-xs">
                <span className={isLight ? 'text-slate-500' : 'text-slate-500'}>Concise</span>
                <span className={isLight ? 'text-slate-500' : 'text-slate-500'}>Detailed</span>
              </div>
            </div>

            {/* Temperature */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className={isLight ? 'text-slate-700' : 'text-slate-300'}>Creativity</Label>
                <span className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Balanced</span>
              </div>
              <Slider defaultValue={[50]} max={100} step={1} className="w-full" />
              <div className="flex justify-between text-xs">
                <span className={isLight ? 'text-slate-500' : 'text-slate-500'}>Precise</span>
                <span className={isLight ? 'text-slate-500' : 'text-slate-500'}>Creative</span>
              </div>
            </div>

            {/* Toggle Options */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className={isLight ? 'text-slate-700' : 'text-slate-300'}>Code Highlighting</Label>
                  <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                    Syntax highlighting for code blocks
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className={isLight ? 'text-slate-700' : 'text-slate-300'}>Auto-save Chats</Label>
                  <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                    Automatically save conversation history
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className={isLight ? 'text-slate-700' : 'text-slate-300'}>Send with Enter</Label>
                  <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                    Press Enter to send (Shift+Enter for new line)
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>

            {/* Clear History */}
            <div className={`pt-4 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
              <div className="space-y-3">
                <div>
                  <Label className={isLight ? 'text-slate-700' : 'text-slate-300'}>Clear Conversation History</Label>
                  <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                    Permanently delete all your chat conversations. This action cannot be undone.
                  </p>
                </div>
                {showConfirm ? (
                  <div className="space-y-2">
                    <p className={`text-sm ${isLight ? 'text-red-600' : 'text-red-400'}`}>
                      Are you sure? This will delete all your conversations.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowConfirm(false)}
                        disabled={isClearing}
                        className={isLight ? '' : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={async () => {
                          setIsClearing(true);
                          try {
                            const response = await chatAPI.clearAllChats();
                            console.log('Clear history response:', response);
                            
                            if (onClearHistory) {
                              await onClearHistory();
                            }
                            setShowConfirm(false);
                            onClose();
                            alert(`Successfully deleted ${response.data?.deletedCount || 0} chat(s).`);
                          } catch (error: any) {
                            console.error('Error clearing history:', error);
                            const errorMsg = error.response?.data?.error || 'Failed to clear history. Please try again.';
                            alert(errorMsg);
                          } finally {
                            setIsClearing(false);
                          }
                        }}
                        disabled={isClearing}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        {isClearing ? 'Clearing...' : 'Yes, Delete All'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowConfirm(true)}
                    className={`${isLight ? 'border-red-300 text-red-600 hover:bg-red-50' : 'border-red-800/50 text-red-400 hover:bg-red-950/20'}`}
                  >
                    Clear All Conversations
                  </Button>
                )}
              </div>
            </div>

            {/* About Section */}
            <div className={`pt-6 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.2"/>
                      <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className={`bg-gradient-to-r ${
                    isLight ? 'from-blue-600 via-indigo-600 to-blue-700' : 'from-blue-400 via-indigo-400 to-blue-500'
                  } bg-clip-text text-transparent tracking-wide`}>
                    SYNAPSE 2.0
                  </h3>
                </div>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                  Version 1.0.0
                </p>
                <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Created by <span className={`${isLight ? 'text-blue-600' : 'text-blue-400'}`}>Aniruddh Vijayvargia</span>
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={onClose} 
                className={`flex-1 ${isLight ? '' : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'}`}
              >
                Cancel
              </Button>
              <Button 
                onClick={onClose} 
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Save Changes
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
      <DialogContent className={`sm:max-w-[550px] ${
        isLight ? 'bg-white' : 'bg-slate-900 border-slate-800 text-slate-200'
      }`}>
        <DialogHeader>
          <DialogTitle className={isLight ? 'text-slate-900' : 'text-slate-100'}>Chat Settings</DialogTitle>
          <DialogDescription className={isLight ? 'text-slate-600' : 'text-slate-400'}>
            Customize your chat experience and AI behavior
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Model Selection */}
          <div className="space-y-2">
            <Label className={isLight ? 'text-slate-700' : 'text-slate-300'}>AI Model</Label>
            <Select defaultValue="synapse-v1">
              <SelectTrigger className={isLight ? '' : 'bg-slate-800 border-slate-700 text-slate-200'}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={isLight ? '' : 'bg-slate-800 border-slate-700'}>
                <SelectItem value="synapse-v1">Synapse v1 (Text)</SelectItem>
              </SelectContent>
            </Select>
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
              Single text-based model for all conversations
            </p>
          </div>

          {/* Response Length */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className={isLight ? 'text-slate-700' : 'text-slate-300'}>Response Length</Label>
              <span className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Medium</span>
            </div>
            <Slider defaultValue={[50]} max={100} step={1} className="w-full" />
            <div className="flex justify-between text-xs">
              <span className={isLight ? 'text-slate-500' : 'text-slate-500'}>Concise</span>
              <span className={isLight ? 'text-slate-500' : 'text-slate-500'}>Detailed</span>
            </div>
          </div>

          {/* Temperature */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className={isLight ? 'text-slate-700' : 'text-slate-300'}>Creativity</Label>
              <span className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Balanced</span>
            </div>
            <Slider defaultValue={[50]} max={100} step={1} className="w-full" />
            <div className="flex justify-between text-xs">
              <span className={isLight ? 'text-slate-500' : 'text-slate-500'}>Precise</span>
              <span className={isLight ? 'text-slate-500' : 'text-slate-500'}>Creative</span>
            </div>
          </div>

          {/* Toggle Options */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className={isLight ? 'text-slate-700' : 'text-slate-300'}>Code Highlighting</Label>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                  Syntax highlighting for code blocks
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className={isLight ? 'text-slate-700' : 'text-slate-300'}>Auto-save Chats</Label>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                  Automatically save conversation history
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className={isLight ? 'text-slate-700' : 'text-slate-300'}>Send with Enter</Label>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                  Press Enter to send (Shift+Enter for new line)
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            {/* Clear History */}
            <div className={`pt-4 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
              <div className="space-y-3">
                <div>
                  <Label className={isLight ? 'text-slate-700' : 'text-slate-300'}>Clear Conversation History</Label>
                  <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                    Permanently delete all your chat conversations. This action cannot be undone.
                  </p>
                </div>
                {showConfirm ? (
                  <div className="space-y-2">
                    <p className={`text-sm ${isLight ? 'text-red-600' : 'text-red-400'}`}>
                      Are you sure? This will delete all your conversations.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowConfirm(false)}
                        disabled={isClearing}
                        className={isLight ? '' : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={async () => {
                          setIsClearing(true);
                          try {
                            const response = await chatAPI.clearAllChats();
                            console.log('Clear history response:', response);
                            
                            if (onClearHistory) {
                              await onClearHistory();
                            }
                            setShowConfirm(false);
                            onClose();
                            alert(`Successfully deleted ${response.data?.deletedCount || 0} chat(s).`);
                          } catch (error: any) {
                            console.error('Error clearing history:', error);
                            const errorMsg = error.response?.data?.error || 'Failed to clear history. Please try again.';
                            alert(errorMsg);
                          } finally {
                            setIsClearing(false);
                          }
                        }}
                        disabled={isClearing}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        {isClearing ? 'Clearing...' : 'Yes, Delete All'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowConfirm(true)}
                    className={`${isLight ? 'border-red-300 text-red-600 hover:bg-red-50' : 'border-red-800/50 text-red-400 hover:bg-red-950/20'}`}
                  >
                    Clear All Conversations
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} className={
            isLight ? '' : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
          }>
            Cancel
          </Button>
          <Button onClick={onClose} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
