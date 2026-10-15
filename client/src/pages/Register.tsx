import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MessageSquareText, AlertCircle, Loader2 } from 'lucide-react';

export const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (!agreed) {
      setErrorMsg('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setLoading(true);
    try {
      await register(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-[#FFFEFA] rounded-2xl border border-[#E3E1D9] p-8 shadow-xs space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
            <img src="/logo.png" alt="ChatTruth" className="h-10 w-auto mx-auto object-contain mb-1" />
          </Link>
          <h2 className="text-2xl font-bold text-[#242923]">Create your account</h2>
          <p className="text-xs text-[#5A6559]">Start analyzing communication patterns today</p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-[#FEE2E2] text-[#991B1B] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

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

          <div>
            <label className="block text-xs font-semibold text-[#5A6559] uppercase tracking-wider mb-1.5">
              Password
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
              Confirm Password
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

          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              className="mt-1 accent-[#304A34]"
            />
            <label htmlFor="agree" className="text-xs text-[#5A6559] leading-relaxed">
              I agree to the{' '}
              <Link to="/terms" className="text-[#304A34] underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-[#304A34] underline">
                Privacy Policy
              </Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#304A34] hover:bg-[#263B29] text-[#FFFEFA] font-semibold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-60 shadow-xs mt-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
          </button>
        </form>

        <div className="pt-4 border-t border-[#E3E1D9] text-center text-xs text-[#5A6559]">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#304A34] hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
