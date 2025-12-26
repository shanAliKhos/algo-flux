import {
  IsString,
  IsArray,
  IsBoolean,
  IsNumber,
  ValidateNested,
  IsNotEmpty,
  IsIn,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

class MarketPersonalityItemDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsBoolean()
  active: boolean;

  @IsString()
  @IsNotEmpty()
  icon: string;
}

class BehaviorMapItemDto {
  @IsString()
  @IsNotEmpty()
  asset: string;

  @IsString()
  @IsNotEmpty()
  behavior: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  sentiment: number;
}

class StrategyItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsIn(['active', 'disabled'])
  status: string;

  @IsString()
  @IsIn(['high', 'medium', 'low'])
  opportunity: string;
}

class StrategyAlignmentItemDto {
  @IsString()
  @IsNotEmpty()
  asset: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StrategyItemDto)
  strategies: StrategyItemDto[];
}

export class ConditionsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MarketPersonalityItemDto)
  marketPersonality: MarketPersonalityItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BehaviorMapItemDto)
  behaviorMap: BehaviorMapItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StrategyAlignmentItemDto)
  strategyAlignment: StrategyAlignmentItemDto[];
}

