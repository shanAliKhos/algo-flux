import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { UserRole, UserStatus } from '../users/schemas/user.schema';
import { AIBrain, AIBrainDocument } from './schemas/ai-brain.schema';
import { AIBrainDto } from './dto/ai-brain.dto';
import { MarketBrain, MarketBrainDocument } from './schemas/market-brain.schema';
import { MarketBrainDto } from './dto/market-brain.dto';
import { Performance, PerformanceDocument } from './schemas/performance.schema';
import { PerformanceDto } from './dto/performance.dto';
import { Strategies, StrategiesDocument } from './schemas/strategies.schema';
import { StrategiesDto, StrategyItemDto } from './dto/strategies.dto';
import { TradeFormation, TradeFormationDocument } from './schemas/trade-formation.schema';
import { TradeFormationDto } from './dto/trade-formation.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(AIBrain.name) private aiBrainModel: Model<AIBrainDocument>,
    @InjectModel(MarketBrain.name) private marketBrainModel: Model<MarketBrainDocument>,
    @InjectModel(Performance.name) private performanceModel: Model<PerformanceDocument>,
    @InjectModel(Strategies.name) private strategiesModel: Model<StrategiesDocument>,
    @InjectModel(TradeFormation.name) private tradeFormationModel: Model<TradeFormationDocument>,
  ) {}

  async getDashboardStats() {
    const [
      totalUsers,
      activeUsers,
      inactiveUsers,
      suspendedUsers,
      adminUsers,
      moderatorUsers,
      regularUsers,
      recentUsers,
    ] = await Promise.all([
      this.userModel.countDocuments(),
      this.userModel.countDocuments({ status: UserStatus.ACTIVE }),
      this.userModel.countDocuments({ status: UserStatus.INACTIVE }),
      this.userModel.countDocuments({ status: UserStatus.SUSPENDED }),
      this.userModel.countDocuments({ role: UserRole.ADMIN }),
      this.userModel.countDocuments({ role: UserRole.MODERATOR }),
      this.userModel.countDocuments({ role: UserRole.USER }),
      this.userModel
        .find()
        .select('-password')
        .sort({ createdAt: -1 })
        .limit(5)
        .exec(),
    ]);

    // Get users by month for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const usersByMonth = await this.userModel.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    return {
      overview: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        suspendedUsers,
      },
      roles: {
        admin: adminUsers,
        moderator: moderatorUsers,
        user: regularUsers,
      },
      recentUsers,
      usersByMonth: usersByMonth.map((item) => ({
        month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
        count: item.count,
      })),
    };
  }

  async getAIBrain() {
    let aiBrain = await this.aiBrainModel.findOne({ key: 'default' }).exec();

    if (!aiBrain) {
      throw new BadRequestException('AI Brain not found');
    }

    // Return the stored configuration
    return {
      neuralConfig: aiBrain.neuralConfig,
      dataStreams: aiBrain.dataStreams,
      marketSentiment: aiBrain.marketSentiment,
      strategies: aiBrain.strategies,
      newsTags: aiBrain.newsTags,
      dataPointsPerSecond: aiBrain.dataPointsPerSecond,
    };
  }

  async updateAIBrain(aiBrainDto: AIBrainDto) {
    const aiBrain = await this.aiBrainModel
      .findOneAndUpdate(
        { key: 'default' },
        {
          key: 'default',
          neuralConfig: aiBrainDto.neuralConfig,
          dataStreams: aiBrainDto.dataStreams,
          marketSentiment: aiBrainDto.marketSentiment,
          strategies: aiBrainDto.strategies,
          newsTags: aiBrainDto.newsTags,
          dataPointsPerSecond: aiBrainDto.dataPointsPerSecond,
        },
        { upsert: true, new: true },
      )
      .exec();

    return {
      neuralConfig: aiBrain.neuralConfig,
      dataStreams: aiBrain.dataStreams,
      marketSentiment: aiBrain.marketSentiment,
      strategies: aiBrain.strategies,
      newsTags: aiBrain.newsTags,
      dataPointsPerSecond: aiBrain.dataPointsPerSecond,
    };
  }

  async getMarketBrain() {
    let marketBrain = await this.marketBrainModel.findOne({ key: 'default' }).exec();

    if (!marketBrain) {
      throw new BadRequestException('Market Brain not found');
    }

    // Return the stored configuration
    return {
      moodData: marketBrain.moodData,
      pressureItems: marketBrain.pressureItems,
      stockSectors: marketBrain.stockSectors || [],
      cryptoSectors: marketBrain.cryptoSectors || [],
      capRotation: marketBrain.capRotation || [],
      instruments: marketBrain.instruments,
    };
  }

  async updateMarketBrain(marketBrainDto: MarketBrainDto) {
    const marketBrain = await this.marketBrainModel
      .findOneAndUpdate(
        { key: 'default' },
        {
          key: 'default',
          moodData: marketBrainDto.moodData,
          pressureItems: marketBrainDto.pressureItems,
          stockSectors: marketBrainDto.stockSectors,
          cryptoSectors: marketBrainDto.cryptoSectors,
          capRotation: marketBrainDto.capRotation,
          instruments: marketBrainDto.instruments,
        },
        { upsert: true, new: true },
      )
      .exec();

    return {
      moodData: marketBrain.moodData,
      pressureItems: marketBrain.pressureItems,
      stockSectors: marketBrain.stockSectors,
      cryptoSectors: marketBrain.cryptoSectors,
      capRotation: marketBrain.capRotation,
      instruments: marketBrain.instruments,
    };
  }

  async getPerformance() {
    let performance = await this.performanceModel.findOne({ key: 'default' }).exec();

    if (!performance) {
      throw new BadRequestException('Performance data not found');
    }

    return {
      riskMetrics: performance.riskMetrics,
      yearlyPerformance: performance.yearlyPerformance,
      equityCurve: performance.equityCurve,
      strategyContributions: performance.strategyContributions,
      drawdownData: performance.drawdownData,
    };
  }

  async updatePerformance(performanceDto: PerformanceDto) {
    const performance = await this.performanceModel
      .findOneAndUpdate(
        { key: 'default' },
        {
          key: 'default',
          riskMetrics: performanceDto.riskMetrics,
          yearlyPerformance: performanceDto.yearlyPerformance,
          equityCurve: performanceDto.equityCurve,
          strategyContributions: performanceDto.strategyContributions,
          drawdownData: performanceDto.drawdownData,
        },
        { upsert: true, new: true },
      )
      .exec();

    return {
      riskMetrics: performance.riskMetrics,
      yearlyPerformance: performance.yearlyPerformance,
      equityCurve: performance.equityCurve,
      strategyContributions: performance.strategyContributions,
      drawdownData: performance.drawdownData,
    };
  }

  async getStrategies() {
    let strategies = await this.strategiesModel.findOne({ key: 'default' }).exec();

    if (!strategies) {
      // Return empty array if no strategies found
      return [];
    }

    return strategies.strategies;
  }

  async updateStrategies(strategiesData: StrategyItemDto[]) {
    const strategies = await this.strategiesModel
      .findOneAndUpdate(
        { key: 'default' },
        {
          key: 'default',
          strategies: strategiesData,
        },
        { upsert: true, new: true },
      )
      .exec();

    return strategies.strategies;
  }

  async getTradeFormation() {
    let tradeFormation = await this.tradeFormationModel.findOne({ key: 'default' }).exec();

    if (!tradeFormation) {
      throw new BadRequestException('Trade Formation data not found');
    }

    return {
      opportunityDetection: tradeFormation.opportunityDetection,
      patternRecognition: tradeFormation.patternRecognition,
      riskShaping: tradeFormation.riskShaping,
      executionBlueprint: tradeFormation.executionBlueprint,
      liveManagement: tradeFormation.liveManagement,
      finalExitReport: tradeFormation.finalExitReport,
    };
  }

  async updateTradeFormation(tradeFormationDto: TradeFormationDto) {
    const tradeFormation = await this.tradeFormationModel
      .findOneAndUpdate(
        { key: 'default' },
        {
          key: 'default',
          opportunityDetection: tradeFormationDto.opportunityDetection,
          patternRecognition: tradeFormationDto.patternRecognition,
          riskShaping: tradeFormationDto.riskShaping,
          executionBlueprint: tradeFormationDto.executionBlueprint,
          liveManagement: tradeFormationDto.liveManagement,
          finalExitReport: tradeFormationDto.finalExitReport,
        },
        { upsert: true, new: true },
      )
      .exec();

    return {
      opportunityDetection: tradeFormation.opportunityDetection,
      patternRecognition: tradeFormation.patternRecognition,
      riskShaping: tradeFormation.riskShaping,
      executionBlueprint: tradeFormation.executionBlueprint,
      liveManagement: tradeFormation.liveManagement,
      finalExitReport: tradeFormation.finalExitReport,
    };
  }
}

