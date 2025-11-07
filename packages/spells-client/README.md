# @pricedb-io/spells

[![npm version](https://badge.fury.io/js/@pricedb-io%2Fspells.svg)](https://badge.fury.io/js/@pricedb-io%2Fspells)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

TypeScript SDK for the [spells.pricedb.io](https://spells.pricedb.io/) API. Calculate spell premiums, get market analytics, and access comprehensive TF2 spell data with full TypeScript support.

## 📦 Installation

```bash
npm install @pricedb-io/spells
```

or with yarn:

```bash
yarn add @pricedb-io/spells
```

## 🚀 Quick Start

```typescript
import { SpellsClient } from '@pricedb-io/spells';

const client = new SpellsClient();

// Get spell prediction for an item
const prediction = await client.predict({
  spells: 'Exorcism',
  item: 'Strange Rocket Launcher'
});

console.log(`Base price: ${prediction.base_price.formatted}`);
console.log(`With spell: ${prediction.predictions.mid.formatted}`);
console.log(`Premium: ${prediction.premium_ranges.mid.formatted}`);
```

## 📖 Usage Examples

### Get Spell Predictions (Recommended)

```typescript
// Get enhanced prediction with low/mid/high estimates
const prediction = await client.predict({
  spells: 'Exorcism',
  item: 'Strange Rocket Launcher'
});

console.log('Price Ranges:');
console.log(`  Low:  ${prediction.predictions.low.formatted}`);
console.log(`  Mid:  ${prediction.predictions.mid.formatted}`);
console.log(`  High: ${prediction.predictions.high.formatted}`);
console.log(`Market Data: ${prediction.market_data.sample_size} samples, ${prediction.market_data.confidence} confidence`);
```

### Alternative POST Prediction

```typescript
// Use spell IDs for prediction
const prediction = await client.predictSpellItem({
  item_name: 'Strange Scattergun',
  spell_ids: [2003, 2002]  // Pumpkin Bombs + Exorcism
});

console.log(`Base price: ${prediction.base_price.formatted}`);
console.log(`Spell premium: ${prediction.spell_premium.formatted}`);
console.log(`Total price: ${prediction.total_price.formatted}`);
```

### Get All Available Spells

```typescript
// List all TF2 spells
const spells = await client.getSpells();

console.log(`Found ${spells.length} spells:`);
spells.forEach(spell => {
  console.log(`  ${spell.id}: ${spell.name} (${spell.type})`);
});
```

### Convert Between Spell IDs and Names

```typescript
// ID to Name
const spell = await client.spellIdToName(2002);
console.log(`Spell #${spell.id}: ${spell.name}`);

// Name to ID (case-insensitive, partial matching)
const spellInfo = await client.spellNameToId('Exorcism');
console.log(`${spellInfo.name} has ID: ${spellInfo.id}`);
```

### Get Market Analytics

```typescript
// Get comprehensive analytics for all spell combinations
const analytics = await client.getSpellAnalytics();

console.log('Top spell premiums:');
analytics
  .sort((a, b) => b.avg_percent - a.avg_percent)
  .slice(0, 10)
  .forEach(spell => {
    console.log(`  Spell ${spell.spell_combo}: +${spell.avg_percent.toFixed(1)}% (${spell.count} samples)`);
  });
```

### Calculate Spell Value

```typescript
// Get predicted premium for spell combination
const value = await client.getSpellValue('2003,2002');

console.log(`Predicted flat premium: ${value.predicted_flat} ref`);
console.log(`Predicted percentage: ${value.predicted_percent}%`);
console.log(`Average flat: ${value.avg_flat} ref`);
console.log(`Confidence: ${value.confidence}`);
console.log(`Sample size: ${value.count}`);
```

### Get Item Spell Premium

```typescript
// Calculate detailed breakdown for specific item
const premium = await client.getItemSpellPremium({
  item: 'Strange Scattergun',
  ids: '2003'
});

console.log(`Item: ${premium.item}`);
console.log(`Base price: ${premium.base_price.formatted}`);
console.log(`Spell premium: ${premium.spell_premium.formatted} (+${premium.premium_percent.toFixed(1)}%)`);
console.log(`Total price: ${premium.total_price.formatted}`);
console.log(`Market confidence: ${premium.market_data.confidence}`);
```

### Monitor Data Collection Status

```typescript
// Check fetcher status
const status = await client.getFetcherStatus();

console.log(`Status: ${status.status}`);
console.log(`Running: ${status.isRunning}`);
console.log(`Last run: ${status.lastRunTime}`);
console.log(`Next run: ${status.nextScheduledRun}`);
console.log(`Schedule: ${status.schedule}`);
console.log('\nStatistics:');
console.log(`  Total fetched: ${status.statistics.totalFetched}`);
console.log(`  Total added: ${status.statistics.totalAdded}`);
console.log(`  Rate limits: ${status.statistics.rateLimits}`);
console.log(`  Errors: ${status.statistics.errors}`);
```

### Get Service Statistics

```typescript
// Get comprehensive service stats
const stats = await client.getStats();

console.log(`Status: ${stats.status}`);
console.log(`\nDatabase:`);
console.log(`  Spelled items: ${stats.database.totalSpelledItems}`);
console.log(`  Analyzed combos: ${stats.database.analyzedCombos}`);
console.log(`\nKey Prices:`);
console.log(`  Refined: ${stats.keyPrices.ref} ref`);
console.log(`  USD: $${stats.keyPrices.usd}`);
console.log(`\nPerformance:`);
console.log(`  Avg response time: ${stats.performance.avgResponseTime}`);
console.log(`  Requests/min: ${stats.performance.requestsPerMinute}`);
console.log(`  Cache hit rate: ${stats.performance.cacheHitRate}`);
```

### Health Check

```typescript
// Simple health check
const health = await client.health();
console.log(`Status: ${health.status}`);
console.log(`Uptime: ${health.uptime}`);
console.log(`Version: ${health.version}`);
```

## 🔧 Configuration

You can configure the client with custom options:

```typescript
const client = new SpellsClient({
  baseUrl: 'https://spell.pricedb.io',  // Optional: custom API base URL
  timeout: 10000,                        // Optional: request timeout in ms (default: 10000)
  headers: {                             // Optional: custom headers
    'User-Agent': 'MyApp/1.0.0'
  }
});
```

## 📋 API Reference

### Client Methods

- `predict(options)` - Get spell prediction with price ranges (recommended)
- `predictSpellItem(options)` - Alternative POST prediction endpoint
- `getSpellValue(ids)` - Calculate premium for spell combination
- `getSpellAnalytics()` - Get market analytics for all spells
- `getItemSpellPremium(options)` - Detailed premium breakdown
- `spellIdToName(id)` - Convert spell ID to name
- `spellNameToId(name)` - Convert spell name to ID
- `getSpells()` - Get all available spells
- `getFetcherStatus()` - Check data collection status
- `health()` - Simple health check
- `getStats()` - Comprehensive service statistics
- `getStatusProxy()` - Get unified status across all services

### Types

All TypeScript types are fully exported:

```typescript
import type { 
  Spell,
  SpellPrediction,
  PostPredictionResponse,
  SpellValue,
  SpellAnalytics,
  ItemSpellPremium,
  FetcherStatus,
  HealthResponse,
  ServiceStats,
  TF2Price
} from '@pricedb-io/spells';
```

## 📊 Understanding the Data

### Confidence Levels

- **High Confidence**: 100+ sample listings - very reliable predictions
- **Medium Confidence**: 20-99 sample listings - reasonably reliable
- **Low Confidence**: <20 sample listings - use with caution

### Price Ranges

The `predict` endpoint provides three estimates:
- **Low (0.75x)**: Quick sale price, conservative estimate
- **Mid (1.0x)**: Market average, most accurate for typical sales
- **High (1.35x)**: Premium asking price, optimistic estimate

### Data Freshness

- Spell listings updated every 6 hours (00:00, 06:00, 12:00, 18:00 UTC)
- Key prices (ref) updated every 5 minutes from pricedb.io
- Key prices (USD) updated every 24 hours from Steam Market
- Analytics recalculated after each spell listing update

## 📊 Rate Limiting

The API limits requests to **100 requests per minute per IP address**. Health check endpoints are exempt from rate limiting.

Rate limit info is available in response headers:
- `RateLimit-Limit` - Maximum requests per window (100)
- `RateLimit-Remaining` - Remaining requests in current window
- `RateLimit-Reset` - Unix timestamp when limit resets

## 🐛 Error Handling

```typescript
try {
  const prediction = await client.predict({
    spells: 'InvalidSpell',
    item: 'Unknown Item'
  });
} catch (error) {
  if (error instanceof Error) {
    console.error('Error:', error.message);
  }
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request (invalid or missing parameters)
- `404` - Not Found (resource doesn't exist)
- `429` - Rate Limit Exceeded
- `500` - Internal Server Error

## 💡 Best Practices

1. **Cache spell list locally** - The spell list rarely changes
2. **Use `/spell-analytics` for bulk data** - More efficient than multiple calls
3. **Respect rate limits** - Implement exponential backoff on 429 errors
4. **Check service status before heavy usage** - Use `getStats()` or `health()`
5. **Understand confidence levels** - Low confidence predictions should be used cautiously

## 🔗 Links

- [API Documentation](https://spells.pricedb.io/api-docs)
- [Spell Search](https://spells.pricedb.io/search)
- [Market Analytics](https://spells.pricedb.io/analytics)
- [GitHub Repository](https://github.com/YOUR_USERNAME/pricedb-io-npm)
- [NPM Package](https://www.npmjs.com/package/@pricedb-io/spells)
- [Issue Tracker](https://github.com/YOUR_USERNAME/pricedb-io-npm/issues)

## 📄 License

MIT © [Your Name]

## 🙏 Credits

Built for the TF2 community. Data provided by [spells.pricedb.io](https://spells.pricedb.io/).

## ⚠️ Disclaimer

Spell prices are estimates and can never be 100% accurate due to item rarity and limited sample sizes. Always verify prices before trading.
