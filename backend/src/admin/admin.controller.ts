import { Controller, Get, Post, Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { AIBrainDto } from './dto/ai-brain.dto';
import { MarketBrainDto } from './dto/market-brain.dto';
import { PerformanceDto } from './dto/performance.dto';
import { StrategyItemDto } from './dto/strategies.dto';
import { TradeFormationDto } from './dto/trade-formation.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.MODERATOR)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Dashboard stats retrieved successfully' })
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Public()
  @Get('ai-brain')
  @ApiOperation({ summary: 'Get AI Brain configuration (Public)' })
  @ApiResponse({ status: 200, description: 'AI Brain configuration retrieved successfully' })
  getAIBrain() {
    // Public endpoint - no authentication required
    return this.adminService.getAIBrain();
  }

  @Post('ai-brain')
  @ApiOperation({ summary: 'Update AI Brain configuration' })
  @ApiResponse({ status: 200, description: 'AI Brain configuration updated successfully' })
  updateAIBrain(@Body() aiBrainDto: AIBrainDto) {
    return this.adminService.updateAIBrain(aiBrainDto);
  }

  @Public()
  @Get('market-brain')
  @ApiOperation({ summary: 'Get Market Brain configuration (Public)' })
  @ApiResponse({ status: 200, description: 'Market Brain configuration retrieved successfully' })
  getMarketBrain() {
    // Public endpoint - no authentication required
    return this.adminService.getMarketBrain();
  }

  @Post('market-brain')
  @ApiOperation({ summary: 'Update Market Brain configuration' })
  @ApiResponse({ status: 200, description: 'Market Brain configuration updated successfully' })
  updateMarketBrain(@Body() marketBrainDto: MarketBrainDto) {
    return this.adminService.updateMarketBrain(marketBrainDto);
  }

  @Public()
  @Get('performance')
  @ApiOperation({ summary: 'Get Performance data (Public)' })
  @ApiResponse({ status: 200, description: 'Performance data retrieved successfully' })
  getPerformance() {
    return this.adminService.getPerformance();
  }

  @Post('performance')
  @ApiOperation({ summary: 'Update Performance data' })
  @ApiResponse({ status: 200, description: 'Performance data updated successfully' })
  updatePerformance(@Body() performanceDto: PerformanceDto) {
    return this.adminService.updatePerformance(performanceDto);
  }

  @Public()
  @Get('strategies')
  @ApiOperation({ summary: 'Get Strategies configuration (Public)' })
  @ApiResponse({ status: 200, description: 'Strategies retrieved successfully' })
  getStrategies() {
    return this.adminService.getStrategies();
  }

  @Post('strategies')
  @ApiOperation({ summary: 'Update Strategies configuration' })
  @ApiResponse({ status: 200, description: 'Strategies updated successfully' })
  updateStrategies(@Body(new ValidationPipe({ transform: true, whitelist: true })) strategiesData: StrategyItemDto[]) {
    return this.adminService.updateStrategies(strategiesData);
  }

  @Public()
  @Get('trade-formation')
  @ApiOperation({ summary: 'Get Trade Formation data (Public)' })
  @ApiResponse({ status: 200, description: 'Trade Formation data retrieved successfully' })
  getTradeFormation() {
    return this.adminService.getTradeFormation();
  }

  @Post('trade-formation')
  @ApiOperation({ summary: 'Update Trade Formation data' })
  @ApiResponse({ status: 200, description: 'Trade Formation data updated successfully' })
  updateTradeFormation(@Body() tradeFormationDto: TradeFormationDto) {
    return this.adminService.updateTradeFormation(tradeFormationDto);
  }
}

