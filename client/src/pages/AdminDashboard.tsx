import React, { useEffect, useState } from 'react';
import { apiRequest } from '../lib/api';
import { Shield, Users, FileText, DollarSign, Activity, AlertCircle, RefreshCw, Loader2, Database, Clock } from 'lucide-react';

interface MetricsData {
  totalUsers: number;
  totalReports: number;
  completedReports: number;
  failedReports: number;
  processingJobs: number;
  totalRevenue: number;
  currency: string;
  conversionRate: number;
  systemHealth: {
    database: { isConnected: boolean; isInMemoryFallback: boolean; engine: string };
    uptimeSeconds: number;
    memoryUsageMb: number;
  };
}

export const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState<'metrics' | 'users' | 'reports' | 'payments' | 'jobs' | 'logs'>('metrics');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchAdminData = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const [m, u, r, p, j, l] = await Promise.all([
        apiRequest<MetricsData>('/admin/metrics'),
        apiRequest<{ users: any[] }>('/admin/users'),
        apiRequest<{ reports: any[] }>('/admin/reports'),
        apiRequest<{ payments: any[] }>('/admin/payments'),
        apiRequest<{ jobs: any[] }>('/admin/jobs'),
        apiRequest<{ logs: any[] }>('/admin/logs'),
      ]);

      setMetrics(m);
      setUsers(u.users || []);
      setReports(r.reports || []);
      setPayments(p.payments || []);
      setJobs(j.jobs || []);
      setLogs(l.logs || []);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to fetch administrator data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Change user role to ${newRole}?`)) return;

    try {
      await apiRequest(`/admin/users/${userId}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role: newRole }),
      });
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to update user role.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#304A34]" />
        <p className="text-xs text-[#5A6559]">Loading administrator control panel...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-[#FFFEFA] rounded-2xl border border-[#E3E1D9] text-center space-y-4 shadow-xs">
        <div className="w-12 h-12 rounded-full bg-[#FEE2E2] text-[#991B1B] flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-[#242923]">Access Denied</h3>
        <p className="text-xs text-[#5A6559]">{errorMsg}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#E3E1D9] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDF3EB] text-[#304A34] text-xs font-semibold mb-2">
            <Shield className="w-3.5 h-3.5" />
            Administrator Control Panel
          </div>
          <h1 className="text-3xl font-extrabold text-[#242923] editorial-title">
            Platform Analytics & Governance
          </h1>
        </div>

        <button
          onClick={fetchAdminData}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E3E1D9] bg-[#FFFEFA] hover:bg-[#F7F6F0] text-xs font-semibold text-[#242923] shadow-xs self-start sm:self-auto transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
        </button>
      </div>

      {/* Metrics Row */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#FFFEFA] p-5 rounded-xl border border-[#E3E1D9] shadow-xs">
            <div className="flex items-center gap-2 text-xs text-[#5A6559] mb-1">
              <Users className="w-4 h-4 text-[#718B65]" /> Total Users
            </div>
            <p className="text-2xl font-bold text-[#242923]">{metrics.totalUsers}</p>
            <span className="text-[11px] text-[#7F8A7D]">Registered accounts</span>
          </div>

          <div className="bg-[#FFFEFA] p-5 rounded-xl border border-[#E3E1D9] shadow-xs">
            <div className="flex items-center gap-2 text-xs text-[#5A6559] mb-1">
              <FileText className="w-4 h-4 text-[#718B65]" /> Total Reports
            </div>
            <p className="text-2xl font-bold text-[#242923]">{metrics.totalReports}</p>
            <span className="text-[11px] text-[#166534]">{metrics.completedReports} completed</span>
          </div>

          <div className="bg-[#FFFEFA] p-5 rounded-xl border border-[#E3E1D9] shadow-xs">
            <div className="flex items-center gap-2 text-xs text-[#5A6559] mb-1">
              <DollarSign className="w-4 h-4 text-[#718B65]" /> Revenue
            </div>
            <p className="text-2xl font-bold text-[#304A34]">
              ₹{metrics.totalRevenue.toLocaleString()}
            </p>
            <span className="text-[11px] text-[#7F8A7D]">Conversion: {metrics.conversionRate}%</span>
          </div>

          <div className="bg-[#FFFEFA] p-5 rounded-xl border border-[#E3E1D9] shadow-xs">
            <div className="flex items-center gap-2 text-xs text-[#5A6559] mb-1">
              <Activity className="w-4 h-4 text-[#718B65]" /> Active Jobs
            </div>
            <p className="text-2xl font-bold text-[#242923]">{metrics.processingJobs}</p>
            <span className="text-[11px] text-[#7F8A7D]">In-queue / processing</span>
          </div>
        </div>
      )}

      {/* System Health Banner */}
      {metrics?.systemHealth && (
        <div className="bg-[#F7F6F0] p-4 rounded-xl border border-[#E3E1D9] flex flex-wrap items-center justify-between gap-4 text-xs text-[#5A6559]">
          <div className="flex items-center gap-2 font-semibold text-[#242923]">
            <Database className="w-4 h-4 text-[#718B65]" />
            <span>Database Storage:</span>
            <span className="px-2 py-0.5 rounded bg-[#EDF3EB] text-[#304A34] uppercase font-bold">
              {metrics.systemHealth.database.engine}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#718B65]" />
            <span>Server Uptime: {metrics.systemHealth.uptimeSeconds}s</span>
          </div>
          <div>Heap Memory: {metrics.systemHealth.memoryUsageMb} MB</div>
        </div>
      )}

      {/* Admin Tabs */}
      <div className="border-b border-[#E3E1D9] flex gap-2 overflow-x-auto pb-1">
        {(['metrics', 'users', 'reports', 'payments', 'jobs', 'logs'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg capitalize transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'bg-[#304A34] text-[#FFFEFA]'
                : 'text-[#5A6559] hover:text-[#242923] hover:bg-[#F7F6F0]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-[#FFFEFA] rounded-2xl border border-[#E3E1D9] p-6 shadow-xs overflow-x-auto">
        {activeTab === 'users' && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E3E1D9] text-[#7F8A7D]">
                <th className="pb-3 font-semibold">Email</th>
                <th className="pb-3 font-semibold">Role</th>
                <th className="pb-3 font-semibold">Verified</th>
                <th className="pb-3 font-semibold">Joined</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E1D9]">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-[#F7F6F0]">
                  <td className="py-3 font-medium text-[#242923]">{u.email}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === 'admin' ? 'bg-[#EDF3EB] text-[#304A34]' : 'bg-[#F7F6F0] text-[#5A6559]'
                      }`}
                    >
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3">{u.emailVerified ? 'Yes' : 'No'}</td>
                  <td className="py-3 text-[#7F8A7D]">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleRoleToggle(u.id, u.role)}
                      className="text-[#304A34] hover:underline font-semibold"
                    >
                      Toggle {u.role === 'admin' ? 'User' : 'Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'reports' && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E3E1D9] text-[#7F8A7D]">
                <th className="pb-3 font-semibold">Title</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Messages</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Paid</th>
                <th className="pb-3 font-semibold">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E1D9]">
              {reports.map(r => (
                <tr key={r.id} className="hover:bg-[#F7F6F0]">
                  <td className="py-3 font-bold text-[#242923]">{r.title}</td>
                  <td className="py-3 capitalize">{r.category}</td>
                  <td className="py-3">{r.totalMessages}</td>
                  <td className="py-3 capitalize font-semibold">{r.status}</td>
                  <td className="py-3 font-semibold">{r.isPaid ? 'Yes (Full)' : 'Preview'}</td>
                  <td className="py-3 text-[#7F8A7D]">{new Date(r.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'payments' && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E3E1D9] text-[#7F8A7D]">
                <th className="pb-3 font-semibold">Order ID</th>
                <th className="pb-3 font-semibold">Report ID</th>
                <th className="pb-3 font-semibold">Provider</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E1D9]">
              {payments.map(p => (
                <tr key={p.id} className="hover:bg-[#F7F6F0]">
                  <td className="py-3 font-mono font-medium">{p.orderId}</td>
                  <td className="py-3 font-mono">{p.reportId}</td>
                  <td className="py-3 uppercase">{p.provider}</td>
                  <td className="py-3 font-bold text-[#304A34]">
                    {p.currency} {p.amount / 100}
                  </td>
                  <td className="py-3 font-bold uppercase">{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'jobs' && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E3E1D9] text-[#7F8A7D]">
                <th className="pb-3 font-semibold">Job ID</th>
                <th className="pb-3 font-semibold">Report ID</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Attempts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E1D9]">
              {jobs.map(j => (
                <tr key={j.id} className="hover:bg-[#F7F6F0]">
                  <td className="py-3 font-mono">{j.id}</td>
                  <td className="py-3 font-mono">{j.reportId}</td>
                  <td className="py-3 uppercase font-bold">{j.status}</td>
                  <td className="py-3">{j.attempts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'logs' && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E3E1D9] text-[#7F8A7D]">
                <th className="pb-3 font-semibold">Action</th>
                <th className="pb-3 font-semibold">Actor</th>
                <th className="pb-3 font-semibold">Target Type</th>
                <th className="pb-3 font-semibold">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E1D9]">
              {logs.map(l => (
                <tr key={l.id} className="hover:bg-[#F7F6F0]">
                  <td className="py-3 font-mono font-bold text-[#304A34]">{l.action}</td>
                  <td className="py-3 font-mono text-[#5A6559]">{l.actorId || 'anon'}</td>
                  <td className="py-3 capitalize">{l.targetType}</td>
                  <td className="py-3 text-[#7F8A7D]">{new Date(l.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'metrics' && (
          <div className="space-y-4 text-xs text-[#5A6559]">
            <h4 className="text-sm font-bold text-[#242923]">Administrator Quick Summary</h4>
            <p>
              ChatTruth is executing with zero data leakage protocols. All database and payment records are monitored and audited above. Use the tabs to inspect user roles, analyze background jobs, or review server activity.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
