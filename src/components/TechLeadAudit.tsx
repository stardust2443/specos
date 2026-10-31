import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Zap, Repeat, Ban, Undo2, Check, AlertTriangle, ShieldCheck } from 'lucide-react';
import { EdgeCase } from '../types/spec';

interface Props {
  edgeCases: EdgeCase[];
}

export const TechLeadAudit = ({ edgeCases }: Props) => {
  const [filterSeverity, setFilterSeverity] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [mitigatedIds, setMitigatedIds] = useState<Record<string, boolean>>({});

  const toggleMitigated = (id: string) => {
    setMitigatedIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'concurrency':
        return <Zap className="w-4 h-4 text-apple-amber" />;
      case 'idempotency':
        return <Repeat className="w-4 h-4 text-apple-accent" />;
      case 'rate_limit':
        return <Ban className="w-4 h-4 text-apple-red" />;
      case 'ux_recovery':
        return <Undo2 className="w-4 h-4 text-apple-purple" />;
      default:
        return <ShieldAlert className="w-4 h-4 text-apple-accent" />;
    }
  };

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'bg-apple-red/15 text-apple-red border-apple-red/30';
      case 'Medium':
        return 'bg-apple-amber/15 text-apple-amber border-apple-amber/30';
      case 'Low':
        return 'bg-apple-accent/15 text-apple-accent border-apple-accent/30';
      default:
        return 'bg-apple-elevated text-apple-textSecondary border-apple-border';
    }
  };

  const filteredCases = filterSeverity === 'All'
    ? edgeCases
    : edgeCases.filter(ec => ec.severity === filterSeverity);

  const mitigatedCount = Object.values(mitigatedIds).filter(Boolean).length;

  return (
    <div className="apple-card rounded-3xl p-7 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-apple-border">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-apple-amber/15 border border-apple-amber/25 flex items-center justify-center text-apple-amber shadow-apple-subtle">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-semibold text-apple-text tracking-tight">Synthetic Tech Lead Audit</h3>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-apple-elevated text-apple-textSecondary border border-apple-border">
                {mitigatedCount}/{edgeCases.length} Mitigated
              </span>
            </div>
            <p className="text-xs text-apple-textTertiary mt-0.5">Adversarial failure mode scanner &amp; distributed edge-case defense</p>
          </div>
        </div>

        {/* Severity Filter Pills with Gliding Motion Indicator */}
        <div className="flex items-center space-x-1 bg-apple-elevated/70 p-1 rounded-xl border border-apple-border self-start sm:self-auto">
          {(['All', 'High', 'Medium', 'Low'] as const).map((sev) => {
            const isActive = filterSeverity === sev;
            return (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-mono transition-colors apple-pressable min-h-[30px] ${
                  isActive ? 'text-apple-text font-semibold' : 'text-apple-textTertiary hover:text-apple-textSecondary'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeAuditFilterPill"
                    className="absolute inset-0 rounded-lg bg-white dark:bg-apple-surface shadow-apple-subtle border border-black/[0.08] dark:border-white/[0.12]"
                    transition={{ type: 'spring', damping: 26, stiffness: 220 }}
                  />
                )}
                <span className="relative z-10">{sev}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Vulnerability Cards */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredCases.map((ec) => {
            const isMitigated = !!mitigatedIds[ec.id];
            return (
              <motion.div
                key={ec.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ type: 'spring', damping: 28, stiffness: 150 }}
                whileHover={{ y: -2, transition: { duration: 0.15 } }}
                className={`p-5 rounded-2xl border transition-all duration-300 space-y-4 ${
                  isMitigated
                    ? 'bg-apple-elevated/20 border-apple-border opacity-70'
                    : 'bg-white dark:bg-[#161719] border-apple-border hover:border-apple-borderHighlight shadow-apple-subtle'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-xl bg-apple-elevated border border-apple-border shadow-apple-subtle">
                      {getCategoryIcon(ec.category)}
                    </div>
                    <div>
                      <span className={`text-sm font-semibold tracking-tight ${isMitigated ? 'line-through text-apple-textSecondary' : 'text-apple-text'}`}>
                        {ec.title}
                      </span>
                      <div className="text-[11px] font-mono text-apple-textTertiary uppercase mt-0.5">
                        Category: {ec.category.replace('_', ' ')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2.5 flex-shrink-0">
                    <span className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-lg border font-semibold ${getSeverityStyle(ec.severity)}`}>
                      {ec.severity}
                    </span>
                    
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => toggleMitigated(ec.id)}
                      className={`p-2 rounded-xl border transition-all apple-pressable min-h-[32px] min-w-[32px] flex items-center justify-center ${
                        isMitigated
                          ? 'bg-apple-emerald/20 border-apple-emerald text-apple-emerald shadow-apple-subtle'
                          : 'bg-apple-elevated border-apple-border text-apple-textTertiary hover:text-apple-text hover:border-apple-borderHighlight'
                      }`}
                      title={isMitigated ? 'Mark as Unmitigated' : 'Mark as Mitigated'}
                    >
                      {isMitigated ? (
                        <motion.div
                          key="checked"
                          initial={{ scale: 0.4, rotate: -25 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', damping: 18, stiffness: 240 }}
                        >
                          <Check className="w-4 h-4" />
                        </motion.div>
                      ) : (
                        <Check className="w-4 h-4 opacity-40" />
                      )}
                    </motion.button>
                  </div>
                </div>

                {/* Scenario & Risk */}
                <div className="text-xs text-apple-textSecondary bg-rose-500/[0.06] p-4 rounded-xl border border-rose-500/15 space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-apple-red">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span className="text-[10px] uppercase font-mono font-semibold tracking-wider">
                      Potential Production Vulnerability
                    </span>
                  </div>
                  <p className="leading-relaxed pl-5 font-sans">{ec.scenario}</p>
                </div>

                {/* Architectural Mitigation */}
                <div className="text-xs text-apple-text bg-emerald-500/[0.06] p-4 rounded-xl border border-emerald-500/15 space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-apple-emerald">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="text-[10px] uppercase font-mono font-semibold tracking-wider">
                      Prescribed Architectural Defense
                    </span>
                  </div>
                  <p className="leading-relaxed pl-5 font-sans text-apple-text">{ec.mitigation}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
