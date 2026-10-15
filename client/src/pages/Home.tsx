import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Heart, Users, Home as HomeIcon, CheckCircle2, Lock, Sparkles, MessageSquare, Zap, Clock } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="space-y-24 py-8 sm:py-16">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center px-4 space-y-6">
        <div className="flex justify-center mb-1">
          <img 
            src="/logo.png" 
            alt="ChatTruth Logo" 
            className="h-14 sm:h-16 w-auto object-contain hover:scale-105 transition-transform duration-300" 
          />
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EDF3EB] border border-[#DCE8D6] text-xs font-semibold text-[#304A34]">
          <Sparkles className="w-3.5 h-3.5 text-[#718B65]" />
          <span>Evidence-Grounded Conversation Analysis</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#242923] leading-tight editorial-title">
          Understand more.<br />
          <span className="text-[#304A34]">Assume less.</span>
        </h1>

        <p className="text-base sm:text-xl text-[#5A6559] max-w-2xl mx-auto leading-relaxed">
          ChatTruth analyzes communication patterns, recurring themes, and response rhythms in your WhatsApp chats using verified statistics and thoughtful AI.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            to="/analyze"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#304A34] hover:bg-[#263B29] text-[#FFFEFA] font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            Analyze a chat
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/sample-report"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#FFFEFA] hover:bg-[#F7F6F0] text-[#242923] border border-[#E3E1D9] font-semibold text-sm transition-all text-center"
          >
            View sample report
          </Link>
        </div>

        {/* Formats banner */}
        <div className="flex items-center justify-center gap-6 pt-6 text-xs text-[#7F8A7D]">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#718B65]" />
            <span>WhatsApp .txt exports</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#718B65]" />
            <span>Android & iPhone</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#718B65]" />
            <span>Private & temporary</span>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#242923] editorial-title">
            Tailored for What Matters Most
          </h2>
          <p className="text-sm text-[#5A6559] max-w-lg mx-auto">
            Choose the right context to ensure the AI evaluates conversational pacing and tone with sensitivity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Relationships */}
          <div className="bg-[#FFFEFA] rounded-2xl border border-[#E3E1D9] p-7 space-y-4 shadow-xs hover:border-[#718B65] transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FEE2E2] text-[#991B1B] flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#242923]">Relationships & Dating</h3>
              <p className="text-xs text-[#5A6559] leading-relaxed">
                Gain clarity on conversational balance, mutual effort, affection indicators, and communication friction without guessing or overthinking.
              </p>
            </div>
            <Link
              to="/relationship"
              className="text-xs font-semibold text-[#304A34] hover:text-[#263B29] inline-flex items-center gap-1 pt-2"
            >
              Analyze relationship chat <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: Friendships */}
          <div className="bg-[#FFFEFA] rounded-2xl border border-[#E3E1D9] p-7 space-y-4 shadow-xs hover:border-[#718B65] transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#EDF3EB] text-[#304A34] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#242923]">Friends & Group Chats</h3>
              <p className="text-xs text-[#5A6559] leading-relaxed">
                Discover who initiates conversations, track group dynamics, response patterns, and inside joke frequencies across friendship circles.
              </p>
            </div>
            <Link
              to="/friends"
              className="text-xs font-semibold text-[#304A34] hover:text-[#263B29] inline-flex items-center gap-1 pt-2"
            >
              Analyze friends chat <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: Family */}
          <div className="bg-[#FFFEFA] rounded-2xl border border-[#E3E1D9] p-7 space-y-4 shadow-xs hover:border-[#718B65] transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#B45309] flex items-center justify-center">
                <HomeIcon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#242923]">Family Dynamics</h3>
              <p className="text-xs text-[#5A6559] leading-relaxed">
                Understand generational communication styles, family check-in habits, coordination trends, and tone shifts across siblings and parents.
              </p>
            </div>
            <Link
              to="/family"
              className="text-xs font-semibold text-[#304A34] hover:text-[#263B29] inline-flex items-center gap-1 pt-2"
            >
              Analyze family chat <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-5xl mx-auto px-4 bg-[#FFFEFA] rounded-3xl border border-[#E3E1D9] p-8 sm:p-14 shadow-xs">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#242923] editorial-title">
            How ChatTruth Works
          </h2>
          <p className="text-sm text-[#5A6559]">
            Three simple steps from WhatsApp export to deep conversational clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3 text-center sm:text-left">
            <div className="w-9 h-9 rounded-full bg-[#304A34] text-[#FFFEFA] flex items-center justify-center font-bold text-sm mx-auto sm:mx-0">
              1
            </div>
            <h4 className="text-base font-bold text-[#242923]">Export Chat</h4>
            <p className="text-xs text-[#5A6559] leading-relaxed">
              In WhatsApp, tap <em>More &gt; Export chat &gt; Without Media</em>. Save the resulting plain-text file (.txt).
            </p>
          </div>

          <div className="space-y-3 text-center sm:text-left">
            <div className="w-9 h-9 rounded-full bg-[#718B65] text-[#FFFEFA] flex items-center justify-center font-bold text-sm mx-auto sm:mx-0">
              2
            </div>
            <h4 className="text-base font-bold text-[#242923]">Upload & Preview</h4>
            <p className="text-xs text-[#5A6559] leading-relaxed">
              Drop the file into our secure preview parser. We confirm total messages, active participants, and date ranges before analysis.
            </p>
          </div>

          <div className="space-y-3 text-center sm:text-left">
            <div className="w-9 h-9 rounded-full bg-[#A3B899] text-[#242923] flex items-center justify-center font-bold text-sm mx-auto sm:mx-0">
              3
            </div>
            <h4 className="text-base font-bold text-[#242923]">Read Evidence Report</h4>
            <p className="text-xs text-[#5A6559] leading-relaxed">
              Explore verified statistics, message frequency charts, identified communication patterns, and constructive suggestions.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Teaser Metric Bar */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-[#EDF3EB] rounded-2xl border border-[#DCE8D6] p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#304A34]">
              <ShieldCheck className="w-4 h-4 text-[#718B65]" />
              Strict Ethical Safeguards
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#242923]">
              Grounding every insight in real messages.
            </h3>
            <p className="text-xs text-[#5A6559] max-w-lg leading-relaxed">
              Unlike speculative chatbots, ChatTruth verifies all excerpt quotes against the actual text. We never invent quotes or assume private thoughts.
            </p>
          </div>
          <Link
            to="/sample-report"
            className="px-6 py-3 rounded-xl bg-[#304A34] hover:bg-[#263B29] text-[#FFFEFA] font-medium text-xs whitespace-nowrap shadow-xs transition-colors"
          >
            Explore Sample Report
          </Link>
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-3xl mx-auto text-center px-4 space-y-5">
        <h2 className="text-3xl font-extrabold text-[#242923] editorial-title">
          Ready to discover your conversation's rhythm?
        </h2>
        <p className="text-sm text-[#5A6559] max-w-md mx-auto">
          Start with a free preview including verified statistics, response time metrics, and key communication insights.
        </p>
        <Link
          to="/analyze"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#304A34] hover:bg-[#263B29] text-[#FFFEFA] font-semibold text-sm shadow-xs transition-all"
        >
          Upload Chat & Generate Free Preview
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
};
