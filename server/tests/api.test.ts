import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { ANDROID_SAMPLE_CHAT } from './fixtures/sampleChats';

const app = createApp();

describe('ChatTruth End-to-End API Integration', () => {
  let authToken = '';
  let authCookie = '';
  let testReportId = '';

  it('GET /api/v1/health returns ok status', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toContain('ChatTruth');
  });

  it('POST /api/v1/auth/register creates user account and sets session', async () => {
    const email = `testuser_${Date.now()}@example.com`;
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email, password: 'SecurePassword123!' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(email);
    expect(res.body.data.token).toBeTruthy();

    authToken = res.body.data.token;
    const cookieHeader = res.headers['set-cookie'];
    if (cookieHeader) {
      authCookie = Array.isArray(cookieHeader) ? cookieHeader[0] : cookieHeader;
    }
  });

  it('POST /api/v1/uploads/preview parses conversation export in memory', async () => {
    const res = await request(app)
      .post('/api/v1/uploads/preview')
      .send({ rawText: ANDROID_SAMPLE_CHAT });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalMessages).toBe(5);
    expect(res.body.data.participants).toContain('Alex');
    expect(res.body.data.participants).toContain('Maya');
    expect(res.body.data.formatDetected).toBe('whatsapp_android');
  });

  it('POST /api/v1/reports creates analysis report and returns safe preview', async () => {
    const res = await request(app)
      .post('/api/v1/reports')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        rawText: ANDROID_SAMPLE_CHAT,
        category: 'relationship',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.reportId).toBeTruthy();
    expect(res.body.data.preview).toBeTruthy();
    expect(res.body.data.isPaid).toBe(false);

    testReportId = res.body.data.reportId;
  });

  it('GET /api/v1/reports/:id on unpaid report returns preview with requiresPayment flag', async () => {
    const res = await request(app).get(`/api/v1/reports/${testReportId}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.isPaid).toBe(false);
    expect(res.body.data.requiresPayment).toBe(true);
    // Locked findings should be protected
    expect(res.body.data.preview.lockedFindingsCount).toBeGreaterThanOrEqual(1);
  });

  it('POST /api/v1/payments/verify unlocks full report upon payment verification', async () => {
    const verifyRes = await request(app)
      .post('/api/v1/payments/verify')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        provider: 'razorpay',
        orderId: `mock_order_${Date.now()}`,
        paymentId: `mock_pay_${Date.now()}`,
        reportId: testReportId,
      });

    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body.data.verified).toBe(true);

    // Now GET /api/v1/reports/:id should return the full report
    const reportRes = await request(app)
      .get(`/api/v1/reports/${testReportId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(reportRes.status).toBe(200);
    expect(reportRes.body.data.report.isPaid).toBe(true);
    expect(reportRes.body.data.report.keyFindings.length).toBeGreaterThan(0);
  });

  it('DELETE /api/v1/reports/:id enforces ownership and forbids unauthorized users', async () => {
    // Generate an unrelated random token
    const otherUserRes = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: `intruder_${Date.now()}@example.com`, password: 'OtherPassword123!' });

    const intruderToken = otherUserRes.body.data.token;

    // Intruder tries to delete original user's report
    const forbiddenRes = await request(app)
      .delete(`/api/v1/reports/${testReportId}`)
      .set('Authorization', `Bearer ${intruderToken}`);

    expect(forbiddenRes.status).toBe(403);
    expect(forbiddenRes.body.error.code).toBe('FORBIDDEN');
  });
});
