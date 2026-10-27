import { useState } from 'react';
import { motion } from 'motion/react';
import { Layers, Sparkles, Copy, Check, Command, FileText, ShieldAlert, MonitorPlay, ExternalLink, ChevronDown, Sun, Moon, KeyRound } from 'lucide-react';

export type ActiveTab = 'prd' | 'audit' | 'linear' | 'sandbox';

interface Props {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  onOpenCommand: () => void;
  onCopyMarkdown: () => void;
  onCopyLinearJson: () => void;
  copiedMarkdown: boolean;
  copiedLinear: boolean;
  edgeCasesCount: number;
  linearIssuesCount: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenApiKey?: () => void;
  isApiKeyConfigured?: boolean;
}

export const Header = ({
  activeTab,
  onChangeTab,
  onOpenCommand,
  onCopyMarkdown,
  onCopyLinearJson,
  copiedMarkdown,
  copiedLinear,
  edgeCasesCount,
  linearIssuesCount,
  theme,
  onToggleTheme,
  onOpenApiKey,
  isApiKeyConfigured,
}: Props) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const navItems: { id: ActiveTab; label: string; icon: any; count?: number }[] = [
    { id: 'prd', label: 'Living PRD', icon: FileText },
    { id: 'sandbox', label: 'Interactive Sandbox', icon: MonitorPlay },
    { id: 'audit', label: 'Tech Lead Audit', icon: ShieldAlert, count: edgeCasesCount },
    { id: 'linear', label: 'Linear Sprints', icon: Layers, count: linearIssuesCount },
  ];

  return (
    <header className="sticky top-4 z-40 max-w-5xl mx-auto px-4 sm:px-6 w-full">
      <div className="glass-panel rounded-2xl px-4 h-14 flex items-center justify-between shadow-lg">
        {/* Brand & Badge */}
        <div className="flex items-center space-x-3">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 rounded-xl bg-apple-accent/15 border border-apple-accent/30 shadow-apple-sm flex items-center justify-center cursor-pointer"
          >
            <Layers className="w-4 h-4 text-apple-accent" />
          </motion.div>

          <div className="flex items-center space-x-2">
            <span className="font-semibold text-apple-text tracking-tight text-sm">SpecOS</span>
            <span className="hidden sm:inline-block text-[10px] font-mono uppercase bg-apple-elevated text-apple-textSecondary px-2 py-0.5 rounded-full border border-apple-border">
              v0.2.0
            </span>
          </div>
        </div>

        {/* Apple-style Segmented Nav Controls */}
        <nav className="flex items-center bg-apple-elevated/70 p-1 rounded-xl border border-apple-border relative">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeTab(item.id)}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                  isActive ? 'text-apple-accent dark:text-apple-text font-semibold' : 'text-apple-textSecondary hover:text-apple-text'
                } apple-pressable`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    transition={{ type: 'spring', damping: 28, stiffness: 170 }}
                    className="absolute inset-0 bg-white dark:bg-apple-surface rounded-lg border border-black/10 dark:border-white/10 shadow-sm"
                  />
                )}
                <Icon className="w-3.5 h-3.5 relative z-10" />
                <span className="relative z-10 hidden md:inline">{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span className={`relative z-10 text-[9px] font-mono px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-apple-accent text-white' : 'bg-apple-elevated text-apple-textSecondary border border-apple-border'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Island */}
        <div className="flex items-center space-x-2">
          {/* Gemini API Key Trigger */}
          <button
            onClick={onOpenApiKey}
            className="relative w-8 h-8 rounded-xl bg-apple-elevated hover:bg-apple-hover border border-apple-border text-apple-textSecondary hover:text-apple-text flex items-center justify-center transition-all apple-pressable shadow-sm"
            title={isApiKeyConfigured ? 'Gemini AI Engine Active (Click to edit key)' : 'Connect Gemini API Key for live AI generation'}
          >
            <KeyRound className="w-3.5 h-3.5 text-apple-accent" />
            <span
              className={`absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full ${
                isApiKeyConfigured ? 'bg-apple-emerald shadow-apple-glow' : 'bg-apple-amber'
              }`}
            />
          </button>

          {/* Theme Toggle Button with Micro-Rotation */}
          <button
            onClick={onToggleTheme}
            className="w-8 h-8 rounded-xl bg-apple-elevated hover:bg-apple-hover border border-apple-border text-apple-textSecondary hover:text-apple-text flex items-center justify-center transition-all apple-pressable shadow-sm overflow-hidden"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            <motion.div
              key={theme}
              initial={{ rotate: -90, scale: 0.7, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-apple-amber" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-apple-accent" />
              )}
            </motion.div>
          </button>

          {/* Quick Search Cmd+K Trigger */}
          <button
            onClick={onOpenCommand}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-apple-elevated hover:bg-apple-hover border border-apple-border text-xs text-apple-textSecondary hover:text-apple-text transition-all apple-pressable shadow-sm"
            title="Open Command Palette (Cmd+K)"
          >
            <Command className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-[11px] font-mono opacity-80">⌘K</span>
          </button>

          {/* Export Dropdown Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(prev => !prev)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-apple-accent hover:bg-apple-accentHover text-white text-xs font-medium transition-all shadow-apple-glow apple-pressable"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Export</span>
              <motion.div animate={{ rotate: showExportMenu ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-3 h-3 opacity-80" />
              </motion.div>
            </button>

            {/* Popover */}
            {showExportMenu && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowExportMenu(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                  className="absolute right-0 mt-2 w-56 glass-panel rounded-xl p-1.5 shadow-2xl border border-apple-border z-40 space-y-1"
                >
                  <button
                    onClick={() => { onCopyMarkdown(); setShowExportMenu(false); }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-apple-text hover:bg-apple-hover transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <Copy className="w-3.5 h-3.5 text-apple-textSecondary" />
                      <span>Copy Full PRD (.md)</span>
                    </div>
                    {copiedMarkdown && <Check className="w-3.5 h-3.5 text-apple-emerald" />}
                  </button>

                  <button
                    onClick={() => { onCopyLinearJson(); setShowExportMenu(false); }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-apple-text hover:bg-apple-hover transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <Layers className="w-3.5 h-3.5 text-apple-purple" />
                      <span>Export Linear JSON</span>
                    </div>
                    {copiedLinear && <Check className="w-3.5 h-3.5 text-apple-emerald" />}
                  </button>

                  <div className="pt-1 border-t border-apple-border">
                    <a
                      href="https://github.com/topics/reverse-engineer-anything"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[11px] text-apple-textSecondary hover:text-apple-text hover:bg-apple-hover transition-colors"
                    >
                      <span>REA Clean-Room Docs</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
