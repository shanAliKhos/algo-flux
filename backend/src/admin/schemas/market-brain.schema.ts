import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MarketBrainDocument = MarketBrain & Document;

@Schema({ timestamps: true })
export class MarketBrain {
  @Prop({ required: true, unique: true, default: 'default' })
  key: string;

  @Prop({ type: Object, required: true })
  moodData: {
    forex: number;
    crypto: number;
    commodities: number;
    equities: number;
    riskOnOff: number;
    dollarStrength: number;
    volatility: 'calm' | 'normal' | 'storm';
  };

  @Prop({ type: [Object], required: true })
  pressureItems: Array<{
    label: string;
    value: number;
    trend: 'up' | 'down' | 'neutral';
  }>;

  @Prop({ type: [Object], required: true })
  stockSectors: Array<{
    sector: string;
    momentum: number;
    change24h: number;
  }>;

  @Prop({ type: [Object], required: true })
  cryptoSectors: Array<{
    sector: string;
    momentum: number;
    change24h: number;
  }>;

  @Prop({ type: [Object], required: true })
  capRotation: Array<{
    sector: string;
    momentum: number;
    change24h: number;
  }>;

  @Prop({ type: [Object], required: true })
  instruments: Array<{
    symbol: string;
    price: string;
    directionProbability: { up: number; down: number };
    trendStrength: number;
    activeStrategy: string;
    threats: string[];
  }>;
}

export const MarketBrainSchema = SchemaFactory.createForClass(MarketBrain);

