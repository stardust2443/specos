import { useState } from 'react';
import { Layers, Sparkles, CheckCircle2, Circle, Clock, Check, Download } from 'lucide-react';
import { LinearTicket, PriorityLevel } from '../types/spec';

interface Props {
  issues: LinearTicket[];
  onCopyLinearJson: () => void;
  copiedLinear: boolean;
}

type IssueStatus = 'backlog' | 'todo' | 'in_progress' | 'done';

export const LinearDrawer = ({ issues, onCopyLinearJson, copiedLinear }: Props) => {
  const [activeArea, setActiveArea] = useState<string>('All');
  const [issueStatuses, setIssueStatuses] = useState<Record<string, IssueStatus>>({});

  const cycleStatus = (id: string) => {
    const cycle: IssueStatus[] = ['backlog', 'todo', 'in_progress', 'done'];
    const current = issueStatuses[id] || 'todo';
    const nextIdx = (cycle.indexOf(current) + 1) % cycle.length;
    setIssueStatuses(prev => ({
      ...prev,
      [id]: cycle[nextIdx]
    }));
  };

  const getStatusIcon = (status: IssueStatus) => {
    switch (status) {
      case 'done':
        return <CheckCircle2 className="w-3.5 h-3.5 text-apple-emerald" />;
      case 'in_progress':
        return <Clock className="w-3.5 h-3.5 text-apple-amber" />;
      case 'todo':
        return <Circle className="w-3.5 h-3.5 text-apple-accent" />;
      default:
        return <Circle className="w-3.5 h-3.5 text-apple-textTertiary" />;
    }
  };

  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case 1:
        return { label: 'P1 Urgent', style: 'bg-red-500/15 text-red-400 border-red-500/30' };
      case 2:
        return { label: 'P2 High', style: 'bg-amber-500/15 text-amber-400 border-amber-500/30' };
      case 3:
        return { label: 'P3 Med', style: 'bg-blue-500/15 text-blue-400 border-blue-500/30' };
      default:
        return { label: 'P4 Low', style: 'bg-gray-500/15 text-gray-400 border-gray-500/30' };
    }
  };

  const areas = ['All', 'Backend', 'Frontend', 'Security', 'Infra'];
  const filteredIssues = activeArea === 'All'
    ? issues
    : issues.filter(i => i.area === activeArea);

  const totalPoints = issues.reduce((acc, curr) => acc + curr.estimate, 0);

  const downloadCsv = () => {
    const headers = ['Title', 'Priority', 'Estimate', 'Area', 'AcceptanceCriteria'];
    const rows = issues.map(i => [
      `"${i.title.replace(/"/g, '""')}"`,
      i.priority,
      i.estimate,
      i.area,
      `"${i.acceptanceCriteria.join('; ').replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `linear_issues_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-apple-purple/10 border border-apple-purple/20 flex items-center justify-center text-apple-purple">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-apple-text tracking-tight">Linear Sprints &amp; Issues</h3>
            <p className="text-[11px] text-apple-textTertiary">{issues.length} Issues • {totalPoints} Story Points</p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={downloadCsv}
            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-apple-textSecondary hover:text-white border border-white/[0.06] transition-all apple-pressable"
            title="Download Linear CSV"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={onCopyLinearJson}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-apple-purple/15 hover:bg-apple-purple/25 border border-apple-purple/30 text-purple-300 transition-all apple-pressable"
          >
            {copiedLinear ? <Check className="w-3.5 h-3.5 text-apple-emerald" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{copiedLinear ? 'Copied' : 'Export JSON'}</span>
          </button>
        </div>
      </div>

      {/* Area Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5">
        {areas.map((area) => (
          <button
            key={area}
            onClick={() => setActiveArea(area)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all apple-pressable ${
              activeArea === area
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-apple-textSecondary hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            {area}
          </button>
        ))}
      </div>

      {/* Issues List with Clickable Status State Machine */}
      <div className="space-y-2.5">
        {filteredIssues.map((issue) => {
          const priority = getPriorityBadge(issue.priority);
          const status = issueStatuses[issue.id] || 'todo';
          return (
            <div
              key={issue.id}
              className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all space-y-2.5 group"
            >
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-start space-x-2.5">
                  <button
                    onClick={() => cycleStatus(issue.id)}
                    className="mt-0.5 p-1 rounded-md hover:bg-white/10 transition-colors apple-pressable"
                    title={`Status: ${status} (click to cycle)`}
                  >
                    {getStatusIcon(status)}
                  </button>

                  <div>
                    <h4 className={`text-xs font-semibold leading-snug ${status === 'done' ? 'line-through text-apple-textSecondary' : 'text-apple-text'}`}>
                      {issue.title}
                    </h4>
                  </div>
                </div>

                <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-md border whitespace-nowrap ${priority.style}`}>
                  {priority.label}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 pl-6">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/[0.04] text-apple-textSecondary border border-white/[0.06]">
                    {issue.area}
                  </span>
                  <span className="text-[10px] font-mono text-apple-textTertiary">
                    {issue.estimate} pts
                  </span>
                </div>

                <span className="text-[10px] font-mono uppercase text-apple-textTertiary group-hover:text-apple-textSecondary">
                  {status}
                </span>
              </div>

              {/* Acceptance Criteria Sub-bullets */}
              <div className="text-[11px] text-apple-textSecondary space-y-1 pl-6 pt-1 border-t border-white/[0.04]">
                <ul className="list-disc list-inside space-y-0.5">
                  {issue.acceptanceCriteria.map((ac, idx) => (
                    <li key={idx} className="text-apple-textSecondary">{ac}</li>
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
