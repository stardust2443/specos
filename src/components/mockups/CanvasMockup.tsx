import { useState } from 'react';
import { MessageSquare, CheckSquare, Square, RefreshCw, ExternalLink, Users } from 'lucide-react';

interface Props {
  config: Record<string, any>;
}

export const CanvasMockup = ({ config }: Props) => {
  const [items, setItems] = useState<Array<{ id: string; text: string; done: boolean; ticket: string }>>(
    config.items || [
      { id: '1', text: 'Rollback auth-service to v2.4.1', done: true, ticket: 'ENG-401' },
      { id: '2', text: 'Invalidate leaked JWT signing tokens in Redis', done: true, ticket: 'ENG-402' },
      { id: '3', text: 'Draft customer post-mortem disclosure', done: false, ticket: 'ENG-403' }
    ]
  );

  const toggleItem = (id: string) => {
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  return (
    <div className="max-w-sm mx-auto glass-panel rounded-3xl p-6 shadow-2xl border border-white/10">
      {/* Top Handle */}
      <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />

      <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-4 h-4 text-apple-emerald" />
          <h4 className="text-xs font-mono font-semibold text-apple-text">
            {config.threadTitle || '#incident-sev1-auth-failure'}
          </h4>
        </div>

        <div className="flex items-center space-x-1.5 text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          <RefreshCw className="w-2.5 h-2.5 animate-spin" />
          <span>Yjs Synced</span>
        </div>
      </div>

      <div className="py-4 space-y-2.5">
        <div className="flex items-center justify-between text-[11px] font-mono text-apple-textTertiary">
          <span>Action Items Canvas</span>
          <div className="flex items-center space-x-1">
            <Users className="w-3 h-3 text-apple-accent" />
            <span>3 active peers</span>
          </div>
        </div>

        {items.map(item => (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.14] cursor-pointer transition-all apple-pressable"
          >
            <div className="flex items-center space-x-3">
              {item.done ? (
                <CheckSquare className="w-4 h-4 text-apple-emerald flex-shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-apple-textTertiary flex-shrink-0" />
              )}
              <span className={`text-xs ${item.done ? 'line-through text-apple-textTertiary' : 'text-apple-text'}`}>
                {item.text}
              </span>
            </div>

            <div className="flex items-center space-x-1 font-mono text-[10px] bg-white/[0.04] text-apple-accent px-2 py-0.5 rounded-md border border-white/[0.06]">
              <span>{item.ticket}</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-white/[0.06] text-right">
        <span className="text-[11px] text-apple-textTertiary">Two-way optimistic sync to Linear backlog</span>
      </div>
    </div>
  );
};
