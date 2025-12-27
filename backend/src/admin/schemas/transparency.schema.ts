import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransparencyDocument = Transparency & Document;

@Schema({ timestamps: true })
export class Transparency {
  @Prop({ required: true, unique: true, default: 'default' })
  key: string;

  @Prop({ type: Object, required: true })
  complianceStats: {
    maxLeverage: string;
    currentLeverage: string;
    maxDrawdown: string;
    observedDrawdown: string;
    avgSlippage: string;
    fillRate: string;
  };

  @Prop({ type: [Object], required: true })
  recentTrades: Array<{
    id: string;
    time: string;
    instrument: string;
    strategy: string;
    direction: 'buy' | 'sell';
    entry: number;
    size: string;
    status: string;
  }>;

  @Prop({ type: [Object], required: true })
  strategyPerformance: Array<{
    name: string;
    trades: number;
    winRate: number;
    avgR: number;
    pnl: number;
  }>;

  @Prop({ type: [Object], required: true })
  topInstruments: Array<{
    symbol: string;
    trades: number;
    volume: string;
    pnl: number;
  }>;

  @Prop({ type: Object, required: true })
  riskCompliance: {
    currentLeverage: string;
    leverageLimit: string;
    currentDD: string;
    maxObservedDD: string;
    slippageStats: string;
    maxSlippage: string;
    venues: number;
    primeBrokers: number;
  };
}

export const TransparencySchema = SchemaFactory.createForClass(Transparency);

