import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BadRequestException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { User, UserDocument } from '../users/schemas/user.schema';
import { AIBrain, AIBrainDocument } from './schemas/ai-brain.schema';
import { AIBrainDto } from './dto/ai-brain.dto';
import { Radar, RadarDocument } from './schemas/radar.schema';
import { RadarDto } from './dto/radar.dto';
import { MarketBrain, MarketBrainDocument } from './schemas/market-brain.schema';
import { Performance, PerformanceDocument } from './schemas/performance.schema';
import { Strategies, StrategiesDocument } from './schemas/strategies.schema';
import { TradeFormation, TradeFormationDocument } from './schemas/trade-formation.schema';
import { AccountRooms, AccountRoomsDocument } from './schemas/account-rooms.schema';
import { Conditions, ConditionsDocument } from './schemas/conditions.schema';
import { Execution, ExecutionDocument } from './schemas/execution.schema';
import { Audit, AuditDocument } from './schemas/audit.schema';
import { TradeRecord, TradeRecordDocument } from './schemas/trade-record.schema';
import { UserRole, UserStatus } from '../users/schemas/user.schema';

describe('AdminService', () => {
  let service: AdminService;
  let userModel: Model<UserDocument>;
  let aiBrainModel: Model<AIBrainDocument>;
  let radarModel: Model<RadarDocument>;

  const mockUserModel = {
    countDocuments: jest.fn(),
    find: jest.fn(),
    aggregate: jest.fn(),
  };

  const mockAIBrainModel = {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
  };

  const mockRadarModel = {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
  };

  // Mock models for other dependencies (not used in radar tests but required by AdminService)
  const createMockModel = () => ({
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    countDocuments: jest.fn(),
    aggregate: jest.fn(),
  });

  const mockAIBrainData: AIBrainDto = {
    neuralConfig: {
      nodes: 60,
      connections: 245,
      latency: 12,
    },
    dataStreams: [
      { label: 'Forex Majors', active: true, delay: 0 },
      { label: 'Indices (US, EU, Asia)', active: true, delay: 200 },
    ],
    marketSentiment: {
      forex: { bullish: 45, neutral: 30, bearish: 25 },
      crypto: { bullish: 62, neutral: 18, bearish: 20 },
      equities: { bullish: 38, neutral: 42, bearish: 20 },
    },
    strategies: [
      {
        name: 'Nuvex',
        icon: 'Target',
        status: 'active',
        accuracy: 78,
        confidence: 'high',
        bias: 'Bullish Reversal',
        instruments: ['XAUUSD', 'EURUSD'],
        path: '/strategy/nuvex',
      },
    ],
    newsTags: [
      { text: 'Risk-On', type: 'bullish' },
      { text: 'FOMC Today', type: 'neutral' },
    ],
    dataPointsPerSecond: 2400000,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: getModelToken(AIBrain.name),
          useValue: mockAIBrainModel,
        },
        {
          provide: getModelToken(MarketBrain.name),
          useValue: createMockModel(),
        },
        {
          provide: getModelToken(Performance.name),
          useValue: createMockModel(),
        },
        {
          provide: getModelToken(Strategies.name),
          useValue: createMockModel(),
        },
        {
          provide: getModelToken(TradeFormation.name),
          useValue: createMockModel(),
        },
        {
          provide: getModelToken(AccountRooms.name),
          useValue: createMockModel(),
        },
        {
          provide: getModelToken(Conditions.name),
          useValue: createMockModel(),
        },
        {
          provide: getModelToken(Execution.name),
          useValue: createMockModel(),
        },
        {
          provide: getModelToken(Audit.name),
          useValue: createMockModel(),
        },
        {
          provide: getModelToken(Radar.name),
          useValue: mockRadarModel,
        },
        {
          provide: getModelToken(TradeRecord.name),
          useValue: createMockModel(),
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
    aiBrainModel = module.get<Model<AIBrainDocument>>(getModelToken(AIBrain.name));
    radarModel = module.get<Model<RadarDocument>>(getModelToken(Radar.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getDashboardStats', () => {
    it('should return dashboard statistics', async () => {
      const mockStats = {
        totalUsers: 100,
        activeUsers: 80,
        inactiveUsers: 15,
        suspendedUsers: 5,
        adminUsers: 10,
        moderatorUsers: 20,
        regularUsers: 70,
        recentUsers: [],
        usersByMonth: [],
      };

      mockUserModel.countDocuments.mockResolvedValueOnce(100);
      mockUserModel.countDocuments.mockResolvedValueOnce(80);
      mockUserModel.countDocuments.mockResolvedValueOnce(15);
      mockUserModel.countDocuments.mockResolvedValueOnce(5);
      mockUserModel.countDocuments.mockResolvedValueOnce(10);
      mockUserModel.countDocuments.mockResolvedValueOnce(20);
      mockUserModel.countDocuments.mockResolvedValueOnce(70);
      mockUserModel.find.mockReturnValue({
        select: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue([]),
            }),
          }),
        }),
      });
      mockUserModel.aggregate.mockResolvedValue([]);

      const result = await service.getDashboardStats();

      expect(result).toHaveProperty('overview');
      expect(result).toHaveProperty('roles');
      expect(result).toHaveProperty('recentUsers');
      expect(result).toHaveProperty('usersByMonth');
      expect(mockUserModel.countDocuments).toHaveBeenCalledTimes(7);
    });
  });

  describe('getAIBrain', () => {
    it('should return AI Brain configuration when found', async () => {
      const mockAIBrain = {
        neuralConfig: mockAIBrainData.neuralConfig,
        dataStreams: mockAIBrainData.dataStreams,
        marketSentiment: mockAIBrainData.marketSentiment,
        strategies: mockAIBrainData.strategies,
        newsTags: mockAIBrainData.newsTags,
        dataPointsPerSecond: mockAIBrainData.dataPointsPerSecond,
      };

      mockAIBrainModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockAIBrain),
      });

      const result = await service.getAIBrain();

      expect(result).toEqual(mockAIBrain);
      expect(mockAIBrainModel.findOne).toHaveBeenCalledWith({ key: 'default' });
    });

    it('should return default configuration when not found', async () => {
      mockAIBrainModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.getAIBrain();

      expect(result).toHaveProperty('neuralConfig');
      expect(result).toHaveProperty('dataStreams');
      expect(result).toHaveProperty('marketSentiment');
      expect(result).toHaveProperty('strategies');
      expect(result).toHaveProperty('newsTags');
      expect(result).toHaveProperty('dataPointsPerSecond');
      expect(result.neuralConfig.nodes).toBe(60);
      expect(result.dataStreams.length).toBeGreaterThan(0);
      expect(result.strategies.length).toBeGreaterThan(0);
    });
  });

  describe('updateAIBrain', () => {
    it('should create new AI Brain configuration if not exists', async () => {
      const mockCreatedAIBrain = {
        neuralConfig: mockAIBrainData.neuralConfig,
        dataStreams: mockAIBrainData.dataStreams,
        marketSentiment: mockAIBrainData.marketSentiment,
        strategies: mockAIBrainData.strategies,
        newsTags: mockAIBrainData.newsTags,
        dataPointsPerSecond: mockAIBrainData.dataPointsPerSecond,
      };

      mockAIBrainModel.findOneAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCreatedAIBrain),
      });

      const result = await service.updateAIBrain(mockAIBrainData);

      expect(result).toEqual(mockCreatedAIBrain);
      expect(mockAIBrainModel.findOneAndUpdate).toHaveBeenCalledWith(
        { key: 'default' },
        {
          key: 'default',
          neuralConfig: mockAIBrainData.neuralConfig,
          dataStreams: mockAIBrainData.dataStreams,
          marketSentiment: mockAIBrainData.marketSentiment,
          strategies: mockAIBrainData.strategies,
          newsTags: mockAIBrainData.newsTags,
          dataPointsPerSecond: mockAIBrainData.dataPointsPerSecond,
        },
        { upsert: true, new: true },
      );
    });

    it('should update existing AI Brain configuration', async () => {
      const updatedData: AIBrainDto = {
        ...mockAIBrainData,
        neuralConfig: {
          nodes: 100,
          connections: 500,
          latency: 15,
        },
      };

      const mockUpdatedAIBrain = {
        neuralConfig: updatedData.neuralConfig,
        dataStreams: updatedData.dataStreams,
        marketSentiment: updatedData.marketSentiment,
        strategies: updatedData.strategies,
        newsTags: updatedData.newsTags,
        dataPointsPerSecond: updatedData.dataPointsPerSecond,
      };

      mockAIBrainModel.findOneAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUpdatedAIBrain),
      });

      const result = await service.updateAIBrain(updatedData);

      expect(result.neuralConfig.nodes).toBe(100);
      expect(result.neuralConfig.connections).toBe(500);
      expect(result.neuralConfig.latency).toBe(15);
    });
  });

  // Note: Market Brain tests are prepared for when getMarketBrain and updateMarketBrain
  // methods are implemented in AdminService. These tests follow the same pattern as AI Brain tests.
  // 
  // To enable these tests, you'll need to:
  // 1. Add MarketBrain schema to schemas/market-brain.schema.ts
  // 2. Inject MarketBrain model in AdminService constructor
  // 3. Implement getMarketBrain() and updateMarketBrain() methods
  // 4. Update the mock models in beforeEach to include MarketBrain model
  //
  // Example structure when implemented:
  // describe('getMarketBrain', () => {
  //   it('should return Market Brain configuration when found', async () => {
  //     const mockMarketBrain = { ... };
  //     mockMarketBrainModel.findOne.mockReturnValue({
  //       exec: jest.fn().mockResolvedValue(mockMarketBrain),
  //     });
  //     const result = await service.getMarketBrain();
  //     expect(result).toEqual(mockMarketBrain);
  //   });
  // });

  describe('getRadar', () => {
    it('should return Radar data when found', async () => {
      const mockRadar = {
        assetClasses: [
          { label: 'Forex', value: 72, sublabel: 'Trending' },
          { label: 'Indices', value: 58, sublabel: 'Ranging' },
        ],
        opportunities: [
          {
            symbol: 'XAUUSD',
            price: '2,034.50',
            change: 1.24,
            strategy: 'Nuvex',
            signal: 'Preparing Entry' as const,
          },
        ],
        regimes: [
          {
            name: 'High Volatility Regime',
            description: 'VIX elevated, wider stops recommended',
          },
        ],
      };

      mockRadarModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockRadar),
      });

      const result = await service.getRadar();

      expect(result).toEqual({
        assetClasses: mockRadar.assetClasses,
        opportunities: mockRadar.opportunities,
        regimes: mockRadar.regimes,
      });
      expect(mockRadarModel.findOne).toHaveBeenCalledWith({ key: 'default' });
    });

    it('should throw BadRequestException when Radar data not found', async () => {
      mockRadarModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.getRadar()).rejects.toThrow(BadRequestException);
      await expect(service.getRadar()).rejects.toThrow(
        'Radar data not found',
      );
    });
  });

  describe('updateRadar', () => {
    it('should create new Radar configuration if not exists', async () => {
      const mockRadarDto: RadarDto = {
        assetClasses: [
          { label: 'Forex', value: 72, sublabel: 'Trending' },
          { label: 'Crypto', value: 85, sublabel: 'High Vol' },
        ],
        opportunities: [
          {
            symbol: 'BTCUSDT',
            price: '43,892',
            change: 2.45,
            strategy: 'Xylo',
            signal: 'In Position',
          },
        ],
        regimes: [
          {
            name: 'Trending Crypto Regime',
            description: 'Strong momentum in majors, breakout plays active',
          },
        ],
      };

      const mockCreatedRadar = {
        assetClasses: mockRadarDto.assetClasses,
        opportunities: mockRadarDto.opportunities,
        regimes: mockRadarDto.regimes,
      };

      mockRadarModel.findOneAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCreatedRadar),
      });

      const result = await service.updateRadar(mockRadarDto);

      expect(result).toEqual({
        assetClasses: mockCreatedRadar.assetClasses,
        opportunities: mockCreatedRadar.opportunities,
        regimes: mockCreatedRadar.regimes,
      });
      expect(mockRadarModel.findOneAndUpdate).toHaveBeenCalledWith(
        { key: 'default' },
        {
          key: 'default',
          assetClasses: mockRadarDto.assetClasses,
          opportunities: mockRadarDto.opportunities,
          regimes: mockRadarDto.regimes,
        },
        { upsert: true, new: true },
      );
    });

    it('should update existing Radar configuration', async () => {
      const updatedData: RadarDto = {
        assetClasses: [
          { label: 'Updated Forex', value: 80, sublabel: 'Updated Status' },
        ],
        opportunities: [
          {
            symbol: 'ETHUSDT',
            price: '2,345.80',
            change: 1.87,
            strategy: 'Xylo',
            signal: 'Preparing Entry',
          },
        ],
        regimes: [
          {
            name: 'Updated Regime',
            description: 'Updated description',
          },
        ],
      };

      const mockUpdatedRadar = {
        assetClasses: updatedData.assetClasses,
        opportunities: updatedData.opportunities,
        regimes: updatedData.regimes,
      };

      mockRadarModel.findOneAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUpdatedRadar),
      });

      const result = await service.updateRadar(updatedData);

      expect(result.assetClasses[0].label).toBe('Updated Forex');
      expect(result.assetClasses[0].value).toBe(80);
      expect(result.opportunities[0].symbol).toBe('ETHUSDT');
      expect(result.regimes[0].name).toBe('Updated Regime');
    });
  });
});

