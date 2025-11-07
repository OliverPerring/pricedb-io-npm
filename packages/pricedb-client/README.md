# @pricedb-io/client

[![npm version](https://badge.fury.io/js/@pricedb-io%2Fclient.svg)](https://badge.fury.io/js/@pricedb-io%2Fclient)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📦 Installation

```bash
npm install @pricedb-io/client
```

or with yarn:

```bash
yarn add @pricedb-io/client
```

## 🚀 Quick Start

```typescript
import { PriceDBClient } from '@pricedb-io/client';

const client = new PriceDBClient();

// Get latest price for an item by SKU
const item = await client.getItem('40;11;kt-3');
console.log(`${item.name}: ${item.buy.keys} keys, ${item.buy.metal} ref`);
```

## 📖 Usage Examples

### Get All Items

```typescript
// Get list of all items with their SKUs
const items = await client.getItems();
console.log(`Total items: ${items.length}`);
items.slice(0, 5).forEach(item => {
  console.log(`${item.name} (${item.sku})`);
});
```

### Get Latest Prices

```typescript
// Get the latest price for each SKU
const latestPrices = await client.getLatestPrices();
console.log(`Found ${latestPrices.length} price entries`);
```

### Search for Items

```typescript
// Fuzzy search for items by name
const results = await client.search({ 
  query: 'Rocket Launcher', 
  limit: 10 
});

console.log(`Found ${results.total} matches`);
results.results.forEach(item => {
  console.log(`${item.name} - Buy: ${item.buy.keys}k ${item.buy.metal}ref`);
});
```

### Get Item Price History

```typescript
// Get full price history for an item
const history = await client.getItemHistory('40;11;kt-3');
console.log(`Found ${history.length} historical entries`);

// Get history for a specific time range
const recentHistory = await client.getItemHistory('40;11;kt-3', {
  start: Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60), // Last 30 days
  end: Math.floor(Date.now() / 1000)
});
```

### Get Item Statistics

```typescript
// Get min, max, and average prices
const stats = await client.getItemStats('40;11;kt-3');
console.log('Buy Statistics:');
console.log(`  Min: ${stats.buy.keys.min}k ${stats.buy.metal.min}ref`);
console.log(`  Avg: ${stats.buy.keys.avg}k ${stats.buy.metal.avg}ref`);
console.log(`  Max: ${stats.buy.keys.max}k ${stats.buy.metal.max}ref`);
console.log(`  Sample size: ${stats.buy.count}`);
```

### Bulk Item Queries

```typescript
// Get prices for multiple items at once
const items = await client.getItemsBulk([
  '40;11;kt-3',
  '202;11;australium',
  '266;6'
]);

items.forEach(item => {
  console.log(`${item.name}: ${item.buy.keys}k ${item.buy.metal}ref`);
});
```

### Compare Items

```typescript
// Compare two items side by side
const comparison = await client.compareItems('40;11;kt-3', '202;11;australium');

console.log('Item 1:', comparison.items['40;11;kt-3'].name);
console.log('Item 2:', comparison.items['202;11;australium'].name);
console.log('Buy Price Difference:', 
  `${comparison.comparison.buyDifference.keys}k ${comparison.comparison.buyDifference.metal}ref`
);
```

### Get Historical Snapshot

```typescript
// Get all prices as they were at a specific time
const timestamp = Math.floor(Date.now() / 1000) - (7 * 24 * 60 * 60); // 7 days ago
const snapshot = await client.getSnapshot(timestamp);
console.log(`Snapshot contains ${snapshot.length} items`);
```

### Get Price Chart URL

```typescript
// Get URL for interactive price chart
const chartUrl = client.getGraphUrl('40;11;kt-3', {
  header: false,
  height: 400,
  width: '100%'
});
console.log(`Chart URL: ${chartUrl}`);
```

### Paginated Price Queries

```typescript
// Get prices with pagination
const firstPage = await client.getPrices({ limit: 100, offset: 0 });
const secondPage = await client.getPrices({ limit: 100, offset: 100 });
```

### Health Check

```typescript
// Check API and database status
const health = await client.health();
console.log(`API Status: ${health.status}`);
console.log(`Database Status: ${health.db}`);
```

### Cache Statistics

```typescript
// Get cache and system statistics
const stats = await client.getCacheStats();
console.log(`Cache size: ${stats.cache.size}/${stats.cache.maxSize}`);
console.log(`Total prices in database: ${stats.database.totalPrices}`);
console.log(`Unique items: ${stats.database.uniqueItems}`);
```

## 🔧 Configuration

You can configure the client with custom options:

```typescript
const client = new PriceDBClient({
  baseUrl: 'https://pricedb.io',  // Optional: custom API base URL
  timeout: 10000,                  // Optional: request timeout in ms (default: 10000)
  headers: {                       // Optional: custom headers
    'User-Agent': 'MyApp/1.0.0'
  }
});
```