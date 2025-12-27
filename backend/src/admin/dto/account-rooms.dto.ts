import {
  IsNumber,
  IsString,
  IsArray,
  IsObject,
  IsBoolean,
  ValidateNested,
  Min,
  Max,
  IsNotEmpty,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

class SafeModeDto {
  @IsBoolean()
  active: boolean;

  @IsString()
  description: string;
}

class RecentSignalDto {
  @IsString()
  emoji: string;

  @IsString()
  text: string;
}

class RetailSmallDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  subtitle: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => SafeModeDto)
  safeMode: SafeModeDto;

  @IsNumber()
  @Min(0)
  @Max(100)
  dailyRiskUsed: number;

  @IsNumber()
  @Max(0)
  maxDrawdown: number;

  @IsNumber()
  @Max(0)
  currentDrawdown: number;

  @IsString()
  leverageMode: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecentSignalDto)
  recentSignals: RecentSignalDto[];

  @IsArray()
  @IsString({ each: true })
  safetyReasons: string[];
}

class StrategyUtilizationDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  percentage: number;
}

class MarketRegimeDto {
  @IsString()
  type: string;

  @IsString()
  description: string;
}

class OpportunityHeatmapItemDto {
  @IsString()
  @IsNotEmpty()
  symbol: string;

  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return Boolean(value);
  })
  active: boolean;
}

class StrategyConfidenceDto {
  @IsString()
  name: string;

  @IsString()
  confidence: string;
}

class ProRetailDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  subtitle: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StrategyUtilizationDto)
  strategyUtilization: StrategyUtilizationDto[];

  @IsNumber()
  @Min(0)
  @Max(100)
  executionQuality: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => MarketRegimeDto)
  marketRegime: MarketRegimeDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OpportunityHeatmapItemDto)
  opportunityHeatmap: OpportunityHeatmapItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StrategyConfidenceDto)
  strategyConfidence: StrategyConfidenceDto[];
}

class EquityCurveDto {
  @IsNumber()
  ytdReturn: number;

  @IsArray()
  @IsNumber({}, { each: true })
  dataPoints: number[];
}

class DrawdownZonesDto {
  @IsNumber()
  @Max(0)
  maxDrawdown: number;

  @IsNumber()
  @Max(0)
  currentDrawdown: number;

  @IsNumber()
  @Min(0)
  avgRecovery: number;
}

class RiskAdjustedMetricsDto {
  @IsNumber()
  sharpeRatio: number;

  @IsNumber()
  sortinoRatio: number;

  @IsNumber()
  calmarRatio: number;
}

class AlphaSourceDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  percentage: number;
}

class InvestorDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  subtitle: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => EquityCurveDto)
  equityCurve: EquityCurveDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => DrawdownZonesDto)
  drawdownZones: DrawdownZonesDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => RiskAdjustedMetricsDto)
  riskAdjustedMetrics: RiskAdjustedMetricsDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AlphaSourceDto)
  alphaSources: AlphaSourceDto[];
}

class FullTransparencyDto {
  @IsBoolean()
  enabled: boolean;

  @IsArray()
  @IsString({ each: true })
  features: string[];
}

class RealTimeDataDto {
  @IsBoolean()
  enabled: boolean;

  @IsNumber()
  @Min(0)
  latency: number;
}

class AdvancedMetricsDto {
  @IsBoolean()
  enabled: boolean;

  @IsArray()
  @IsString({ each: true })
  metrics: string[];
}

class CustomReportingDto {
  @IsBoolean()
  enabled: boolean;

  @IsArray()
  @IsString({ each: true })
  formats: string[];
}

class AIPreferenceTunerDto {
  @IsString()
  @IsNotEmpty()
  riskAppetite: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  exposureLimit: number;
}

class DCNPipelineAccessItemDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsString()
  @IsNotEmpty()
  status: string;
}

class ExecutionVenueDetailDto {
  @IsString()
  @IsNotEmpty()
  venue: string;

  @IsString()
  @IsNotEmpty()
  fill: string;
}

class MarketImpactReportDto {
  @IsString()
  @IsNotEmpty()
  avgSlippage: string;

  @IsString()
  @IsNotEmpty()
  fillRate: string;

  @IsString()
  @IsNotEmpty()
  priceImpact: string;
}

class VipUltraDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  subtitle: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => FullTransparencyDto)
  fullTransparency: FullTransparencyDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => RealTimeDataDto)
  realTimeData: RealTimeDataDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AdvancedMetricsDto)
  advancedMetrics: AdvancedMetricsDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CustomReportingDto)
  customReporting: CustomReportingDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AIPreferenceTunerDto)
  aiPreferenceTuner: AIPreferenceTunerDto;

  @IsArray()
  @IsString({ each: true })
  manualOverrideOptions: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DCNPipelineAccessItemDto)
  dcnPipelineAccess: DCNPipelineAccessItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExecutionVenueDetailDto)
  executionVenueDetails: ExecutionVenueDetailDto[];

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => MarketImpactReportDto)
  marketImpactReport: MarketImpactReportDto;
}

export class AccountRoomsDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => RetailSmallDto)
  retailSmall: RetailSmallDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ProRetailDto)
  proRetail: ProRetailDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => InvestorDto)
  investor: InvestorDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => VipUltraDto)
  vipUltra: VipUltraDto;
}

