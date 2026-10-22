import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MonitorPlay, ShieldAlert, Layers } from 'lucide-react';
import { Header, ActiveTab } from './components/Header';
import { PromptBar } from './components/PromptBar';
import { PrdViewer } from './components/PrdViewer';
import { TechLeadAudit } from './components/TechLeadAudit';
import { LinearDrawer } from './components/LinearDrawer';
import { MockupContainer } from './components/MockupContainer';
import { CommandPalette } from './components/CommandPalette';
import { DEMO_PRESETS } from './data/presets';
import { SpecDocument, DemoPreset } from './types/spec';

export function App() {
  const [activePreset, setActivePreset] = useState<DemoPreset>(DEMO_PRESETS[0]);
  const [currentSpec, setCurrentSpec] = useState<SpecDocument>(DEMO_PRESETS[0].spec);
  const [activeTab, setActiveTab] = useState<ActiveTab>('prd');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [copiedLinear, setCopiedLinear] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('specos_theme');
      if (saved === 'dark' || saved === 'light') return saved;
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('specos_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSelectPreset = (preset: DemoPreset) => {
    setActivePreset(preset);
    setCurrentSpec(preset.spec);
  };

  const handleCustomPrompt = (prompt: string) => {
    setIsGenerating(true);
    setTimeout(() => {
      const generatedSpec: SpecDocument = {
        id: `spec-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString(),
        prompt: prompt,
        title: prompt.length > 55 ? prompt.substring(0, 55) + '...' : prompt,
        targetKpi: '+24.2% User Feature Adoption; <60ms P99 Interaction Latency',
        problemStatement: `Users currently experience high friction, cognitive load, and edge-case ambiguity when attempting to execute: "${prompt}". Existing workflows require manual coordination across disjointed tools, creating silent failures and data discrepancies.`,
        userJourney: {
          persona: 'Technical Product Lead / Senior Engineer',
          entryPoint: 'Primary application dashboard or command menu',
          targetOutcome: 'Instant, deterministic completion with optimistic local feedback and zero lost state'
        },
        acceptanceCriteria: [
          {
            id: 'ac-1',
            scenario: 'User initiates the automated action from UI or hotkey',
            given: 'User has an active session with verified workspace permissions',
            when: `Action "${prompt}" is triggered`,
            then: 'State transition is applied optimistically in local cache within 20ms'
          },
          {
            id: 'ac-2',
            scenario: 'Transient network failure during background synchronization',
            given: 'Client loses network connectivity mid-handshake',
            when: 'Mutation fails with timeout or disconnection',
            then: 'Request is placed in local offline mutation queue with exponential backoff and zero UI block'
          }
        ],
        dataSchemaDiff: [
          {
            entity: 'feature_events_log',
            action: 'create',
            description: 'Idempotency and audit ledger for asynchronous state mutations',
            fields: [
              { name: 'id', type: 'UUID PRIMARY KEY', description: 'Deterministic unique event ID' },
              { name: 'idempotency_hash', type: 'VARCHAR(64) UNIQUE NOT NULL', description: 'SHA-256 validation token' },
              { name: 'status', type: 'VARCHAR(32)', description: 'pending | committed | rolled_back' }
            ]
          }
        ],
        edgeCases: [
          {
            id: 'ec-gen-1',
            category: 'concurrency',
            severity: 'High',
            title: 'Race Condition under Rapid Sequential Triggers',
            scenario: 'User triggers multiple executions in rapid succession before the initial request acknowledges.',
            mitigation: 'Implement local optimistic lock + server-side distributed Redis mutex lease with 3s TTL.'
          },
          {
            id: 'ec-gen-2',
            category: 'idempotency',
            severity: 'Medium',
            title: 'Stale State Overwrite on Delayed Acknowledgment',
            scenario: 'Slow 4G response arrives after a subsequent client mutation has already been applied locally.',
            mitigation: 'Enforce Hybrid Logical Clocks (HLC) / Vector clocks to guarantee deterministic Last-Write-Wins.'
          }
        ],
        linearIssues: [
          {
            id: 'lin-gen-1',
            title: `[Core] Implement ${prompt.slice(0, 35)} Backend Pipeline`,
            priority: 1,
            estimate: 5,
            area: 'Backend',
            acceptanceCriteria: ['Implement primary data handler with idempotency check', 'Add unit tests for network boundaries']
          },
          {
            id: 'lin-gen-2',
            title: `[UI] Build Keyboard-First Interface for ${prompt.slice(0, 25)}`,
            priority: 2,
            estimate: 3,
            area: 'Frontend',
            acceptanceCriteria: ['Support Cmd+K action palette trigger', 'Optimistic UI update state machine with 0ms lag']
          }
        ],
        mockupState: {
          type: 'generic',
          title: 'Custom Feature Live Sandbox',
          subtitle: prompt,
          config: {}
        }
      };

      setCurrentSpec(generatedSpec);
      setIsGenerating(false);
    }, 1300);
  };

  const copyMarkdownPRD = () => {
    const md = `# ${currentSpec.title}
**Target KPI:** ${currentSpec.targetKpi}
**Created:** ${currentSpec.createdAt}

## Problem Statement
${currentSpec.problemStatement}

## User Journey
- **Persona:** ${currentSpec.userJourney.persona}
- **Entry Point:** ${currentSpec.userJourney.entryPoint}
- **Target Outcome:** ${currentSpec.userJourney.targetOutcome}

## Acceptance Criteria (Gherkin)
${currentSpec.acceptanceCriteria.map(ac => `### ${ac.scenario}
- **GIVEN** ${ac.given}
- **WHEN** ${ac.when}
- **THEN** ${ac.then}
`).join('\n')}

## Synthetic Tech Lead Audit (Edge Cases)
${currentSpec.edgeCases.map(ec => `### [${ec.severity}] ${ec.title} (${ec.category})
- **Scenario:** ${ec.scenario}
- **Mitigation:** ${ec.mitigation}
`).join('\n')}

## Linear Sprints & Issues
${currentSpec.linearIssues.map(li => `- [P${li.priority}] ${li.title} (${li.area}, ${li.estimate} pts)`).join('\n')}
`;
    navigator.clipboard.writeText(md);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2000);
  };

  const copyLinearJson = () => {
    const jsonStr = JSON.stringify(currentSpec.linearIssues, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopiedLinear(true);
    setTimeout(() => setCopiedLinear(false), 2000);
  };

  return (
    <div className="min-h-screen bg-apple-bg text-apple-text flex flex-col font-sans selection:bg-apple-accent selection:text-white relative overflow-x-hidden">
      {/* Ambient Radial Mesh Gradient */}
      <div className={`fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] blur-3xl pointer-events-none -z-10 transition-colors duration-500 ${
        theme === 'dark'
          ? 'bg-gradient-to-b from-apple-accent/15 via-purple-500/5 to-transparent'
          : 'bg-gradient-to-b from-blue-500/10 via-amber-400/5 to-transparent'
      }`} />

      {/* Floating Island Header */}
      <Header
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onOpenCommand={() => setIsCommandOpen(true)}
        onCopyMarkdown={copyMarkdownPRD}
        onCopyLinearJson={copyLinearJson}
        copiedMarkdown={copiedMarkdown}
        copiedLinear={copiedLinear}
        edgeCasesCount={currentSpec.edgeCases.length}
        linearIssuesCount={currentSpec.linearIssues.length}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 pb-16 space-y-6">
        {/* Prompt Bar with Presets */}
        <PromptBar
          presets={DEMO_PRESETS}
          activePresetId={activePreset.id}
          onSelectPreset={handleSelectPreset}
          onSubmitCustomPrompt={handleCustomPrompt}
          isGenerating={isGenerating}
        />

        {/* Dynamic Tab Views with Luxurious Spring Presence */}
        <AnimatePresence mode="wait">
          {activeTab === 'prd' && (
            <motion.div
              key="prd-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ type: 'spring', damping: 28, stiffness: 150, mass: 0.9 }}
              className="max-w-4xl mx-auto space-y-10"
            >
              <PrdViewer spec={currentSpec} />

              {/* Companion Pipeline Discovery Banner */}
              <div className="pt-4 border-t border-apple-border space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-mono uppercase tracking-wider text-apple-accent font-semibold">
                      SpecOS Multi-Agent Pipeline Outputs
                    </h3>
                    <p className="text-xs text-apple-textTertiary mt-0.5">
                      Deterministic companion artifacts synthesized concurrently from this living specification
                    </p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-apple-elevated text-apple-textSecondary border border-apple-border">
                    3 Synchronized Artifacts
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Card 1: Interactive Sandbox */}
                  <motion.button
                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('sandbox')}
                    className="p-5 rounded-2xl bg-apple-elevated/40 hover:bg-apple-elevated border border-apple-border hover:border-apple-borderHighlight text-left transition-all shadow-apple-sm group space-y-3 apple-pressable"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-apple-accent/10 border border-apple-accent/20 flex items-center justify-center text-apple-accent">
                        <MonitorPlay className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono text-apple-accent font-semibold group-hover:translate-x-0.5 transition-transform">
                        Explore →
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-apple-text group-hover:text-apple-accent transition-colors">
                        Interactive Sandbox
                      </div>
                      <div className="text-xs text-apple-textSecondary mt-0.5">
                        Live Apple-grade prototype simulating 0ms local state transitions
                      </div>
                    </div>
                  </motion.button>

                  {/* Card 2: Tech Lead Audit */}
                  <motion.button
                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('audit')}
                    className="p-5 rounded-2xl bg-apple-elevated/40 hover:bg-apple-elevated border border-apple-border hover:border-apple-borderHighlight text-left transition-all shadow-apple-sm group space-y-3 apple-pressable"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-apple-amber/10 border border-apple-amber/20 flex items-center justify-center text-apple-amber">
                        <ShieldAlert className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono text-apple-amber font-semibold group-hover:translate-x-0.5 transition-transform">
                        {currentSpec.edgeCases.length} Risks →
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-apple-text group-hover:text-apple-amber transition-colors">
                        Tech Lead Audit
                      </div>
                      <div className="text-xs text-apple-textSecondary mt-0.5">
                        Adversarial failure modes, race conditions &amp; distributed defenses
                      </div>
                    </div>
                  </motion.button>

                  {/* Card 3: Linear Sprints */}
                  <motion.button
                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('linear')}
                    className="p-5 rounded-2xl bg-apple-elevated/40 hover:bg-apple-elevated border border-apple-border hover:border-apple-borderHighlight text-left transition-all shadow-apple-sm group space-y-3 apple-pressable"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-apple-purple/10 border border-apple-purple/20 flex items-center justify-center text-apple-purple">
                        <Layers className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono text-apple-purple font-semibold group-hover:translate-x-0.5 transition-transform">
                        {currentSpec.linearIssues.length} Tickets →
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-apple-text group-hover:text-apple-purple transition-colors">
                        Linear Sprints
                      </div>
                      <div className="text-xs text-apple-textSecondary mt-0.5">
                        P1-P4 Fibonacci tickets ready for 1-click JSON/CSV sprint import
                      </div>
                    </div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'audit' && (
            <motion.div
              key="audit-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ type: 'spring', damping: 28, stiffness: 150, mass: 0.9 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              <TechLeadAudit edgeCases={currentSpec.edgeCases} />
            </motion.div>
          )}

          {activeTab === 'linear' && (
            <motion.div
              key="linear-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ type: 'spring', damping: 28, stiffness: 150, mass: 0.9 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              <LinearDrawer
                issues={currentSpec.linearIssues}
                onCopyLinearJson={copyLinearJson}
                copiedLinear={copiedLinear}
              />
            </motion.div>
          )}

          {activeTab === 'sandbox' && (
            <motion.div
              key="sandbox-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ type: 'spring', damping: 28, stiffness: 150, mass: 0.9 }}
              className="max-w-2xl mx-auto space-y-6 pt-2"
            >
              <MockupContainer mockupState={currentSpec.mockupState} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        presets={DEMO_PRESETS}
        onSelectPreset={handleSelectPreset}
        onSelectView={setActiveTab}
        onExportMarkdown={copyMarkdownPRD}
        onExportLinear={copyLinearJson}
        onSubmitCustomPrompt={handleCustomPrompt}
      />

      {/* Apple-grade Minimalist Footer */}
      <footer className="border-t border-apple-border py-6 text-center text-xs text-apple-textTertiary bg-apple-surface/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-apple-emerald animate-pulse" />
            <span>
              Engineered by <strong className="text-apple-text font-medium">Arun Mitra Kommireddy</strong> — Solo AI PM / Technical Builder
            </span>
          </div>
          <div className="flex items-center space-x-4 font-mono text-[11px]">
            <span>Local-First (0ms)</span>
            <span>•</span>
            <span>Linear &amp; Notion Synthesis</span>
            <span>•</span>
            <span>Apple Motion Ergonomics</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
