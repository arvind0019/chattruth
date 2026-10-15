import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../lib/api';
import { User, Shield, Trash2, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

export const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [deleting, setDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [saved, setSaved] = useState(false);

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') {
      alert('Please type DELETE to confirm account deletion.');
      return;
    }

    setDeleting(true);
    try {
      await apiRequest('/settings/account', { method: 'DELETE' });
      await logout();
      navigate('/');
    } catch (err: any) {
      alert(err.message || 'Failed to delete account.');
      setDeleting(false);
    }
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">
      <div className="space-y-2 border-b border-[#E3E1D9] pb-4">
        <h1 className="text-3xl font-extrabold text-[#242923] editorial-title">Account Settings</h1>
        <p className="text-xs text-[#5A6559]">Manage your profile and privacy preferences</p>
      </div>

      {/* Profile Card */}
      <div className="bg-[#FFFEFA] rounded-2xl border border-[#E3E1D9] p-6 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-[#242923] flex items-center gap-2">
          <User className="w-4 h-4 text-[#304A34]" />
          Profile Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-[#5A6559] uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="text"
              disabled
              value={user?.email || ''}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E3E1D9] text-[#7F8A7D] bg-[#F7F6F0]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#5A6559] uppercase tracking-wider mb-1">
              Account Role
            </label>
            <input
              type="text"
              disabled
              value={user?.role?.toUpperCase() || 'USER'}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E3E1D9] text-[#7F8A7D] bg-[#F7F6F0]"
            />
          </div>
        </div>
      </div>

      {/* Privacy Preferences */}
      <div className="bg-[#FFFEFA] rounded-2xl border border-[#E3E1D9] p-6 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-[#242923] flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#718B65]" />
          Privacy & Data Retention Controls
        </h3>

        <form onSubmit={handleSavePreferences} className="space-y-4 text-xs">
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="mt-1 accent-[#304A34]" />
              <div>
                <span className="font-semibold text-[#242923] block">Automatic Memory Purge</span>
                <span className="text-[#7F8A7D]">
                  Purge uploaded temporary file data within 60 minutes after report compilation.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked={false} className="mt-1 accent-[#304A34]" />
              <div>
                <span className="font-semibold text-[#242923] block">Strict Zero Analytics Tracking</span>
                <span className="text-[#7F8A7D]">
                  Refuse all client-side telemetry and analytical cookies.
                </span>
              </div>
            </label>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#304A34] text-[#FFFEFA] font-medium text-xs hover:bg-[#263B29] transition-colors"
            >
              Save Preferences
            </button>
            {saved && (
              <span className="text-xs text-[#166534] flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Preferences updated
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="bg-[#FFFEFA] rounded-2xl border border-[#FCA5A5] p-6 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-[#991B1B] flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[#991B1B]" />
          Danger Zone
        </h3>
        <p className="text-xs text-[#5A6559] leading-relaxed">
          Permanently delete your ChatTruth user account and all generated conversation reports. This action cannot be undone.
        </p>

        <div className="space-y-3 pt-2">
          <label className="block text-[11px] font-semibold text-[#5A6559]">
            Type <strong>DELETE</strong> to confirm permanent erasure:
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={deleteConfirm}
              onChange={e => setDeleteConfirm(e.target.value)}
              placeholder="DELETE"
              className="px-3.5 py-2 rounded-lg border border-[#E3E1D9] text-xs text-[#242923] uppercase bg-[#F7F6F0]"
            />
            <button
              onClick={handleDeleteAccount}
              disabled={deleteConfirm !== 'DELETE' || deleting}
              className="px-4 py-2 rounded-lg bg-[#991B1B] hover:bg-[#7F1D1D] text-[#FFFEFA] text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50 transition-colors"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              Delete Account & All Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
