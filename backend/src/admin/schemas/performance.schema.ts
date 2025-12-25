import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PerformanceDocument = Performance & Document;

@Schema({ timestamps: true })
export class Performance {
  @Prop({ required: true, unique: true, default: 'default' })
  key: string;

  @Prop({ type: Object, required: true })
  riskMetrics: {
    sharpeRatio: number;
    sortinoRatio: number;
    maxDrawdown: number;
    winRate: number;
    profitFactor: number;
    averageWin: number;
    averageLoss: number;
    totalTrades: number;
  };

  @Prop({ type: [Object], required: true })
  yearlyPerformance: Array<{
    year: number;
    return: number;
    trades: number;
    winRate: number;
  }>;

  @Prop({ type: [Object], required: true })
  equityCurve: Array<{
    date: string;
    equity: number;
    drawdown: number;
  }>;

  @Prop({ type: [Object], required: true })
  strategyContributions: Array<{
    strategy: string;
    return: number;
    trades: number;
    winRate: number;
    sharpeRatio: number;
  }>;

  @Prop({ type: Object, required: true })
  drawdownData: {
    maxDrawdown: number;
    maxDrawdownDate: string;
    currentDrawdown: number;
    recoveryTime: number;
    drawdownHistory: Array<{
      date: string;
      drawdown: number;
      recovery: number;
    }>;
  };
}

export const PerformanceSchema = SchemaFactory.createForClass(Performance);


