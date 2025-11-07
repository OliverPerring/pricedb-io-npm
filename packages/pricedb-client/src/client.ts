import {
  ItemPrice,
  Item,
  ItemStats,
  SearchResult,
  ComparisonResult,
  CacheStats,
  HealthResponse,
  PaginationOptions,
  HistoryOptions,
  SearchOptions,
} from './types';

/**
 * Configuration options for the PriceDBClient
 */
export interface PriceDBClientConfig {
  baseUrl?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

/**
 * TypeScript client for the pricedb.io API
 * 
 * @example
 * ```typescript
 * const client = new PriceDBClient();
 * const item = await client.getItem('40;11;kt-3');
 * console.log(item.name, item.buy.keys);
 * ```
 */
export class PriceDBClient {
  private baseUrl: string;
  private timeout: number;
  private headers: Record<string, string>;

  /**
   * Create a new PriceDB client
   * 
   * @param config - Optional configuration options
   */
  constructor(config: PriceDBClientConfig = {}) {
    this.baseUrl = config.baseUrl || 'https://pricedb.io';
    this.timeout = config.timeout || 10000;
    this.headers = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
  }

  /**
   * Make an HTTP request to the API
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          ...this.headers,
          ...options.headers,
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Health check - Check API and database status
   * 
   * @returns Health status of the API
   */
  async health(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/api/');
  }

  /**
   * Get all items - Returns a list of all unique items (name and SKU)
   * 
   * @returns Array of all items in the database
   */
  async getItems(): Promise<Item[]> {
    return this.request<Item[]>('/api/items');
  }

  /**
   * Get latest prices - Returns the latest price entry for each SKU
   * 
   * @returns Array of latest prices for all items
   */
  async getLatestPrices(): Promise<ItemPrice[]> {
    return this.request<ItemPrice[]>('/api/latest-prices');
  }

  /**
   * Get prices with pagination
   * 
   * @param options - Pagination options (limit and offset)
   * @returns Paginated array of prices
   */
  async getPrices(options: PaginationOptions = {}): Promise<ItemPrice[]> {
    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.offset) params.append('offset', options.offset.toString());
    
    const queryString = params.toString();
    const endpoint = queryString ? `/api/prices?${queryString}` : '/api/prices';
    
    return this.request<ItemPrice[]>(endpoint);
  }

  /**
   * Get item by SKU - Returns the latest price for a specific item
   * 
   * @param sku - The SKU of the item to look up
   * @returns Price information for the specified item
   */
  async getItem(sku: string): Promise<ItemPrice> {
    return this.request<ItemPrice>(`/api/item/${encodeURIComponent(sku)}`);
  }

  /**
   * Get item history - Returns the full price history for a specific item
   * 
   * @param sku - The SKU of the item
   * @param options - Optional start and end timestamps for filtering
   * @returns Array of historical prices
   */
  async getItemHistory(sku: string, options: HistoryOptions = {}): Promise<ItemPrice[]> {
    const params = new URLSearchParams();
    if (options.start) params.append('start', options.start.toString());
    if (options.end) params.append('end', options.end.toString());
    
    const queryString = params.toString();
    const endpoint = queryString 
      ? `/api/item-history/${encodeURIComponent(sku)}?${queryString}`
      : `/api/item-history/${encodeURIComponent(sku)}`;
    
    return this.request<ItemPrice[]>(endpoint);
  }

  /**
   * Get item statistics - Returns min, max, avg statistics for an item
   * 
   * @param sku - The SKU of the item
   * @returns Statistics for buy and sell prices
   */
  async getItemStats(sku: string): Promise<ItemStats> {
    return this.request<ItemStats>(`/api/item-stats/${encodeURIComponent(sku)}`);
  }

  /**
   * Get multiple items in bulk
   * 
   * @param skus - Array of SKU strings to look up
   * @returns Array of price information for the requested items
   */
  async getItemsBulk(skus: string[]): Promise<ItemPrice[]> {
    return this.request<ItemPrice[]>('/api/items-bulk', {
      method: 'POST',
      body: JSON.stringify({ skus }),
    });
  }

  /**
   * Get snapshot - Returns prices as they were at a specific timestamp
   * 
   * @param timestamp - Unix timestamp (seconds)
   * @returns Array of prices at the specified time
   */
  async getSnapshot(timestamp: number): Promise<ItemPrice[]> {
    return this.request<ItemPrice[]>(`/api/snapshot/${timestamp}`);
  }

  /**
   * Search for items by name using fuzzy search
   * 
   * @param options - Search query and optional limit
   * @returns Search results with relevance scores
   */
  async search(options: SearchOptions): Promise<SearchResult> {
    const params = new URLSearchParams();
    params.append('q', options.query);
    if (options.limit) params.append('limit', options.limit.toString());
    
    return this.request<SearchResult>(`/api/search?${params.toString()}`);
  }

  /**
   * Compare two items side by side
   * 
   * @param sku1 - SKU of the first item
   * @param sku2 - SKU of the second item
   * @returns Comparison data including price differences and history
   */
  async compareItems(sku1: string, sku2: string): Promise<ComparisonResult> {
    return this.request<ComparisonResult>(
      `/api/compare/${encodeURIComponent(sku1)}/${encodeURIComponent(sku2)}`
    );
  }

  /**
   * Get cache statistics
   * 
   * @returns Cache performance and system statistics
   */
  async getCacheStats(): Promise<CacheStats> {
    return this.request<CacheStats>('/api/cache-stats');
  }

  /**
   * Get graph URL for an item's price history
   * 
   * @param sku - The SKU of the item
   * @param options - Optional display options
   * @returns URL to the interactive chart
   */
  getGraphUrl(
    sku: string,
    options: { header?: boolean; height?: number; width?: string } = {}
  ): string {
    const params = new URLSearchParams();
    if (options.header === false) params.append('header', 'false');
    if (options.height) params.append('height', options.height.toString());
    if (options.width) params.append('width', options.width);
    
    const queryString = params.toString();
    return queryString 
      ? `${this.baseUrl}/api/graph/${encodeURIComponent(sku)}?${queryString}`
      : `${this.baseUrl}/api/graph/${encodeURIComponent(sku)}`;
  }
}
