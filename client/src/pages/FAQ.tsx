import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    category: 'Privacy & Security',
    question: 'Are my private chat messages stored permanently on your servers?',
    answer:
      'No. ChatTruth does not store raw chat contents permanently. The uploaded export is processed in-memory to calculate deterministic statistics and generate your report. Any temporary upload files are purged automatically within 60 minutes.',
  },
  {
    category: 'Privacy & Security',
    question: 'Does ChatTruth or Google train AI models on my conversations?',
    answer:
      'No. ChatTruth accesses Google Gemini via the enterprise-tier developer API with zero data training consent. Your private chat messages are never used to train or refine public machine learning models.',
  },
  {
    category: 'Analysis & Accuracy',
    question: 'How do you prevent the AI from making up quotes or events?',
    answer:
      'Every excerpt displayed in your report passes through our server-side Evidence Verification Engine. If an excerpt quote does not match verbatim in the actual chat messages, it is flagged and discarded. We never permit fabricated quotes.',
  },
  {
    category: 'Analysis & Accuracy',
    question: 'Can ChatTruth tell me if my partner is cheating or lying?',
    answer:
      'No. ChatTruth strictly avoids definitive speculative claims about infidelity, romantic destiny, or clinical diagnoses. Text messages inherently lack tone of voice and facial expression. Our analysis provides measured conversational patterns and plausible alternative interpretations to encourage healthy communication.',
  },
  {
    category: 'Formats & Usage',
    question: 'Which formats are supported?',
    answer:
      'Currently, ChatTruth supports WhatsApp plain-text exports (.txt) generated on Android and iPhone devices without media attachments. Instagram and Telegram plain-text adapters are planned for future updates.',
  },
  {
    category: 'Billing',
    question: 'Is this a monthly subscription?',
    answer:
      'No. ChatTruth operates on a transparent pay-per-report model. You can generate a free preview with basic statistics for any conversation. You only pay (₹499 INR / $9.99 USD) when you explicitly choose to unlock a full report.',
  },
  {
    category: 'Data Control',
    question: 'Can I delete my reports and account?',
    answer:
      'Yes. You have total data sovereignty. You can delete individual reports at any time with a single click, or permanently delete your entire account and all associated records from your Settings page.',
  },
];

export const FAQ: React.FC = () => {
  const [openIndices, setOpenIndices] = useState<Record<number, boolean>>({ 0: true, 1: true });

  const toggle = (idx: number) => {
    setOpenIndices(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDF3EB] text-[#304A34] text-xs font-semibold">
          <HelpCircle className="w-3.5 h-3.5" />
          Transparency & Answers
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#242923] editorial-title">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-[#5A6559] max-w-lg mx-auto">
          Everything you need to know about our privacy architecture, AI analysis methods, and pricing.
        </p>
      </div>

      <div className="space-y-4">
        {FAQ_DATA.map((item, idx) => (
          <div
            key={idx}
            className="bg-[#FFFEFA] rounded-xl border border-[#E3E1D9] overflow-hidden shadow-xs"
          >
            <button
              type="button"
              onClick={() => toggle(idx)}
              className="w-full p-5 text-left flex justify-between items-center gap-4 hover:bg-[#F7F6F0] transition-colors"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#718B65]">
                  {item.category}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-[#242923]">{item.question}</h4>
              </div>
              <div className="text-[#5A6559] shrink-0">
                {openIndices[idx] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {openIndices[idx] && (
              <div className="px-5 pb-5 pt-1 text-xs text-[#5A6559] leading-relaxed border-t border-[#E3E1D9]/60">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Support Box */}
      <div className="bg-[#EDF3EB] rounded-2xl border border-[#DCE8D6] p-8 text-center space-y-3">
        <h4 className="text-base font-bold text-[#242923]">Still have questions?</h4>
        <p className="text-xs text-[#5A6559] max-w-md mx-auto">
          We are always happy to help explain how your conversation data is processed and protected.
        </p>
        <Link
          to="/contact"
          className="inline-block px-5 py-2.5 rounded-lg bg-[#304A34] text-[#FFFEFA] text-xs font-semibold hover:bg-[#263B29] transition-colors"
        >
          Contact Support Team
        </Link>
      </div>
    </div>
  );
};
