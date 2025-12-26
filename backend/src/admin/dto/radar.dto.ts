import {
  IsNumber,
  IsString,
  IsArray,
  ValidateNested,
  Min,
  Max,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

class AssetClassDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  value: number;

  @IsString()
  @IsNotEmpty()
  sublabel: string;
}

class OpportunityDto {
  @IsString()
  @IsNotEmpty()
  symbol: string;

  @IsString()
  @IsNotEmpty()
  price: string;

  @IsNumber()
  change: number;

  @IsString()
  @IsNotEmpty()
  strategy: string;

  @IsEnum(['In Position', 'Preparing Entry', 'Watching'])
  signal: 'In Position' | 'Preparing Entry' | 'Watching';
}

class RegimeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

export class RadarDto {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AssetClassDto)
  assetClasses: AssetClassDto[];

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OpportunityDto)
  opportunities: OpportunityDto[];

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RegimeDto)
  regimes: RegimeDto[];
}

