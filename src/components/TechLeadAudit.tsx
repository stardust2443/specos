import { ShieldAlert, Zap, Repeat, Ban, Undo2 } from 'lucide-react';
import { EdgeCase } from '../types/spec';

interface Props {
  edgeCases: EdgeCase[];
}

export const TechLeadAudit: React.FC<Props> = ({ edgeCases }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'concurrency':
        return <Zap className="w-3.5 h-3.5 text-amber-400" />;
      case 'idempotency':
        return <Repeat className="w-3.5 h-3.5 text-sky-400" />;
      case 'rate_limit':
        return <Ban className="w-3.5 h-3.5 text-red-400" />;
      case 'ux_recovery':
        return <Undo2 className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <ShieldAlert className="w-3.5 h-3.5 text-spec-accent" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'bg-red-500/15 text-red-400 border-red-500/30';
      case 'Medium':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Low':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/15 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="bg-[#121216] border border-[#222228] rounded-xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#222228]">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded bg-red-500/15 flex items-center justify-center text-red-400">
            <ShieldAlert className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Synthetic Tech Lead Audit</h3>
            <p className="text-[11px] text-spec-textMuted">Adversarial failure mode analysis</p>
          </div>
        </div>
        <span className="text-xs font-mono text-spec-textMuted bg-[#181820] px-2 py-0.5 rounded border border-[#282834]">
          {edgeCases.length} Vulnerabilities Flagged
        </span>
      </div>

      <div className="space-y-3">
        {edgeCases.map((ec) => (
          <div
            key={ec.id}
            className="p-3 bg-[#16161D] rounded-lg border border-[#222228] hover:border-[#33333F] transition-all space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getCategoryIcon(ec.category)}
                <span className="text-xs font-semibold text-white">{ec.title}</span>
              </div>
              <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${getSeverityBadge(ec.severity)}`}>
                {ec.severity}
              </span>
            </div>

            <div className="text-xs text-spec-textMuted bg-[#111115] p-2 rounded border border-[#1E1E24]">
              <span className="text-[10px] uppercase font-mono text-red-400 font-semibold block mb-0.5">Failure Scenario</span>
              {ec.scenario}
            </div>

            <div className="text-xs text-emerald-300 bg-emerald-950/20 p-2 rounded border border-emerald-900/30">
              <span className="text-[10px] uppercase font-mono text-emerald-400 font-semibold block mb-0.5">Architectural Mitigation</span>
              {ec.mitigation}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
