/**
 * Price format used throughout the spell API
 */
export interface TF2Price {
  total_ref: number;
  keys: number;
  metal: number;
  formatted: string;
}

/**
 * Spell information
 */
export interface Spell {
  id: number;
  name: string;
  type: 'effect' | 'footprint' | 'paint' | 'voice';
  attributeId: number;
}

/**
 * Market data for a spell combination
 */
export interface MarketData {
  avg_flat_premium: number;
  sample_size: number;
  confidence: 'high' | 'medium' | 'low';
}

/**
 * Spell prediction with price ranges
 */
export interface SpellPrediction {
  item_name: string;
  spells: string[];
  spell_ids: number[];
  base_price: TF2Price;
  predictions: {
    low: TF2Price;
    mid: TF2Price;
    high: TF2Price;
  };
  premium_ranges: {
    low: { ref: number; formatted: string };
    mid: { ref: number; formatted: string };
    high: { ref: number; formatted: string };
  };
  market_data: MarketData;
  method: string;
  key_rate: number;
  multipliers: {
    low: number;
    mid: number;
    high: number;
  };
}

/**
 * POST prediction response
 */
export interface PostPredictionResponse {
  item_name: string;
  base_price: TF2Price;
  spell_premium: TF2Price;
  total_price: TF2Price;
  spell_data: {
    spell_ids: number[];
    spell_names: string[];
    avg_flat_premium: number;
    sample_size: number;
    confidence: 'high' | 'medium' | 'low';
  };
  method: string;
  key_rate: number;
}

/**
 * Spell value prediction
 */
export interface SpellValue {
  spell_ids: number[];
  predicted_flat: number;
  predicted_percent: number;
  avg_flat: number;
  avg_percent: number;
  count: number;
  confidence: 'high' | 'medium' | 'low';
}

/**
 * Spell analytics data
 */
export interface SpellAnalytics {
  spell_combo: number[];
  avg_flat: number;
  avg_percent: number;
  count: number;
  last_updated: string;
}

/**
 * Item spell premium breakdown
 */
export interface ItemSpellPremium {
  item: string;
  spell_ids: number[];
  base_price: TF2Price;
  spell_premium: TF2Price;
  total_price: TF2Price;
  premium_percent: number;
  market_data: {
    sample_size: number;
    confidence: 'high' | 'medium' | 'low';
    avg_flat_premium: number;
  };
}

/**
 * Data collection status
 */
export interface FetcherStatus {
  status: string;
  isRunning: boolean;
  lastRunTime: string;
  nextScheduledRun: string;
  statistics: {
    totalFetched: number;
    totalAdded: number;
    totalUpdated: number;
    rateLimits: number;
    errors: number;
  };
  schedule: string;
  historicalDataRange: string;
  lastRunDuration: string;
  performance: {
    itemsPerMinute: number;
    avgResponseTime: string;
  };
}

/**
 * Health check response
 */
export interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: string;
  version: string;
}

/**
 * Service statistics
 */
export interface ServiceStats {
  status: string;
  timestamp: string;
  database: {
    connected: boolean;
    totalSpelledItems: number;
    analyzedCombos: number;
    lastCleanup: string;
  };
  fetcher: {
    status: string;
    isRunning: boolean;
    lastRun: string;
    nextRun: string;
    statistics: {
      totalFetched: number;
      totalAdded: number;
      totalUpdated: number;
      rateLimits: number;
      errors: number;
    };
  };
  keyPrices: {
    ref: number;
    usd: number;
    lastUpdated: {
      ref: string;
      usd: string;
    };
  };
  performance: {
    avgResponseTime: string;
    requestsPerMinute: number;
    cacheHitRate: string;
  };
  spells: {
    totalAvailable: number;
    withMarketData: number;
    avgPremium: string;
  };
}

/**
 * Status proxy response
 */
export interface StatusProxyResponse {
  status: string;
  services: {
    api: string;
    database: string;
    spellHandler: string;
  };
  lastUpdate: string;
}
