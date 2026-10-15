import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../lib/api';
import { KeyRound, ArrowLeft, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      await apiRequest('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit password reset request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-[#FFFEFA] rounded-2xl border border-[#E3E1D9] p-8 shadow-xs space-y-6">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#304A34] text-[#FFFEFA] flex items-center justify-center mx-auto">
            <KeyRound className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-[#242923]">Reset Password</h2>
          <p className="text-xs text-[#5A6559]">Enter your account email to receive reset instructions</p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-[#FEE2E2] text-[#991B1B] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {submitted ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#DCFCE7] text-[#166534] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[#242923]">Instructions Dispatched</h4>
            <p className="text-xs text-[#5A6559] leading-relaxed">
              If an account exists for <strong>{email}</strong>, a secure reset link has been dispatched. Please check your inbox.
            </p>
            <div className="pt-4">
              <Link to="/login" className="text-xs font-semibold text-[#304A34] hover:underline">
                Back to Sign in
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#5A6559] uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E3E1D9] text-sm text-[#242923] focus:border-[#304A34] outline-hidden bg-[#F7F6F0]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#304A34] hover:bg-[#263B29] text-[#FFFEFA] font-semibold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-60 shadow-xs"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div className="pt-2 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-[#7F8A7D] hover:text-[#242923]"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
