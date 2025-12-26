import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getModelToken } from '@nestjs/mongoose';
import { TradeRecord } from '../admin/schemas/trade-record.schema';

async function seedTradeRecords() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const tradeRecordModel = app.get(getModelToken(TradeRecord.name));

  // Clear existing records
  await tradeRecordModel.deleteMany({});

  // Create sample trade records
  const now = new Date();
  const sampleTrades = [
    // Recent executions
    {
      time: new Date(now.getTime() - 5 * 60000), // 5 minutes ago
      strategy: 'Drav',
      symbol: 'XAUUSD',
      direction: 'Long',
      size: '0.85',
      price: 2641.50,
      status: 'Filled',
      win: true,
      pnl: 125.50,
      rMultiple: 2.1,
      entryTime: new Date(now.getTime() - 30 * 60000),
      exitTime: new Date(now.getTime() - 5 * 60000),
    },
    {
      time: new Date(now.getTime() - 8 * 60000), // 8 minutes ago
      strategy: 'Tenzor',
      symbol: 'BTCUSDT',
      direction: 'Long',
      size: '0.12',
      price: 98245.00,
      status: 'Filled',
      win: true,
      pnl: 350.00,
      rMultiple: 2.8,
      entryTime: new Date(now.getTime() - 45 * 60000),
      exitTime: new Date(now.getTime() - 8 * 60000),
    },
    {
      time: new Date(now.getTime() - 15 * 60000), // 15 minutes ago
      strategy: 'Drav',
      symbol: 'EURUSD',
      direction: 'Short',
      size: '1.00',
      price: 1.0850,
      status: 'Filled',
      win: false,
      pnl: -50.00,
      rMultiple: -1.0,
      entryTime: new Date(now.getTime() - 60 * 60000),
      exitTime: new Date(now.getTime() - 15 * 60000),
    },
    {
      time: new Date(now.getTime() - 20 * 60000), // 20 minutes ago
      strategy: 'Tenzor',
      symbol: 'XAUUSD',
      direction: 'Long',
      size: '0.50',
      price: 2635.00,
      status: 'Filled',
      win: true,
      pnl: 75.00,
      rMultiple: 1.5,
      entryTime: new Date(now.getTime() - 90 * 60000),
      exitTime: new Date(now.getTime() - 20 * 60000),
    },
    {
      time: new Date(now.getTime() - 25 * 60000), // 25 minutes ago
      strategy: 'Drav',
      symbol: 'BTCUSDT',
      direction: 'Short',
      size: '0.10',
      price: 98000.00,
      status: 'Filled',
      win: true,
      pnl: 200.00,
      rMultiple: 3.0,
      entryTime: new Date(now.getTime() - 120 * 60000),
      exitTime: new Date(now.getTime() - 25 * 60000),
    },
    // More trades for performance calculation
    {
      time: new Date(now.getTime() - 1 * 24 * 60 * 60000), // 1 day ago
      strategy: 'Drav',
      symbol: 'XAUUSD',
      direction: 'Long',
      size: '0.75',
      price: 2630.00,
      status: 'Filled',
      win: true,
      pnl: 100.00,
      rMultiple: 2.0,
      entryTime: new Date(now.getTime() - 1 * 24 * 60 * 60000 - 30 * 60000),
      exitTime: new Date(now.getTime() - 1 * 24 * 60 * 60000),
    },
    {
      time: new Date(now.getTime() - 2 * 24 * 60 * 60000), // 2 days ago
      strategy: 'Tenzor',
      symbol: 'EURUSD',
      direction: 'Long',
      size: '1.20',
      price: 1.0820,
      status: 'Filled',
      win: false,
      pnl: -60.00,
      rMultiple: -1.2,
      entryTime: new Date(now.getTime() - 2 * 24 * 60 * 60000 - 45 * 60000),
      exitTime: new Date(now.getTime() - 2 * 24 * 60 * 60000),
    },
    {
      time: new Date(now.getTime() - 3 * 24 * 60 * 60000), // 3 days ago
      strategy: 'Drav',
      symbol: 'BTCUSDT',
      direction: 'Long',
      size: '0.15',
      price: 97500.00,
      status: 'Filled',
      win: true,
      pnl: 450.00,
      rMultiple: 3.5,
      entryTime: new Date(now.getTime() - 3 * 24 * 60 * 60000 - 60 * 60000),
      exitTime: new Date(now.getTime() - 3 * 24 * 60 * 60000),
    },
    {
      time: new Date(now.getTime() - 4 * 24 * 60 * 60000), // 4 days ago
      strategy: 'Tenzor',
      symbol: 'XAUUSD',
      direction: 'Short',
      size: '0.60',
      price: 2620.00,
      status: 'Filled',
      win: true,
      pnl: 90.00,
      rMultiple: 1.8,
      entryTime: new Date(now.getTime() - 4 * 24 * 60 * 60000 - 30 * 60000),
      exitTime: new Date(now.getTime() - 4 * 24 * 60 * 60000),
    },
    {
      time: new Date(now.getTime() - 5 * 24 * 60 * 60000), // 5 days ago
      strategy: 'Drav',
      symbol: 'EURUSD',
      direction: 'Long',
      size: '0.90',
      price: 1.0800,
      status: 'Filled',
      win: false,
      pnl: -40.00,
      rMultiple: -0.8,
      entryTime: new Date(now.getTime() - 5 * 24 * 60 * 60000 - 40 * 60000),
      exitTime: new Date(now.getTime() - 5 * 24 * 60 * 60000),
    },
    {
      time: new Date(now.getTime() - 6 * 24 * 60 * 60000), // 6 days ago
      strategy: 'Tenzor',
      symbol: 'BTCUSDT',
      direction: 'Long',
      size: '0.08',
      price: 97000.00,
      status: 'Filled',
      win: true,
      pnl: 300.00,
      rMultiple: 2.5,
      entryTime: new Date(now.getTime() - 6 * 24 * 60 * 60000 - 50 * 60000),
      exitTime: new Date(now.getTime() - 6 * 24 * 60 * 60000),
    },
  ];

  await tradeRecordModel.insertMany(sampleTrades);
  console.log(`✅ Seeded ${sampleTrades.length} trade records`);

  await app.close();
}

seedTradeRecords()
  .then(() => {
    console.log('✅ Seed completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  });

