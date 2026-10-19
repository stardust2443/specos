import { Layers, Sparkles, CheckCircle2 } from 'lucide-react';
import { LinearTicket, PriorityLevel } from '../types/spec';

interface Props {
  issues: LinearTicket[];
  onCopyLinearJson: () => void;
  copiedLinear: boolean;
}

export const LinearDrawer: React.FC<Props> = ({ issues, onCopyLinearJson, copiedLinear }) => {
  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case 1:
        return { label: 'P1 Urgent', style: 'bg-red-500/20 text-red-400 border-red-500/30' };
      case 2:
        return { label: 'P2 High', style: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
      case 3:
        return { label: 'P3 Med', style: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
      default:
        return { label: 'P4 Low', style: 'bg-gray-500/20 text-gray-400 border-gray-500/30' };
    }
  };

  const getAreaColor = (area: string) => {
    switch (area) {
      case 'Backend':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'Frontend':
        return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
      case 'Security':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'Infra':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <div className="bg-[#121216] border border-[#222228] rounded-xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#222228]">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded bg-spec-accent/20 flex items-center justify-center text-spec-accent">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Linear Issue Decomposition</h3>
            <p className="text-[11px] text-spec-textMuted">Auto-generated sprint backlog</p>
          </div>
        </div>

        <button
          onClick={onCopyLinearJson}
          className="flex items-center space-x-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-spec-accent/15 border border-spec-accent/40 text-spec-accent hover:bg-spec-accent/25 transition-all"
        >
          {copiedLinear ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Sparkles className="w-3.5 h-3.5" />}
          <span>{copiedLinear ? 'Copied!' : 'Export JSON'}</span>
        </button>
      </div>

      <div className="space-y-3">
        {issues.map((issue) => {
          const priority = getPriorityBadge(issue.priority);
          return (
            <div
              key={issue.id}
              className="p-3 bg-[#16161D] rounded-lg border border-[#222228] hover:border-[#33333F] transition-all space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-semibold text-white leading-snug">
                  {issue.title}
                </span>
                <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border whitespace-nowrap ${priority.style}`}>
                  {priority.label}
                </span>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${getAreaColor(issue.area)}`}>
                  {issue.area}
                </span>
                <span className="text-[10px] font-mono text-spec-textMuted bg-[#111115] px-2 py-0.5 rounded border border-[#1E1E24]">
                  {issue.estimate} pts
                </span>
              </div>

              <div className="text-[11px] text-spec-textMuted space-y-1 pt-1 border-t border-[#222228]/60">
                <span className="text-[10px] uppercase font-mono text-spec-textMuted block">Acceptance Criteria:</span>
                <ul className="list-disc list-inside space-y-0.5">
                  {issue.acceptanceCriteria.map((ac, idx) => (
                    <li key={idx} className="text-neutral-300">{ac}</li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
