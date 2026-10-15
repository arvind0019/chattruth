import React, { useState } from 'react';
import { Mail, CheckCircle2, Send, MessageSquare } from 'lucide-react';

export const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDF3EB] text-[#304A34] text-xs font-semibold">
          <Mail className="w-3.5 h-3.5" />
          Support & Inquiries
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#242923] editorial-title">
          Get in Touch
        </h1>
        <p className="text-sm text-[#5A6559] max-w-md mx-auto">
          Have questions about chat exports, security, or enterprise inquiries? Our team is here to assist.
        </p>
      </div>

      <div className="bg-[#FFFEFA] rounded-2xl border border-[#E3E1D9] p-8 shadow-xs">
        {submitted ? (
          <div className="text-center py-10 space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#DCFCE7] text-[#166534] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#242923]">Message Sent Successfully</h3>
            <p className="text-xs text-[#5A6559] max-w-sm mx-auto">
              Thank you for reaching out. A support engineer will review your message and reply to <strong>{email}</strong> within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#5A6559] uppercase tracking-wider mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Alex Morgan"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E3E1D9] text-sm text-[#242923] focus:border-[#304A34] outline-hidden bg-[#F7F6F0]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A6559] uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E3E1D9] text-sm text-[#242923] focus:border-[#304A34] outline-hidden bg-[#F7F6F0]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5A6559] uppercase tracking-wider mb-1.5">
                Message
              </label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="How can we help you?"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E3E1D9] text-sm text-[#242923] focus:border-[#304A34] outline-hidden bg-[#F7F6F0] resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#304A34] hover:bg-[#263B29] text-[#FFFEFA] font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </form>
        )}
      </div>

      <div className="text-center text-xs text-[#7F8A7D]">
        Direct email: <a href="mailto:support@chattruth.app" className="font-semibold text-[#304A34]">support@chattruth.app</a>
      </div>
    </div>
  );
};
