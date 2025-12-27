import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { AdminService } from './admin/admin.service';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly adminService: AdminService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  getHello(): { message: string; status: string } {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: 'Detailed health check' })
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  @Get('strategies')
  @ApiOperation({ summary: 'Get Strategies (Public)' })
  @ApiResponse({ status: 200, description: 'Strategies retrieved successfully' })
  getStrategies() {
    return this.adminService.getStrategies();
  }
}

