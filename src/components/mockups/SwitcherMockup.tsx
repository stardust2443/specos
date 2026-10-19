import { useState } from 'react';
import { Layers, Check, Command, Bell } from 'lucide-react';

interface Props {
  config: Record<string, any>;
}

export const SwitcherMockup: React.FC<Props> = ({ config }) => {
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
    setSwitchLatency(elapsed || 14);
  };

  return (
    <div className="bg-[#121216] border border-[#222228] rounded-xl p-5 max-w-md mx-auto shadow-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-[#222228]">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-spec-accent" />
          <h4 className="text-sm font-medium text-white">Linear Workspace Switcher</h4>
        </div>
        <div className="flex items-center space-x-1.5 text-[11px] font-mono text-spec-textMuted bg-[#181820] px-2 py-0.5 rounded border border-[#282834]">
          <Command className="w-3 h-3" />
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
              className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                isActive
                  ? 'bg-spec-accent/15 border-spec-accent text-white shadow-sm'
                  : 'bg-[#16161D] border-[#222228] text-spec-textMuted hover:text-white hover:border-[#33333F]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-mono font-bold ${
                  isActive ? 'bg-spec-accent text-white' : 'bg-[#222228] text-spec-textMuted'
                }`}>
                  {idx + 1}
                </div>
                <div>
                  <div className="text-xs font-medium text-white">{ws.name}</div>
                  <div className="text-[10px] text-spec-textMuted font-mono">shard: idxdb_{ws.id}_sharded</div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {ws.unread > 0 && (
                  <span className="flex items-center space-x-1 text-[11px] font-medium bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30">
                    <Bell className="w-2.5 h-2.5" />
                    <span>{ws.unread}</span>
                  </span>
                )}
                {isActive && <Check className="w-4 h-4 text-spec-accent" />}
              </div>
            </button>
          );
        })}
      </div>

      <div className="pt-3 border-t border-[#222228] flex items-center justify-between text-xs text-spec-textMuted font-mono">
        <span>Active Memory Shard: <strong className="text-white">IndexedDB (0ms)</strong></span>
        {switchLatency !== null && (
          <span className="text-emerald-400 font-semibold">Switch Latency: {switchLatency}ms</span>
        )}
      </div>
    </div>
  );
};
