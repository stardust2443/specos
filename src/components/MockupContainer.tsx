import { CheckoutMockup } from './mockups/CheckoutMockup';
import { SwitcherMockup } from './mockups/SwitcherMockup';
import { CanvasMockup } from './mockups/CanvasMockup';
import { MonitorPlay, Sparkles } from 'lucide-react';

interface Props {
  mockupState: {
    type: 'checkout' | 'switcher' | 'canvas' | 'generic';
    title: string;
    subtitle: string;
    config: Record<string, any>;
  };
}

export const MockupContainer = ({ mockupState }: Props) => {
  return (
    <div className="apple-card rounded-3xl p-7 sm:p-10 relative overflow-hidden shadow-apple-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-5 border-b border-apple-border relative z-10">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-apple-accent/15 border border-apple-accent/25 flex items-center justify-center text-apple-accent shadow-apple-subtle">
            <MonitorPlay className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-apple-text tracking-tight">{mockupState.title}</h3>
            <p className="text-xs text-apple-textSecondary mt-0.5">{mockupState.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <div className="flex items-center space-x-1.5 text-[11px] font-mono text-apple-emerald bg-apple-emerald/10 px-3 py-1 rounded-full border border-apple-emerald/25 font-semibold shadow-apple-subtle">
            <span className="w-2 h-2 rounded-full bg-apple-emerald animate-pulse"></span>
            <span>Live Interactive Sandbox</span>
          </div>
        </div>
      </div>

      {/* Component Sandbox View */}
      <div className="py-4 relative z-10">
        {mockupState.type === 'checkout' && <CheckoutMockup config={mockupState.config} />}
        {mockupState.type === 'switcher' && <SwitcherMockup config={mockupState.config} />}
        {mockupState.type === 'canvas' && <CanvasMockup config={mockupState.config} />}
        {mockupState.type === 'generic' && (
          <div className="max-w-md mx-auto p-12 text-center border border-dashed border-apple-border rounded-3xl bg-apple-elevated/40 text-apple-textSecondary text-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-apple-accent/15 text-apple-accent flex items-center justify-center mx-auto">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="font-semibold text-apple-text text-sm">Dynamic Sandbox Generated</div>
            <p className="leading-relaxed text-apple-textSecondary">Interactive component mockup synthesized deterministically from this custom specification.</p>
          </div>
        )}
      </div>

      {/* Footer Specs Bar */}
      <div className="mt-8 pt-4 border-t border-apple-border flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-apple-textTertiary relative z-10">
        <span>Framework: <strong className="text-apple-text font-medium">React 19 + Motion</strong></span>
        <span>•</span>
        <span>State Machine: <strong className="text-apple-text font-medium">Optimistic Local (0ms)</strong></span>
        <span>•</span>
        <span>Physics: <strong className="text-apple-text font-medium">Apple Fluid Spring</strong></span>
      </div>
    </div>
  );
};
