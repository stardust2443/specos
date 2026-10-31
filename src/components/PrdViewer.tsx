import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, AlertCircle, Compass, CheckSquare, Database, Check, Copy, Play, CheckCircle2, ChevronDown, Loader2 } from 'lucide-react';
import { SpecDocument } from '../types/spec';

interface Props {
  spec: SpecDocument;
}

type TestState = 'untested' | 'running' | 'verified';

export const PrdViewer = ({ spec }: Props) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [showSchema, setShowSchema] = useState(false);
  const [testStates, setTestStates] = useState<Record<string, TestState>>({
    'ac-1': 'verified',
  });

  const handleRunTest = (id: string) => {
    if (testStates[id] === 'running') return;
    if (testStates[id] === 'verified') {
      setTestStates(prev => ({ ...prev, [id]: 'untested' }));
      return;
    }
    setTestStates(prev => ({ ...prev, [id]: 'running' }));
    setTimeout(() => {
      setTestStates(prev => ({ ...prev, [id]: 'verified' }));
    }, 450);
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Hero Title & North Star Metric */}
      <div className="apple-card rounded-3xl p-7 sm:p-8 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-apple-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-apple-accent"></span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-apple-accent">
              Living Specification
            </span>
          </div>
          <span className="text-[11px] font-mono text-apple-textTertiary bg-apple-elevated px-2.5 py-0.5 rounded-full border border-apple-border">
            {spec.id}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-apple-text tracking-tight leading-snug">
          {spec.title}
        </h1>

        {/* North Star KPI Card (Apple Callout Container) */}
        <div className="flex items-start space-x-4 p-5 rounded-2xl bg-apple-elevated/70 dark:bg-apple-elevated/40 border border-apple-border transition-colors">
          <div className="p-2.5 rounded-xl bg-apple-emerald/15 text-apple-emerald flex-shrink-0 mt-0.5 shadow-apple-subtle">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-apple-emerald">
              Primary North Star Metric
            </div>
            <div className="text-base sm:text-lg font-semibold text-apple-text mt-0.5 tracking-tight">
              {spec.targetKpi}
            </div>
          </div>
        </div>
      </div>

      {/* Block: Problem Statement & Strategic Context */}
      <div className="apple-card rounded-3xl p-7 sm:p-8 relative group transition-all duration-300 hover:border-apple-borderHighlight">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-apple-amber/15 text-apple-amber">
              <AlertCircle className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-semibold text-apple-text tracking-tight">
              Problem Statement &amp; Strategic Context
            </h2>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCopy('problem', spec.problemStatement)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-xl bg-apple-elevated hover:bg-apple-hover text-apple-textSecondary hover:text-apple-text border border-apple-border shadow-apple-subtle apple-pressable min-h-[32px] min-w-[32px] flex items-center justify-center"
            title="Copy section"
          >
            {copiedSection === 'problem' ? (
              <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 20, stiffness: 300 }}>
                <Check className="w-3.5 h-3.5 text-apple-emerald" />
              </motion.div>
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </motion.button>
        </div>

        <p className="text-sm text-apple-textSecondary leading-relaxed max-w-3xl font-sans">
          {spec.problemStatement}
        </p>
      </div>

      {/* Block: User Persona & Journey Matrix */}
      <div className="apple-card rounded-3xl p-7 sm:p-8 space-y-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-apple-accent/15 text-apple-accent">
            <Compass className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-semibold text-apple-text tracking-tight">
            User Persona &amp; Journey Matrix
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div className="p-4 rounded-2xl bg-apple-elevated/50 dark:bg-apple-elevated/30 border border-apple-border transition-transform duration-200 hover:-translate-y-0.5">
            <span className="text-[11px] font-semibold text-apple-textTertiary uppercase tracking-wider">Target Persona</span>
            <p className="text-xs font-semibold text-apple-text mt-1.5 leading-relaxed">{spec.userJourney.persona}</p>
          </div>
          <div className="p-4 rounded-2xl bg-apple-elevated/50 dark:bg-apple-elevated/30 border border-apple-border transition-transform duration-200 hover:-translate-y-0.5">
            <span className="text-[11px] font-semibold text-apple-textTertiary uppercase tracking-wider">Entry Point</span>
            <p className="text-xs font-semibold text-apple-text mt-1.5 leading-relaxed">{spec.userJourney.entryPoint}</p>
          </div>
          <div className="p-4 rounded-2xl bg-apple-elevated/50 dark:bg-apple-elevated/30 border border-apple-border transition-transform duration-200 hover:-translate-y-0.5">
            <span className="text-[11px] font-semibold text-apple-textTertiary uppercase tracking-wider">Target Outcome</span>
            <p className="text-xs font-semibold text-apple-text mt-1.5 leading-relaxed">{spec.userJourney.targetOutcome}</p>
          </div>
        </div>
      </div>

      {/* Block: Gherkin Acceptance Criteria (Interactive Test Runner) */}
      <div className="apple-card rounded-3xl p-7 sm:p-8 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-apple-emerald/15 text-apple-emerald">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-apple-text tracking-tight">
                Acceptance Criteria (Gherkin Scenarios)
              </h2>
              <p className="text-xs text-apple-textTertiary mt-0.5">Interactive behavioral test runner &amp; acceptance criteria</p>
            </div>
          </div>
          <span className="text-xs font-medium text-apple-textSecondary px-2.5 py-1 rounded-full bg-apple-elevated border border-apple-border">
            {spec.acceptanceCriteria.length} Scenarios
          </span>
        </div>

        <div className="space-y-3.5">
          {spec.acceptanceCriteria.map((ac, idx) => {
            const state = testStates[ac.id] || 'untested';
            return (
              <div
                key={ac.id}
                className="p-5 rounded-2xl bg-apple-elevated/40 dark:bg-apple-elevated/20 border border-apple-border hover:border-apple-borderHighlight transition-all space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-apple-text">
                    Scenario {idx + 1}: {ac.scenario}
                  </span>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRunTest(ac.id)}
                    className={`flex items-center space-x-1.5 text-[11px] font-mono px-3 py-1.5 rounded-xl border transition-all apple-pressable min-h-[30px] ${
                      state === 'verified'
                        ? 'bg-apple-emerald/15 border-apple-emerald/30 text-apple-emerald font-semibold shadow-apple-subtle'
                        : state === 'running'
                        ? 'bg-apple-accent/15 border-apple-accent/30 text-apple-accent font-semibold'
                        : 'bg-white dark:bg-apple-surface border-apple-border text-apple-textSecondary hover:text-apple-text shadow-apple-subtle'
                    }`}
                  >
                    {state === 'verified' ? (
                      <motion.div
                        initial={{ scale: 0.6, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 220 }}
                        className="flex items-center space-x-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-apple-emerald" />
                        <span>Verified</span>
                      </motion.div>
                    ) : state === 'running' ? (
                      <div className="flex items-center space-x-1.5">
                        <Loader2 className="w-3 h-3 animate-spin text-apple-accent" />
                        <span>Asserting...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1.5">
                        <Play className="w-3 h-3" />
                        <span>Run Test</span>
                      </div>
                    )}
                  </motion.button>
                </div>

                <div className="text-xs font-mono space-y-2 p-3.5 rounded-xl bg-white dark:bg-[#151618] border border-apple-border">
                  <div className="leading-relaxed">
                    <span className="text-apple-purple font-semibold mr-2">GIVEN</span>
                    <span className="text-apple-textSecondary">{ac.given}</span>
                  </div>
                  <div className="leading-relaxed">
                    <span className="text-apple-accent font-semibold mr-2">WHEN</span>
                    <span className="text-apple-textSecondary">{ac.when}</span>
                  </div>
                  <div className="leading-relaxed">
                    <span className="text-apple-emerald font-semibold mr-2">THEN</span>
                    <span className="text-apple-text font-medium">{ac.then}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Block: Data Schema & Contract Diff (PROGRESSIVE DISCLOSURE COLLAPSIBLE) */}
      <div className="apple-card rounded-3xl overflow-hidden transition-all">
        <button
          onClick={() => setShowSchema(prev => !prev)}
          className="w-full p-6 sm:p-7 flex items-center justify-between text-left hover:bg-apple-hover/40 transition-colors apple-pressable"
        >
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 rounded-xl bg-apple-purple/15 text-apple-purple flex-shrink-0">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h2 className="text-sm font-semibold text-apple-text tracking-tight">
                  Technical Architecture &amp; Database Schema
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-apple-elevated text-apple-textSecondary border border-apple-border">
                  {spec.dataSchemaDiff.length} Entities
                </span>
              </div>
              <p className="text-xs text-apple-textTertiary mt-0.5">
                {showSchema ? 'Click to collapse database migration contracts' : 'Click to inspect SQL tables, primary keys & migration diffs'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 text-xs text-apple-accent font-semibold">
            <span>{showSchema ? 'Hide Contracts' : 'View Contracts'}</span>
            <motion.div animate={{ rotate: showSchema ? 180 : 0 }} transition={{ duration: 0.25 }}>
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </div>
        </button>

        <AnimatePresence>
          {showSchema && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="px-7 pb-7 pt-2 space-y-4 border-t border-apple-border">
                {spec.dataSchemaDiff.map((schema) => (
                  <div key={schema.entity} className="border border-apple-border rounded-2xl overflow-hidden bg-white dark:bg-[#17181A]">
                    <div className="px-4 py-3 bg-apple-elevated/60 dark:bg-apple-elevated/40 border-b border-apple-border flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <span className="font-mono text-xs font-bold text-apple-text">{schema.entity}</span>
                        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-md font-semibold ${
                          schema.action === 'create'
                            ? 'bg-apple-emerald/15 text-apple-emerald border border-apple-emerald/30'
                            : schema.action === 'modify'
                            ? 'bg-apple-amber/15 text-apple-amber border border-apple-amber/30'
                            : 'bg-apple-red/15 text-apple-red border border-apple-red/30'
                        }`}>
                          {schema.action}
                        </span>
                      </div>
                      <span className="text-xs text-apple-textSecondary font-sans">{schema.description}</span>
                    </div>

                    <div className="p-3 overflow-x-auto">
                      <table className="w-full text-left font-mono text-xs">
                        <thead>
                          <tr className="text-apple-textTertiary border-b border-apple-border">
                            <th className="pb-2 font-medium">Field</th>
                            <th className="pb-2 font-medium">Type</th>
                            <th className="pb-2 font-medium">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-apple-border">
                          {schema.fields.map((f) => (
                            <tr key={f.name} className="hover:bg-apple-hover/30">
                              <td className="py-2.5 text-apple-text font-semibold">{f.name}</td>
                              <td className="py-2.5 text-apple-purple text-[11px]">{f.type}</td>
                              <td className="py-2.5 text-apple-textSecondary text-[11px] font-sans">{f.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
