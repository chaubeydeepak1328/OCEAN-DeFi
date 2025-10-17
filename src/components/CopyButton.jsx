import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function CopyButton({ text, label = 'Copy' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-cyan-400 hover:text-neon-green transition-colors hover:bg-cyan-500/10 rounded"
      aria-label={label}
    >
      {copied ? (
        <>
          <Check size={12} className="text-neon-green" />
          <span className="text-neon-green">Copied!</span>
        </>
      ) : (
        <>
          <Copy size={12} />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
