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

export const MockupContainer: React.FC<Props> = ({ mockupState }) => {
  return (
    <div className="bg-[#121216] border border-[#222228] rounded-xl p-6 relative overflow-hidden shadow-xl">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-md bg-spec-accent/20 flex items-center justify-center text-spec-accent">
            <MonitorPlay className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{mockupState.title}</h3>
            <p className="text-xs text-spec-textMuted">{mockupState.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Interactive Preview</span>
        </div>
      </div>

      <div className="py-2">
        {mockupState.type === 'checkout' && <CheckoutMockup config={mockupState.config} />}
        {mockupState.type === 'switcher' && <SwitcherMockup config={mockupState.config} />}
        {mockupState.type === 'canvas' && <CanvasMockup config={mockupState.config} />}
        {mockupState.type === 'generic' && (
          <div className="p-8 text-center border border-dashed border-[#282834] rounded-lg text-spec-textMuted text-xs">
            Dynamic component prototype rendered for this custom specification.
          </div>
        )}
      </div>
    </div>
  );
};
