import {
  IsString,
  IsArray,
  IsObject,
  ValidateNested,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderBookLevelDto {
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  size: number;

  @IsNumber()
  @IsNotEmpty()
  total: number;
}

class OrderbookDto {
  @IsString()
  @IsNotEmpty()
  instrument: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderBookLevelDto)
  bids: OrderBookLevelDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderBookLevelDto)
  asks: OrderBookLevelDto[];

  @IsNumber()
  @IsNotEmpty()
  spread: number;
}

class TradeTicketDto {
  @IsString()
  @IsNotEmpty()
  instrument: string;

  @IsString()
  @IsNotEmpty()
  strategy: string;

  @IsString()
  @IsNotEmpty()
  direction: string;

  @IsNumber()
  @IsNotEmpty()
  entry: number;

  @IsNumber()
  @IsNotEmpty()
  stopLoss: number;

  @IsNumber()
  @IsNotEmpty()
  takeProfit: number;

  @IsString()
  @IsNotEmpty()
  size: string;

  @IsString()
  @IsNotEmpty()
  risk: string;
}

class ExecutionMetricsDto {
  @IsString()
  @IsNotEmpty()
  speed: string;

  @IsString()
  @IsNotEmpty()
  slippage: string;

  @IsString()
  @IsNotEmpty()
  fillQuality: string;
}

class ExposureDto {
  @IsString()
  @IsNotEmpty()
  currentExposure: string;

  @IsString()
  @IsNotEmpty()
  openPnL: string;
}

export class ExecutionDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => OrderbookDto)
  orderbook: OrderbookDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => TradeTicketDto)
  tradeTicket: TradeTicketDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ExecutionMetricsDto)
  executionMetrics: ExecutionMetricsDto;

  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  equityCurve: number[];

  @IsOptional()
  @ValidateNested()
  @Type(() => ExposureDto)
  exposure?: ExposureDto;
}

