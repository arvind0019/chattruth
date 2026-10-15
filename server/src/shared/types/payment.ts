export type PaymentProvider = 'razorpay' | 'stripe';
export type PaymentStatus = 'created' | 'pending' | 'completed' | 'failed' | 'refunded';

export interface PaymentOrder {
  id: string;
  orderId: string;
  reportId: string;
  userId?: string;
  amount: number;
  currency: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  keyId?: string; // Public client key
  createdAt: string;
  notes?: Record<string, string>;
}

export interface PaymentVerificationRequest {
  provider: PaymentProvider;
  orderId: string;
  paymentId: string;
  signature?: string;
  reportId: string;
}

export interface PaymentPricing {
  amount: number;
  currency: string;
  formattedPrice: string;
  features: string[];
}
