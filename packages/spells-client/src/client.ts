import {
  Spell,
  SpellPrediction,
  PostPredictionResponse,
  SpellValue,
  SpellAnalytics,
  ItemSpellPremium,
  FetcherStatus,
  HealthResponse,
  ServiceStats,
  StatusProxyResponse,
} from './types';

/**
 * Configuration options for the SpellsClient
 */
export interface SpellsClientConfig {
  baseUrl?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

/**
 * TypeScript client for the spells.pricedb.io API
 * 
 * @example
 * ```typescript
 * const client = new SpellsClient();
 * const prediction = await client.predict({
 *   spells: 'Exorcism',
 *   item: 'Strange Rocket Launcher'
 * });
 * console.log(prediction.predictions.mid.formatted);
 * ```
 */
export class SpellsClient {
  private baseUrl: string;
  private timeout: number;
  private headers: Record<string, string>;

  /**
   * Create a new Spells client
   * 
   * @param config - Optional configuration options
   */
  constructor(config: SpellsClientConfig = {}) {
    this.baseUrl = config.baseUrl || 'https://spell.pricedb.io';
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
   * Get spell prediction for an item with realistic flat-based price ranges
   * 
   * @param options - Spell names and item name
   * @returns Comprehensive spell prediction with low/mid/high estimates
   */
  async predict(options: { spells: string; item: string }): Promise<SpellPrediction> {
    const params = new URLSearchParams({
      spells: options.spells,
      item: options.item,
    });
    return this.request<SpellPrediction>(`/api/spell/predict?${params.toString()}`);
  }

  /**
   * Alternative prediction endpoint accepting POST body
   * 
   * @param options - Item name and array of spell IDs
   * @returns Spell premium predictions with market insights
   */
  async predictSpellItem(options: {
    item_name: string;
    spell_ids: number[];
  }): Promise<PostPredictionResponse> {
    return this.request<PostPredictionResponse>('/api/spell/predict-spell-item', {
      method: 'POST',
      body: JSON.stringify(options),
    });
  }

  /**
   * Calculate predicted premium for specific spell combinations
   * 
   * @param ids - Comma-separated spell defindex IDs
   * @returns Premium estimates based on market averages
   */
  async getSpellValue(ids: string): Promise<SpellValue> {
    const params = new URLSearchParams({ ids });
    return this.request<SpellValue>(`/api/spell/spell-value?${params.toString()}`);
  }

  /**
   * Get comprehensive market analytics for all spell combinations
   * 
   * @returns Array of spell analytics with sample sizes and averages
   */
  async getSpellAnalytics(): Promise<SpellAnalytics[]> {
    return this.request<SpellAnalytics[]>('/api/spell/spell-analytics');
  }

  /**
   * Calculate detailed spell premium breakdown for a specific item
   * 
   * @param options - Item name/SKU and spell IDs
   * @returns Premium breakdown with base price, premium, and total
   */
  async getItemSpellPremium(options: { item: string; ids: string }): Promise<ItemSpellPremium> {
    const params = new URLSearchParams({
      item: options.item,
      ids: options.ids,
    });
    return this.request<ItemSpellPremium>(`/api/spell/item-spell-premium?${params.toString()}`);
  }

  /**
   * Convert spell defindex ID to human-readable spell name
   * 
   * @param id - Spell defindex ID
   * @returns Spell information including name, type, and attribute ID
   */
  async spellIdToName(id: number): Promise<Spell> {
    const params = new URLSearchParams({ id: id.toString() });
    return this.request<Spell>(`/api/spell/spell-id-to-name?${params.toString()}`);
  }

  /**
   * Convert spell name to defindex ID (case-insensitive partial matching)
   * 
   * @param name - Spell name
   * @returns Spell information including ID, type, and attribute ID
   */
  async spellNameToId(name: string): Promise<Spell> {
    const params = new URLSearchParams({ name });
    return this.request<Spell>(`/api/spell/spell-name-to-id?${params.toString()}`);
  }

  /**
   * Get complete list of all available TF2 spells
   * 
   * @returns Array of all spells with IDs, names, types, and attributes
   */
  async getSpells(): Promise<Spell[]> {
    return this.request<Spell[]>('/api/spell/spells');
  }

  /**
   * Get real-time status of the spell data collection service
   * 
   * @returns Fetcher status with statistics and schedule information
   */
  async getFetcherStatus(): Promise<FetcherStatus> {
    return this.request<FetcherStatus>('/api/spell/fetcher-status');
  }

  /**
   * Simple health check endpoint for uptime monitoring
   * 
   * @returns Health status of the service
   */
  async health(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/api/spell/health');
  }

  /**
   * Comprehensive service statistics dashboard
   * 
   * @returns Detailed statistics including database, fetcher, and performance metrics
   */
  async getStats(): Promise<ServiceStats> {
    return this.request<ServiceStats>('/api/stats');
  }

  /**
   * Proxy endpoint for accessing main pricedb.io status API
   * 
   * @returns Unified status across all TF2 Price DB services
   */
  async getStatusProxy(): Promise<StatusProxyResponse> {
    return this.request<StatusProxyResponse>('/api/spell/status-proxy');
  }
}
