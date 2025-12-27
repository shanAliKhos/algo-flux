import {
  IsNumber,
  IsString,
  IsArray,
  IsObject,
  ValidateNested,
  IsNotEmpty,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

class ComplianceStatsDto {
  @IsString()
  @IsNotEmpty()
  maxLeverage: string;

  @IsString()
  @IsNotEmpty()
  currentLeverage: string;

  @IsString()
  @IsNotEmpty()
  maxDrawdown: string;

  @IsString()
  @IsNotEmpty()
  observedDrawdown: string;

  @IsString()
  @IsNotEmpty()
  avgSlippage: string;

  @IsString()
  @IsNotEmpty()
  fillRate: string;
}

class RecentTradeDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  time: string;

  @IsString()
  @IsNotEmpty()
  instrument: string;

  @IsString()
  @IsNotEmpty()
  strategy: string;

  @IsEnum(['buy', 'sell'])
  direction: 'buy' | 'sell';

  @IsNumber()
  entry: number;

  @IsString()
  @IsNotEmpty()
  size: string;

  @IsString()
  @IsNotEmpty()
  status: string;
}

class StrategyPerformanceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  trades: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  winRate: number;

  @IsNumber()
  avgR: number;

  @IsNumber()
  pnl: number;
}

class TopInstrumentDto {
  @IsString()
  @IsNotEmpty()
  symbol: string;

  @IsNumber()
  @Min(0)
  trades: number;

  @IsString()
  @IsNotEmpty()
  volume: string;

  @IsNumber()
  pnl: number;
}

class RiskComplianceDto {
  @IsString()
  @IsNotEmpty()
  currentLeverage: string;

  @IsString()
  @IsNotEmpty()
  leverageLimit: string;

  @IsString()
  @IsNotEmpty()
  currentDD: string;

  @IsString()
  @IsNotEmpty()
  maxObservedDD: string;

  @IsString()
  @IsNotEmpty()
  slippageStats: string;

  @IsString()
  @IsNotEmpty()
  maxSlippage: string;

  @IsNumber()
  @Min(0)
  venues: number;

  @IsNumber()
  @Min(0)
  primeBrokers: number;
}

export class TransparencyDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ComplianceStatsDto)
  complianceStats: ComplianceStatsDto;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecentTradeDto)
  recentTrades: RecentTradeDto[];

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StrategyPerformanceDto)
  strategyPerformance: StrategyPerformanceDto[];

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TopInstrumentDto)
  topInstruments: TopInstrumentDto[];

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => RiskComplianceDto)
  riskCompliance: RiskComplianceDto;
}

