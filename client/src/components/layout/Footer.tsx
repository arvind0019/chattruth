import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Scale, 
  Heart,
  MessageCircle
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#FFFEFA] border-t border-[#E3E1D9] text-[#5A6559] mt-24">
      {/* Top Pre-Footer Callout */}
      <div className="border-b border-[#E3E1D9] bg-gradient-to-r from-[#F0FDF4]/50 via-[#EFF6FF]/60 to-[#FDF4FF]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen WhatsApp AI Analyzer</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#1E293B]">
                Ready to uncover the real truth in your chats?
              </h3>
              <p className="text-sm text-[#64748B] max-w-xl">
                Unbiased stats, clear conflict verdicts, and genuine intent decoding. No speculation, pure conversation evidence.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/analyze"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0066FF] text-white text-sm font-semibold shadow-sm hover:bg-[#0052CC] transition-all hover:shadow-md"
              >
                <span>Analyze Chat Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/sample-report"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-[#CBD5E1] text-[#334155] text-sm font-medium hover:bg-[#F8FAFC] transition-colors"
              >
                <span>View Sample Report</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand & Mission (Spans 2 cols on desktop) */}
          <div className="space-y-4 lg:col-span-2">
            <Link to="/" className="inline-block group">
              <img 
                src="/logo.png" 
                alt="ChatTruth" 
                className="h-10 w-auto object-contain transition-transform group-hover:scale-105" 
              />
            </Link>
            <p className="text-sm text-[#64748B] leading-relaxed max-w-sm">
              ChatTruth provides deep, evidence-grounded WhatsApp conversation dynamics. Decoding response rhythms, balance of effort, and giving clear, honest verdicts on complex relationship and friend chats.
            </p>

            {/* Indian Context Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-medium text-[#334155]">
              <span className="text-base">🇮🇳</span>
              <span>Specially optimized for Hinglish & Indian WhatsApp idioms</span>
            </div>

            {/* Privacy Proof Badges */}
            <div className="pt-2 space-y-2 text-xs text-[#475569]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero Permanent Chat Storage — in-memory processing only</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Google Enterprise API — zero AI model training on your data</span>
              </div>
            </div>
          </div>

          {/* Col 1: Solutions */}
          <div>
            <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-[#0066FF]" />
              Analysis Modes
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/relationship" className="text-[#64748B] hover:text-[#0066FF] transition-colors flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  Relationships & Dating
                </Link>
              </li>
              <li>
                <Link to="/friends" className="text-[#64748B] hover:text-[#0066FF] transition-colors">
                  Friendships & Groups
                </Link>
              </li>
              <li>
                <Link to="/family" className="text-[#64748B] hover:text-[#0066FF] transition-colors">
                  Family Conversations
                </Link>
              </li>
              <li>
                <Link to="/analyze" className="text-[#64748B] hover:text-[#0066FF] transition-colors">
                  Upload WhatsApp (.txt)
                </Link>
              </li>
              <li>
                <Link to="/sample-report" className="text-[#64748B] hover:text-[#0066FF] transition-colors">
                  Interactive Demo Report
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Core Intelligence */}
          <div>
            <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-[#0066FF]" />
              Intelligence
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="text-[#334155] font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Kaun Galat / Sahi Verdicts
                </span>
              </li>
              <li>
                <span className="text-[#64748B] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                  Hinglish Intent Decoding
                </span>
              </li>
              <li>
                <span className="text-[#64748B] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
                  Response Delay Rhythms
                </span>
              </li>
              <li>
                <span className="text-[#64748B] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                  Verified Evidence Quotes
                </span>
              </li>
              <li>
                <span className="text-[#64748B] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />
                  WhatsApp Reply Scripts
                </span>
              </li>
            </ul>
          </div>

          {/* Col 3: Trust & Company */}
          <div>
            <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#0066FF]" />
              Trust & Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/pricing" className="text-[#64748B] hover:text-[#0066FF] transition-colors">
                  Transparent Pricing
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-[#64748B] hover:text-[#0066FF] transition-colors flex items-center gap-1">
                  Privacy Policy & Retention
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-[#64748B] hover:text-[#0066FF] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-[#64748B] hover:text-[#0066FF] transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[#64748B] hover:text-[#0066FF] transition-colors">
                  Contact & Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Live System Status & Security Bar */}
        <div className="mt-12 p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-medium text-[#334155]">
              Gemini 3.8 Flash AI Engine Active • All Analysis Pipelines Operational
            </span>
          </div>

          <div className="flex items-center gap-4 text-[#64748B]">
            <span className="inline-flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-600" />
              256-Bit SSL Secured
            </span>
            <span>•</span>
            <span>DPDP Act 2023 Compliant</span>
          </div>
        </div>

        {/* Bottom Copyright & Fine Print */}
        <div className="mt-8 pt-6 border-t border-[#E3E1D9] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#94A3B8]">
          <p>© {new Date().getFullYear()} ChatTruth. All rights reserved. Built for clarity, honesty, and better human connections.</p>
          <div className="flex items-center gap-6 text-[#64748B]">
            <Link to="/privacy" className="hover:text-[#0066FF] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#0066FF] transition-colors">Terms of Use</Link>
            <Link to="/contact" className="hover:text-[#0066FF] transition-colors">Help Center</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
