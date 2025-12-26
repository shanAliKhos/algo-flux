import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConditionsDocument = Conditions & Document;

class MarketPersonalityItem {
  label: string;
  active: boolean;
  icon: string;
}

class BehaviorMapItem {
  asset: string;
  behavior: string;
  sentiment: number;
}

class StrategyItem {
  name: string;
  status: string;
  opportunity: string;
}

class StrategyAlignmentItem {
  asset: string;
  strategies: StrategyItem[];
}

@Schema({ timestamps: true })
export class Conditions {
  @Prop({ required: true, unique: true, default: 'default' })
  key: string;

  @Prop({ type: [Object], required: true })
  marketPersonality: MarketPersonalityItem[];

  @Prop({ type: [Object], required: true })
  behaviorMap: BehaviorMapItem[];

  @Prop({ type: [Object], required: true })
  strategyAlignment: StrategyAlignmentItem[];
}

export const ConditionsSchema = SchemaFactory.createForClass(Conditions);

