import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
    <div className="min-h-screen bg-apple-bg text-apple-text flex flex-col font-sans selection:bg-apple-accent/30 selection:text-white relative overflow-x-hidden">
      {/* Ambient Radial Mesh Gradient */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-apple-accent/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

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

        {/* Dynamic Tab Views with Spring Presence */}
        <AnimatePresence mode="wait">
          {activeTab === 'prd' && (
            <motion.div
              key="prd-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
            >
              {/* Left Column (7 cols): Living PRD + Live Sandbox */}
              <div className="lg:col-span-7 space-y-6">
                <PrdViewer spec={currentSpec} />
                <MockupContainer mockupState={currentSpec.mockupState} />
              </div>

              {/* Right Column (5 cols): Tech Lead Audit & Linear Sprints */}
              <div className="lg:col-span-5 space-y-6 sticky top-20">
                <TechLeadAudit edgeCases={currentSpec.edgeCases} />
                <LinearDrawer
                  issues={currentSpec.linearIssues}
                  onCopyLinearJson={copyLinearJson}
                  copiedLinear={copiedLinear}
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'audit' && (
            <motion.div
              key="audit-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              <TechLeadAudit edgeCases={currentSpec.edgeCases} />
            </motion.div>
          )}

          {activeTab === 'linear' && (
            <motion.div
              key="linear-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="max-w-xl mx-auto space-y-6 pt-4"
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
      <footer className="border-t border-white/[0.06] py-6 text-center text-xs text-apple-textTertiary bg-apple-bg/80 backdrop-blur-md">
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
