import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
        return <CheckCircle2 className="w-4 h-4 text-apple-emerald" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-apple-amber" />;
      case 'todo':
        return <Circle className="w-4 h-4 text-apple-accent" />;
      default:
        return <Circle className="w-4 h-4 text-apple-textTertiary" />;
    }
  };

  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case 1:
        return { label: 'P1 Urgent', style: 'bg-red-500/15 text-red-500 dark:text-red-400 border-red-500/30' };
      case 2:
        return { label: 'P2 High', style: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30' };
      case 3:
        return { label: 'P3 Med', style: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30' };
      default:
        return { label: 'P4 Low', style: 'bg-gray-500/15 text-gray-500 dark:text-gray-400 border-gray-500/30' };
    }
  };

  const areas = ['All', 'Backend', 'Frontend', 'Security', 'Infra'];
  const filteredIssues = activeArea === 'All'
    ? issues
    : issues.filter(i => i.area === activeArea);

  const totalPoints = issues.reduce((acc, curr) => acc + curr.estimate, 0);

  const statusCounts = issues.reduce((acc, curr) => {
    const s = issueStatuses[curr.id] || 'todo';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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
    <div className="glass-panel rounded-2xl p-7 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-apple-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-apple-purple/10 border border-apple-purple/20 flex items-center justify-center text-apple-purple shadow-apple-sm">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-semibold text-apple-text tracking-tight">Linear Sprints &amp; Tickets</h3>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-apple-elevated text-apple-textSecondary border border-apple-border">
                {issues.length} Issues • {totalPoints} Story Pts
              </span>
            </div>
            <p className="text-xs text-apple-textTertiary mt-0.5">Automated decomposition with Fibonacci sizing &amp; Gherkin criteria</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            onClick={downloadCsv}
            className="p-2 rounded-xl bg-apple-surface hover:bg-apple-hover text-apple-textSecondary hover:text-apple-text border border-apple-border transition-colors shadow-apple-sm"
            title="Download Linear CSV"
          >
            <Download className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={onCopyLinearJson}
            className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-apple-purple/15 hover:bg-apple-purple/25 border border-apple-purple/30 text-purple-600 dark:text-purple-300 transition-colors shadow-apple-sm"
          >
            {copiedLinear ? (
              <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 18, stiffness: 220 }}>
                <Check className="w-4 h-4 text-apple-emerald" />
              </motion.div>
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>{copiedLinear ? 'Copied' : 'Export JSON'}</span>
          </motion.button>
        </div>
      </div>

      {/* Progress Breakdown & Area Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Area Filter Tabs with Gliding Indicator */}
        <div className="flex flex-wrap items-center gap-1 bg-apple-elevated/80 p-1 rounded-xl border border-apple-border">
          {areas.map((area) => {
            const isActive = activeArea === area;
            return (
              <button
                key={area}
                onClick={() => setActiveArea(area)}
                className={`relative px-3 py-1 rounded-lg text-xs font-medium transition-colors apple-pressable ${
                  isActive ? 'text-apple-accent dark:text-apple-text font-semibold' : 'text-apple-textSecondary hover:text-apple-text'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeLinearAreaPill"
                    className="absolute inset-0 rounded-lg bg-white dark:bg-apple-surface shadow-apple-sm border border-apple-accent/30 dark:border-apple-border"
                    transition={{ type: 'spring', damping: 26, stiffness: 160 }}
                  />
                )}
                <span className="relative z-10">{area}</span>
              </button>
            );
          })}
        </div>

        {/* Status Micro-Stats */}
        <div className="flex items-center space-x-3 text-[11px] font-mono text-apple-textTertiary">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-apple-accent"></span>
            <span>{statusCounts['todo'] || 0} Todo</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-apple-amber"></span>
            <span>{statusCounts['in_progress'] || 0} In Dev</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-apple-emerald"></span>
            <span>{statusCounts['done'] || 0} Shipped</span>
          </span>
        </div>
      </div>

      {/* Issues List with Clickable Status State Machine */}
      <div className="space-y-3.5">
        <AnimatePresence mode="popLayout">
          {filteredIssues.map((issue) => {
            const priority = getPriorityBadge(issue.priority);
            const status = issueStatuses[issue.id] || 'todo';
            return (
              <motion.div
                key={issue.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ type: 'spring', damping: 28, stiffness: 150 }}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
                className="p-5 rounded-2xl bg-apple-elevated/40 border border-apple-border hover:border-apple-borderHighlight shadow-apple-sm transition-all duration-300 space-y-3 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.85, rotate: 15 }}
                      onClick={() => cycleStatus(issue.id)}
                      className="mt-0.5 p-1 rounded-lg hover:bg-apple-hover transition-colors apple-pressable"
                      title={`Status: ${status} (click to cycle)`}
                    >
                      <motion.div
                        key={status}
                        initial={{ scale: 0.5, rotate: -30 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', damping: 18, stiffness: 220 }}
                      >
                        {getStatusIcon(status)}
                      </motion.div>
                    </motion.button>

                    <div>
                      <h4 className={`text-sm font-semibold leading-snug tracking-tight ${status === 'done' ? 'line-through text-apple-textTertiary' : 'text-apple-text'}`}>
                        {issue.title}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-apple-surface text-apple-textSecondary border border-apple-border">
                          {issue.area}
                        </span>
                        <span className="text-[11px] font-mono text-apple-textTertiary">
                          {issue.estimate} Story Pts
                        </span>
                        <span className="text-apple-textTertiary">•</span>
                        <span className="text-[10px] font-mono uppercase text-apple-accent font-medium">
                          {status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-lg border whitespace-nowrap font-medium ${priority.style}`}>
                    {priority.label}
                  </span>
                </div>

                {/* Acceptance Criteria Sub-bullets */}
                <div className="text-xs text-apple-textSecondary space-y-1.5 pl-8 pt-2.5 border-t border-apple-border">
                  <div className="text-[10px] uppercase font-mono text-apple-textTertiary font-medium tracking-wider">
                    Acceptance Criteria:
                  </div>
                  <ul className="list-disc list-inside space-y-1">
                    {issue.acceptanceCriteria.map((ac, idx) => (
                      <li key={idx} className="leading-relaxed text-apple-textSecondary">{ac}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
