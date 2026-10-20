import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Command } from 'lucide-react';
import { DemoPreset } from '../types/spec';

interface Props {
  presets: DemoPreset[];
  activePresetId: string;
  onSelectPreset: (preset: DemoPreset) => void;
  onSubmitCustomPrompt: (prompt: string) => void;
  isGenerating: boolean;
}

export const PromptBar = ({
  presets,
  activePresetId,
  onSelectPreset,
  onSubmitCustomPrompt,
  isGenerating,
}: Props) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) {
      onSubmitCustomPrompt(prompt.trim());
    }
  };

  return (
    <div className="w-full space-y-3.5">
      {/* Input Field */}
      <form onSubmit={handleSubmit} className="relative flex items-center group">
        <div className="absolute left-4 text-apple-accent pointer-events-none transition-transform group-focus-within:scale-110">
          <Sparkles className="w-4 h-4" />
        </div>

        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a 1-sentence feature prompt (e.g. 'Add one-click Apple Pay guest checkout with zero account creation')..."
          className="w-full pl-11 pr-32 py-3.5 glass-input rounded-2xl text-sm text-apple-text placeholder-apple-textSecondary focus:border-apple-accent focus:ring-4 focus:ring-apple-accent/15 outline-none transition-all shadow-apple-md font-sans"
        />

        <div className="absolute right-2 flex items-center space-x-1.5">
          <button
            type="submit"
            disabled={!prompt.trim() || isGenerating}
            className="px-3.5 py-1.5 bg-apple-accent hover:bg-apple-accentHover disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition-all shadow-apple-sm apple-pressable"
          >
            <span>{isGenerating ? 'Synthesizing...' : 'Generate Spec'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* Preset Pill Carousel with Spring Physics */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center space-x-1 text-[11px] font-mono text-apple-textTertiary mr-1">
          <Command className="w-3 h-3" />
          <span>Curated Presets:</span>
        </div>

        {presets.map((preset) => {
          const isSelected = preset.id === activePresetId;
          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`relative px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center space-x-2 apple-pressable ${
                isSelected
                  ? 'text-white border border-apple-accent/60 bg-apple-accent/15 shadow-apple-sm'
                  : 'text-apple-textSecondary hover:text-white glass-pill hover:border-white/20'
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="activePresetGlow"
                  className="absolute inset-0 rounded-xl bg-apple-accent/10 border border-apple-accent/40 pointer-events-none"
                  transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                />
              )}
              <span className="relative z-10">{preset.name}</span>
              <span className={`relative z-10 text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                isSelected ? 'bg-apple-accent/30 text-white' : 'bg-white/5 text-apple-textTertiary'
              }`}>
                {preset.tag}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
