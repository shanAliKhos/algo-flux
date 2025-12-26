import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RadarDocument = Radar & Document;

@Schema({ timestamps: true })
export class Radar {
  @Prop({ required: true, unique: true, default: 'default' })
  key: string;

  @Prop({ type: [Object], required: true })
  assetClasses: Array<{
    label: string;
    value: number;
    sublabel: string;
  }>;

  @Prop({ type: [Object], required: true })
  opportunities: Array<{
    symbol: string;
    price: string;
    change: number;
    strategy: string;
    signal: 'In Position' | 'Preparing Entry' | 'Watching';
  }>;

  @Prop({ type: [Object], required: true })
  regimes: Array<{
    name: string;
    description: string;
  }>;
}

export const RadarSchema = SchemaFactory.createForClass(Radar);

