import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AccountRoomsDocument = AccountRooms & Document;

@Schema({ timestamps: true })
export class AccountRooms {
  @Prop({ required: true, unique: true, default: 'default' })
  key: string;

  @Prop({ type: Object, required: true })
  retailSmall: {
    title: string;
    subtitle: string;
    safeMode: {
      active: boolean;
      description: string;
    };
    dailyRiskUsed: number;
    maxDrawdown: number;
    currentDrawdown: number;
    leverageMode: string;
    recentSignals: Array<{
      emoji: string;
      text: string;
    }>;
    safetyReasons: string[];
  };

  @Prop({ type: Object, required: true })
  proRetail: {
    title: string;
    subtitle: string;
    strategyUtilization: Array<{
      name: string;
      percentage: number;
    }>;
    executionQuality: number;
    marketRegime: {
      type: string;
      description: string;
    };
    opportunityHeatmap: Array<{
      symbol: string;
      active: boolean;
    }>;
    strategyConfidence: Array<{
      name: string;
      confidence: string;
    }>;
  };

  @Prop({ type: Object, required: true })
  investor: {
    title: string;
    subtitle: string;
    equityCurve: {
      ytdReturn: number;
      dataPoints: number[];
    };
    drawdownZones: {
      maxDrawdown: number;
      currentDrawdown: number;
      avgRecovery: number;
    };
    riskAdjustedMetrics: {
      sharpeRatio: number;
      sortinoRatio: number;
      calmarRatio: number;
    };
    alphaSources: Array<{
      name: string;
      percentage: number;
    }>;
  };

  @Prop({ type: Object, required: true })
  vipUltra: {
    title: string;
    subtitle: string;
    fullTransparency: {
      enabled: boolean;
      features: string[];
    };
    realTimeData: {
      enabled: boolean;
      latency: number;
    };
    advancedMetrics: {
      enabled: boolean;
      metrics: string[];
    };
    customReporting: {
      enabled: boolean;
      formats: string[];
    };
  };
}

export const AccountRoomsSchema = SchemaFactory.createForClass(AccountRooms);

