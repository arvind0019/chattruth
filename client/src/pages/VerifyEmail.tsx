import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { apiRequest } from '../lib/api';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setErrorMsg('No verification token provided in URL.');
      setLoading(false);
      return;
    }

    apiRequest('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    })
      .then(() => setSuccess(true))
      .catch(err => setErrorMsg(err.message || 'Verification token is invalid or expired.'))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-[#FFFEFA] rounded-2xl border border-[#E3E1D9] p-8 text-center space-y-6 shadow-xs">
        {loading ? (
          <div className="py-8 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#304A34] mx-auto" />
            <h3 className="text-base font-bold text-[#242923]">Verifying your email address...</h3>
          </div>
        ) : success ? (
          <div className="py-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#DCFCE7] text-[#166534] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#242923]">Email Verified</h3>
            <p className="text-xs text-[#5A6559]">
              Your email address has been successfully verified. You can now access your full dashboard and reports.
            </p>
            <div className="pt-4">
              <Link
                to="/dashboard"
                className="inline-block px-5 py-2.5 rounded-lg bg-[#304A34] text-[#FFFEFA] text-xs font-semibold hover:bg-[#263B29] transition-colors"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <div className="py-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#FEE2E2] text-[#991B1B] flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#242923]">Verification Failed</h3>
            <p className="text-xs text-[#5A6559]">{errorMsg}</p>
            <div className="pt-4">
              <Link
                to="/login"
                className="inline-block px-5 py-2.5 rounded-lg bg-[#304A34] text-[#FFFEFA] text-xs font-semibold hover:bg-[#263B29] transition-colors"
              >
                Back to Sign in
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
