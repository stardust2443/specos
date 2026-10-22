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
    <div className="space-y-8">
      {/* Hero Title & North Star Metric */}
      <div className="glass-panel rounded-2xl p-7 sm:p-8 relative overflow-hidden">
        {/* Subtle Ambient Radial Highlight */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-apple-accent/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-apple-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-apple-accent"></span>
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-apple-accent font-semibold">
              Living Specification
            </span>
          </div>
          <span className="text-[11px] font-mono text-apple-textTertiary bg-apple-elevated px-3 py-1 rounded-full border border-apple-border">
            {spec.id}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-apple-text tracking-tight mb-5 leading-snug">
          {spec.title}
        </h1>

        {/* North Star KPI Card */}
        <div className="flex items-start space-x-4 p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md transition-transform duration-300 hover:scale-[1.005]">
          <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-300 font-semibold">
              Primary North Star Metric
            </div>
            <div className="text-base sm:text-lg font-semibold text-emerald-800 dark:text-emerald-200 mt-0.5">
              {spec.targetKpi}
            </div>
          </div>
        </div>
      </div>

      {/* Block: Problem Statement */}
      <div className="glass-panel rounded-2xl p-7 sm:p-8 relative group transition-all duration-300 hover:border-apple-borderHighlight">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-apple-amber/10 text-apple-amber">
              <AlertCircle className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-semibold uppercase tracking-wider font-mono text-apple-text">
              Problem Statement &amp; Strategic Context
            </h2>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCopy('problem', spec.problemStatement)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-xl bg-apple-elevated hover:bg-apple-hover text-apple-textSecondary hover:text-apple-text border border-apple-border shadow-sm"
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

        <p className="text-sm text-apple-textSecondary leading-relaxed font-sans max-w-3xl">
          {spec.problemStatement}
        </p>
      </div>

      {/* Block: User Journey & Persona Matrix */}
      <div className="glass-panel rounded-2xl p-7 sm:p-8 space-y-5">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-apple-accent/10 text-apple-accent">
            <Compass className="w-4 h-4" />
          </div>
          <h2 className="text-xs font-semibold uppercase tracking-wider font-mono text-apple-text">
            User Persona &amp; Journey Matrix
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-apple-elevated/50 border border-apple-border transition-transform duration-300 hover:-translate-y-0.5">
            <span className="text-[11px] font-mono uppercase text-apple-textTertiary font-medium">Target Persona</span>
            <p className="text-xs font-medium text-apple-text mt-2 leading-relaxed">{spec.userJourney.persona}</p>
          </div>
          <div className="p-4 rounded-xl bg-apple-elevated/50 border border-apple-border transition-transform duration-300 hover:-translate-y-0.5">
            <span className="text-[11px] font-mono uppercase text-apple-textTertiary font-medium">Entry Point</span>
            <p className="text-xs font-medium text-apple-text mt-2 leading-relaxed">{spec.userJourney.entryPoint}</p>
          </div>
          <div className="p-4 rounded-xl bg-apple-elevated/50 border border-apple-border transition-transform duration-300 hover:-translate-y-0.5">
            <span className="text-[11px] font-mono uppercase text-apple-textTertiary font-medium">Target Outcome</span>
            <p className="text-xs font-medium text-apple-text mt-2 leading-relaxed">{spec.userJourney.targetOutcome}</p>
          </div>
        </div>
      </div>

      {/* Block: Gherkin Acceptance Criteria (Interactive Test Runner) */}
      <div className="glass-panel rounded-2xl p-7 sm:p-8 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-apple-emerald/10 text-apple-emerald">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider font-mono text-apple-text">
                Acceptance Criteria (Gherkin Scenarios)
              </h2>
              <p className="text-[11px] text-apple-textTertiary mt-0.5">Interactive behavioral test runner</p>
            </div>
          </div>
          <span className="text-xs font-mono text-apple-textSecondary px-2.5 py-1 rounded-full bg-apple-elevated border border-apple-border">
            {spec.acceptanceCriteria.length} Scenarios
          </span>
        </div>

        <div className="space-y-3.5">
          {spec.acceptanceCriteria.map((ac, idx) => {
            const state = testStates[ac.id] || 'untested';
            return (
              <div
                key={ac.id}
                className="p-5 rounded-xl bg-apple-elevated/40 border border-apple-border hover:border-apple-borderHighlight transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-apple-text">
                    Scenario {idx + 1}: {ac.scenario}
                  </span>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRunTest(ac.id)}
                    className={`flex items-center space-x-1.5 text-[11px] font-mono px-3 py-1.5 rounded-lg border transition-all ${
                      state === 'verified'
                        ? 'bg-apple-emerald/15 border-apple-emerald/30 text-emerald-600 dark:text-emerald-300 font-medium shadow-sm'
                        : state === 'running'
                        ? 'bg-apple-accent/15 border-apple-accent/30 text-apple-accent font-medium'
                        : 'bg-apple-elevated border-apple-border text-apple-textSecondary hover:text-apple-text'
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

                <div className="text-xs font-mono space-y-2 p-3.5 rounded-xl bg-apple-elevated/80 border border-apple-border">
                  <div>
                    <span className="text-purple-600 dark:text-purple-400 font-semibold mr-2">GIVEN</span>
                    <span className="text-apple-textSecondary">{ac.given}</span>
                  </div>
                  <div>
                    <span className="text-sky-600 dark:text-sky-400 font-semibold mr-2">WHEN</span>
                    <span className="text-apple-textSecondary">{ac.when}</span>
                  </div>
                  <div>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold mr-2">THEN</span>
                    <span className="text-apple-text">{ac.then}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Block: Data Schema & Contract Diff (PROGRESSIVE DISCLOSURE COLLAPSIBLE) */}
      <div className="glass-panel rounded-2xl overflow-hidden transition-all">
        <button
          onClick={() => setShowSchema(prev => !prev)}
          className="w-full p-6 sm:p-7 flex items-center justify-between text-left hover:bg-apple-hover/50 transition-colors apple-pressable"
        >
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 rounded-xl bg-apple-purple/10 text-apple-purple flex-shrink-0">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h2 className="text-xs font-semibold uppercase tracking-wider font-mono text-apple-text">
                  Technical Architecture &amp; Database Schema
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-apple-elevated text-apple-textTertiary border border-apple-border">
                  {spec.dataSchemaDiff.length} Entities
                </span>
              </div>
              <p className="text-[11px] text-apple-textSecondary mt-0.5">
                {showSchema ? 'Click to collapse database migration contracts' : 'Click to inspect SQL tables, primary keys & migration diffs'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs text-apple-accent font-medium">
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
                  <div key={schema.entity} className="border border-apple-border rounded-xl overflow-hidden bg-apple-elevated/30">
                    <div className="px-4 py-3 bg-apple-elevated/60 border-b border-apple-border flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <span className="font-mono text-xs font-bold text-apple-text">{schema.entity}</span>
                        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-md font-semibold ${
                          schema.action === 'create'
                            ? 'bg-apple-emerald/15 text-emerald-600 dark:text-emerald-300 border border-apple-emerald/30'
                            : schema.action === 'modify'
                            ? 'bg-apple-amber/15 text-amber-600 dark:text-amber-300 border border-apple-amber/30'
                            : 'bg-apple-red/15 text-red-600 dark:text-red-300 border border-apple-red/30'
                        }`}>
                          {schema.action}
                        </span>
                      </div>
                      <span className="text-xs text-apple-textSecondary">{schema.description}</span>
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
                              <td className="py-2 text-apple-text font-semibold">{f.name}</td>
                              <td className="py-2 text-purple-600 dark:text-purple-300 text-[11px]">{f.type}</td>
                              <td className="py-2 text-apple-textSecondary text-[11px] font-sans">{f.description}</td>
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
