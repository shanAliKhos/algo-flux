import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TradeRecordDocument = TradeRecord & Document;

@Schema({ timestamps: true })
export class TradeRecord {
  @Prop({ required: true })
  time: Date;

  @Prop({ required: true })
  strategy: string;

  @Prop({ required: true })
  symbol: string;

  @Prop({ required: true, enum: ['Long', 'Short'] })
  direction: string;

  @Prop({ required: true })
  size: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, enum: ['Filled', 'Pending', 'Cancelled', 'Rejected'] })
  status: string;

  @Prop({ required: false })
  exitPrice?: number;

  @Prop({ required: false })
  pnl?: number;

  @Prop({ required: false })
  rMultiple?: number;

  @Prop({ required: false })
  win?: boolean;

  @Prop({ required: false })
  entryTime?: Date;

  @Prop({ required: false })
  exitTime?: Date;
}

export const TradeRecordSchema = SchemaFactory.createForClass(TradeRecord);

// Create indexes for efficient queries
TradeRecordSchema.index({ time: -1 });
TradeRecordSchema.index({ strategy: 1 });
TradeRecordSchema.index({ symbol: 1 });
TradeRecordSchema.index({ createdAt: -1 });

