import {
  IsNumber,
  IsString,
  IsBoolean,
  IsArray,
  IsObject,
  IsEnum,
  ValidateNested,
  Min,
  Max,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

class NeuralConfigDto {
  @IsNumber()
  @Min(1)
  @Max(1000)
  nodes: number;

  @IsNumber()
  @Min(1)
  @Max(10000)
  connections: number;

  @IsNumber()
  @Min(1)
  @Max(1000)
  latency: number;
}

class DataStreamDto {
  @IsString()
  label: string;

  @IsBoolean()
  active: boolean;

  @IsNumber()
  @Min(0)
  delay: number;
}

class MarketSentimentItemDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  bullish: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  neutral: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  bearish: number;
}

class MarketSentimentDto {
  @ValidateNested()
  @Type(() => MarketSentimentItemDto)
  forex: MarketSentimentItemDto;

  @ValidateNested()
  @Type(() => MarketSentimentItemDto)
  crypto: MarketSentimentItemDto;

  @ValidateNested()
  @Type(() => MarketSentimentItemDto)
  equities: MarketSentimentItemDto;
}

class StrategyDto {
  @IsString()
  name: string;

  @IsString()
  icon: string;

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

  @IsString()
  path: string;
}

class NewsTagDto {
  @IsString()
  text: string;

  @IsEnum(['bullish', 'bearish', 'neutral'])
  type: 'bullish' | 'bearish' | 'neutral';
}

export class AIBrainDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => NeuralConfigDto)
  neuralConfig: NeuralConfigDto;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DataStreamDto)
  dataStreams: DataStreamDto[];

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => MarketSentimentDto)
  marketSentiment: MarketSentimentDto;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StrategyDto)
  strategies: StrategyDto[];

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NewsTagDto)
  newsTags: NewsTagDto[];

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  dataPointsPerSecond: number;
}


