import {
  IsNumber,
  IsString,
  IsArray,
  IsObject,
  ValidateNested,
  Min,
  Max,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

class RiskMetricsDto {
  @IsNumber()
  @Min(-10)
  @Max(10)
  sharpeRatio: number;

  @IsNumber()
  @Min(-10)
  @Max(10)
  sortinoRatio: number;

  @IsNumber()
  @Min(-100)
  @Max(0)
  maxDrawdown: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  winRate: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  profitFactor: number;

  @IsNumber()
  averageWin: number;

  @IsNumber()
  averageLoss: number;

  @IsNumber()
  @Min(0)
  totalTrades: number;
}

class YearlyPerformanceDto {
  @IsNumber()
  @Min(2000)
  @Max(2100)
  year: number;

  @IsNumber()
  return: number;

  @IsNumber()
  @Min(0)
  trades: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  winRate: number;
}

class EquityCurvePointDto {
  @IsString()
  date: string;

  @IsNumber()
  equity: number;

  @IsNumber()
  drawdown: number;
}

class StrategyContributionDto {
  @IsString()
  strategy: string;

  @IsNumber()
  return: number;

  @IsNumber()
  @Min(0)
  trades: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  winRate: number;

  @IsNumber()
  sharpeRatio: number;
}

class DrawdownHistoryPointDto {
  @IsString()
  date: string;

  @IsNumber()
  drawdown: number;

  @IsNumber()
  @Min(0)
  recovery: number;
}

class DrawdownDataDto {
  @IsNumber()
  @Min(-100)
  @Max(0)
  maxDrawdown: number;

  @IsString()
  maxDrawdownDate: string;

  @IsNumber()
  @Min(-100)
  @Max(0)
  currentDrawdown: number;

  @IsNumber()
  @Min(0)
  recoveryTime: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DrawdownHistoryPointDto)
  drawdownHistory: DrawdownHistoryPointDto[];
}

export class PerformanceDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => RiskMetricsDto)
  riskMetrics: RiskMetricsDto;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => YearlyPerformanceDto)
  yearlyPerformance: YearlyPerformanceDto[];

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EquityCurvePointDto)
  equityCurve: EquityCurvePointDto[];

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StrategyContributionDto)
  strategyContributions: StrategyContributionDto[];

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => DrawdownDataDto)
  drawdownData: DrawdownDataDto;
}


