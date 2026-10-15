import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MessageSquareText, AlertCircle, Loader2 } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid email or password.');
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
          <h2 className="text-2xl font-bold text-[#242923]">Welcome back</h2>
          <p className="text-xs text-[#5A6559]">Sign in to access your conversation reports</p>
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
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-[#5A6559] uppercase tracking-wider">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-[#718B65] hover:text-[#304A34]">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E3E1D9] text-sm text-[#242923] focus:border-[#304A34] outline-hidden bg-[#F7F6F0]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#304A34] hover:bg-[#263B29] text-[#FFFEFA] font-semibold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-60 shadow-xs mt-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign in'}
          </button>
        </form>

        <div className="pt-4 border-t border-[#E3E1D9] text-center text-xs text-[#5A6559]">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-[#304A34] hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};
