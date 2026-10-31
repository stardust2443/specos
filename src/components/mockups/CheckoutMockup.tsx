import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Apple, CheckCircle2, ShieldCheck, ArrowRight, Loader2, CreditCard } from 'lucide-react';

interface Props {
  config: Record<string, any>;
}

export const CheckoutMockup = ({ config }: Props) => {
  const [status, setStatus] = useState<'idle' | 'authorizing' | 'success'>('idle');

  const handlePay = () => {
    setStatus('authorizing');
    setTimeout(() => {
      setStatus('success');
    }, 1400);
  };

  const handleReset = () => {
    setStatus('idle');
  };

  return (
    <div className="relative max-w-sm mx-auto apple-card rounded-3xl p-6 shadow-apple-md border border-apple-border overflow-hidden">
      {/* Top Sheet Handle (Apple Sheet Standard) */}
      <div className="w-10 h-1 bg-apple-borderHighlight rounded-full mx-auto mb-5" />

      {/* Header Item Details */}
      <div className="flex items-center justify-between pb-4 border-b border-apple-border">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-apple-accent font-semibold">
            Apple Pay Express
          </span>
          <h4 className="text-sm font-semibold text-apple-text mt-0.5">
            {config.productName || 'Mechanical Keychron Q1 Pro'}
          </h4>
        </div>
        <span className="text-lg font-bold font-mono text-apple-text tracking-tight">
          ${config.price?.toFixed(2) || '199.00'}
        </span>
      </div>

      <div className="py-5 min-h-[220px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="space-y-4"
            >
              {/* Shipping & Card Selector */}
              <div className="p-3.5 rounded-xl bg-apple-elevated/50 border border-apple-border text-xs space-y-2">
                <div className="flex items-center justify-between text-apple-textSecondary">
                  <span className="text-[11px]">Card:</span>
                  <div className="flex items-center space-x-1.5 text-apple-text font-medium">
                    <CreditCard className="w-3.5 h-3.5 text-apple-accent" />
                    <span>Apple Card (•• 9214)</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-apple-textSecondary">
                  <span className="text-[11px]">Shipping:</span>
                  <span className="text-apple-text font-medium">San Francisco, CA 94107</span>
                </div>
              </div>

              {/* The Apple Pay Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handlePay}
                className="w-full py-3.5 px-4 bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-100 font-semibold rounded-2xl flex items-center justify-center space-x-2 transition-all shadow-md apple-pressable"
              >
                <Apple className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium">Pay with Apple Pay</span>
              </motion.button>

              <div className="flex items-center justify-center space-x-1.5 text-[11px] text-apple-textTertiary">
                <ShieldCheck className="w-3.5 h-3.5 text-apple-emerald" />
                <span>Zero forms typed • Biometric tokenized</span>
              </div>
            </motion.div>
          )}

          {status === 'authorizing' && (
            <motion.div
              key="authorizing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 28, stiffness: 150, mass: 0.9 }}
              className="py-6 text-center space-y-3"
            >
              <div className="relative w-12 h-12 mx-auto flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.2, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                  className="absolute inset-0 rounded-full bg-apple-accent/30"
                />
                <Loader2 className="w-7 h-7 text-apple-accent animate-spin" />
              </div>

              <div>
                <div className="text-sm font-semibold text-apple-text">Scanning FaceID...</div>
                <p className="text-[11px] text-apple-textSecondary font-mono mt-1">
                  POST /api/v1/checkout/express-guest
                </p>
              </div>
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 28, stiffness: 150, mass: 0.9 }}
              className="py-4 text-center space-y-3"
            >
              <motion.div
                initial={{ scale: 0.5, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                className="w-12 h-12 rounded-full bg-apple-emerald/15 border border-apple-emerald/30 flex items-center justify-center mx-auto text-apple-emerald shadow-apple-glow"
              >
                <CheckCircle2 className="w-7 h-7" />
              </motion.div>

              <div>
                <div className="text-base font-semibold text-apple-text">Order Confirmed #ORD-98214</div>
                <p className="text-xs text-apple-textSecondary mt-1">
                  Total latency: <strong>840ms</strong>. Direct receipt generated.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReset}
                className="mt-3 text-xs text-apple-accent hover:underline flex items-center justify-center mx-auto space-x-1 apple-pressable font-medium"
              >
                <span>Reset Simulation</span>
                <ArrowRight className="w-3 h-3" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
