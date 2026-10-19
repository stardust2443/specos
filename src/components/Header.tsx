import { Layers, Sparkles, Copy, Check, ExternalLink, Terminal } from 'lucide-react';

interface Props {
  onCopyMarkdown: () => void;
  onCopyLinearJson: () => void;
  copiedMarkdown: boolean;
  copiedLinear: boolean;
}

export const Header: React.FC<Props> = ({
  onCopyMarkdown,
  onCopyLinearJson,
  copiedMarkdown,
  copiedLinear,
}) => {
  return (
    <header className="border-b border-[#222228] bg-[#0A0A0C]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-spec-accent to-purple-600 flex items-center justify-center text-white shadow-lg shadow-spec-accent/20">
            <Layers className="w-4 h-4" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-semibold text-white tracking-tight text-sm sm:text-base">SpecOS</span>
            <span className="text-[10px] font-mono uppercase bg-[#181820] text-spec-textMuted px-1.5 py-0.5 rounded border border-[#282834]">
              v0.1.0-alpha
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={onCopyMarkdown}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[#16161D] border border-[#222228] text-spec-textMuted hover:text-white hover:border-[#33333F] transition-all"
            title="Copy full PRD as Markdown"
          >
            {copiedMarkdown ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy PRD</span>
          </button>

          <button
            onClick={onCopyLinearJson}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-spec-accent/15 border border-spec-accent/40 text-spec-accent hover:bg-spec-accent/25 transition-all shadow-sm"
            title="Copy structured Linear issues for import"
          >
            {copiedLinear ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>Export to Linear</span>
          </button>

          <a
            href="https://github.com/topics/reverse-engineer-anything"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center space-x-1 text-xs text-spec-textMuted hover:text-white px-2 py-1 transition-colors"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>REA Clean-Room</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
    </header>
  );
};
