import { useState } from 'react';
import { Apple, CheckCircle2, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

interface Props {
  config: Record<string, any>;
}

export const CheckoutMockup: React.FC<Props> = ({ config }) => {
  const [status, setStatus] = useState<'idle' | 'authorizing' | 'success'>('idle');

  const handlePay = () => {
    setStatus('authorizing');
    setTimeout(() => {
      setStatus('success');
    }, 1200);
  };

  const handleReset = () => {
    setStatus('idle');
  };

  return (
    <div className="bg-[#121216] border border-[#222228] rounded-xl p-5 max-w-md mx-auto shadow-2xl">
      <div className="flex items-center justify-between pb-4 border-b border-[#222228]">
        <div>
          <span className="text-xs uppercase font-mono text-spec-accent font-semibold tracking-wider">PDP Express Checkout</span>
          <h4 className="text-sm font-medium text-white">{config.productName || 'Mechanical Keychron Q1 Pro'}</h4>
        </div>
        <span className="text-base font-semibold font-mono text-white">${config.price?.toFixed(2) || '199.00'}</span>
      </div>

      <div className="py-5 space-y-4">
        {status === 'idle' && (
          <>
            <div className="bg-[#181820] p-3 rounded-lg border border-[#282834] text-xs space-y-1.5 text-spec-textMuted">
              <div className="flex justify-between">
                <span>Shipping Destination:</span>
                <span className="text-white font-medium">San Francisco, CA 94107</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Delivery:</span>
                <span className="text-emerald-400 font-medium">Tomorrow, 2-day Air</span>
              </div>
            </div>

            <button
              onClick={handlePay}
              className="w-full py-3 px-4 bg-white hover:bg-neutral-200 text-black font-semibold rounded-lg flex items-center justify-center space-x-2 transition-all shadow-md active:scale-[0.98]"
            >
              <Apple className="w-4 h-4 fill-black" />
              <span>Pay with Apple Pay</span>
            </button>

            <div className="flex items-center justify-center space-x-1.5 text-[11px] text-spec-textMuted">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tokenized 256-bit biometrics. Zero card numbers stored.</span>
            </div>
          </>
        )}

        {status === 'authorizing' && (
          <div className="py-6 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-spec-accent animate-spin mx-auto" />
            <div className="text-sm font-medium text-white">Authenticating FaceID...</div>
            <p className="text-xs text-spec-textMuted font-mono">POST /api/v1/checkout/express-guest (Idempotency: 8f9b...)</p>
          </div>
        )}

        {status === 'success' && (
          <div className="py-4 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <div className="text-base font-medium text-white">Order Confirmed #ORD-98214</div>
            <p className="text-xs text-spec-textMuted">Receipt sent to Apple Pay iCloud relay. 0 form fields typed!</p>
            <button
              onClick={handleReset}
              className="mt-2 text-xs text-spec-accent hover:underline flex items-center justify-center mx-auto space-x-1"
            >
              <span>Reset Demo Simulation</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
