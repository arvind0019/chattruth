import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../lib/api';
import { Plus, FileText, Trash2, ArrowRight, Loader2, Calendar, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

interface ReportListItem {
  id: string;
  title: string;
  category: string;
  conciseSummary: string;
  totalMessages: number;
  participants: string[];
  isPaid: boolean;
  createdAt: string;
}

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<ReportListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      const data = await apiRequest<{ reports: ReportListItem[] }>('/reports');
      setReports(data.reports);
    } catch (err) {
      console.error('Failed to load user reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!window.confirm('Are you sure you want to permanently delete this report? This action cannot be undone.')) {
      return;
    }

    setDeletingId(id);
    try {
      await apiRequest(`/reports/${id}`, { method: 'DELETE' });
      setReports(prev => prev.filter(r => r.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete report.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
      {/* Welcome Banner */}
      <div className="bg-[#FFFEFA] rounded-2xl border border-[#E3E1D9] p-6 sm:p-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-xs">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#718B65]">User Portal</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#242923]">
            Welcome, {user?.email}
          </h1>
          <p className="text-xs text-[#5A6559] mt-1">
            Manage your analyzed conversation reports and review communication patterns.
          </p>
        </div>

        <Link
          to="/analyze"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#304A34] hover:bg-[#263B29] text-[#FFFEFA] text-xs font-semibold shadow-xs transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Analyze New Chat
        </Link>
      </div>

      {/* Reports List Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-[#E3E1D9] pb-3">
          <h2 className="text-lg font-bold text-[#242923] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#304A34]" />
            Your Conversation Reports ({reports.length})
          </h2>
          <Link to="/settings" className="text-xs text-[#718B65] hover:text-[#304A34] font-medium">
            Account Settings
          </Link>
        </div>

        {loading ? (
          <div className="bg-[#FFFEFA] rounded-2xl border border-[#E3E1D9] p-12 text-center space-y-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#304A34] mx-auto" />
            <p className="text-xs text-[#5A6559]">Loading your conversation reports...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="bg-[#FFFEFA] rounded-2xl border border-dashed border-[#E3E1D9] p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#EDF3EB] text-[#304A34] flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#242923]">No conversation reports yet</h3>
            <p className="text-xs text-[#5A6559] max-w-sm mx-auto">
              Upload an exported WhatsApp .txt chat to uncover conversation dynamics, response patterns, and key findings.
            </p>
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#304A34] hover:bg-[#263B29] text-[#FFFEFA] text-xs font-semibold shadow-xs transition-colors"
            >
              Analyze Your First Chat
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-[#FFFEFA] rounded-xl border border-[#E3E1D9] p-5 shadow-xs hover:border-[#718B65] transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-4"
              >
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F7F6F0] text-[#5A6559] border border-[#E3E1D9]">
                      {report.category}
                    </span>
                    {report.isPaid ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#DCFCE7] text-[#166534] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Full Report
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FEF3C7] text-[#B45309] flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Free Preview
                      </span>
                    )}
                    <span className="text-xs text-[#7F8A7D] flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {formatDate(report.createdAt)}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#242923] hover:text-[#304A34] transition-colors">
                    <Link to={`/reports/${report.id}`}>{report.title}</Link>
                  </h3>

                  <p className="text-xs text-[#5A6559] line-clamp-2 leading-relaxed">
                    {report.conciseSummary}
                  </p>

                  <div className="text-[11px] text-[#7F8A7D]">
                    {report.totalMessages} messages • Participants: {report.participants.join(', ')}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/reports/${report.id}`}
                    className="px-4 py-2 rounded-lg bg-[#304A34] hover:bg-[#263B29] text-[#FFFEFA] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    View Report <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={(e) => handleDelete(report.id, e)}
                    disabled={deletingId === report.id}
                    title="Delete report permanently"
                    className="p-2 rounded-lg text-[#7F8A7D] hover:text-[#991B1B] hover:bg-[#FEE2E2] transition-colors disabled:opacity-50"
                  >
                    {deletingId === report.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-[#EDF3EB] rounded-xl p-4 border border-[#DCE8D6] text-xs text-[#304A34] flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-[#718B65] shrink-0" />
        <span>You have permanent control over your reports. Deleting a report permanently purges all metrics from the database.</span>
      </div>
    </div>
  );
};
