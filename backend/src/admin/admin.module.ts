import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { User, UserSchema } from '../users/schemas/user.schema';
import { AIBrain, AIBrainSchema } from './schemas/ai-brain.schema';
import { MarketBrain, MarketBrainSchema } from './schemas/market-brain.schema';
import { Performance, PerformanceSchema } from './schemas/performance.schema';
import { Strategies, StrategiesSchema } from './schemas/strategies.schema';
import { TradeFormation, TradeFormationSchema } from './schemas/trade-formation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: AIBrain.name, schema: AIBrainSchema },
      { name: MarketBrain.name, schema: MarketBrainSchema },
      { name: Performance.name, schema: PerformanceSchema },
      { name: Strategies.name, schema: StrategiesSchema },
      { name: TradeFormation.name, schema: TradeFormationSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}

