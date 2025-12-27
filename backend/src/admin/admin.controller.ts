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
import { AccountRoomsDto } from './dto/account-rooms.dto';
import { RadarDto } from './dto/radar.dto';
import { AuditDto } from './dto/audit.dto';
import { ConditionsDto } from './dto/conditions.dto';
import { ExecutionDto } from './dto/execution.dto';
import { PortfolioDto } from './dto/portfolio.dto';
import { TransparencyDto } from './dto/transparency.dto';

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

  @Get('strategies')
  @ApiOperation({ summary: 'Get Strategies configuration (Admin only)' })
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

  @Public()
  @Get('account-rooms')
  @ApiOperation({ summary: 'Get Account Rooms data (Public)' })
  @ApiResponse({ status: 200, description: 'Account Rooms data retrieved successfully' })
  getAccountRooms() {
    return this.adminService.getAccountRooms();
  }

  @Post('account-rooms')
  @ApiOperation({ summary: 'Update Account Rooms data' })
  @ApiResponse({ status: 200, description: 'Account Rooms data updated successfully' })
  updateAccountRooms(@Body(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true })) accountRoomsDto: AccountRoomsDto) {
    return this.adminService.updateAccountRooms(accountRoomsDto);
  }

  @Public()
  @Get('conditions')
  @ApiOperation({ summary: 'Get Conditions data (Public)' })
  @ApiResponse({ status: 200, description: 'Conditions data retrieved successfully' })
  getConditions() {
    return this.adminService.getConditions();
  }

  @Post('conditions')
  @ApiOperation({ summary: 'Update Conditions data' })
  @ApiResponse({ status: 200, description: 'Conditions data updated successfully' })
  updateConditions(@Body(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true })) conditionsDto: ConditionsDto) {
    return this.adminService.updateConditions(conditionsDto);
  }

  @Public()
  @Get('execution')
  @ApiOperation({ summary: 'Get Execution data (Public)' })
  @ApiResponse({ status: 200, description: 'Execution data retrieved successfully' })
  getExecution() {
    return this.adminService.getExecution();
  }

  @Post('execution')
  @ApiOperation({ summary: 'Update Execution data' })
  @ApiResponse({ status: 200, description: 'Execution data updated successfully' })
  updateExecution(@Body(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true })) executionDto: ExecutionDto) {
    return this.adminService.updateExecution(executionDto);
  }

  @Public()
  @Get('audit-room')
  @ApiOperation({ summary: 'Get Audit data (Public)' })
  @ApiResponse({ status: 200, description: 'Audit data retrieved successfully' })
  getAudit() {
    return this.adminService.getAudit();
  }

  @Post('audit-room')
  @ApiOperation({ summary: 'Update Audit data' })
  @ApiResponse({ status: 200, description: 'Audit data updated successfully' })
  updateAudit(@Body(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true })) auditDto: AuditDto) {
    return this.adminService.updateAudit(auditDto);
  }

  @Public()
  @Get('market-radar')
  @ApiOperation({ summary: 'Get Radar data (Public)' })
  @ApiResponse({ status: 200, description: 'Radar data retrieved successfully' })
  getRadar() {
    return this.adminService.getRadar();
  }

  @Post('market-radar')
  @ApiOperation({ summary: 'Update Radar data' })
  @ApiResponse({ status: 200, description: 'Radar data updated successfully' })
  updateRadar(@Body(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true })) radarDto: RadarDto) {
    return this.adminService.updateRadar(radarDto);
  }

  @Public()
  @Get('portfolio')
  @ApiOperation({ summary: 'Get Portfolio data (Public)' })
  @ApiResponse({ status: 200, description: 'Portfolio data retrieved successfully' })
  getPortfolio() {
    return this.adminService.getPortfolio();
  }

  @Post('portfolio')
  @ApiOperation({ summary: 'Update Portfolio data' })
  @ApiResponse({ status: 200, description: 'Portfolio data updated successfully' })
  updatePortfolio(@Body(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true })) portfolioDto: PortfolioDto) {
    return this.adminService.updatePortfolio(portfolioDto);
  }

  @Public()
  @Get('transparency')
  @ApiOperation({ summary: 'Get Transparency data (Public)' })
  @ApiResponse({ status: 200, description: 'Transparency data retrieved successfully' })
  getTransparency() {
    return this.adminService.getTransparency();
  }

  @Post('transparency')
  @ApiOperation({ summary: 'Update Transparency data' })
  @ApiResponse({ status: 200, description: 'Transparency data updated successfully' })
  updateTransparency(@Body(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true })) transparencyDto: TransparencyDto) {
    return this.adminService.updateTransparency(transparencyDto);
  }
}

