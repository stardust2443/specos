import { useState } from 'react';
import { motion } from 'motion/react';
import { Layers, Sparkles, Copy, Check, Command, FileText, ShieldAlert, MonitorPlay, ExternalLink, ChevronDown } from 'lucide-react';

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
}: Props) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const navItems: { id: ActiveTab; label: string; icon: any; count?: number }[] = [
    { id: 'prd', label: 'Living PRD', icon: FileText },
    { id: 'audit', label: 'Tech Lead Audit', icon: ShieldAlert, count: edgeCasesCount },
    { id: 'linear', label: 'Linear Sprints', icon: Layers, count: linearIssuesCount },
    { id: 'sandbox', label: 'Live Sandbox', icon: MonitorPlay },
  ];

  return (
    <header className="sticky top-3 z-40 max-w-7xl mx-auto px-4 sm:px-6 w-full">
      <div className="glass-panel rounded-2xl px-3 sm:px-4 h-14 flex items-center justify-between border border-white/10 shadow-2xl">
        {/* Brand & Badge */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-white/20 to-white/5 p-[1px] shadow-apple-sm flex items-center justify-center">
            <div className="w-full h-full bg-[#16181E] rounded-[11px] flex items-center justify-center">
              <Layers className="w-4 h-4 text-apple-accent" />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="font-semibold text-apple-text tracking-tight text-sm">SpecOS</span>
            <span className="hidden sm:inline-block text-[10px] font-mono uppercase bg-white/[0.06] text-apple-textSecondary px-1.5 py-0.5 rounded-full border border-white/[0.08]">
              v0.2.0
            </span>
          </div>
        </div>

        {/* Apple-style Segmented Nav Controls */}
        <nav className="flex items-center bg-black/40 p-1 rounded-xl border border-white/[0.06] relative">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeTab(item.id)}
                className={`relative px-2.5 sm:px-3 py-1 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                  isActive ? 'text-white' : 'text-apple-textSecondary hover:text-apple-text'
                } apple-pressable`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                    className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 shadow-sm"
                  />
                )}
                <Icon className="w-3.5 h-3.5 relative z-10" />
                <span className="relative z-10 hidden md:inline">{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span className={`relative z-10 text-[9px] font-mono px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-apple-accent text-white' : 'bg-white/10 text-apple-textSecondary'
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
          {/* Quick Search Cmd+K Trigger */}
          <button
            onClick={onOpenCommand}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs text-apple-textSecondary hover:text-apple-text transition-all apple-pressable shadow-sm"
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
              <ChevronDown className="w-3 h-3 opacity-80" />
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
                  className="absolute right-0 mt-2 w-56 glass-panel rounded-xl p-1.5 shadow-2xl border border-white/10 z-40 space-y-1"
                >
                  <button
                    onClick={() => { onCopyMarkdown(); setShowExportMenu(false); }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-apple-text hover:bg-white/[0.06] transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <Copy className="w-3.5 h-3.5 text-apple-textSecondary" />
                      <span>Copy Full PRD (.md)</span>
                    </div>
                    {copiedMarkdown && <Check className="w-3.5 h-3.5 text-apple-emerald" />}
                  </button>

                  <button
                    onClick={() => { onCopyLinearJson(); setShowExportMenu(false); }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-apple-text hover:bg-white/[0.06] transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <Layers className="w-3.5 h-3.5 text-apple-purple" />
                      <span>Export Linear JSON</span>
                    </div>
                    {copiedLinear && <Check className="w-3.5 h-3.5 text-apple-emerald" />}
                  </button>

                  <div className="pt-1 border-t border-white/[0.06]">
                    <a
                      href="https://github.com/topics/reverse-engineer-anything"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[11px] text-apple-textSecondary hover:text-white hover:bg-white/[0.04] transition-colors"
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
