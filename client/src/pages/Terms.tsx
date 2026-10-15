import React from 'react';
import { FileCheck, AlertCircle } from 'lucide-react';

export const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
      <div className="space-y-3 border-b border-[#E3E1D9] pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDF3EB] text-[#304A34] text-xs font-semibold">
          <FileCheck className="w-3.5 h-3.5" />
          Service Agreement
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#242923] editorial-title">
          Terms of Service
        </h1>
        <p className="text-xs text-[#7F8A7D]">Last updated: October 2026</p>
      </div>

      <div className="prose prose-sm max-w-none text-[#5A6559] space-y-8 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#242923]">1. Acceptance of Terms</h2>
          <p>
            By accessing or using ChatTruth ("the Service"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use the Service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#242923]">2. Intended Use & Nature of Analysis</h2>
          <div className="p-4 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <strong>Important Disclaimer:</strong> ChatTruth provides linguistic and conversational pattern analysis for personal reflection and communication improvement. ChatTruth does NOT provide psychological counseling, marriage therapy, legal counsel, or forensic determinations of relationship infidelity.
            </div>
          </div>
          <p className="pt-2">
            You agree to use the Service solely for lawful purposes. You represent that you have the right or mutual consent to process conversations uploaded to the platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#242923]">3. Payment & Pay-Per-Report Terms</h2>
          <p>
            ChatTruth offers free preliminary previews and paid comprehensive report unlocks. All prices are displayed explicitly prior to purchase. Payments are verified through server-side cryptographic signatures. Once a full report is generated and verified, fees are non-refundable except where technical failure prevents report generation.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#242923]">4. Limitation of Liability</h2>
          <p>
            In no event shall ChatTruth, its operators, or affiliates be liable for any indirect, incidental, consequential, or punitive damages arising from interpersonal decisions made pursuant to conversation reports.
          </p>
        </section>
      </div>
    </div>
  );
};
