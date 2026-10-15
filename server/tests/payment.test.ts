import { describe, it, expect } from 'vitest';
import crypto from 'crypto';
import { paymentService } from '../src/services/paymentService';

describe('Payment Engine & Verification', () => {
  it('creates order in sandbox mock mode', async () => {
    const order = await paymentService.createOrder({
      reportId: 'rep_test_123',
      provider: 'razorpay',
    });

    expect(order.reportId).toBe('rep_test_123');
    expect(order.amount).toBeGreaterThan(0);
    expect(order.orderId).toBeTruthy();
    expect(order.status).toBe('created');
  });

  it('verifies sandbox mock payments successfully', async () => {
    const result = await paymentService.verifyPayment({
      provider: 'razorpay',
      orderId: 'mock_order_12345',
      paymentId: 'mock_pay_12345',
      reportId: 'rep_test_123',
    });

    expect(result.verified).toBe(true);
  });

  it('guarantees payment idempotency on repeat verification calls', async () => {
    const paymentId = `mock_pay_idempotent_${Date.now()}`;
    const firstCheck = await paymentService.verifyPayment({
      provider: 'razorpay',
      orderId: 'mock_order_idem_1',
      paymentId,
      reportId: 'rep_idem_123',
    });
    expect(firstCheck.verified).toBe(true);

    const secondCheck = await paymentService.verifyPayment({
      provider: 'razorpay',
      orderId: 'mock_order_idem_1',
      paymentId,
      reportId: 'rep_idem_123',
    });
    expect(secondCheck.verified).toBe(true);
    expect(secondCheck.message).toContain('idempotent');
  });
});
