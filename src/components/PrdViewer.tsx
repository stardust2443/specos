import { useState } from 'react';
import { Target, AlertCircle, Compass, CheckSquare, Database, Check, Copy, Play, CheckCircle2 } from 'lucide-react';
import { SpecDocument } from '../types/spec';

interface Props {
  spec: SpecDocument;
}

export const PrdViewer = ({ spec }: Props) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [verifiedScenarios, setVerifiedScenarios] = useState<Record<string, boolean>>({
    'ac-1': true,
  });

  const toggleScenarioVerification = (id: string) => {
    setVerifiedScenarios(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Hero Title & North Star Metric */}
      <div className="glass-panel rounded-2xl p-6 sm:p-7 relative overflow-hidden">
        {/* Subtle Ambient Radial Highlight */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-apple-accent/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-apple-accent animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-apple-accent font-semibold">
              Living Specification
            </span>
          </div>
          <span className="text-[11px] font-mono text-apple-textTertiary bg-white/[0.04] px-2.5 py-0.5 rounded-full border border-white/[0.06]">
            {spec.id}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-apple-text tracking-tight mb-4">
          {spec.title}
        </h1>

        {/* North Star KPI Card */}
        <div className="flex items-start space-x-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
          <div className="p-2 rounded-lg bg-apple-emerald/10 text-apple-emerald flex-shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-apple-textSecondary">
              Primary North Star Metric
            </div>
            <div className="text-sm sm:text-base font-semibold text-emerald-300 mt-0.5">
              {spec.targetKpi}
            </div>
          </div>
        </div>
      </div>

      {/* Block: Problem Statement */}
      <div className="glass-panel rounded-2xl p-6 relative group">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-apple-amber/10 text-apple-amber">
              <AlertCircle className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-semibold uppercase tracking-wider font-mono text-apple-text">
              Problem Statement &amp; Market Context
            </h2>
          </div>

          <button
            onClick={() => handleCopy('problem', spec.problemStatement)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/10 text-apple-textSecondary hover:text-white"
            title="Copy section"
          >
            {copiedSection === 'problem' ? <Check className="w-3.5 h-3.5 text-apple-emerald" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        <p className="text-sm text-apple-textSecondary leading-relaxed font-sans">
          {spec.problemStatement}
        </p>
      </div>

      {/* Block: User Journey & Persona Matrix */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center space-x-2 mb-4">
          <div className="p-1.5 rounded-lg bg-apple-accent/10 text-apple-accent">
            <Compass className="w-4 h-4" />
          </div>
          <h2 className="text-xs font-semibold uppercase tracking-wider font-mono text-apple-text">
            User Persona &amp; Journey Matrix
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[11px] font-mono uppercase text-apple-textTertiary">Target Persona</span>
            <p className="text-xs font-medium text-apple-text mt-1.5 leading-snug">{spec.userJourney.persona}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[11px] font-mono uppercase text-apple-textTertiary">Entry Point</span>
            <p className="text-xs font-medium text-apple-text mt-1.5 leading-snug">{spec.userJourney.entryPoint}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[11px] font-mono uppercase text-apple-textTertiary">Target Outcome</span>
            <p className="text-xs font-medium text-apple-text mt-1.5 leading-snug">{spec.userJourney.targetOutcome}</p>
          </div>
        </div>
      </div>

      {/* Block: Gherkin Acceptance Criteria (Interactive Test Runner) */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-apple-emerald/10 text-apple-emerald">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider font-mono text-apple-text">
                Acceptance Criteria (Gherkin Scenarios)
              </h2>
              <p className="text-[11px] text-apple-textTertiary">Interactive behavioral specifications</p>
            </div>
          </div>
          <span className="text-xs font-mono text-apple-textSecondary">
            {spec.acceptanceCriteria.length} Scenarios
          </span>
        </div>

        <div className="space-y-3">
          {spec.acceptanceCriteria.map((ac, idx) => {
            const isVerified = !!verifiedScenarios[ac.id];
            return (
              <div
                key={ac.id}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-apple-text">
                    Scenario {idx + 1}: {ac.scenario}
                  </span>
                  
                  <button
                    onClick={() => toggleScenarioVerification(ac.id)}
                    className={`flex items-center space-x-1.5 text-[11px] font-mono px-2.5 py-1 rounded-lg border transition-all apple-pressable ${
                      isVerified
                        ? 'bg-apple-emerald/15 border-apple-emerald/30 text-emerald-300'
                        : 'bg-white/[0.04] border-white/10 text-apple-textSecondary hover:text-white'
                    }`}
                  >
                    {isVerified ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-apple-emerald" />
                        <span>Verified</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3" />
                        <span>Run Test</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-xs font-mono space-y-1.5 p-3 rounded-lg bg-black/40 border border-white/[0.04]">
                  <div>
                    <span className="text-purple-400 font-semibold mr-1.5">GIVEN</span>
                    <span className="text-apple-textSecondary">{ac.given}</span>
                  </div>
                  <div>
                    <span className="text-sky-400 font-semibold mr-1.5">WHEN</span>
                    <span className="text-apple-textSecondary">{ac.when}</span>
                  </div>
                  <div>
                    <span className="text-emerald-400 font-semibold mr-1.5">THEN</span>
                    <span className="text-apple-text">{ac.then}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Block: Data Schema & Contract Diff */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-apple-purple/10 text-apple-purple">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider font-mono text-apple-text">
                Data Schema &amp; Contract Diff
              </h2>
              <p className="text-[11px] text-apple-textTertiary">Database migration blueprint</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {spec.dataSchemaDiff.map((schema) => (
            <div key={schema.entity} className="border border-white/[0.08] rounded-xl overflow-hidden bg-white/[0.01]">
              <div className="px-4 py-3 bg-white/[0.03] border-b border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <span className="font-mono text-xs font-bold text-apple-text">{schema.entity}</span>
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-md font-semibold ${
                    schema.action === 'create'
                      ? 'bg-apple-emerald/15 text-emerald-300 border border-apple-emerald/30'
                      : schema.action === 'modify'
                      ? 'bg-apple-amber/15 text-amber-300 border border-apple-amber/30'
                      : 'bg-apple-red/15 text-red-300 border border-apple-red/30'
                  }`}>
                    {schema.action}
                  </span>
                </div>
                <span className="text-xs text-apple-textSecondary">{schema.description}</span>
              </div>

              <div className="p-3 overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="text-apple-textTertiary border-b border-white/[0.06]">
                      <th className="pb-2 font-medium">Field</th>
                      <th className="pb-2 font-medium">Type</th>
                      <th className="pb-2 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {schema.fields.map((f) => (
                      <tr key={f.name} className="hover:bg-white/[0.01]">
                        <td className="py-2 text-apple-text font-semibold">{f.name}</td>
                        <td className="py-2 text-purple-300 text-[11px]">{f.type}</td>
                        <td className="py-2 text-apple-textSecondary text-[11px] font-sans">{f.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
