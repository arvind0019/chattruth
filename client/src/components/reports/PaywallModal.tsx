import React, { useState } from 'react';
import { X, Check, Lock, ShieldCheck, Loader2 } from 'lucide-react';
import { apiRequest } from '../../lib/api';

interface PaywallModalProps {
  reportId: string;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  reportId,
  isOpen,
  onClose,
  onPaymentSuccess,
}) => {
  const [provider, setProvider] = useState<'razorpay' | 'stripe'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      // 1. Create Order on backend
      const orderRes = await apiRequest<{ order: any }>('/payments/create-order', {
        method: 'POST',
        body: JSON.stringify({ reportId, provider }),
      });

      const order = orderRes.order;

      // 2. Perform payment verification with backend
      // In development / sandbox mode, verifies mock order directly server-side
      const verifyRes = await apiRequest<{ verified: boolean }>('/payments/verify', {
        method: 'POST',
        body: JSON.stringify({
          provider,
          orderId: order.orderId,
          paymentId: `mock_pay_${Date.now()}`,
          reportId,
        }),
      });

      if (verifyRes.verified) {
        onPaymentSuccess();
        onClose();
      } else {
        setErrorMsg('Payment verification could not be confirmed by the server.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment initiation failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-[#FFFEFA] rounded-2xl border border-[#E3E1D9] max-w-md w-full p-5 sm:p-8 shadow-xl relative animate-in fade-in duration-200 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#7F8A7D] hover:text-[#242923] hover:bg-[#F7F6F0]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-full bg-[#EDF3EB] text-[#304A34] mx-auto flex items-center justify-center mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-[#242923]">Unlock Full Conversation Report</h3>
          <p className="text-xs text-[#5A6559]">
            Transparent single-report unlock. No recurring subscriptions.
          </p>
        </div>

        {/* Pricing card */}
        <div className="bg-[#F7F6F0] rounded-xl p-4 border border-[#E3E1D9] text-center mb-6">
          <div className="text-3xl font-extrabold text-[#304A34]">
            {provider === 'razorpay' ? '₹499' : '$9.99'}
          </div>
          <p className="text-[11px] text-[#7F8A7D] mt-1">One-time payment • Lifetime report access</p>
        </div>

        {/* Features Checklist */}
        <div className="space-y-2.5 mb-6 text-xs text-[#242923]">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#166534] shrink-0" />
            <span>Complete verified findings with verbatim chat evidence</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#166534] shrink-0" />
            <span>Full recurring pattern & friction point analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#166534] shrink-0" />
            <span>Practical, tailored communication suggestions</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#166534] shrink-0" />
            <span>Hourly & daily response-time distributions</span>
          </div>
        </div>

        {/* Payment Provider Toggle */}
        <div className="mb-6">
          <label className="block text-[11px] font-semibold text-[#5A6559] uppercase tracking-wider mb-2">
            Payment Method
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setProvider('razorpay')}
              className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                provider === 'razorpay'
                  ? 'border-[#304A34] bg-[#EDF3EB] text-[#304A34]'
                  : 'border-[#E3E1D9] bg-[#FFFEFA] text-[#5A6559]'
              }`}
            >
              UPI / Cards (Razorpay)
            </button>
            <button
              type="button"
              onClick={() => setProvider('stripe')}
              className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                provider === 'stripe'
                  ? 'border-[#304A34] bg-[#EDF3EB] text-[#304A34]'
                  : 'border-[#E3E1D9] bg-[#FFFEFA] text-[#5A6559]'
              }`}
            >
              International (Stripe)
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-lg bg-[#FEE2E2] text-[#991B1B] text-xs">
            {errorMsg}
          </div>
        )}

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          disabled={isProcessing}
          className="w-full py-3.5 px-4 rounded-xl bg-[#304A34] hover:bg-[#263B29] text-[#FFFEFA] font-semibold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60 shadow-xs"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Verifying payment server-side...
            </>
          ) : (
            `Pay ${provider === 'razorpay' ? '₹499' : '$9.99'} & Unlock Report`
          )}
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#7F8A7D] mt-4">
          <ShieldCheck className="w-3.5 h-3.5 text-[#718B65]" />
          <span>256-bit encrypted • Server verified checkout</span>
        </div>
      </div>
    </div>
  );
};
