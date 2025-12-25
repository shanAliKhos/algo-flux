import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { MarketBrainDto } from './market-brain.dto';

describe('MarketBrainDto', () => {
  describe('validation', () => {
    it('should pass validation with valid data', async () => {
      const validData = {
        moodData: {
          forex: 58,
          crypto: 75,
          commodities: 52,
          equities: 65,
          riskOnOff: 35,
          dollarStrength: 62,
          volatility: 'normal',
        },
        pressureItems: [
          { label: 'Fed Rate', value: 5.25, trend: 'up' },
          { label: 'DXY', value: 104.2, trend: 'down' },
        ],
        sectorRotations: [
          { sector: 'Tech', momentum: 85, change24h: 2.3 },
          { sector: 'Finance', momentum: 62, change24h: -0.8 },
        ],
        instruments: [
          {
            symbol: 'XAUUSD',
            price: '2,645.32',
            directionProbability: { up: 62, down: 38 },
            trendStrength: 78,
            activeStrategy: 'Drav',
            threats: ['High volatility', 'News pending'],
          },
        ],
      };

      const dto = plainToInstance(MarketBrainDto, validData);
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
    });

    it('should fail validation when moodData is missing', async () => {
      const invalidData = {
        pressureItems: [],
        sectorRotations: [],
        instruments: [],
      };

      const dto = plainToInstance(MarketBrainDto, invalidData);
      const errors = await validate(dto, {
        skipMissingProperties: false,
        whitelist: true,
        forbidNonWhitelisted: false,
      });

      expect(errors.length).toBeGreaterThan(0);
      const moodDataError = errors.find((e) => e.property === 'moodData');
      expect(moodDataError).toBeDefined();
    });

    it('should fail validation when forex mood is out of range', async () => {
      const invalidData = {
        moodData: {
          forex: 150, // exceeds max of 100
          crypto: 75,
          commodities: 52,
          equities: 65,
          riskOnOff: 35,
          dollarStrength: 62,
          volatility: 'normal',
        },
        pressureItems: [],
        sectorRotations: [],
        instruments: [],
      };

      const dto = plainToInstance(MarketBrainDto, invalidData);
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail validation when riskOnOff is out of range', async () => {
      const invalidData = {
        moodData: {
          forex: 58,
          crypto: 75,
          commodities: 52,
          equities: 65,
          riskOnOff: 150, // exceeds max of 100
          dollarStrength: 62,
          volatility: 'normal',
        },
        pressureItems: [],
        sectorRotations: [],
        instruments: [],
      };

      const dto = plainToInstance(MarketBrainDto, invalidData);
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail validation when volatility is invalid', async () => {
      const invalidData = {
        moodData: {
          forex: 58,
          crypto: 75,
          commodities: 52,
          equities: 65,
          riskOnOff: 35,
          dollarStrength: 62,
          volatility: 'invalid', // invalid enum value
        },
        pressureItems: [],
        sectorRotations: [],
        instruments: [],
      };

      const dto = plainToInstance(MarketBrainDto, invalidData);
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail validation when pressure item trend is invalid', async () => {
      const invalidData = {
        moodData: {
          forex: 58,
          crypto: 75,
          commodities: 52,
          equities: 65,
          riskOnOff: 35,
          dollarStrength: 62,
          volatility: 'normal',
        },
        pressureItems: [
          { label: 'Fed Rate', value: 5.25, trend: 'invalid' }, // invalid trend
        ],
        sectorRotations: [],
        instruments: [],
      };

      const dto = plainToInstance(MarketBrainDto, invalidData);
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail validation when sector momentum is out of range', async () => {
      const invalidData = {
        moodData: {
          forex: 58,
          crypto: 75,
          commodities: 52,
          equities: 65,
          riskOnOff: 35,
          dollarStrength: 62,
          volatility: 'normal',
        },
        pressureItems: [],
        sectorRotations: [
          { sector: 'Tech', momentum: 150, change24h: 2.3 }, // exceeds max of 100
        ],
        instruments: [],
      };

      const dto = plainToInstance(MarketBrainDto, invalidData);
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail validation when instrument direction probability is out of range', async () => {
      const invalidData = {
        moodData: {
          forex: 58,
          crypto: 75,
          commodities: 52,
          equities: 65,
          riskOnOff: 35,
          dollarStrength: 62,
          volatility: 'normal',
        },
        pressureItems: [],
        sectorRotations: [],
        instruments: [
          {
            symbol: 'XAUUSD',
            price: '2,645.32',
            directionProbability: { up: 150, down: 38 }, // up exceeds max of 100
            trendStrength: 78,
            activeStrategy: 'Drav',
            threats: [],
          },
        ],
      };

      const dto = plainToInstance(MarketBrainDto, invalidData);
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail validation when instrument trendStrength is out of range', async () => {
      const invalidData = {
        moodData: {
          forex: 58,
          crypto: 75,
          commodities: 52,
          equities: 65,
          riskOnOff: 35,
          dollarStrength: 62,
          volatility: 'normal',
        },
        pressureItems: [],
        sectorRotations: [],
        instruments: [
          {
            symbol: 'XAUUSD',
            price: '2,645.32',
            directionProbability: { up: 62, down: 38 },
            trendStrength: 150, // exceeds max of 100
            activeStrategy: 'Drav',
            threats: [],
          },
        ],
      };

      const dto = plainToInstance(MarketBrainDto, invalidData);
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail validation when required fields are missing', async () => {
      const invalidData = {
        moodData: {
          forex: 58,
          crypto: 75,
          commodities: 52,
          equities: 65,
          riskOnOff: 35,
          dollarStrength: 62,
          volatility: 'normal',
        },
        // missing pressureItems, sectorRotations, instruments
      };

      const dto = plainToInstance(MarketBrainDto, invalidData);
      const errors = await validate(dto, { skipMissingProperties: false });

      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail validation when pressure item label is empty', async () => {
      const invalidData = {
        moodData: {
          forex: 58,
          crypto: 75,
          commodities: 52,
          equities: 65,
          riskOnOff: 35,
          dollarStrength: 62,
          volatility: 'normal',
        },
        pressureItems: [
          { label: '', value: 5.25, trend: 'up' }, // empty label
        ],
        sectorRotations: [],
        instruments: [],
      };

      const dto = plainToInstance(MarketBrainDto, invalidData);
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail validation when instrument symbol is empty', async () => {
      const invalidData = {
        moodData: {
          forex: 58,
          crypto: 75,
          commodities: 52,
          equities: 65,
          riskOnOff: 35,
          dollarStrength: 62,
          volatility: 'normal',
        },
        pressureItems: [],
        sectorRotations: [],
        instruments: [
          {
            symbol: '', // empty symbol
            price: '2,645.32',
            directionProbability: { up: 62, down: 38 },
            trendStrength: 78,
            activeStrategy: 'Drav',
            threats: [],
          },
        ],
      };

      const dto = plainToInstance(MarketBrainDto, invalidData);
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
    });

    it('should pass validation with all volatility enum values', async () => {
      const volatilityValues: ('calm' | 'normal' | 'storm')[] = ['calm', 'normal', 'storm'];

      for (const volatility of volatilityValues) {
        const validData = {
          moodData: {
            forex: 58,
            crypto: 75,
            commodities: 52,
            equities: 65,
            riskOnOff: 35,
            dollarStrength: 62,
            volatility,
          },
          pressureItems: [],
          sectorRotations: [],
          instruments: [],
        };

        const dto = plainToInstance(MarketBrainDto, validData);
        const errors = await validate(dto);

        expect(errors.length).toBe(0);
      }
    });

    it('should pass validation with all trend enum values', async () => {
      const trendValues: ('up' | 'down' | 'neutral')[] = ['up', 'down', 'neutral'];

      for (const trend of trendValues) {
        const validData = {
          moodData: {
            forex: 58,
            crypto: 75,
            commodities: 52,
            equities: 65,
            riskOnOff: 35,
            dollarStrength: 62,
            volatility: 'normal',
          },
          pressureItems: [{ label: 'Test', value: 5.25, trend }],
          sectorRotations: [],
          instruments: [],
        };

        const dto = plainToInstance(MarketBrainDto, validData);
        const errors = await validate(dto);

        expect(errors.length).toBe(0);
      }
    });
  });
});

