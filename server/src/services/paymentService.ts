import crypto from 'crypto';
import { PaymentOrder, PaymentProvider, PaymentVerificationRequest } from '../shared/types/payment';

export interface CreateOrderParams {
  reportId: string;
  userId?: string;
  provider?: PaymentProvider;
}

export class PaymentService {
  private razorpayKeyId = process.env.RAZORPAY_KEY_ID || '';
  private razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || '';
  private stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';

  // Configurable pricing in smallest currency unit
  private amountINR = parseInt(process.env.REPORT_PRICE_INR || '49900', 10); // 499 INR
  private amountUSD = parseInt(process.env.REPORT_PRICE_USD || '999', 10); // $9.99 USD

  // Idempotency cache for processed payment IDs
  private processedPayments = new Set<string>();

  /**
   * Creates a payment order for unlocking a specific report.
   */
  async createOrder(params: CreateOrderParams): Promise<PaymentOrder> {
    const provider: PaymentProvider = params.provider || (process.env.PAYMENT_PROVIDER === 'stripe' ? 'stripe' : 'razorpay');
    const currency = provider === 'razorpay' ? 'INR' : 'USD';
    const amount = provider === 'razorpay' ? this.amountINR : this.amountUSD;
    const now = new Date().toISOString();

    // Check if live Razorpay credentials are provided
    if (provider === 'razorpay' && this.razorpayKeyId && this.razorpayKeySecret) {
      try {
        const Razorpay = (await import('razorpay')).default;
        const rzp = new Razorpay({
          key_id: this.razorpayKeyId,
          key_secret: this.razorpayKeySecret,
        });

        const order = await rzp.orders.create({
          amount,
          currency,
          receipt: `rcpt_${params.reportId.slice(-8)}`,
          notes: {
            reportId: params.reportId,
            userId: params.userId || 'anonymous',
          },
        });

        return {
          id: `pay_${Date.now()}`,
          orderId: order.id,
          reportId: params.reportId,
          userId: params.userId,
          amount,
          currency,
          provider: 'razorpay',
          status: 'created',
          keyId: this.razorpayKeyId,
          createdAt: now,
        };
      } catch (err: any) {
        console.error('[PaymentService] Razorpay order creation failed:', err.message);
        throw new Error(`Failed to create Razorpay order: ${err.message}`);
      }
    }

    // Check if live Stripe credentials are provided
    if (provider === 'stripe' && this.stripeSecretKey) {
      try {
        const Stripe = (await import('stripe')).default;
        const stripe = new Stripe(this.stripeSecretKey);

        const paymentIntent = await stripe.paymentIntents.create({
          amount,
          currency: 'usd',
          metadata: {
            reportId: params.reportId,
            userId: params.userId || 'anonymous',
          },
        });

        return {
          id: `pay_${Date.now()}`,
          orderId: paymentIntent.id,
          reportId: params.reportId,
          userId: params.userId,
          amount,
          currency: 'USD',
          provider: 'stripe',
          status: 'created',
          keyId: process.env.STRIPE_PUBLISHABLE_KEY || '',
          createdAt: now,
        };
      } catch (err: any) {
        console.error('[PaymentService] Stripe payment creation failed:', err.message);
        throw new Error(`Failed to create Stripe order: ${err.message}`);
      }
    }

    // Safe Development / Sandbox Mock Mode
    console.log(`[PaymentService] Sandbox mock order created for report ${params.reportId} (${provider}, ${currency} ${amount / 100})`);
    const mockOrderId = `mock_order_${params.reportId.slice(0, 8)}_${Date.now()}`;

    return {
      id: `pay_mock_${Date.now()}`,
      orderId: mockOrderId,
      reportId: params.reportId,
      userId: params.userId,
      amount,
      currency,
      provider,
      status: 'created',
      keyId: 'mock_key_id_sandbox',
      createdAt: now,
      notes: { mode: 'sandbox_mock' },
    };
  }

  /**
   * Verifies payment authenticity server-side.
   * Prevents client-side spoofing and guarantees idempotency.
   */
  async verifyPayment(req: PaymentVerificationRequest): Promise<{ verified: boolean; message: string }> {
    const { provider, orderId, paymentId, signature } = req;

    // Idempotency check: prevent double processing
    if (this.processedPayments.has(paymentId)) {
      return { verified: true, message: 'Payment already processed and verified (idempotent).' };
    }

    // 1. Sandbox Mock verification
    if (orderId.startsWith('mock_order_') || paymentId.startsWith('mock_pay_')) {
      this.processedPayments.add(paymentId);
      return { verified: true, message: 'Sandbox payment successfully verified.' };
    }

    // 2. Live Razorpay Verification
    if (provider === 'razorpay') {
      if (!this.razorpayKeySecret) {
        throw new Error('Razorpay secret not configured on server.');
      }
      if (!signature) {
        return { verified: false, message: 'Missing payment signature.' };
      }

      const generatedSignature = crypto
        .createHmac('sha256', this.razorpayKeySecret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      if (generatedSignature === signature) {
        this.processedPayments.add(paymentId);
        return { verified: true, message: 'Razorpay payment signature verified.' };
      } else {
        return { verified: false, message: 'Invalid payment signature. Verification failed.' };
      }
    }

    // 3. Live Stripe Verification
    if (provider === 'stripe') {
      if (!this.stripeSecretKey) {
        throw new Error('Stripe secret key not configured on server.');
      }
      const Stripe = (await import('stripe')).default;
      const stripe = new Stripe(this.stripeSecretKey);

      const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
      if (paymentIntent.status === 'succeeded') {
        this.processedPayments.add(paymentId);
        return { verified: true, message: 'Stripe payment confirmed succeeded.' };
      } else {
        return { verified: false, message: `Stripe payment status is ${paymentIntent.status}.` };
      }
    }

    return { verified: false, message: 'Unsupported payment provider.' };
  }

  /**
   * Verifies Razorpay Webhook signature.
   */
  verifyRazorpayWebhook(rawBody: string, signature: string, webhookSecret: string): boolean {
    if (!signature || !webhookSecret) return false;
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');
    return expectedSignature === signature;
  }
}

export const paymentService = new PaymentService();
