import {
  IsString,
  IsArray,
  IsObject,
  ValidateNested,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

class InstrumentWithReasonDto {
  @IsString()
  @IsNotEmpty()
  symbol: string;

  @IsString()
  @IsNotEmpty()
  reason: string;
}

class OpportunityDetectionDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InstrumentWithReasonDto)
  instruments: InstrumentWithReasonDto[];

  @IsString()
  @IsNotEmpty()
  selectedInstrument: string;
}

class ChartDataPointDto {
  @IsNotEmpty()
  x: number;

  @IsNotEmpty()
  y: number;
}

class PatternRecognitionDto {
  @IsArray()
  @IsString({ each: true })
  patterns: string[];

  @IsString()
  @IsNotEmpty()
  detectedPattern: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChartDataPointDto)
  chartData: ChartDataPointDto[];
}

class RiskShapingItemDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsString()
  @IsNotEmpty()
  value: string;

  @IsNotEmpty()
  bar: number;
}

class ExecutionBlueprintDto {
  @IsString()
  @IsNotEmpty()
  entry: string;

  @IsString()
  @IsNotEmpty()
  stopLoss: string;

  @IsString()
  @IsNotEmpty()
  takeProfit: string;

  @IsString()
  @IsNotEmpty()
  rrRatio: string;
}

class LiveManagementItemDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsBoolean()
  active: boolean;
}

class FinalExitReportDto {
  @IsString()
  @IsNotEmpty()
  exitReason: string;

  @IsString()
  @IsNotEmpty()
  rating: string;

  @IsString()
  @IsNotEmpty()
  profitLoss: string;

  @IsString()
  @IsNotEmpty()
  duration: string;

  @IsString()
  @IsNotEmpty()
  notes: string;
}

export class TradeFormationDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => OpportunityDetectionDto)
  opportunityDetection: OpportunityDetectionDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PatternRecognitionDto)
  patternRecognition: PatternRecognitionDto;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RiskShapingItemDto)
  riskShaping: RiskShapingItemDto[];

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ExecutionBlueprintDto)
  executionBlueprint: ExecutionBlueprintDto;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LiveManagementItemDto)
  liveManagement: LiveManagementItemDto[];

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => FinalExitReportDto)
  finalExitReport: FinalExitReportDto;
}

