import { useState } from 'react';
import { motion } from 'motion/react';
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
    <div className="max-w-sm mx-auto apple-card rounded-3xl p-6 shadow-apple-md border border-apple-border">
      {/* Top Handle */}
      <div className="w-10 h-1 bg-apple-borderHighlight rounded-full mx-auto mb-5" />

      <div className="flex items-center justify-between pb-3.5 border-b border-apple-border">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-4 h-4 text-apple-emerald" />
          <h4 className="text-xs font-mono font-semibold text-apple-text">
            {config.threadTitle || '#incident-sev1-auth-failure'}
          </h4>
        </div>

        <div className="flex items-center space-x-1.5 text-[10px] text-apple-emerald font-mono bg-apple-emerald/10 px-2 py-0.5 rounded-full border border-apple-emerald/20 font-semibold">
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
          <motion.div
            key={item.id}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toggleItem(item.id)}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-apple-elevated/40 border border-apple-border hover:border-apple-borderHighlight cursor-pointer transition-all apple-pressable"
          >
            <div className="flex items-center space-x-3">
              {item.done ? (
                <motion.div
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 18, stiffness: 220 }}
                >
                  <CheckSquare className="w-4 h-4 text-apple-emerald flex-shrink-0" />
                </motion.div>
              ) : (
                <Square className="w-4 h-4 text-apple-textTertiary flex-shrink-0" />
              )}
              <span className={`text-xs ${item.done ? 'line-through text-apple-textTertiary' : 'text-apple-text font-medium'}`}>
                {item.text}
              </span>
            </div>

            <div className="flex items-center space-x-1 font-mono text-[10px] bg-apple-surface text-apple-accent px-2 py-0.5 rounded-md border border-apple-border font-semibold">
              <span>{item.ticket}</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="pt-3 border-t border-apple-border text-right">
        <span className="text-[11px] text-apple-textTertiary">Two-way optimistic sync to Linear backlog</span>
      </div>
    </div>
  );
};
