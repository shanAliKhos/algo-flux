import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TradeFormationDocument = TradeFormation & Document;

@Schema({ timestamps: true })
export class TradeFormation {
  @Prop({ required: true, unique: true, default: 'default' })
  key: string;

  @Prop({ type: Object, required: true })
  opportunityDetection: {
    instruments: Array<{
      symbol: string;
      reason: string;
    }>;
    selectedInstrument: string;
  };

  @Prop({ type: Object, required: true })
  patternRecognition: {
    patterns: string[];
    detectedPattern: string;
    chartData: Array<{
      x: number;
      y: number;
    }>;
  };

  @Prop({ type: [Object], required: true })
  riskShaping: Array<{
    label: string;
    value: string;
    bar: number;
  }>;

  @Prop({ type: Object, required: true })
  executionBlueprint: {
    entry: string;
    stopLoss: string;
    takeProfit: string;
    rrRatio: string;
  };

  @Prop({ type: [Object], required: true })
  liveManagement: Array<{
    label: string;
    status: string;
    active: boolean;
  }>;

  @Prop({ type: Object, required: true })
  finalExitReport: {
    exitReason: string;
    rating: string;
    profitLoss: string;
    duration: string;
    notes: string;
  };
}

export const TradeFormationSchema = SchemaFactory.createForClass(TradeFormation);

