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
import { ApiKeyModal } from './components/ApiKeyModal';
import { generateSpecWithGemini, hasApiKey, getStoredApiKey } from './services/gemini';
import { DEMO_PRESETS } from './data/presets';
import { SpecDocument, DemoPreset } from './types/spec';

export function App() {
  const [activePreset, setActivePreset] = useState<DemoPreset>(DEMO_PRESETS[0]);
  const [currentSpec, setCurrentSpec] = useState<SpecDocument>(DEMO_PRESETS[0].spec);
  const [activeTab, setActiveTab] = useState<ActiveTab>('prd');
  const [isGenerating, setIsGenerating] = useState(false);
  const [synthesisStatus, setSynthesisStatus] = useState('');
  const [apiError, setApiError] = useState<string | null>(null);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [hasKey, setHasKey] = useState<boolean>(() => hasApiKey());
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

  const handleCustomPrompt = async (prompt: string) => {
    const key = getStoredApiKey();
    if (!key) {
      setApiError('A free Gemini API Key is required for live AI synthesis. Paste your key below to unlock custom generations.');
      setIsApiKeyModalOpen(true);
      return;
    }

    setIsGenerating(true);
    setApiError(null);
    setSynthesisStatus('Initializing SpecOS multi-agent synthesis...');

    try {
      const generatedSpec = await generateSpecWithGemini(
        prompt,
        key,
        (status) => setSynthesisStatus(status)
      );
      setCurrentSpec(generatedSpec);
      setActivePreset({
        id: generatedSpec.id,
        name: generatedSpec.title.length > 25 ? generatedSpec.title.slice(0, 25) + '...' : generatedSpec.title,
        prompt: prompt,
        tag: 'Live AI Spec',
        spec: generatedSpec,
      });
      setActiveTab('prd');
    } catch (err: any) {
      console.error('Spec generation failed:', err);
      setApiError(err.message || 'Failed to generate specification. Please try again.');
    } finally {
      setIsGenerating(false);
      setSynthesisStatus('');
    }
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
      {/* Subtle Apple Ambient Highlight */}
      <div className={`fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[280px] blur-3xl pointer-events-none -z-10 transition-opacity duration-700 ${
        theme === 'dark' ? 'bg-apple-accent/5 opacity-60' : 'bg-apple-accent/[0.03] opacity-80'
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
        onOpenApiKey={() => setIsApiKeyModalOpen(true)}
        isApiKeyConfigured={hasKey}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 pb-16 space-y-6">
        {/* API Error Notification */}
        <AnimatePresence>
          {apiError && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center justify-between shadow-apple-sm"
            >
              <div className="flex items-center space-x-2.5">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium">{apiError}</span>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsApiKeyModalOpen(true)}
                  className="font-semibold underline hover:text-rose-600 transition-colors"
                >
                  Configure Key
                </button>
                <button
                  onClick={() => setApiError(null)}
                  className="text-rose-400 hover:text-rose-600 p-1"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prompt Bar with Presets & Live Multi-Agent Status */}
        <PromptBar
          presets={DEMO_PRESETS}
          activePresetId={activePreset.id}
          onSelectPreset={handleSelectPreset}
          onSubmitCustomPrompt={handleCustomPrompt}
          isGenerating={isGenerating}
          synthesisStatus={synthesisStatus}
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
                    whileHover={{ y: -2, transition: { duration: 0.15 } }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('sandbox')}
                    className="p-5 rounded-2xl apple-card hover:border-apple-accent/40 text-left transition-all shadow-apple-sm group space-y-3 apple-pressable"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-apple-accent/10 border border-apple-accent/20 flex items-center justify-center text-apple-accent">
                        <MonitorPlay className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-medium text-apple-accent group-hover:translate-x-0.5 transition-transform">
                        Explore →
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-apple-text group-hover:text-apple-accent transition-colors">
                        Interactive Sandbox
                      </div>
                      <div className="text-xs text-apple-textSecondary mt-0.5 leading-relaxed">
                        Live Apple-grade prototype simulating 0ms local state transitions
                      </div>
                    </div>
                  </motion.button>

                  {/* Card 2: Tech Lead Audit */}
                  <motion.button
                    whileHover={{ y: -2, transition: { duration: 0.15 } }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('audit')}
                    className="p-5 rounded-2xl apple-card hover:border-apple-amber/40 text-left transition-all shadow-apple-sm group space-y-3 apple-pressable"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-apple-amber/10 border border-apple-amber/20 flex items-center justify-center text-apple-amber">
                        <ShieldAlert className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-medium text-apple-amber group-hover:translate-x-0.5 transition-transform">
                        {currentSpec.edgeCases.length} Risks →
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-apple-text group-hover:text-apple-amber transition-colors">
                        Tech Lead Audit
                      </div>
                      <div className="text-xs text-apple-textSecondary mt-0.5 leading-relaxed">
                        Adversarial failure modes, race conditions &amp; distributed defenses
                      </div>
                    </div>
                  </motion.button>

                  {/* Card 3: Linear Sprints */}
                  <motion.button
                    whileHover={{ y: -2, transition: { duration: 0.15 } }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('linear')}
                    className="p-5 rounded-2xl apple-card hover:border-apple-purple/40 text-left transition-all shadow-apple-sm group space-y-3 apple-pressable"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-apple-purple/10 border border-apple-purple/20 flex items-center justify-center text-apple-purple">
                        <Layers className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-medium text-apple-purple group-hover:translate-x-0.5 transition-transform">
                        {currentSpec.linearIssues.length} Tickets →
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-apple-text group-hover:text-apple-purple transition-colors">
                        Linear Sprints
                      </div>
                      <div className="text-xs text-apple-textSecondary mt-0.5 leading-relaxed">
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

      {/* Gemini API Key Configuration Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeySaved={() => {
          setHasKey(hasApiKey());
          setApiError(null);
        }}
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
