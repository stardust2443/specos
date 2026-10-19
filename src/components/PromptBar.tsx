import { useState } from 'react';
import { ArrowRight, Sparkles, Command } from 'lucide-react';
import { DemoPreset } from '../types/spec';

interface Props {
  presets: DemoPreset[];
  activePresetId: string;
  onSelectPreset: (preset: DemoPreset) => void;
  onSubmitCustomPrompt: (prompt: string) => void;
  isGenerating: boolean;
}

export const PromptBar: React.FC<Props> = ({
  presets,
  activePresetId,
  onSelectPreset,
  onSubmitCustomPrompt,
  isGenerating,
}) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) {
      onSubmitCustomPrompt(prompt.trim());
    }
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="absolute left-4 text-spec-textMuted pointer-events-none">
          <Sparkles className="w-4 h-4 text-spec-accent" />
        </div>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a 1-sentence feature prompt (e.g. 'Add Apple Pay 1-click checkout for guest mobile users')..."
          className="w-full pl-11 pr-28 py-3.5 bg-[#121216] border border-[#222228] focus:border-spec-accent rounded-xl text-sm text-white placeholder-spec-textMuted outline-none shadow-xl transition-all"
        />
        <div className="absolute right-2.5 flex items-center space-x-1.5">
          <button
            type="submit"
            disabled={!prompt.trim() || isGenerating}
            className="px-3 py-1.5 bg-spec-accent hover:bg-spec-accentHover disabled:opacity-40 text-white text-xs font-semibold rounded-lg flex items-center space-x-1 transition-all"
          >
            <span>{isGenerating ? 'Synthesizing...' : 'Generate'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* Preset Chips for instant recruiter evaluation */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-[11px] font-mono uppercase text-spec-textMuted flex items-center space-x-1 mr-1">
          <Command className="w-3 h-3" />
          <span>Presets:</span>
        </span>
        {presets.map((preset) => {
          const isSelected = preset.id === activePresetId;
          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`text-xs px-2.5 py-1 rounded-md border transition-all flex items-center space-x-1.5 ${
                isSelected
                  ? 'bg-spec-accent/20 border-spec-accent text-white shadow-sm'
                  : 'bg-[#121216] border-[#222228] text-spec-textMuted hover:text-white hover:border-[#33333F]'
              }`}
            >
              <span className="font-medium">{preset.name}</span>
              <span className="text-[10px] text-spec-textMuted opacity-70 font-mono">({preset.tag})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
