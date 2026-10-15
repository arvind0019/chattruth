import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

export const Pricing: React.FC = () => {
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#242923] editorial-title">
          Simple, Transparent Pricing
        </h1>
        <p className="text-base text-[#5A6559]">
          No monthly subscriptions or recurring fees. Pay only when you want to unlock a full conversation report.
        </p>

        {/* Currency Switcher */}
        <div className="inline-flex items-center p-1 rounded-xl bg-[#EDF3EB] border border-[#DCE8D6] text-xs font-semibold">
          <button
            type="button"
            onClick={() => setCurrency('INR')}
            className={`px-4 py-1.5 rounded-lg transition-all ${
              currency === 'INR' ? 'bg-[#304A34] text-[#FFFEFA]' : 'text-[#5A6559]'
            }`}
          >
            INR (India / UPI)
          </button>
          <button
            type="button"
            onClick={() => setCurrency('USD')}
            className={`px-4 py-1.5 rounded-lg transition-all ${
              currency === 'USD' ? 'bg-[#304A34] text-[#FFFEFA]' : 'text-[#5A6559]'
            }`}
          >
            USD (International)
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Card 1: Free Preview */}
        <div className="bg-[#FFFEFA] rounded-2xl border border-[#E3E1D9] p-8 space-y-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#718B65]">
              Free Preview
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-[#242923]">$0</span>
              <span className="text-xs text-[#7F8A7D]">/ preview</span>
            </div>
            <p className="text-xs text-[#5A6559]">
              Instant conversation verification and fundamental communication metrics.
            </p>

            <ul className="space-y-3 pt-4 border-t border-[#E3E1D9] text-xs text-[#242923]">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#166534] shrink-0" />
                <span>Instant WhatsApp export validation</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#166534] shrink-0" />
                <span>Total messages & active participant count</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#166534] shrink-0" />
                <span>Overall conversation executive summary</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#166534] shrink-0" />
                <span>Participation balance percentage index</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#166534] shrink-0" />
                <span>2 sample findings with real quotes</span>
              </li>
            </ul>
          </div>

          <Link
            to="/analyze"
            className="w-full py-3 rounded-xl border border-[#304A34] text-[#304A34] hover:bg-[#F7F6F0] font-semibold text-xs text-center transition-colors mt-6"
          >
            Generate Free Preview
          </Link>
        </div>

        {/* Card 2: Full Report (Featured) */}
        <div className="bg-[#FFFEFA] rounded-2xl border-2 border-[#304A34] p-8 space-y-6 shadow-md relative flex flex-col justify-between">
          <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-[#304A34] text-[#FFFEFA] text-[10px] font-bold uppercase tracking-wider">
            Full Clarity
          </div>

          <div className="space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#304A34]">
              Comprehensive Report
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-[#304A34]">
                {currency === 'INR' ? '₹499' : '$9.99'}
              </span>
              <span className="text-xs text-[#7F8A7D]">/ single report</span>
            </div>
            <p className="text-xs text-[#5A6559]">
              Everything you need for complete, evidence-based conversational understanding.
            </p>

            <ul className="space-y-3 pt-4 border-t border-[#E3E1D9] text-xs text-[#242923]">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#166534] shrink-0" />
                <span><strong>All key findings</strong> with verified chat excerpts</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#166534] shrink-0" />
                <span>Plausible alternative explanations for each pattern</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#166534] shrink-0" />
                <span>24-hour time-of-day activity heatmap</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#166534] shrink-0" />
                <span>Median & average reply pacing distributions</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#166534] shrink-0" />
                <span>Tailored practical communication suggestions</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#166534] shrink-0" />
                <span>Lifetime access in user dashboard</span>
              </li>
            </ul>
          </div>

          <Link
            to="/analyze"
            className="w-full py-3.5 rounded-xl bg-[#304A34] hover:bg-[#263B29] text-[#FFFEFA] font-semibold text-xs text-center shadow-xs transition-colors mt-6 flex items-center justify-center gap-2"
          >
            Start Chat Analysis <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="max-w-3xl mx-auto bg-[#EDF3EB] rounded-2xl border border-[#DCE8D6] p-6 text-center space-y-2">
        <div className="flex items-center justify-center gap-2 font-bold text-sm text-[#304A34]">
          <ShieldCheck className="w-4 h-4 text-[#718B65]" />
          <span>Server-Verified Payments & Zero Subscription Traps</span>
        </div>
        <p className="text-xs text-[#5A6559] max-w-lg mx-auto leading-relaxed">
          Payments are handled securely via Razorpay and Stripe. We do not store card information and will never charge you on a recurring schedule.
        </p>
      </div>
    </div>
  );
};
