const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.loadToken();
  }

  private loadToken() {
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    skipAuth: boolean = false,
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Only add Authorization header if not skipping auth and token exists
    if (!skipAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      throw new Error(error.message || 'An error occurred');
    }

    return response.json();
  }

  get<T>(endpoint: string, skipAuth: boolean = false): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' }, skipAuth);
  }

  post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<{ access_token: string; user: any }>('/auth/login', {
      email,
      password,
    }),
  register: (data: any) =>
    apiClient.post<{ message: string; user: any }>('/auth/register', data),
  getProfile: () => apiClient.get<any>('/auth/profile'),
};

// Users API
export const usersApi = {
  getAll: (params?: any) => {
    // Filter out undefined values to avoid issues with URLSearchParams
    const cleanParams: any = {};
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          cleanParams[key] = params[key];
        }
      });
    }
    const queryString = new URLSearchParams(cleanParams).toString();
    const url = queryString ? `/users?${queryString}` : '/users';
    return apiClient.get<{
      data: any[];
      meta: { total: number; page: number; limit: number; totalPages: number };
    }>(url);
  },
  getById: (id: string) => apiClient.get<any>(`/users/${id}`),
  create: (data: any) => apiClient.post<any>('/users', data),
  update: (id: string, data: any) => apiClient.patch<any>(`/users/${id}`, data),
  delete: (id: string) => apiClient.delete<void>(`/users/${id}`),
};

// Admin API
export const adminApi = {
  getDashboardStats: () =>
    apiClient.get<{
      overview: any;
      roles: any;
      recentUsers: any[];
      usersByMonth: any[];
    }>('/admin/dashboard'),
  getAIBrain: () =>
    apiClient.get<{
      neuralConfig: {
        nodes: number;
        connections: number;
        latency: number;
      };
      dataStreams: Array<{
        label: string;
        active: boolean;
        delay: number;
      }>;
      marketSentiment: {
        forex: { bullish: number; neutral: number; bearish: number };
        crypto: { bullish: number; neutral: number; bearish: number };
        equities: { bullish: number; neutral: number; bearish: number };
      };
      strategies: Array<{
        name: string;
        icon: string;
        status: 'active' | 'waiting' | 'cooling';
        accuracy: number;
        confidence: 'high' | 'medium' | 'low';
        bias: string;
        instruments: string[];
        path: string;
      }>;
      newsTags: Array<{
        text: string;
        type: 'bullish' | 'bearish' | 'neutral';
      }>;
      dataPointsPerSecond: number;
    }>('/admin/ai-brain', true), // Skip auth for public endpoint
  getMarketBrain: () =>
    apiClient.get<{
      moodData: {
        forex: number;
        crypto: number;
        commodities: number;
        equities: number;
        riskOnOff: number;
        dollarStrength: number;
        volatility: 'calm' | 'normal' | 'storm';
      };
      pressureItems: Array<{
        label: string;
        value: number;
        trend: 'up' | 'down' | 'neutral';
      }>;
      stockSectors: Array<{
        sector: string;
        momentum: number;
        change24h: number;
      }>;
      cryptoSectors: Array<{
        sector: string;
        momentum: number;
        change24h: number;
      }>;
      capRotation: Array<{
        sector: string;
        momentum: number;
        change24h: number;
      }>;
      instruments: Array<{
        symbol: string;
        price: string;
        directionProbability: { up: number; down: number };
        trendStrength: number;
        activeStrategy: string;
        threats: string[];
      }>;
    }>('/admin/market-brain', true), // Skip auth for public endpoint
  updateMarketBrain: (data: {
    moodData: {
      forex: number;
      crypto: number;
      commodities: number;
      equities: number;
      riskOnOff: number;
      dollarStrength: number;
      volatility: 'calm' | 'normal' | 'storm';
    };
    pressureItems: Array<{
      label: string;
      value: number;
      trend: 'up' | 'down' | 'neutral';
    }>;
    stockSectors: Array<{
      sector: string;
      momentum: number;
      change24h: number;
    }>;
    cryptoSectors: Array<{
      sector: string;
      momentum: number;
      change24h: number;
    }>;
    capRotation: Array<{
      sector: string;
      momentum: number;
      change24h: number;
    }>;
    instruments: Array<{
      symbol: string;
      price: string;
      directionProbability: { up: number; down: number };
      trendStrength: number;
      activeStrategy: string;
      threats: string[];
    }>;
  }) => apiClient.post('/admin/market-brain', data),
  getPerformance: () =>
    apiClient.get<{
      riskMetrics: {
        sharpeRatio: number;
        sortinoRatio: number;
        maxDrawdown: number;
        winRate: number;
        profitFactor: number;
        averageWin: number;
        averageLoss: number;
        totalTrades: number;
      };
      yearlyPerformance: Array<{
        year: number;
        return: number;
        trades: number;
        winRate: number;
      }>;
      equityCurve: Array<{
        date: string;
        equity: number;
        drawdown: number;
      }>;
      strategyContributions: Array<{
        strategy: string;
        return: number;
        trades: number;
        winRate: number;
        sharpeRatio: number;
      }>;
      drawdownData: {
        maxDrawdown: number;
        maxDrawdownDate: string;
        currentDrawdown: number;
        recoveryTime: number;
        drawdownHistory: Array<{
          date: string;
          drawdown: number;
          recovery: number;
        }>;
      };
    }>('/admin/performance', true), // Skip auth for public endpoint
  updatePerformance: (data: {
    riskMetrics: {
      sharpeRatio: number;
      sortinoRatio: number;
      maxDrawdown: number;
      winRate: number;
      profitFactor: number;
      averageWin: number;
      averageLoss: number;
      totalTrades: number;
    };
    yearlyPerformance: Array<{
      year: number;
      return: number;
      trades: number;
      winRate: number;
    }>;
    equityCurve: Array<{
      date: string;
      equity: number;
      drawdown: number;
    }>;
    strategyContributions: Array<{
      strategy: string;
      return: number;
      trades: number;
      winRate: number;
      sharpeRatio: number;
    }>;
    drawdownData: {
      maxDrawdown: number;
      maxDrawdownDate: string;
      currentDrawdown: number;
      recoveryTime: number;
      drawdownHistory: Array<{
        date: string;
        drawdown: number;
      }>;
    };
  }) => apiClient.post('/admin/performance', data),
  getTradeFormation: () =>
    apiClient.get<{
      opportunityDetection: {
        instruments: Array<{
          symbol: string;
          reason: string;
        }>;
        selectedInstrument: string;
      };
      patternRecognition: {
        patterns: string[];
        detectedPattern: string;
        chartData: Array<{ x: number; y: number }>;
      };
      riskShaping: Array<{
        label: string;
        value: string;
        bar: number;
      }>;
      executionBlueprint: {
        entry: string;
        stopLoss: string;
        takeProfit: string;
        rrRatio: string;
      };
      liveManagement: Array<{
        label: string;
        status: string;
        active: boolean;
      }>;
      finalExitReport: {
        exitReason: string;
        rating: string;
        profitLoss: string;
        duration: string;
        notes: string;
      };
    }>('/admin/trade-formation', true), // Skip auth for public endpoint
  updateTradeFormation: (data: {
    opportunityDetection: {
      instruments: Array<{
        symbol: string;
        reason: string;
      }>;
      selectedInstrument: string;
    };
    patternRecognition: {
      patterns: string[];
      detectedPattern: string;
      chartData: Array<{ x: number; y: number }>;
    };
    riskShaping: Array<{
      label: string;
      value: string;
      bar: number;
    }>;
    executionBlueprint: {
      entry: string;
      stopLoss: string;
      takeProfit: string;
      rrRatio: string;
    };
    liveManagement: Array<{
      label: string;
      status: string;
      active: boolean;
    }>;
    finalExitReport: {
      exitReason: string;
      rating: string;
      profitLoss: string;
      duration: string;
      notes: string;
    };
  }) => apiClient.post('/admin/trade-formation', data),
  getAccountRooms: () =>
    apiClient.get<{
      retailSmall: {
        title: string;
        subtitle: string;
        safeMode: {
          active: boolean;
          description: string;
        };
        dailyRiskUsed: number;
        maxDrawdown: number;
        currentDrawdown: number;
        leverageMode: string;
        recentSignals: Array<{
          emoji: string;
          text: string;
        }>;
        safetyReasons: string[];
      };
      proRetail: {
        title: string;
        subtitle: string;
        strategyUtilization: Array<{
          name: string;
          percentage: number;
        }>;
        executionQuality: number;
        marketRegime: {
          type: string;
          description: string;
        };
        opportunityHeatmap: Array<{
          symbol: string;
          active: boolean;
        }>;
        strategyConfidence: Array<{
          name: string;
          confidence: string;
        }>;
      };
      investor: {
        title: string;
        subtitle: string;
        equityCurve: {
          ytdReturn: number;
          dataPoints: number[];
        };
        drawdownZones: {
          maxDrawdown: number;
          currentDrawdown: number;
          avgRecovery: number;
        };
        riskAdjustedMetrics: {
          sharpeRatio: number;
          sortinoRatio: number;
          calmarRatio: number;
        };
        alphaSources: Array<{
          name: string;
          percentage: number;
        }>;
      };
      vipUltra: {
        title: string;
        subtitle: string;
        fullTransparency: {
          enabled: boolean;
          features: string[];
        };
        realTimeData: {
          enabled: boolean;
          latency: number;
        };
        advancedMetrics: {
          enabled: boolean;
          metrics: string[];
        };
        customReporting: {
          enabled: boolean;
          formats: string[];
        };
      };
    }>('/admin/account-rooms', true), // Skip auth for public endpoint
  updateAccountRooms: (data: {
    retailSmall: {
      title: string;
      subtitle: string;
      safeMode: {
        active: boolean;
        description: string;
      };
      dailyRiskUsed: number;
      maxDrawdown: number;
      currentDrawdown: number;
      leverageMode: string;
      recentSignals: Array<{
        emoji: string;
        text: string;
      }>;
      safetyReasons: string[];
    };
    proRetail: {
      title: string;
      subtitle: string;
      strategyUtilization: Array<{
        name: string;
        percentage: number;
      }>;
      executionQuality: number;
      marketRegime: {
        type: string;
        description: string;
      };
      opportunityHeatmap: string[];
      strategyConfidence: Array<{
        name: string;
        confidence: string;
      }>;
    };
    investor: {
      title: string;
      subtitle: string;
      equityCurve: {
        ytdReturn: number;
        dataPoints: number[];
      };
      drawdownZones: {
        maxDrawdown: number;
        currentDrawdown: number;
        avgRecovery: number;
      };
      riskAdjustedMetrics: {
        sharpeRatio: number;
        sortinoRatio: number;
        calmarRatio: number;
      };
      alphaSources: Array<{
        name: string;
        percentage: number;
      }>;
    };
    vipUltra: {
      title: string;
      subtitle: string;
      fullTransparency: {
        enabled: boolean;
        features: string[];
      };
      realTimeData: {
        enabled: boolean;
        latency: number;
      };
      advancedMetrics: {
        enabled: boolean;
        metrics: string[];
      };
      customReporting: {
        enabled: boolean;
        formats: string[];
      };
    };
  }) => apiClient.post('/admin/account-rooms', data),
  getRadar: () =>
    apiClient.get<{
      assetClasses: Array<{
        label: string;
        value: number;
        sublabel: string;
      }>;
      opportunities: Array<{
        symbol: string;
        price: string;
        change: number;
        strategy: string;
        signal: 'In Position' | 'Preparing Entry' | 'Watching';
      }>;
      regimes: Array<{
        name: string;
        description: string;
      }>;
    }>('/admin/market-radar', true), // Skip auth for public endpoint
  updateRadar: (data: {
    assetClasses: Array<{
      label: string;
      value: number;
      sublabel: string;
    }>;
    opportunities: Array<{
      symbol: string;
      price: string;
      change: number;
      strategy: string;
      signal: 'In Position' | 'Preparing Entry' | 'Watching';
    }>;
    regimes: Array<{
      name: string;
      description: string;
    }>;
  }) => apiClient.post('/admin/market-radar', data),
  getAudit: () =>
    apiClient.get<{
      recentExecutions: Array<{
        time: string;
        strategy: string;
        symbol: string;
        direction: string;
        size: string;
        price: string;
        status: string;
      }>;
      performanceByStrategy: Array<{
        name: string;
        winRate: number;
        avgR: number;
        trades: number;
        pnl: string;
      }>;
      riskMetrics: Array<{
        label: string;
        value: string;
        status: string;
      }>;
      anomalies: Array<{
        time: string;
        type: string;
        asset: string;
        severity: string;
      }>;
      dailyAccuracy: Array<{
        day: string;
        accuracy: number;
      }>;
      complianceLogs: {
        riskCompliance: string;
        policyViolations: number;
        systemUptime: string;
        avgLatency: string;
      };
    }>('/admin/audit-room', true), // Skip auth for public endpoint
  updateAudit: (data: {
    recentExecutions: Array<{
      time: string;
      strategy: string;
      symbol: string;
      direction: string;
      size: string;
      price: string;
      status: string;
    }>;
    performanceByStrategy: Array<{
      name: string;
      winRate: number;
      avgR: number;
      trades: number;
      pnl: string;
    }>;
    riskMetrics: Array<{
      label: string;
      value: string;
      status: string;
    }>;
    anomalies: Array<{
      time: string;
      type: string;
      asset: string;
      severity: string;
    }>;
    dailyAccuracy: Array<{
      day: string;
      accuracy: number;
    }>;
    complianceLogs: {
      riskCompliance: string;
      policyViolations: number;
      systemUptime: string;
      avgLatency: string;
    };
  }) => apiClient.post('/admin/audit-room', data),
  getConditions: () =>
    apiClient.get<{
      marketPersonality: Array<{
        label: string;
        active: boolean;
        icon: string;
      }>;
      behaviorMap: Array<{
        asset: string;
        behavior: string;
        sentiment: number;
      }>;
      strategyAlignment: Array<{
        asset: string;
        strategies: Array<{
          name: string;
          status: string;
          opportunity: string;
        }>;
      }>;
    }>('/admin/conditions', true), // Skip auth for public endpoint
  updateConditions: (data: {
    marketPersonality: Array<{
      label: string;
      active: boolean;
      icon: string;
    }>;
    behaviorMap: Array<{
      asset: string;
      behavior: string;
      sentiment: number;
    }>;
    strategyAlignment: Array<{
      asset: string;
      strategies: Array<{
        name: string;
        status: string;
        opportunity: string;
      }>;
    }>;
  }) => apiClient.post('/admin/conditions', data),
};
