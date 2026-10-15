export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    timestamp?: string;
  };
}

export interface AdminMetrics {
  totalUsers: number;
  totalReports: number;
  completedReports: number;
  failedReports: number;
  processingJobs: number;
  totalRevenue: number;
  currency: string;
  failedPaymentsCount: number;
  conversionRate: number;
  activeUsersLast30Days: number;
}
