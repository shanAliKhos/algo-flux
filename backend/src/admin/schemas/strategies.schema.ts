import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StrategiesDocument = Strategies & Document;

@Schema({ timestamps: true })
export class Strategies {
  @Prop({ required: true, unique: true, default: 'default' })
  key: string;

  @Prop({ type: [Object], required: true, default: [] })
  strategies: Array<{
    id?: string;
    name: string;
    status: 'active' | 'waiting' | 'cooling';
    accuracy: number;
    confidence: 'high' | 'medium' | 'low';
    bias: string;
    instruments: string[];
  }>;
}

export const StrategiesSchema = SchemaFactory.createForClass(Strategies);

