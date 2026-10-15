import mongoose, { Document, Schema } from 'mongoose';
import { PaymentProvider, PaymentStatus } from '../shared/types/payment';

export interface IPaymentDoc extends Document {
  id: string;
  userId?: mongoose.Types.ObjectId;
  reportId: string;
  provider: PaymentProvider;
  providerOrderId: string;
  providerPaymentId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  verifiedAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPaymentDoc>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    reportId: {
      type: String,
      required: true,
      index: true,
    },
    provider: {
      type: String,
      enum: ['razorpay', 'stripe'],
      required: true,
    },
    providerOrderId: {
      type: String,
      required: true,
      index: true,
    },
    providerPaymentId: {
      type: String,
      sparse: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: 'INR',
    },
    status: {
      type: String,
      enum: ['created', 'pending', 'completed', 'failed', 'refunded'],
      default: 'created',
      index: true,
    },
    verifiedAt: {
      type: Date,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret: any) => {
        ret.id = ret._id?.toString();
        if (ret.userId) ret.userId = ret.userId.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const PaymentModel = mongoose.models.Payment || mongoose.model<IPaymentDoc>('Payment', PaymentSchema);
