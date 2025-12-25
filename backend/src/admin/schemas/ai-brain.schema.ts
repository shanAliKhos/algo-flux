import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AIBrainDocument = AIBrain & Document;

@Schema({ timestamps: true })
export class AIBrain {
  @Prop({ required: true, unique: true, default: 'default' })
  key: string;

  @Prop({ type: Object, required: true })
  neuralConfig: {
    nodes: number;
    connections: number;
    latency: number;
  };

  @Prop({ type: [Object], required: true })
  dataStreams: Array<{
    label: string;
    active: boolean;
    delay: number;
  }>;

  @Prop({ type: Object, required: true })
  marketSentiment: {
    forex: { bullish: number; neutral: number; bearish: number };
    crypto: { bullish: number; neutral: number; bearish: number };
    equities: { bullish: number; neutral: number; bearish: number };
  };

  @Prop({ type: [Object], required: true })
  strategies: Array<{
    name: string;
    icon: string;
    status: 'active' | 'waiting' | 'cooling';
    accuracy: number;
    confidence: 'high' | 'medium' | 'low';
    bias: string;
    instruments: string[];
    path: string;
  }>;

  @Prop({ type: [Object], required: true })
  newsTags: Array<{
    text: string;
    type: 'bullish' | 'bearish' | 'neutral';
  }>;

  @Prop({ required: true, default: 2400000 })
  dataPointsPerSecond: number;
}

export const AIBrainSchema = SchemaFactory.createForClass(AIBrain);

// Note: Index on 'key' is automatically created by the unique: true constraint


