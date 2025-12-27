import {
  IsNumber,
  IsString,
  IsArray,
  IsObject,
  ValidateNested,
  IsOptional,
  Min,
  Max,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

class TopStatsDto {
  @IsString()
  @IsNotEmpty()
  totalEquity: string;

  @IsOptional()
  @IsNumber()
  totalEquityChange?: number;

  @IsString()
  @IsNotEmpty()
  mtdReturn: string;

  @IsString()
  @IsNotEmpty()
  maxDrawdown: string;

  @IsString()
  @IsNotEmpty()
  sharpeRatio: string;
}

class ExposureTileDto {
  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  allocation: number;

  @IsNumber()
  pnl: number;
}

class RegionExposureDto {
  @IsString()
  @IsNotEmpty()
  region: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  allocation: number;
}

class RiskBucketDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  allocation: number;

  @IsArray()
  @IsString({ each: true })
  strategies: string[];
}

export class PortfolioDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => TopStatsDto)
  topStats: TopStatsDto;

  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  equityData: number[];

  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  drawdownData: number[];

  @IsNumber()
  @Min(-100)
  @Max(0)
  maxDrawdownValue: number;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExposureTileDto)
  exposureTiles: ExposureTileDto[];

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RegionExposureDto)
  regionExposure: RegionExposureDto[];

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RiskBucketDto)
  riskBuckets: RiskBucketDto[];
}

