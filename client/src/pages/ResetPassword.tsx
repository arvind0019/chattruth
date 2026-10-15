import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { apiRequest } from '../lib/api';
import { KeyRound, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

export const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      await apiRequest('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword: password }),
      });
      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to reset password. The link may have expired.');
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
          <h2 className="text-2xl font-bold text-[#242923]">Choose New Password</h2>
          <p className="text-xs text-[#5A6559]">Must contain at least 8 characters, 1 uppercase, 1 number</p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-[#FEE2E2] text-[#991B1B] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {success ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#DCFCE7] text-[#166534] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[#242923]">Password Successfully Updated</h4>
            <p className="text-xs text-[#5A6559]">You can now sign in with your updated credentials.</p>
            <div className="pt-4">
              <Link
                to="/login"
                className="inline-block px-5 py-2.5 rounded-lg bg-[#304A34] text-[#FFFEFA] text-xs font-semibold hover:bg-[#263B29] transition-colors"
              >
                Sign in to ChatTruth
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#5A6559] uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 8 chars, 1 uppercase, 1 number"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E3E1D9] text-sm text-[#242923] focus:border-[#304A34] outline-hidden bg-[#F7F6F0]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5A6559] uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E3E1D9] text-sm text-[#242923] focus:border-[#304A34] outline-hidden bg-[#F7F6F0]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#304A34] hover:bg-[#263B29] text-[#FFFEFA] font-semibold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-60 shadow-xs"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
