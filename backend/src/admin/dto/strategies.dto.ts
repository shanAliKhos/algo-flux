import { IsArray, IsString, IsEnum, IsNumber, Min, Max, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class StrategyItemDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  name: string;

  @IsEnum(['active', 'waiting', 'cooling'])
  status: 'active' | 'waiting' | 'cooling';

  @IsNumber()
  @Min(0)
  @Max(100)
  accuracy: number;

  @IsEnum(['high', 'medium', 'low'])
  confidence: 'high' | 'medium' | 'low';

  @IsString()
  bias: string;

  @IsArray()
  @IsString({ each: true })
  instruments: string[];
}

export class StrategiesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StrategyItemDto)
  strategies: StrategyItemDto[];
}

