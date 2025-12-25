import tradingPairsData from '@/data/trading-pairs.json';

export interface TradingPair {
  symbol: string;
  name: string;
  category: string;
}

export interface TradingPairsData {
  forex: {
    majors: TradingPair[];
    crosses: TradingPair[];
    exotic: TradingPair[];
  };
  crypto: {
    major: TradingPair[];
    altcoins: TradingPair[];
  };
  commodities: {
    metals: TradingPair[];
    energy: TradingPair[];
  };
  indices: TradingPair[];
  stocks: {
    tech: TradingPair[];
    finance: TradingPair[];
    other: TradingPair[];
  };
}

// Get all pairs as a flat array
export function getAllPairs(): TradingPair[] {
  const data = tradingPairsData as TradingPairsData;
  return [
    ...data.forex.majors,
    ...data.forex.crosses,
    ...data.forex.exotic,
    ...data.crypto.major,
    ...data.crypto.altcoins,
    ...data.commodities.metals,
    ...data.commodities.energy,
    ...data.indices,
    ...data.stocks.tech,
    ...data.stocks.finance,
    ...data.stocks.other,
  ];
}

// Get all symbols as a flat array
export function getAllSymbols(): string[] {
  return getAllPairs().map(pair => pair.symbol);
}

// Get pairs by category
export function getPairsByCategory(category: string): TradingPair[] {
  return getAllPairs().filter(pair => pair.category === category);
}

// Get pair by symbol
export function getPairBySymbol(symbol: string): TradingPair | undefined {
  return getAllPairs().find(pair => pair.symbol === symbol);
}

// Get pairs grouped by main category
export function getPairsGrouped(): { [key: string]: TradingPair[] } {
  const data = tradingPairsData as TradingPairsData;
  return {
    'Forex Majors': data.forex.majors,
    'Forex Crosses': data.forex.crosses,
    'Forex Exotic': data.forex.exotic,
    'Crypto Major': data.crypto.major,
    'Crypto Altcoins': data.crypto.altcoins,
    'Commodities Metals': data.commodities.metals,
    'Commodities Energy': data.commodities.energy,
    'Indices': data.indices,
    'Stocks Tech': data.stocks.tech,
    'Stocks Finance': data.stocks.finance,
    'Stocks Other': data.stocks.other,
  };
}

// Get categories list
export function getCategories(): string[] {
  const grouped = getPairsGrouped();
  return Object.keys(grouped);
}

export default tradingPairsData as TradingPairsData;

