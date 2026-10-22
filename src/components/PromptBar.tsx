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
          placeholder="What feature would you like to build? (e.g. 'Add one-click Apple Pay guest checkout')..."
          className="w-full pl-11 pr-36 py-3.5 glass-input rounded-2xl text-sm text-apple-text placeholder-apple-textSecondary focus:border-apple-accent focus:ring-4 focus:ring-apple-accent/15 outline-none transition-all shadow-apple-md font-sans"
        />

        <div className="absolute right-2 flex items-center space-x-1.5">
          <button
            type="submit"
            disabled={!prompt.trim() || isGenerating}
            className="px-4 py-2 bg-apple-accent hover:bg-apple-accentHover disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition-all shadow-apple-sm apple-pressable"
          >
            <span>{isGenerating ? 'Synthesizing...' : 'Generate Spec'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* Preset Pill Carousel with Spring Physics */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <div className="flex items-center space-x-1.5 text-[11px] font-mono text-apple-textTertiary mr-1">
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
                  ? 'text-apple-accent font-semibold border border-apple-accent/50 bg-apple-accent/10 shadow-apple-sm'
                  : 'text-apple-textSecondary hover:text-apple-text glass-pill hover:border-apple-borderHighlight'
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="activePresetGlow"
                  className="absolute inset-0 rounded-xl bg-apple-accent/10 border border-apple-accent/30 pointer-events-none"
                  transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                />
              )}
              <span className="relative z-10">{preset.name}</span>
              <span className={`relative z-10 text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                isSelected ? 'bg-apple-accent/20 text-apple-accent font-semibold' : 'bg-apple-elevated text-apple-textTertiary border border-apple-border'
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
