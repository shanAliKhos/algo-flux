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
import { AccountRooms, AccountRoomsDocument } from './schemas/account-rooms.schema';
import { AccountRoomsDto } from './dto/account-rooms.dto';
import { Audit, AuditDocument } from './schemas/audit.schema';
import { AuditDto } from './dto/audit.dto';
import { Conditions, ConditionsDocument } from './schemas/conditions.schema';
import { ConditionsDto } from './dto/conditions.dto';
import { Execution, ExecutionDocument } from './schemas/execution.schema';
import { ExecutionDto } from './dto/execution.dto';
import { Radar, RadarDocument } from './schemas/radar.schema';
import { RadarDto } from './dto/radar.dto';
import { TradeRecord, TradeRecordDocument } from './schemas/trade-record.schema';
import { Portfolio, PortfolioDocument } from './schemas/portfolio.schema';
import { PortfolioDto } from './dto/portfolio.dto';
import { Transparency, TransparencyDocument } from './schemas/transparency.schema';
import { TransparencyDto } from './dto/transparency.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(AIBrain.name) private aiBrainModel: Model<AIBrainDocument>,
    @InjectModel(MarketBrain.name) private marketBrainModel: Model<MarketBrainDocument>,
    @InjectModel(Performance.name) private performanceModel: Model<PerformanceDocument>,
    @InjectModel(Strategies.name) private strategiesModel: Model<StrategiesDocument>,
    @InjectModel(TradeFormation.name) private tradeFormationModel: Model<TradeFormationDocument>,
    @InjectModel(AccountRooms.name) private accountRoomsModel: Model<AccountRoomsDocument>,
    @InjectModel(Conditions.name) private conditionsModel: Model<ConditionsDocument>,
    @InjectModel(Execution.name) private executionModel: Model<ExecutionDocument>,
    @InjectModel(Audit.name) private auditModel: Model<AuditDocument>,
    @InjectModel(Radar.name) private radarModel: Model<RadarDocument>,
    @InjectModel(TradeRecord.name) private tradeRecordModel: Model<TradeRecordDocument>,
    @InjectModel(Portfolio.name) private portfolioModel: Model<PortfolioDocument>,
    @InjectModel(Transparency.name) private transparencyModel: Model<TransparencyDocument>,
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

  async getAccountRooms() {
    let accountRooms = await this.accountRoomsModel.findOne({ key: 'default' }).exec();

    if (!accountRooms) {
      throw new BadRequestException('Account Rooms data not found');
    }

    return {
      retailSmall: accountRooms.retailSmall,
      proRetail: accountRooms.proRetail,
      investor: accountRooms.investor,
      vipUltra: accountRooms.vipUltra,
    };
  }

  async updateAccountRooms(accountRoomsDto: AccountRoomsDto) {
    const accountRooms = await this.accountRoomsModel
      .findOneAndUpdate(
        { key: 'default' },
        {
          key: 'default',
          retailSmall: accountRoomsDto.retailSmall,
          proRetail: accountRoomsDto.proRetail,
          investor: accountRoomsDto.investor,
          vipUltra: accountRoomsDto.vipUltra,
        },
        { upsert: true, new: true },
      )
      .exec();

    return {
      retailSmall: accountRooms.retailSmall,
      proRetail: accountRooms.proRetail,
      investor: accountRooms.investor,
      vipUltra: accountRooms.vipUltra,
    };
  }

  async getConditions() {
    let conditions = await this.conditionsModel.findOne({ key: 'default' }).exec();

    if (!conditions) {
      throw new BadRequestException('Conditions data not found');
    }

    return {
      marketPersonality: conditions.marketPersonality,
      behaviorMap: conditions.behaviorMap,
      strategyAlignment: conditions.strategyAlignment,
    };
  }

  async updateConditions(conditionsDto: ConditionsDto) {
    const conditions = await this.conditionsModel
      .findOneAndUpdate(
        { key: 'default' },
        {
          key: 'default',
          marketPersonality: conditionsDto.marketPersonality,
          behaviorMap: conditionsDto.behaviorMap,
          strategyAlignment: conditionsDto.strategyAlignment,
        },
        { upsert: true, new: true },
      )
      .exec();

    return {
      marketPersonality: conditions.marketPersonality,
      behaviorMap: conditions.behaviorMap,
      strategyAlignment: conditions.strategyAlignment,
    };
  }

  async getExecution() {
    let execution = await this.executionModel.findOne({ key: 'default' }).exec();

    if (!execution) {
      throw new BadRequestException('Execution data not found');
    }

    return {
      orderbook: execution.orderbook,
      tradeTicket: execution.tradeTicket,
      executionMetrics: execution.executionMetrics,
      equityCurve: execution.equityCurve,
      exposure: execution.exposure,
    };
  }

  async updateExecution(executionDto: ExecutionDto) {
    const execution = await this.executionModel
      .findOneAndUpdate(
        { key: 'default' },
        {
          key: 'default',
          orderbook: executionDto.orderbook,
          tradeTicket: executionDto.tradeTicket,
          executionMetrics: executionDto.executionMetrics,
          equityCurve: executionDto.equityCurve,
          exposure: executionDto.exposure,
        },
        { upsert: true, new: true },
      )
      .exec();

    return {
      orderbook: execution.orderbook,
      tradeTicket: execution.tradeTicket,
      executionMetrics: execution.executionMetrics,
      equityCurve: execution.equityCurve,
      exposure: execution.exposure,
    };
  }

  async getAudit() {
    // Calculate daily accuracy dynamically from trade records (always)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const tradesLast7Days = await this.tradeRecordModel
      .find({
        time: { $gte: sevenDaysAgo },
        win: { $exists: true },
      })
      .exec();

    const dailyStats = new Map<string, { wins: number; total: number }>();
    const dayOrder = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    tradesLast7Days.forEach((trade) => {
      const tradeDate = trade.time instanceof Date ? trade.time : new Date(trade.time);
      const dayName = dayOrder[tradeDate.getDay()];
      if (!dailyStats.has(dayName)) {
        dailyStats.set(dayName, { wins: 0, total: 0 });
      }
      const stats = dailyStats.get(dayName)!;
      stats.total++;
      if (trade.win) stats.wins++;
    });

    // Create daily accuracy array with all days that have trade data
    const dailyAccuracy = Array.from(dailyStats.entries())
      .map(([day, stats]) => ({
        day,
        accuracy: stats.total > 0 ? Math.round((stats.wins / stats.total) * 100) : 0,
      }))
      .sort((a, b) => {
        return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
      });

    // First, check if there's manually saved audit data
    const savedAudit = await this.auditModel.findOne({ key: 'default' }).exec();

    // If manual data exists and has content, use it (allowing manual overrides)
    // But always use dynamically calculated dailyAccuracy
    if (savedAudit && (
      (savedAudit.recentExecutions && savedAudit.recentExecutions.length > 0) ||
      (savedAudit.performanceByStrategy && savedAudit.performanceByStrategy.length > 0)
    )) {
      return {
        recentExecutions: savedAudit.recentExecutions || [],
        performanceByStrategy: savedAudit.performanceByStrategy || [],
        riskMetrics: savedAudit.riskMetrics || [],
        anomalies: savedAudit.anomalies || [],
        dailyAccuracy: dailyAccuracy.length > 0 ? dailyAccuracy : (savedAudit.dailyAccuracy || []),
        complianceLogs: savedAudit.complianceLogs || {
          riskCompliance: "100%",
          policyViolations: 0,
          systemUptime: "99.9%",
          avgLatency: "12ms",
        },
      };
    }

    // Otherwise, calculate dynamically from trade records
    // Get recent executions from trade records (last 10)
    const recentTrades = await this.tradeRecordModel
      .find()
      .sort({ time: -1 })
      .limit(10)
      .exec();

    const recentExecutions = recentTrades.map((trade) => {
      const timeStr = trade.time instanceof Date 
        ? trade.time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
        : new Date(trade.time).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      // Format price based on magnitude
      let priceStr: string;
      if (trade.price >= 1000) {
        priceStr = trade.price.toLocaleString('en-US', { maximumFractionDigits: 2 });
      } else {
        priceStr = trade.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }

      return {
        time: timeStr,
        strategy: trade.strategy,
        symbol: trade.symbol,
        direction: trade.direction,
        size: trade.size,
        price: priceStr,
        status: trade.status,
      };
    });

    // Calculate performance by strategy from all completed trades
    const allTrades = await this.tradeRecordModel
      .find({ status: 'Filled', win: { $exists: true } })
      .exec();

    const strategyMap = new Map<string, { wins: number; total: number; pnl: number; rMultiples: number[] }>();

    allTrades.forEach((trade) => {
      if (!strategyMap.has(trade.strategy)) {
        strategyMap.set(trade.strategy, { wins: 0, total: 0, pnl: 0, rMultiples: [] });
      }
      const stats = strategyMap.get(trade.strategy)!;
      stats.total++;
      if (trade.win) stats.wins++;
      if (trade.pnl) stats.pnl += trade.pnl;
      if (trade.rMultiple) stats.rMultiples.push(trade.rMultiple);
    });

    const performanceByStrategy = Array.from(strategyMap.entries()).map(([name, stats]) => {
      const winRate = stats.total > 0 ? (stats.wins / stats.total) * 100 : 0;
      const avgR = stats.rMultiples.length > 0
        ? stats.rMultiples.reduce((sum, r) => sum + r, 0) / stats.rMultiples.length
        : 0;
      const pnlFormatted = stats.pnl >= 0 ? `+$${stats.pnl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `-$${Math.abs(stats.pnl).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

      return {
        name,
        winRate: Math.round(winRate * 10) / 10,
        avgR: Math.round(avgR * 10) / 10,
        trades: stats.total,
        pnl: pnlFormatted,
      };
    });

    // Calculate risk metrics from recent trades and performance data
    const recentTradesForRisk = await this.tradeRecordModel
      .find()
      .sort({ time: -1 })
      .limit(100)
      .exec();

    const totalExposure = recentTradesForRisk
      .filter((t) => t.status === 'Filled')
      .reduce((sum, t) => {
        const sizeNum = parseFloat(t.size) || 0;
        return sum + sizeNum * t.price;
      }, 0);

    const maxLeverage = 50; // Default max leverage
    const currentLeverage = totalExposure > 0 ? Math.round((totalExposure / 10000) * 10) / 10 : 0; // Assuming base capital of 10000

    const riskMetrics = [
      {
        label: 'Max Leverage Allowed',
        value: `1:${maxLeverage}`,
        status: currentLeverage <= maxLeverage ? 'ok' : 'warning',
      },
      {
        label: 'Current Leverage',
        value: `1:${currentLeverage}`,
        status: currentLeverage <= maxLeverage ? 'ok' : 'warning',
      },
    ];

    // Detect anomalies (simplified - can be enhanced)
    const anomalies: Array<{ time: string; type: string; asset: string; severity: string }> = [];
    
    // Check for unusual volatility in recent trades
    const tradesBySymbol = new Map<string, number[]>();
    recentTradesForRisk.forEach((trade) => {
      if (!tradesBySymbol.has(trade.symbol)) {
        tradesBySymbol.set(trade.symbol, []);
      }
      tradesBySymbol.get(trade.symbol)!.push(trade.price);
    });

    tradesBySymbol.forEach((prices, symbol) => {
      if (prices.length >= 3) {
        const avg = prices.reduce((sum, p) => sum + p, 0) / prices.length;
        const variance = prices.reduce((sum, p) => sum + Math.pow(p - avg, 2), 0) / prices.length;
        const stdDev = Math.sqrt(variance);
        const coefficient = (stdDev / avg) * 100;

        if (coefficient > 5) {
          anomalies.push({
            time: new Date().toLocaleTimeString('en-US', { hour12: false }),
            type: 'Volatility Spike',
            asset: symbol,
            severity: coefficient > 10 ? 'high' : 'medium',
          });
        }
      }
    });

    // dailyAccuracy is already calculated above

    // Calculate compliance logs
    const totalTrades = await this.tradeRecordModel.countDocuments({ status: 'Filled' }).exec();
    const rejectedTrades = await this.tradeRecordModel.countDocuments({ status: 'Rejected' }).exec();
    const policyViolations = rejectedTrades;
    const riskCompliance = totalTrades > 0 ? `${Math.round(((totalTrades - policyViolations) / totalTrades) * 100)}%` : '100%';

    // Get system metrics (simplified - can be enhanced with actual system monitoring)
    const complianceLogs = {
      riskCompliance,
      policyViolations,
      systemUptime: '99.9%', // This could be calculated from actual uptime logs
      avgLatency: '12ms', // This could be calculated from actual execution metrics
    };

    return {
      recentExecutions: recentExecutions.length > 0 ? recentExecutions : [],
      performanceByStrategy: performanceByStrategy.length > 0 ? performanceByStrategy : [],
      riskMetrics,
      anomalies: anomalies.length > 0 ? anomalies : [],
      dailyAccuracy: dailyAccuracy.length > 0 ? dailyAccuracy : [],
      complianceLogs,
    };
  }

  async updateAudit(auditDto: AuditDto) {
    // Save manual audit data - this will be used by getAudit() if it exists
    const audit = await this.auditModel
      .findOneAndUpdate(
        { key: 'default' },
        {
          key: 'default',
          recentExecutions: auditDto.recentExecutions,
          performanceByStrategy: auditDto.performanceByStrategy,
          riskMetrics: auditDto.riskMetrics,
          anomalies: auditDto.anomalies,
          dailyAccuracy: auditDto.dailyAccuracy,
          complianceLogs: auditDto.complianceLogs,
        },
        { upsert: true, new: true },
      )
      .exec();

    // Return the saved data (which will be used by getAudit on next call)
    return {
      recentExecutions: audit.recentExecutions,
      performanceByStrategy: audit.performanceByStrategy,
      riskMetrics: audit.riskMetrics,
      anomalies: audit.anomalies,
      dailyAccuracy: audit.dailyAccuracy,
      complianceLogs: audit.complianceLogs,
    };
  }

  async getRadar() {
    let radar = await this.radarModel.findOne({ key: 'default' }).exec();

    if (!radar) {
      throw new BadRequestException('Radar data not found');
    }

    return {
      assetClasses: radar.assetClasses,
      opportunities: radar.opportunities,
      regimes: radar.regimes,
    };
  }

  async updateRadar(radarDto: RadarDto) {
    const radar = await this.radarModel
      .findOneAndUpdate(
        { key: 'default' },
        {
          key: 'default',
          assetClasses: radarDto.assetClasses,
          opportunities: radarDto.opportunities,
          regimes: radarDto.regimes,
        },
        { upsert: true, new: true },
      )
      .exec();

    return {
      assetClasses: radar.assetClasses,
      opportunities: radar.opportunities,
      regimes: radar.regimes,
    };
  }

  async getPortfolio() {
    let portfolio = await this.portfolioModel.findOne({ key: 'default' }).exec();

    if (!portfolio) {
      throw new BadRequestException('Portfolio data not found');
    }

    return {
      topStats: portfolio.topStats,
      equityData: portfolio.equityData,
      drawdownData: portfolio.drawdownData,
      maxDrawdownValue: portfolio.maxDrawdownValue,
      exposureTiles: portfolio.exposureTiles,
      regionExposure: portfolio.regionExposure,
      riskBuckets: portfolio.riskBuckets,
    };
  }

  async updatePortfolio(portfolioDto: PortfolioDto) {
    const portfolio = await this.portfolioModel
      .findOneAndUpdate(
        { key: 'default' },
        {
          key: 'default',
          topStats: portfolioDto.topStats,
          equityData: portfolioDto.equityData,
          drawdownData: portfolioDto.drawdownData,
          maxDrawdownValue: portfolioDto.maxDrawdownValue,
          exposureTiles: portfolioDto.exposureTiles,
          regionExposure: portfolioDto.regionExposure,
          riskBuckets: portfolioDto.riskBuckets,
        },
        { upsert: true, new: true },
      )
      .exec();

    return {
      topStats: portfolio.topStats,
      equityData: portfolio.equityData,
      drawdownData: portfolio.drawdownData,
      maxDrawdownValue: portfolio.maxDrawdownValue,
      exposureTiles: portfolio.exposureTiles,
      regionExposure: portfolio.regionExposure,
      riskBuckets: portfolio.riskBuckets,
    };
  }

  async getTransparency() {
    let transparency = await this.transparencyModel.findOne({ key: 'default' }).exec();

    if (!transparency) {
      throw new BadRequestException('Transparency data not found');
    }

    return {
      complianceStats: transparency.complianceStats,
      recentTrades: transparency.recentTrades,
      strategyPerformance: transparency.strategyPerformance,
      topInstruments: transparency.topInstruments,
      riskCompliance: transparency.riskCompliance,
    };
  }

  async updateTransparency(transparencyDto: TransparencyDto) {
    const transparency = await this.transparencyModel
      .findOneAndUpdate(
        { key: 'default' },
        {
          key: 'default',
          complianceStats: transparencyDto.complianceStats,
          recentTrades: transparencyDto.recentTrades,
          strategyPerformance: transparencyDto.strategyPerformance,
          topInstruments: transparencyDto.topInstruments,
          riskCompliance: transparencyDto.riskCompliance,
        },
        { upsert: true, new: true },
      )
      .exec();

    return {
      complianceStats: transparency.complianceStats,
      recentTrades: transparency.recentTrades,
      strategyPerformance: transparency.strategyPerformance,
      topInstruments: transparency.topInstruments,
      riskCompliance: transparency.riskCompliance,
    };
  }
}

