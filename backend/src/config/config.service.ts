import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import * as Joi from 'joi';

export function getValidationSchema(): Joi.ObjectSchema {
  return Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test')
      .default('development'),
    PORT: Joi.number().default(3000),
    MONGODB_URI: Joi.string().required(),
    JWT_SECRET: Joi.string().required().min(32),
    JWT_EXPIRES_IN: Joi.string().default('7d'),
    CORS_ORIGIN: Joi.string().default('http://localhost:8080'),
    THROTTLE_TTL: Joi.number().default(60),
    THROTTLE_LIMIT: Joi.number().default(10),
  });
}

@Injectable()
export class ConfigService extends NestConfigService {}

