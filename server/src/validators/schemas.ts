import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string().email('Please enter a valid email address').max(100),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(100)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const ResetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(100)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const CreateReportSchema = z.object({
  category: z.enum(['relationship', 'friends', 'family', 'general']).default('general'),
  rawText: z.string().min(10, 'Chat text must contain at least 10 characters').optional(),
  title: z.string().max(120).optional(),
});

export const PaymentOrderSchema = z.object({
  reportId: z.string().min(1, 'Report ID is required'),
  provider: z.enum(['razorpay', 'stripe']).optional(),
});

export const PaymentVerifySchema = z.object({
  provider: z.enum(['razorpay', 'stripe']),
  orderId: z.string().min(1, 'Order ID is required'),
  paymentId: z.string().min(1, 'Payment ID is required'),
  signature: z.string().optional(),
  reportId: z.string().min(1, 'Report ID is required'),
});
