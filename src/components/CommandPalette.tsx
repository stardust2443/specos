import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Sparkles, Layers, ShieldAlert, FileText, ArrowRight, CornerDownLeft, X } from 'lucide-react';
import { DemoPreset } from '../types/spec';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  presets: DemoPreset[];
  onSelectPreset: (preset: DemoPreset) => void;
  onSelectView: (view: 'prd' | 'audit' | 'linear' | 'sandbox') => void;
  onExportMarkdown: () => void;
  onExportLinear: () => void;
  onSubmitCustomPrompt: (prompt: string) => void;
}

export const CommandPalette = ({
  isOpen,
  onClose,
  presets,
  onSelectPreset,
  onSelectView,
  onExportMarkdown,
  onExportLinear,
  onSubmitCustomPrompt,
}: Props) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'view-prd',
      title: 'Jump to Living PRD Document',
      category: 'Navigation',
      icon: <FileText className="w-4 h-4 text-apple-accent" />,
      run: () => { onSelectView('prd'); onClose(); }
    },
    {
      id: 'view-audit',
      title: 'Jump to Synthetic Tech Lead Audit',
      category: 'Navigation',
      icon: <ShieldAlert className="w-4 h-4 text-apple-red" />,
      run: () => { onSelectView('audit'); onClose(); }
    },
    {
      id: 'view-linear',
      title: 'Jump to Linear Sprints & Issues',
      category: 'Navigation',
      icon: <Layers className="w-4 h-4 text-apple-purple" />,
      run: () => { onSelectView('linear'); onClose(); }
    },
    {
      id: 'view-sandbox',
      title: 'Open Interactive Prototype Sandbox',
      category: 'Navigation',
      icon: <Sparkles className="w-4 h-4 text-apple-emerald" />,
      run: () => { onSelectView('sandbox'); onClose(); }
    },
    {
      id: 'export-md',
      title: 'Copy Complete PRD as Markdown',
      category: 'Actions',
      icon: <FileText className="w-4 h-4 text-white" />,
      run: () => { onExportMarkdown(); onClose(); }
    },
    {
      id: 'export-linear',
      title: 'Export Issues to Linear JSON',
      category: 'Actions',
      icon: <Layers className="w-4 h-4 text-white" />,
      run: () => { onExportLinear(); onClose(); }
    },
    ...presets.map(p => ({
      id: `preset-${p.id}`,
      title: `Load Preset: ${p.name}`,
      category: 'Presets',
      icon: <Sparkles className="w-4 h-4 text-apple-amber" />,
      run: () => { onSelectPreset(p); onClose(); }
    }))
  ];

  const filtered = actions.filter(a =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].run();
      } else if (query.trim()) {
        onSubmitCustomPrompt(query.trim());
        onClose();
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative w-full max-w-xl glass-panel rounded-2xl overflow-hidden shadow-2xl border border-apple-border z-10"
        >
          {/* Search Header */}
          <div className="flex items-center px-4 py-3.5 border-b border-apple-border bg-apple-elevated/40">
            <Search className="w-4 h-4 text-apple-textSecondary mr-3 flex-shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
              onKeyDown={handleKeyDown}
              placeholder="Search actions, views, presets, or type a custom feature..."
              className="w-full bg-transparent text-sm text-apple-text placeholder-apple-textSecondary outline-none font-sans"
            />
            {query && (
              <button onClick={() => setQuery('')} className="p-1 text-apple-textSecondary hover:text-apple-text">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <div className="flex items-center space-x-1 pl-2">
              <span className="text-[10px] font-mono uppercase bg-apple-elevated text-apple-textSecondary px-1.5 py-0.5 rounded border border-apple-border">ESC</span>
            </div>
          </div>

          {/* Action List */}
          <div className="max-h-80 overflow-y-auto p-2 space-y-1">
            {filtered.length > 0 ? (
              filtered.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={item.id}
                    onClick={item.run}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                      isSelected
                        ? 'bg-apple-accent text-white shadow-sm font-medium'
                        : 'text-apple-text hover:bg-apple-hover'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-1 rounded-md ${isSelected ? 'text-white' : 'text-apple-textSecondary'}`}>
                        {item.icon}
                      </div>
                      <span className="font-medium">{item.title}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-apple-elevated text-apple-textTertiary border border-apple-border'
                      }`}>
                        {item.category}
                      </span>
                      {isSelected && <CornerDownLeft className="w-3 h-3 text-white" />}
                    </div>
                  </button>
                );
              })
            ) : query.trim() ? (
              <button
                onClick={() => { onSubmitCustomPrompt(query.trim()); onClose(); }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-apple-accent/15 border border-apple-accent/30 text-left text-xs text-apple-accent"
              >
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-apple-accent" />
                  <span>Synthesize custom PRD for: <strong>"{query}"</strong></span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-apple-accent" />
              </button>
            ) : (
              <div className="p-4 text-center text-xs text-apple-textSecondary font-mono">
                No matching actions found.
              </div>
            )}
          </div>

          {/* Footer Navigation Hints */}
          <div className="px-4 py-2 border-t border-apple-border bg-apple-elevated/40 flex items-center justify-between text-[11px] text-apple-textTertiary font-mono">
            <span>Use ↑↓ to navigate</span>
            <span>Press ↵ to select</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
