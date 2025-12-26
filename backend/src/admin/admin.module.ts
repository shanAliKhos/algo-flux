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
import { AccountRooms, AccountRoomsSchema } from './schemas/account-rooms.schema';
import { Execution, ExecutionSchema } from './schemas/execution.schema';
import { Radar, RadarSchema } from './schemas/radar.schema';
import { Conditions, ConditionsSchema } from './schemas/conditions.schema';
import { Audit, AuditSchema } from './schemas/audit.schema';
import { TradeRecord, TradeRecordSchema } from './schemas/trade-record.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: AIBrain.name, schema: AIBrainSchema },
      { name: MarketBrain.name, schema: MarketBrainSchema },
      { name: Performance.name, schema: PerformanceSchema },
      { name: Strategies.name, schema: StrategiesSchema },
      { name: TradeFormation.name, schema: TradeFormationSchema },
      { name: AccountRooms.name, schema: AccountRoomsSchema },
      { name: Execution.name, schema: ExecutionSchema },
      { name: Conditions.name, schema: ConditionsSchema },
      { name: Audit.name, schema: AuditSchema },
      { name: Radar.name, schema: RadarSchema },
      { name: TradeRecord.name, schema: TradeRecordSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}

