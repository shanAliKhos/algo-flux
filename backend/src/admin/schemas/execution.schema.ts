import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ExecutionDocument = Execution & Document;

@Schema({ timestamps: true })
export class Execution {
  @Prop({ required: true, unique: true, default: 'default' })
  key: string;

  @Prop({ type: Object, required: true })
  orderbook: {
    instrument: string;
    bids: Array<{
      price: number;
      size: number;
      total: number;
    }>;
    asks: Array<{
      price: number;
      size: number;
      total: number;
    }>;
    spread: number;
  };

  @Prop({ type: Object, required: true })
  tradeTicket: {
    instrument: string;
    strategy: string;
    direction: string;
    entry: number;
    stopLoss: number;
    takeProfit: number;
    size: string;
    risk: string;
  };

  @Prop({ type: Object, required: true })
  executionMetrics: {
    speed: string;
    slippage: string;
    fillQuality: string;
  };

  @Prop({ type: [Number], required: true })
  equityCurve: number[];

  @Prop({ type: Object, required: false })
  exposure?: {
    currentExposure: string;
    openPnL: string;
  };
}

export const ExecutionSchema = SchemaFactory.createForClass(Execution);

