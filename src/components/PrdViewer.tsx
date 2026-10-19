import { Target, AlertCircle, Compass, CheckSquare, Database, Sparkles } from 'lucide-react';
import { SpecDocument } from '../types/spec';
import { MockupContainer } from './MockupContainer';

interface Props {
  spec: SpecDocument;
}

export const PrdViewer: React.FC<Props> = ({ spec }) => {
  return (
    <div className="space-y-6">
      {/* Title & Target KPI Banner */}
      <div className="bg-[#121216] border border-[#222228] rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-spec-accent/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-spec-accent font-semibold flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Living Specification</span>
          </span>
          <span className="text-[11px] font-mono text-spec-textMuted bg-[#181820] px-2 py-0.5 rounded border border-[#282834]">
            ID: {spec.id}
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-3">
          {spec.title}
        </h1>

        {/* Target KPI */}
        <div className="flex items-start space-x-2.5 p-3 rounded-lg bg-[#181820] border border-[#282834]">
          <Target className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-spec-textMuted">North Star KPI</div>
            <div className="text-xs sm:text-sm font-medium text-emerald-300">{spec.targetKpi}</div>
          </div>
        </div>
      </div>

      {/* Block: Problem Statement & Strategic Context */}
      <div className="bg-[#121216] border border-[#222228] rounded-xl p-6 shadow-xl">
        <div className="flex items-center space-x-2 mb-3">
          <AlertCircle className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-semibold uppercase tracking-wider font-mono text-white">Problem Statement</h2>
        </div>
        <p className="text-xs sm:text-sm text-spec-textMuted leading-relaxed">
          {spec.problemStatement}
        </p>
      </div>

      {/* Block: User Journey & Persona */}
      <div className="bg-[#121216] border border-[#222228] rounded-xl p-6 shadow-xl">
        <div className="flex items-center space-x-2 mb-4">
          <Compass className="w-4 h-4 text-sky-400" />
          <h2 className="text-sm font-semibold uppercase tracking-wider font-mono text-white">User Journey &amp; Persona</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 bg-[#181820] rounded-lg border border-[#282834]">
            <span className="text-[11px] font-mono uppercase text-spec-textMuted">Target Persona</span>
            <p className="text-xs font-medium text-white mt-1">{spec.userJourney.persona}</p>
          </div>
          <div className="p-3 bg-[#181820] rounded-lg border border-[#282834]">
            <span className="text-[11px] font-mono uppercase text-spec-textMuted">Entry Point</span>
            <p className="text-xs font-medium text-white mt-1">{spec.userJourney.entryPoint}</p>
          </div>
          <div className="p-3 bg-[#181820] rounded-lg border border-[#282834]">
            <span className="text-[11px] font-mono uppercase text-spec-textMuted">Desired Outcome</span>
            <p className="text-xs font-medium text-white mt-1">{spec.userJourney.targetOutcome}</p>
          </div>
        </div>
      </div>

      {/* Block: Live Interactive Mockup Sandbox */}
      <MockupContainer mockupState={spec.mockupState} />

      {/* Block: Gherkin Acceptance Criteria */}
      <div className="bg-[#121216] border border-[#222228] rounded-xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <CheckSquare className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-semibold uppercase tracking-wider font-mono text-white">Acceptance Criteria (Gherkin)</h2>
          </div>
          <span className="text-xs font-mono text-spec-textMuted">{spec.acceptanceCriteria.length} Scenarios</span>
        </div>

        <div className="space-y-3">
          {spec.acceptanceCriteria.map((ac, idx) => (
            <div key={ac.id} className="p-3.5 bg-[#181820] rounded-lg border border-[#282834] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">
                  Scenario {idx + 1}: {ac.scenario}
                </span>
                <span className="text-[10px] font-mono text-spec-accent bg-spec-accent/10 px-1.5 py-0.5 rounded border border-spec-accent/20">
                  {ac.id}
                </span>
              </div>
              <div className="text-xs font-mono space-y-1 text-spec-textMuted pt-1">
                <div><span className="text-purple-400 font-semibold">GIVEN</span> {ac.given}</div>
                <div><span className="text-sky-400 font-semibold">WHEN</span> {ac.when}</div>
                <div><span className="text-emerald-400 font-semibold">THEN</span> {ac.then}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Block: Data Schema & API Contract Diff */}
      <div className="bg-[#121216] border border-[#222228] rounded-xl p-6 shadow-xl">
        <div className="flex items-center space-x-2 mb-4">
          <Database className="w-4 h-4 text-purple-400" />
          <h2 className="text-sm font-semibold uppercase tracking-wider font-mono text-white">Data Schema &amp; Contract Diff</h2>
        </div>

        <div className="space-y-4">
          {spec.dataSchemaDiff.map((schema) => (
            <div key={schema.entity} className="border border-[#282834] rounded-lg overflow-hidden bg-[#16161D]">
              <div className="px-4 py-2.5 bg-[#1C1C24] border-b border-[#282834] flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-white">{schema.entity}</span>
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold ${
                    schema.action === 'create'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : schema.action === 'modify'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {schema.action}
                  </span>
                </div>
                <span className="text-xs text-spec-textMuted">{schema.description}</span>
              </div>

              <div className="p-3 overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="text-spec-textMuted border-b border-[#222228]">
                      <th className="pb-1.5 font-medium">Field</th>
                      <th className="pb-1.5 font-medium">Type</th>
                      <th className="pb-1.5 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#202028]">
                    {schema.fields.map((f) => (
                      <tr key={f.name}>
                        <td className="py-1.5 text-white font-semibold">{f.name}</td>
                        <td className="py-1.5 text-purple-300">{f.type}</td>
                        <td className="py-1.5 text-spec-textMuted text-[11px] font-sans">{f.description}</td>
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
