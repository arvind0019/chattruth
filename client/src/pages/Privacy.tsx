import React from 'react';
import { ShieldCheck, Lock, Trash2, Database, EyeOff } from 'lucide-react';

export const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
      <div className="space-y-3 border-b border-[#E3E1D9] pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDF3EB] text-[#304A34] text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          Data Protection Policy
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#242923] editorial-title">
          Privacy Policy
        </h1>
        <p className="text-xs text-[#7F8A7D]">
          Effective Date: October 2026 • Compliant with Indian DPDP Act 2023 & Global Privacy Standards
        </p>
      </div>

      <div className="prose prose-sm max-w-none text-[#5A6559] space-y-8 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#242923] flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#718B65]" /> 1. Overview & Privacy First Architecture
          </h2>
          <p>
            At ChatTruth, we treat personal messaging data as exceptionally sensitive. Our core engineering principle is <strong>minimal data retention</strong>: we only process what is mathematically and contextually necessary to generate your conversation dynamics report, and we never maintain permanent archives of your raw chat text.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#242923] flex items-center gap-2">
            <Database className="w-4 h-4 text-[#718B65]" /> 2. Information We Process
          </h2>
          <p>
            When you use ChatTruth, we process the following categories of information:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs">
            <li><strong>Account Credentials:</strong> Email address and hashed passwords (Argon2id/bcrypt) when you create an account.</li>
            <li><strong>Chat Exports (.txt):</strong> The plain-text conversation file you upload. This is processed in-memory to compute message counts, timestamps, and active participants.</li>
            <li><strong>Generated Reports:</strong> The structured analytical output (verified statistics, observation cards, communication patterns) associated with your account.</li>
            <li><strong>Transactional Records:</strong> Payment provider order IDs and verification signatures (credit card and banking data are processed exclusively by Razorpay and Stripe; we never store your payment details).</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#242923] flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-[#718B65]" /> 3. AI Processing & Google Gemini
          </h2>
          <p>
            ChatTruth utilizes Google Gemini API for structured semantic analysis. Under our enterprise developer agreement:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs">
            <li>Your conversation content is <strong>never used to train or fine-tune Google AI models</strong>.</li>
            <li>API communications are conducted strictly server-to-server over encrypted TLS 1.3 channels.</li>
            <li>AI prompts enforce strict redaction protocols and do not request or infer personally identifiable government IDs, financial numbers, or addresses.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#242923] flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-[#718B65]" /> 4. Data Retention & Deletion Workflows
          </h2>
          <p>
            We enforce strict automated data lifecycles:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs">
            <li><strong>Temporary Upload Files:</strong> Any server-side temporary buffers are automatically purged within 60 minutes of upload.</li>
            <li><strong>1-Click Report Deletion:</strong> You can permanently delete any report at any moment from your dashboard. Deletion permanently erases the report record and all metrics.</li>
            <li><strong>Account Deletion:</strong> Deleting your account from Settings permanently wipes your user profile, all associated reports, and audit identifiers.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#242923]">5. Your Legal Rights</h2>
          <p>
            Under the Digital Personal Data Protection Act (DPDP Act 2023) and GDPR, you possess the right to access, rectify, port, or erase your personal data at any time. To exercise these rights or contact our Data Protection Officer, email <code>privacy@chattruth.app</code>.
          </p>
        </section>
      </div>
    </div>
  );
};
