import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { KeyRound, X, ExternalLink, Check, Trash2, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { getStoredApiKey, setStoredApiKey, removeStoredApiKey } from '../services/gemini';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved?: () => void;
}

export const ApiKeyModal = ({ isOpen, onClose, onKeySaved }: Props) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const current = getStoredApiKey();
      setApiKey(current);
      setIsConfigured(Boolean(current));
      setSavedSuccess(false);
    }
  }, [isOpen]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;
    setStoredApiKey(apiKey.trim());
    setIsConfigured(true);
    setSavedSuccess(true);
    onKeySaved?.();
    setTimeout(() => {
      onClose();
    }, 800);
  };

  const handleRemove = () => {
    removeStoredApiKey();
    setApiKey('');
    setIsConfigured(false);
    onKeySaved?.();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 28, stiffness: 200 }}
            className="relative w-full max-w-lg glass-panel rounded-3xl p-7 shadow-2xl border border-apple-border overflow-hidden z-10 space-y-6"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-apple-accent/10 border border-apple-accent/20 flex items-center justify-center text-apple-accent shadow-apple-sm">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-apple-text tracking-tight">
                    Gemini AI Engine
                  </h3>
                  <p className="text-xs text-apple-textTertiary mt-0.5">
                    Connect your free Google AI Studio key for live multi-agent synthesis
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-xl hover:bg-apple-hover text-apple-textSecondary hover:text-apple-text transition-colors apple-pressable"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono font-medium text-apple-textSecondary block">
                  Gemini API Key
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full pl-4 pr-20 py-3 rounded-2xl glass-input text-xs font-mono text-apple-text placeholder-apple-textTertiary focus:border-apple-accent focus:ring-4 focus:ring-apple-accent/15 outline-none transition-all"
                  />
                  <div className="absolute right-2 flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="p-1.5 rounded-lg text-apple-textTertiary hover:text-apple-text transition-colors"
                      title={showKey ? 'Hide key' : 'Show key'}
                    >
                      {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Status & Get Key Link */}
              <div className="flex items-center justify-between text-xs pt-1">
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-apple-accent hover:underline flex items-center space-x-1 font-medium"
                >
                  <span>Get free key in 10s (Google AI Studio)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                {isConfigured && (
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="text-rose-500 hover:text-rose-600 flex items-center space-x-1 text-xs apple-pressable"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Disconnect</span>
                  </button>
                )}
              </div>

              {/* Security Guarantee */}
              <div className="p-3.5 rounded-xl bg-apple-elevated/50 border border-apple-border flex items-start space-x-2.5 text-xs text-apple-textSecondary">
                <ShieldCheck className="w-4 h-4 text-apple-emerald flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Keys are stored exclusively in your browser’s local client storage (<code className="font-mono text-[11px] text-apple-text">localStorage</code>). No tokens or requests are logged to an intermediary server.
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-apple-border">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-apple-textSecondary hover:text-apple-text hover:bg-apple-hover transition-colors apple-pressable"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={!apiKey.trim()}
                  className="px-5 py-2 bg-apple-accent hover:bg-apple-accentHover disabled:opacity-40 text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition-all shadow-apple-sm apple-pressable"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <span>Save Key</span>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
