import {
  IsNumber,
  IsString,
  IsArray,
  IsObject,
  IsEnum,
  ValidateNested,
  Min,
  Max,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

class MoodDataDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  forex: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  crypto: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  commodities: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  equities: number;

  @IsNumber()
  @Min(-100)
  @Max(100)
  riskOnOff: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  dollarStrength: number;

  @IsEnum(['calm', 'normal', 'storm'])
  volatility: 'calm' | 'normal' | 'storm';
}

class PressureItemDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsNumber()
  value: number;

  @IsEnum(['up', 'down', 'neutral'])
  trend: 'up' | 'down' | 'neutral';
}

class SectorRotationDto {
  @IsString()
  @IsNotEmpty()
  sector: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  momentum: number;

  @IsNumber()
  change24h: number;
}

class DirectionProbabilityDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  up: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  down: number;
}

class InstrumentDto {
  @IsString()
  @IsNotEmpty()
  symbol: string;

  @IsString()
  @IsNotEmpty()
  price: string;

  @ValidateNested()
  @Type(() => DirectionProbabilityDto)
  directionProbability: DirectionProbabilityDto;

  @IsNumber()
  @Min(0)
  @Max(100)
  trendStrength: number;

  @IsString()
  @IsNotEmpty()
  activeStrategy: string;

  @IsArray()
  @IsString({ each: true })
  threats: string[];
}

export class MarketBrainDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => MoodDataDto)
  moodData: MoodDataDto;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PressureItemDto)
  pressureItems: PressureItemDto[];

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectorRotationDto)
  stockSectors: SectorRotationDto[];

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectorRotationDto)
  cryptoSectors: SectorRotationDto[];

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectorRotationDto)
  capRotation: SectorRotationDto[];

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InstrumentDto)
  instruments: InstrumentDto[];
}

