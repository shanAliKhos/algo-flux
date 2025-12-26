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

class RecentExecutionDto {
  @IsString()
  @IsNotEmpty()
  time: string;

  @IsString()
  @IsNotEmpty()
  strategy: string;

  @IsString()
  @IsNotEmpty()
  symbol: string;

  @IsString()
  @IsNotEmpty()
  direction: string;

  @IsString()
  @IsNotEmpty()
  size: string;

  @IsString()
  @IsNotEmpty()
  price: string;

  @IsString()
  @IsNotEmpty()
  status: string;
}

class PerformanceByStrategyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  winRate: number;

  @IsNumber()
  @Min(0)
  avgR: number;

  @IsNumber()
  @Min(0)
  trades: number;

  @IsString()
  @IsNotEmpty()
  pnl: string;
}

class RiskMetricDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsString()
  @IsNotEmpty()
  value: string;

  @IsString()
  @IsNotEmpty()
  status: string;
}

class AnomalyDto {
  @IsString()
  @IsNotEmpty()
  time: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  asset: string;

  @IsString()
  @IsNotEmpty()
  severity: string;
}

class DailyAccuracyDto {
  @IsString()
  @IsNotEmpty()
  day: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  accuracy: number;
}

class ComplianceLogsDto {
  @IsString()
  @IsNotEmpty()
  riskCompliance: string;

  @IsNumber()
  @Min(0)
  policyViolations: number;

  @IsString()
  @IsNotEmpty()
  systemUptime: string;

  @IsString()
  @IsNotEmpty()
  avgLatency: string;
}

export class AuditDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecentExecutionDto)
  recentExecutions: RecentExecutionDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PerformanceByStrategyDto)
  performanceByStrategy: PerformanceByStrategyDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RiskMetricDto)
  riskMetrics: RiskMetricDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnomalyDto)
  anomalies: AnomalyDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DailyAccuracyDto)
  dailyAccuracy: DailyAccuracyDto[];

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ComplianceLogsDto)
  complianceLogs: ComplianceLogsDto;
}

