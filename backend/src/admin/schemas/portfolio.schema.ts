import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PortfolioDocument = Portfolio & Document;

@Schema({ timestamps: true })
export class Portfolio {
  @Prop({ required: true, unique: true, default: 'default' })
  key: string;

  @Prop({ type: Object, required: true })
  topStats: {
    totalEquity: string;
    totalEquityChange?: number;
    mtdReturn: string;
    maxDrawdown: string;
    sharpeRatio: string;
  };

  @Prop({ type: [Number], required: true })
  equityData: number[];

  @Prop({ type: [Number], required: true })
  drawdownData: number[];

  @Prop({ type: Number, required: true })
  maxDrawdownValue: number;

  @Prop({ type: [Object], required: true })
  exposureTiles: Array<{
    category: string;
    allocation: number;
    pnl: number;
  }>;

  @Prop({ type: [Object], required: true })
  regionExposure: Array<{
    region: string;
    allocation: number;
  }>;

  @Prop({ type: [Object], required: true })
  riskBuckets: Array<{
    name: string;
    allocation: number;
    strategies: string[];
  }>;
}

export const PortfolioSchema = SchemaFactory.createForClass(Portfolio);

