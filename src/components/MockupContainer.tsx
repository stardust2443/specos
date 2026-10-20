import { CheckoutMockup } from './mockups/CheckoutMockup';
import { SwitcherMockup } from './mockups/SwitcherMockup';
import { CanvasMockup } from './mockups/CanvasMockup';
import { MonitorPlay } from 'lucide-react';

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
    <div className="glass-panel rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-2xl border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-apple-accent/10 border border-apple-accent/20 flex items-center justify-center text-apple-accent">
            <MonitorPlay className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-apple-text tracking-tight">{mockupState.title}</h3>
            <p className="text-xs text-apple-textSecondary">{mockupState.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Live Interactive Sandbox</span>
        </div>
      </div>

      {/* Component Sandbox View */}
      <div className="py-2">
        {mockupState.type === 'checkout' && <CheckoutMockup config={mockupState.config} />}
        {mockupState.type === 'switcher' && <SwitcherMockup config={mockupState.config} />}
        {mockupState.type === 'canvas' && <CanvasMockup config={mockupState.config} />}
        {mockupState.type === 'generic' && (
          <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl text-apple-textSecondary text-xs">
            Dynamic component prototype rendered for this custom specification.
          </div>
        )}
      </div>
    </div>
  );
};
