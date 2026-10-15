import { Request, Response } from 'express';
import { paymentService } from '../services/paymentService';
import { store } from '../services/store';
import { emailService } from '../services/emailService';
import { PaymentOrderSchema, PaymentVerifySchema } from '../validators/schemas';

export class PaymentController {
  async createOrder(req: Request, res: Response): Promise<void> {
    const parse = PaymentOrderSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: parse.error.errors[0].message },
      });
      return;
    }

    const { reportId, provider } = parse.data;
    const report = await store.getReportById(reportId);

    if (!report) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Report not found.' },
      });
      return;
    }

    if (report.isPaid) {
      res.status(400).json({
        success: false,
        error: { code: 'ALREADY_PAID', message: 'This report is already unlocked and paid.' },
      });
      return;
    }

    const order = await paymentService.createOrder({
      reportId,
      userId: req.user?.id,
      provider,
    });

    await store.savePayment(order);

    res.json({
      success: true,
      data: { order },
    });
  }

  async verifyPayment(req: Request, res: Response): Promise<void> {
    const parse = PaymentVerifySchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: parse.error.errors[0].message },
      });
      return;
    }

    const { provider, orderId, paymentId, signature, reportId } = parse.data;

    const verification = await paymentService.verifyPayment({
      provider,
      orderId,
      paymentId,
      signature,
      reportId,
    });

    if (!verification.verified) {
      res.status(400).json({
        success: false,
        error: { code: 'PAYMENT_VERIFICATION_FAILED', message: verification.message },
      });
      return;
    }

    // Server-side unlock of full report
    await store.updateReportPaymentStatus(reportId, true);

    const existingPayment = await store.getPaymentByOrderId(orderId);
    if (existingPayment) {
      existingPayment.status = 'completed';
      await store.savePayment(existingPayment);
    }

    await store.logAudit({
      actorId: req.user?.id || 'anonymous',
      action: 'PAYMENT_VERIFIED',
      targetType: 'payment',
      targetId: paymentId,
      metadata: { orderId, reportId, provider },
      ipAddress: req.ip,
    });

    // Send confirmation email if user is registered
    if (req.user?.email) {
      const appUrl = process.env.PUBLIC_APP_URL || 'http://localhost:5173';
      emailService.sendPaymentReceiptEmail(
        req.user.email,
        existingPayment ? `${existingPayment.currency} ${existingPayment.amount / 100}` : 'Standard Report Fee',
        orderId,
        `${appUrl}/reports/${reportId}`
      ).catch(console.error);
    }

    res.json({
      success: true,
      data: {
        verified: true,
        message: 'Payment verified and full report unlocked successfully.',
        reportId,
      },
    });
  }

  async handleWebhook(req: Request, res: Response): Promise<void> {
    const signature = req.headers['x-razorpay-signature'] as string;
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (webhookSecret && signature) {
      const rawBody = JSON.stringify(req.body);
      const isValid = paymentService.verifyRazorpayWebhook(rawBody, signature, webhookSecret);
      if (!isValid) {
        res.status(400).json({ status: 'invalid_signature' });
        return;
      }

      // Handle event payload
      const event = req.body.event;
      if (event === 'payment.captured') {
        const paymentEntity = req.body.payload?.payment?.entity;
        const notes = paymentEntity?.notes;
        if (notes?.reportId) {
          await store.updateReportPaymentStatus(notes.reportId, true);
        }
      }
    }

    res.json({ status: 'ok' });
  }
}

export const paymentController = new PaymentController();
