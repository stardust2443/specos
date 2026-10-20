import { useState } from 'react';
import { ShieldAlert, Zap, Repeat, Ban, Undo2, Check } from 'lucide-react';
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
        return <Zap className="w-3.5 h-3.5 text-apple-amber" />;
      case 'idempotency':
        return <Repeat className="w-3.5 h-3.5 text-apple-accent" />;
      case 'rate_limit':
        return <Ban className="w-3.5 h-3.5 text-apple-red" />;
      case 'ux_recovery':
        return <Undo2 className="w-3.5 h-3.5 text-apple-purple" />;
      default:
        return <ShieldAlert className="w-3.5 h-3.5 text-apple-accent" />;
    }
  };

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'bg-red-500/10 text-red-400 border-red-500/25';
      case 'Medium':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/25';
      case 'Low':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/25';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/25';
    }
  };

  const filteredCases = filterSeverity === 'All'
    ? edgeCases
    : edgeCases.filter(ec => ec.severity === filterSeverity);

  return (
    <div className="glass-panel rounded-2xl p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-apple-red/10 border border-apple-red/20 flex items-center justify-center text-apple-red">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-apple-text tracking-tight">Synthetic Tech Lead Audit</h3>
            <p className="text-[11px] text-apple-textTertiary">Adversarial failure mode scanner</p>
          </div>
        </div>

        {/* Severity Filter Pills */}
        <div className="flex items-center space-x-1 bg-black/40 p-1 rounded-xl border border-white/[0.06]">
          {(['All', 'High', 'Medium', 'Low'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-mono transition-all apple-pressable ${
                filterSeverity === sev
                  ? 'bg-white/15 text-white font-semibold'
                  : 'text-apple-textTertiary hover:text-apple-textSecondary'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Vulnerability Cards */}
      <div className="space-y-3">
        {filteredCases.map((ec) => {
          const isMitigated = !!mitigatedIds[ec.id];
          return (
            <div
              key={ec.id}
              className={`p-4 rounded-xl border transition-all space-y-3 ${
                isMitigated
                  ? 'bg-white/[0.01] border-white/[0.04] opacity-60'
                  : 'bg-white/[0.02] border-white/[0.08] hover:border-white/[0.14]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <div className="p-1 rounded-md bg-white/[0.04]">
                    {getCategoryIcon(ec.category)}
                  </div>
                  <span className={`text-xs font-semibold ${isMitigated ? 'line-through text-apple-textSecondary' : 'text-apple-text'}`}>
                    {ec.title}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-md border ${getSeverityStyle(ec.severity)}`}>
                    {ec.severity}
                  </span>
                  
                  <button
                    onClick={() => toggleMitigated(ec.id)}
                    className={`p-1 rounded-md border transition-all apple-pressable ${
                      isMitigated
                        ? 'bg-apple-emerald/20 border-apple-emerald text-apple-emerald'
                        : 'bg-white/[0.04] border-white/10 text-apple-textTertiary hover:text-white'
                    }`}
                    title={isMitigated ? 'Mark as Unmitigated' : 'Mark as Mitigated'}
                  >
                    <Check className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Scenario */}
              <div className="text-xs text-apple-textSecondary bg-black/40 p-3 rounded-lg border border-white/[0.04] space-y-1">
                <span className="text-[10px] uppercase font-mono text-apple-red font-semibold block tracking-wider">
                  Failure Vector
                </span>
                <p className="leading-relaxed">{ec.scenario}</p>
              </div>

              {/* Architectural Mitigation */}
              <div className="text-xs text-emerald-300 bg-emerald-950/20 p-3 rounded-lg border border-emerald-500/20 space-y-1">
                <span className="text-[10px] uppercase font-mono text-emerald-400 font-semibold block tracking-wider">
                  Prescribed Architectural Mitigation
                </span>
                <p className="leading-relaxed font-sans">{ec.mitigation}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
