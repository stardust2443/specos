import { useState } from 'react';
import { motion } from 'motion/react';
import { Layers, Check, Command, Bell } from 'lucide-react';

interface Props {
  config: Record<string, any>;
}

export const SwitcherMockup = ({ config }: Props) => {
  const [activeId, setActiveId] = useState('1');
  const [switchLatency, setSwitchLatency] = useState<number | null>(null);

  const workspaces = config.workspaces || [
    { id: '1', name: 'Acme Corp (Primary)', unread: 0 },
    { id: '2', name: 'HyperScale AI (Client)', unread: 3 },
    { id: '3', name: 'Personal Lab', unread: 1 }
  ];

  const handleSwitch = (id: string) => {
    const start = performance.now();
    setActiveId(id);
    const elapsed = Math.round(performance.now() - start);
    setSwitchLatency(elapsed || 12);
  };

  return (
    <div className="max-w-sm mx-auto glass-panel rounded-3xl p-6 shadow-2xl border border-apple-border">
      {/* Top Handle */}
      <div className="w-10 h-1 bg-apple-borderHighlight rounded-full mx-auto mb-5" />

      <div className="flex items-center justify-between pb-3.5 border-b border-apple-border">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-apple-accent" />
          <h4 className="text-xs font-semibold text-apple-text uppercase tracking-wider font-mono">
            Workspace Quick Switcher
          </h4>
        </div>

        <div className="flex items-center space-x-1 text-[10px] font-mono text-apple-textTertiary bg-apple-elevated px-2 py-0.5 rounded-md border border-apple-border">
          <Command className="w-2.5 h-2.5" />
          <span>+ [1-3]</span>
        </div>
      </div>

      <div className="py-4 space-y-2">
        {workspaces.map((ws: any, idx: number) => {
          const isActive = ws.id === activeId;
          return (
            <button
              key={ws.id}
              onClick={() => handleSwitch(ws.id)}
              className={`relative w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all apple-pressable ${
                isActive
                  ? 'bg-apple-accent/15 border-apple-accent text-apple-accent font-semibold shadow-apple-sm'
                  : 'bg-apple-elevated/40 border-apple-border text-apple-textSecondary hover:text-apple-text hover:border-apple-borderHighlight'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeWorkspaceGlow"
                  className="absolute inset-0 rounded-2xl bg-apple-accent/10 pointer-events-none"
                  transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                />
              )}

              <div className="flex items-center space-x-3 relative z-10">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-mono font-bold ${
                  isActive ? 'bg-apple-accent text-white shadow-sm' : 'bg-white/[0.06] text-apple-textSecondary'
                }`}>
                  {idx + 1}
                </div>
                <div>
                  <div className="text-xs font-semibold text-apple-text">{ws.name}</div>
                  <div className="text-[10px] text-apple-textTertiary font-mono">shard: idxdb_{ws.id}_sharded</div>
                </div>
              </div>

              <div className="flex items-center space-x-2 relative z-10">
                {ws.unread > 0 && (
                  <span className="flex items-center space-x-1 text-[10px] font-medium bg-red-500/15 text-red-300 px-2 py-0.5 rounded-full border border-red-500/25">
                    <Bell className="w-2.5 h-2.5" />
                    <span>{ws.unread}</span>
                  </span>
                )}
                {isActive && <Check className="w-4 h-4 text-apple-accent" />}
              </div>
            </button>
          );
        })}
      </div>

      <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-apple-textTertiary font-mono">
        <span>Memory Shard: <strong className="text-apple-text">0ms (IndexedDB)</strong></span>
        {switchLatency !== null && (
          <span className="text-emerald-400 font-semibold">{switchLatency}ms transition</span>
        )}
      </div>
    </div>
  );
};
