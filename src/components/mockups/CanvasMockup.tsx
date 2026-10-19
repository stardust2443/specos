import { useState } from 'react';
import { MessageSquare, CheckSquare, Square, RefreshCw, ExternalLink } from 'lucide-react';

interface Props {
  config: Record<string, any>;
}

export const CanvasMockup: React.FC<Props> = ({ config }) => {
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
    <div className="bg-[#121216] border border-[#222228] rounded-xl p-5 max-w-md mx-auto shadow-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-[#222228]">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-4 h-4 text-emerald-400" />
          <h4 className="text-xs font-mono font-medium text-white">{config.threadTitle || '#incident-sev1-auth-failure'}</h4>
        </div>
        <div className="flex items-center space-x-1 text-[11px] text-emerald-400 font-mono">
          <RefreshCw className="w-3 h-3 animate-spin" />
          <span>Yjs CRDT Synced</span>
        </div>
      </div>

      <div className="py-4 space-y-2.5">
        <div className="text-[11px] font-mono uppercase tracking-wider text-spec-textMuted">Live Action Items Canvas:</div>
        {items.map(item => (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className="flex items-center justify-between p-2.5 rounded-lg bg-[#16161D] border border-[#222228] hover:border-[#33333F] cursor-pointer transition-all"
          >
            <div className="flex items-center space-x-2.5">
              {item.done ? (
                <CheckSquare className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-spec-textMuted flex-shrink-0" />
              )}
              <span className={`text-xs ${item.done ? 'line-through text-spec-textMuted' : 'text-white'}`}>
                {item.text}
              </span>
            </div>

            <div className="flex items-center space-x-1.5 font-mono text-[10px] bg-[#1E1E26] text-spec-accent px-2 py-0.5 rounded border border-[#2B2B38]">
              <span>{item.ticket}</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-[#222228] text-right">
        <span className="text-[11px] text-spec-textMuted">Click items to toggle Linear two-way state</span>
      </div>
    </div>
  );
};
