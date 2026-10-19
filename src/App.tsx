import { useState } from 'react';
import { Header } from './components/Header';
import { PromptBar } from './components/PromptBar';
import { PrdViewer } from './components/PrdViewer';
import { TechLeadAudit } from './components/TechLeadAudit';
import { LinearDrawer } from './components/LinearDrawer';
import { DEMO_PRESETS } from './data/presets';
import { SpecDocument, DemoPreset } from './types/spec';

export function App() {
  const [activePreset, setActivePreset] = useState<DemoPreset>(DEMO_PRESETS[0]);
  const [currentSpec, setCurrentSpec] = useState<SpecDocument>(DEMO_PRESETS[0].spec);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [copiedLinear, setCopiedLinear] = useState(false);

  const handleSelectPreset = (preset: DemoPreset) => {
    setActivePreset(preset);
    setCurrentSpec(preset.spec);
  };

  const handleCustomPrompt = (prompt: string) => {
    setIsGenerating(true);
    // Simulate high-speed AI agent synthesis
    setTimeout(() => {
      const generatedSpec: SpecDocument = {
        id: `spec-${Date.now()}`,
        createdAt: new Date().toISOString(),
        prompt: prompt,
        title: prompt.length > 50 ? prompt.substring(0, 50) + '...' : prompt,
        targetKpi: '+22.5% Feature Engagement; <100ms P99 latency impact',
        problemStatement: `Users require an automated, frictionless solution for "${prompt}". Current workflows introduce cognitive overhead, manual copy-pasting, and unpredictable edge-case failures.`,
        userJourney: {
          persona: 'Power User / Engineering Lead',
          entryPoint: 'Primary application dashboard or quick action menu',
          targetOutcome: 'Completed task with deterministic verification and zero context switching'
        },
        acceptanceCriteria: [
          {
            id: 'ac-1',
            scenario: 'User initiates the automated action',
            given: 'User is authenticated with valid tenant credentials',
            when: `Action "${prompt}" is triggered`,
            then: 'State transition is reflected optimistically in local cache within 30ms'
          },
          {
            id: 'ac-2',
            scenario: 'Network failure or timeout during execution',
            given: 'Client loses network connectivity during background sync',
            when: 'Mutation request fails with ECONNRESET',
            then: 'Request is queued in local offline mutation buffer with exponential backoff'
          }
        ],
        dataSchemaDiff: [
          {
            entity: 'custom_feature_events',
            action: 'create',
            description: 'Audit log and state reconciliation table',
            fields: [
              { name: 'id', type: 'UUID PRIMARY KEY', description: 'Unique event identifier' },
              { name: 'payload_hash', type: 'VARCHAR(64) NOT NULL', description: 'SHA-256 for idempotency validation' },
              { name: 'status', type: 'VARCHAR(32)', description: 'pending | committed | rolled_back' }
            ]
          }
        ],
        edgeCases: [
          {
            id: 'ec-custom-1',
            category: 'concurrency',
            severity: 'High',
            title: 'Race Condition under Rapid Sequential Triggering',
            scenario: 'User triggers the action repeatedly before previous execution reconciles.',
            mitigation: 'Implement local optimistic lock + server-side distributed Redis mutex lease.'
          },
          {
            id: 'ec-custom-2',
            category: 'idempotency',
            severity: 'Medium',
            title: 'Stale State Overwrite on Delayed Acknowledgment',
            scenario: 'Slow 3G response arrives after a subsequent mutation has already been applied locally.',
            mitigation: 'Vector clocks / Hybrid Logical Clocks (HLC) to enforce deterministic Last-Write-Wins.'
          }
        ],
        linearIssues: [
          {
            id: 'lin-gen-1',
            title: `[Core] Implement ${prompt.slice(0, 35)} Pipeline`,
            priority: 1,
            estimate: 5,
            area: 'Backend',
            acceptanceCriteria: ['Implement primary data handler', 'Add unit tests for error boundaries']
          },
          {
            id: 'lin-gen-2',
            title: `[UI] Build Keyboard-First Interface for ${prompt.slice(0, 25)}`,
            priority: 2,
            estimate: 3,
            area: 'Frontend',
            acceptanceCriteria: ['Cmd+K integration', 'Optimistic UI update state machine']
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
    }, 1400);
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

## Linear Issues
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
    <div className="min-h-screen bg-[#0A0A0C] text-[#EDEDEF] flex flex-col font-sans selection:bg-spec-accent/30 selection:text-white">
      <Header
        onCopyMarkdown={copyMarkdownPRD}
        onCopyLinearJson={copyLinearJson}
        copiedMarkdown={copiedMarkdown}
        copiedLinear={copiedLinear}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Hero Prompt Input Bar */}
        <PromptBar
          presets={DEMO_PRESETS}
          activePresetId={activePreset.id}
          onSelectPreset={handleSelectPreset}
          onSubmitCustomPrompt={handleCustomPrompt}
          isGenerating={isGenerating}
        />

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Left Column (7 cols): Living PRD & Live Mockup */}
          <div className="lg:col-span-7 space-y-6">
            <PrdViewer spec={currentSpec} />
          </div>

          {/* Sidebar Right Column (5 cols): Tech Lead Audit & Linear Decomposition */}
          <div className="lg:col-span-5 space-y-6 sticky top-20">
            <TechLeadAudit edgeCases={currentSpec.edgeCases} />
            <LinearDrawer
              issues={currentSpec.linearIssues}
              onCopyLinearJson={copyLinearJson}
              copiedLinear={copiedLinear}
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-[#222228] py-6 text-center text-xs text-spec-textMuted bg-[#0A0A0C]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>
            Crafted by <strong className="text-white">Arun Mitra Kommireddy</strong> — Solo AI PM / Technical Builder
          </span>
          <div className="flex items-center space-x-4 font-mono text-[11px]">
            <span>Local-First (0ms Latency)</span>
            <span>•</span>
            <span>Linear &amp; Notion Clean-Room Synthesis</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
