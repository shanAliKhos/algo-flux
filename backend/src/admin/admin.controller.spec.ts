import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AIBrainDto } from './dto/ai-brain.dto';
import { MarketBrainDto } from './dto/market-brain.dto';
import { RadarDto } from './dto/radar.dto';

describe('AdminController', () => {
  let controller: AdminController;
  let service: AdminService;

  const mockAdminService = {
    getDashboardStats: jest.fn(),
    getAIBrain: jest.fn(),
    updateAIBrain: jest.fn(),
    getMarketBrain: jest.fn(),
    updateMarketBrain: jest.fn(),
    getRadar: jest.fn(),
    updateRadar: jest.fn(),
  };

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
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: mockAdminService,
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    service = module.get<AdminService>(AdminService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getDashboardStats', () => {
    it('should return dashboard statistics', async () => {
      const mockStats = {
        overview: {
          totalUsers: 100,
          activeUsers: 80,
          inactiveUsers: 15,
          suspendedUsers: 5,
        },
        roles: {
          admin: 10,
          moderator: 20,
          user: 70,
        },
        recentUsers: [],
        usersByMonth: [],
      };

      mockAdminService.getDashboardStats.mockResolvedValue(mockStats);

      const result = await controller.getDashboardStats();

      expect(result).toEqual(mockStats);
      expect(service.getDashboardStats).toHaveBeenCalled();
    });
  });

  describe('getAIBrain', () => {
    it('should return AI Brain configuration', async () => {
      mockAdminService.getAIBrain.mockResolvedValue(mockAIBrainData);

      const result = await controller.getAIBrain();

      expect(result).toEqual(mockAIBrainData);
      expect(service.getAIBrain).toHaveBeenCalled();
    });

    it('should handle errors when getting AI Brain configuration', async () => {
      const error = new Error('Database error');
      mockAdminService.getAIBrain.mockRejectedValue(error);

      await expect(controller.getAIBrain()).rejects.toThrow('Database error');
    });
  });

  describe('updateAIBrain', () => {
    it('should update AI Brain configuration', async () => {
      const updatedData: AIBrainDto = {
        ...mockAIBrainData,
        neuralConfig: {
          nodes: 100,
          connections: 500,
          latency: 15,
        },
      };

      mockAdminService.updateAIBrain.mockResolvedValue(updatedData);

      const result = await controller.updateAIBrain(updatedData);

      expect(result).toEqual(updatedData);
      expect(service.updateAIBrain).toHaveBeenCalledWith(updatedData);
    });

    it('should validate and update all AI Brain fields', async () => {
      const updatedData: AIBrainDto = {
        neuralConfig: {
          nodes: 75,
          connections: 300,
          latency: 10,
        },
        dataStreams: [
          { label: 'New Stream', active: false, delay: 100 },
        ],
        marketSentiment: {
          forex: { bullish: 50, neutral: 25, bearish: 25 },
          crypto: { bullish: 70, neutral: 15, bearish: 15 },
          equities: { bullish: 40, neutral: 40, bearish: 20 },
        },
        strategies: [
          {
            name: 'New Strategy',
            icon: 'BarChart3',
            status: 'waiting',
            accuracy: 85,
            confidence: 'high',
            bias: 'New Bias',
            instruments: ['BTCUSDT'],
            path: '/strategy/new',
          },
        ],
        newsTags: [
          { text: 'New Tag', type: 'bearish' },
        ],
        dataPointsPerSecond: 3000000,
      };

      mockAdminService.updateAIBrain.mockResolvedValue(updatedData);

      const result = await controller.updateAIBrain(updatedData);

      expect(result.neuralConfig.nodes).toBe(75);
      expect(result.dataStreams[0].label).toBe('New Stream');
      expect(result.strategies[0].name).toBe('New Strategy');
      expect(result.newsTags[0].text).toBe('New Tag');
      expect(result.dataPointsPerSecond).toBe(3000000);
    });

    it('should handle errors when updating AI Brain configuration', async () => {
      const error = new Error('Update failed');
      mockAdminService.updateAIBrain.mockRejectedValue(error);

      await expect(controller.updateAIBrain(mockAIBrainData)).rejects.toThrow(
        'Update failed',
      );
    });
  });

  // Market Brain tests - These will be enabled when getMarketBrain() and updateMarketBrain()
  // methods are implemented in AdminController and AdminService
  //
  // To enable:
  // 1. Add getMarketBrain() and updateMarketBrain() methods to AdminService
  // 2. Add corresponding endpoints to AdminController
  // 3. Uncomment the tests below
  //
  // describe('getMarketBrain', () => {
  //   it('should return Market Brain configuration', async () => {
  //     const mockMarketBrainData: MarketBrainDto = {
  //       moodData: {
  //         forex: 58,
  //         crypto: 75,
  //         commodities: 52,
  //         equities: 65,
  //         riskOnOff: 35,
  //         dollarStrength: 62,
  //         volatility: 'normal',
  //       },
  //       pressureItems: [
  //         { label: 'Fed Rate', value: 5.25, trend: 'up' },
  //       ],
  //       sectorRotations: [
  //         { sector: 'Tech', momentum: 85, change24h: 2.3 },
  //       ],
  //       instruments: [
  //         {
  //           symbol: 'XAUUSD',
  //           price: '2,645.32',
  //           directionProbability: { up: 62, down: 38 },
  //           trendStrength: 78,
  //           activeStrategy: 'Drav',
  //           threats: ['High volatility'],
  //         },
  //       ],
  //     };
  //
  //     mockAdminService.getMarketBrain.mockResolvedValue(mockMarketBrainData);
  //
  //     const result = await controller.getMarketBrain();
  //
  //     expect(result).toEqual(mockMarketBrainData);
  //     expect(service.getMarketBrain).toHaveBeenCalled();
  //   });
  //
  //   it('should handle errors when getting Market Brain configuration', async () => {
  //     const error = new Error('Database error');
  //     mockAdminService.getMarketBrain.mockRejectedValue(error);
  //
  //     await expect(controller.getMarketBrain()).rejects.toThrow('Database error');
  //   });
  // });
  //
  // describe('updateMarketBrain', () => {
  //   it('should update Market Brain configuration', async () => {
  //     const mockMarketBrainData: MarketBrainDto = {
  //       moodData: {
  //         forex: 70,
  //         crypto: 80,
  //         commodities: 60,
  //         equities: 75,
  //         riskOnOff: 50,
  //         dollarStrength: 70,
  //         volatility: 'storm',
  //       },
  //       pressureItems: [
  //         { label: 'Updated Rate', value: 6.0, trend: 'down' },
  //       ],
  //       sectorRotations: [
  //         { sector: 'Updated Sector', momentum: 90, change24h: 3.5 },
  //       ],
  //       instruments: [
  //         {
  //           symbol: 'EURUSD',
  //           price: '1.1000',
  //           directionProbability: { up: 70, down: 30 },
  //           trendStrength: 85,
  //           activeStrategy: 'Nuvex',
  //           threats: ['Updated threat'],
  //         },
  //       ],
  //     };
  //
  //     mockAdminService.updateMarketBrain.mockResolvedValue(mockMarketBrainData);
  //
  //     const result = await controller.updateMarketBrain(mockMarketBrainData);
  //
  //     expect(result).toEqual(mockMarketBrainData);
  //     expect(service.updateMarketBrain).toHaveBeenCalledWith(mockMarketBrainData);
  //   });
  //
  //   it('should validate and update all Market Brain fields', async () => {
  //     const updatedData: MarketBrainDto = {
  //       moodData: {
  //         forex: 65,
  //         crypto: 70,
  //         commodities: 55,
  //         equities: 68,
  //         riskOnOff: 40,
  //         dollarStrength: 65,
  //         volatility: 'normal',
  //       },
  //       pressureItems: [
  //         { label: 'New Pressure', value: 5.5, trend: 'neutral' },
  //       ],
  //       sectorRotations: [
  //         { sector: 'New Sector', momentum: 75, change24h: 1.5 },
  //       ],
  //       instruments: [
  //         {
  //           symbol: 'BTCUSDT',
  //           price: '98,432',
  //           directionProbability: { up: 71, down: 29 },
  //           trendStrength: 85,
  //           activeStrategy: 'Tenzor',
  //           threats: ['High volatility'],
  //         },
  //       ],
  //     };
  //
  //     mockAdminService.updateMarketBrain.mockResolvedValue(updatedData);
  //
  //     const result = await controller.updateMarketBrain(updatedData);
  //
  //     expect(result.moodData.forex).toBe(65);
  //     expect(result.pressureItems[0].label).toBe('New Pressure');
  //     expect(result.sectorRotations[0].sector).toBe('New Sector');
  //     expect(result.instruments[0].symbol).toBe('BTCUSDT');
  //   });
  //
  //   it('should handle errors when updating Market Brain configuration', async () => {
  //     const mockMarketBrainData: MarketBrainDto = {
  //       moodData: {
  //         forex: 58,
  //         crypto: 75,
  //         commodities: 52,
  //         equities: 65,
  //         riskOnOff: 35,
  //         dollarStrength: 62,
  //         volatility: 'normal',
  //       },
  //       pressureItems: [],
  //       sectorRotations: [],
  //       instruments: [],
  //     };
  //
  //     const error = new Error('Update failed');
  //     mockAdminService.updateMarketBrain.mockRejectedValue(error);
  //
  //     await expect(controller.updateMarketBrain(mockMarketBrainData)).rejects.toThrow(
  //       'Update failed',
  //     );
  //   });
  // });

  describe('getRadar', () => {
    it('should return Radar data', async () => {
      const mockRadarData: RadarDto = {
        assetClasses: [
          { label: 'Forex', value: 72, sublabel: 'Trending' },
          { label: 'Indices', value: 58, sublabel: 'Ranging' },
          { label: 'Stocks', value: 45, sublabel: 'Mixed' },
        ],
        opportunities: [
          {
            symbol: 'XAUUSD',
            price: '2,034.50',
            change: 1.24,
            strategy: 'Nuvex',
            signal: 'Preparing Entry',
          },
          {
            symbol: 'EURUSD',
            price: '1.0892',
            change: -0.34,
            strategy: 'Yark',
            signal: 'Watching',
          },
        ],
        regimes: [
          {
            name: 'High Volatility Regime',
            description: 'VIX elevated, wider stops recommended',
          },
          {
            name: 'Trending Crypto Regime',
            description: 'Strong momentum in majors, breakout plays active',
          },
        ],
      };

      mockAdminService.getRadar.mockResolvedValue(mockRadarData);

      const result = await controller.getRadar();

      expect(result).toEqual(mockRadarData);
      expect(service.getRadar).toHaveBeenCalled();
    });

    it('should handle errors when getting Radar data', async () => {
      const error = new Error('Database error');
      mockAdminService.getRadar.mockRejectedValue(error);

      await expect(controller.getRadar()).rejects.toThrow('Database error');
    });
  });

  describe('updateRadar', () => {
    it('should update Radar data', async () => {
      const mockRadarData: RadarDto = {
        assetClasses: [
          { label: 'Forex', value: 75, sublabel: 'Trending' },
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
            name: 'Risk-Off Equities',
            description: 'Defensive positioning, reduced exposure',
          },
        ],
      };

      mockAdminService.updateRadar.mockResolvedValue(mockRadarData);

      const result = await controller.updateRadar(mockRadarData);

      expect(result).toEqual(mockRadarData);
      expect(service.updateRadar).toHaveBeenCalledWith(mockRadarData);
    });

    it('should validate and update all Radar fields', async () => {
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

      mockAdminService.updateRadar.mockResolvedValue(updatedData);

      const result = await controller.updateRadar(updatedData);

      expect(result.assetClasses[0].label).toBe('Updated Forex');
      expect(result.assetClasses[0].value).toBe(80);
      expect(result.opportunities[0].symbol).toBe('ETHUSDT');
      expect(result.regimes[0].name).toBe('Updated Regime');
    });

    it('should handle errors when updating Radar data', async () => {
      const mockRadarData: RadarDto = {
        assetClasses: [
          { label: 'Forex', value: 72, sublabel: 'Trending' },
        ],
        opportunities: [],
        regimes: [],
      };

      const error = new Error('Update failed');
      mockAdminService.updateRadar.mockRejectedValue(error);

      await expect(controller.updateRadar(mockRadarData)).rejects.toThrow(
        'Update failed',
      );
    });
  });
});

