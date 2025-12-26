import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuditDocument = Audit & Document;

@Schema({ timestamps: true })
export class Audit {
  @Prop({ required: true, unique: true, default: 'default' })
  key: string;

  @Prop({ type: Array, required: true })
  recentExecutions: Array<{
    time: string;
    strategy: string;
    symbol: string;
    direction: string;
    size: string;
    price: string;
    status: string;
  }>;

  @Prop({ type: Array, required: true })
  performanceByStrategy: Array<{
    name: string;
    winRate: number;
    avgR: number;
    trades: number;
    pnl: string;
  }>;

  @Prop({ type: Array, required: true })
  riskMetrics: Array<{
    label: string;
    value: string;
    status: string;
  }>;

  @Prop({ type: Array, required: true })
  anomalies: Array<{
    time: string;
    type: string;
    asset: string;
    severity: string;
  }>;

  @Prop({ type: Array, required: true })
  dailyAccuracy: Array<{
    day: string;
    accuracy: number;
  }>;

  @Prop({ type: Object, required: true })
  complianceLogs: {
    riskCompliance: string;
    policyViolations: number;
    systemUptime: string;
    avgLatency: string;
  };
}

export const AuditSchema = SchemaFactory.createForClass(Audit);

