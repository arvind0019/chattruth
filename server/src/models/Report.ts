import mongoose, { Document, Schema } from 'mongoose';
import { AnalysisReport } from '../shared/types/report';

export interface IReportDoc extends Document, Omit<AnalysisReport, 'id'> {
  id: string;
}

const ReportSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
      required: false,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['relationship', 'friends', 'family', 'general'],
      default: 'general',
      index: true,
    },
    conciseSummary: {
      type: String,
      required: true,
    },
    apparentTone: {
      type: String,
      default: 'Balanced',
    },
    verifiedStatistics: {
      type: Schema.Types.Mixed,
      required: true,
    },
    keyFindings: {
      type: [Schema.Types.Mixed],
      default: [],
    },
    communicationPatterns: {
      type: [Schema.Types.Mixed],
      default: [],
    },
    positiveObservations: {
      type: [String],
      default: [],
    },
    potentialFrictionPoints: {
      type: [String],
      default: [],
    },
    practicalSuggestions: {
      type: [Schema.Types.Mixed],
      default: [],
    },
    confidenceLevel: {
      type: String,
      enum: ['high', 'moderate', 'tentative'],
      default: 'moderate',
    },
    limitationsAndUncertainty: {
      type: [String],
      default: [],
    },
    isPaid: {
      type: Boolean,
      default: false,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
      index: true,
    },
    errorMessage: {
      type: String,
    },
    analyzedMessagesCount: {
      type: Number,
      default: 0,
    },
    totalOriginalMessagesCount: {
      type: Number,
      default: 0,
    },
    dateRangeAnalyzed: {
      start: String,
      end: String,
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

export const ReportModel = mongoose.models.Report || mongoose.model<IReportDoc>('Report', ReportSchema);
