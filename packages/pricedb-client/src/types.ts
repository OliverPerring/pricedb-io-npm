/**
 * Price information for an item
 */
export interface Price {
  keys: number;
  metal: number;
}

/**
 * Item price data from the API
 */
export interface ItemPrice {
  name: string;
  sku: string;
  source: string;
  time: number;
  buy: Price;
  sell: Price;
}

/**
 * Price statistics for an item
 */
export interface PriceStats {
  count: number;
  keys: {
    min: number;
    max: number;
    avg: number;
  };
  metal: {
    min: number;
    max: number;
    avg: number;
  };
}

/**
 * Item statistics response
 */
export interface ItemStats {
  buy: PriceStats;
  sell: PriceStats;
}

/**
 * Item search result
 */
export interface SearchResult {
  query: string;
  results: Array<ItemPrice & { relevance: number }>;
  total: number;
  limit: number;
}

/**
 * Item comparison result
 */
export interface ComparisonResult {
  items: {
    [sku: string]: ItemPrice;
  };
  comparison: {
    buyDifference: Price;
    sellDifference: Price;
  };
  history: {
    [sku: string]: ItemPrice[];
  };
  meta: {
    compared: string;
    historyDays: number;
  };
}

/**
 * Cache statistics
 */
export interface CacheStats {
  cache: {
    size: number;
    maxSize: number;
    activeTimers: number;
  };
  database: {
    totalPrices: number;
    uniqueItems: number;
    latestUpdate: number;
  };
}

/**
 * Health check response
 */
export interface HealthResponse {
  status: string;
  db: string;
}

/**
 * Basic item information
 */
export interface Item {
  name: string;
  sku: string;
}

/**
 * Pagination options
 */
export interface PaginationOptions {
  limit?: number;
  offset?: number;
}

/**
 * History filter options
 */
export interface HistoryOptions {
  start?: number;
  end?: number;
}

/**
 * Search options
 */
export interface SearchOptions {
  query: string;
  limit?: number;
}
