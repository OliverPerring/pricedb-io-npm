# PriceDB.io NPM Packages

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

TypeScript SDK packages for interacting with the [pricedb.io](https://pricedb.io/) and [spells.pricedb.io](https://spells.pricedb.io/) APIs - comprehensive TF2 (Team Fortress 2) item pricing and spell premium databases.

## 📦 Packages

This monorepo contains two NPM packages:

### [@pricedb-io/client](./packages/pricedb-client)
TypeScript client for the main pricedb.io API - access TF2 item prices, historical data, and market statistics.

```bash
npm install @pricedb-io/client
```

### [@pricedb-io/spells](./packages/spells-client)
TypeScript client for the spells.pricedb.io API - calculate spell premiums, get market analytics for spelled items.

```bash
npm install @pricedb-io/spells
```

## 🚀 Quick Start

### Using the Main PriceDB Client

```typescript
import { PriceDBClient } from '@pricedb-io/client';

const client = new PriceDBClient();

// Get latest price for an item
const item = await client.getItem('40;11;kt-3');
console.log(`${item.name}: ${item.buy.keys} keys, ${item.buy.metal} ref`);

// Search for items
const results = await client.search({ query: 'Rocket Launcher', limit: 5 });
results.results.forEach(item => {
  console.log(`${item.name} (${item.sku})`);
});

// Get price history
const history = await client.getItemHistory('40;11;kt-3');
console.log(`Found ${history.length} historical price entries`);
```

### Using the Spells Client

```typescript
import { SpellsClient } from '@pricedb-io/spells';

const client = new SpellsClient();

// Get spell prediction for an item
const prediction = await client.predict({
  spells: 'Exorcism',
  item: 'Strange Rocket Launcher'
});
console.log(`Predicted price: ${prediction.predictions.mid.formatted}`);
console.log(`Base price: ${prediction.base_price.formatted}`);
console.log(`Premium: ${prediction.premium_ranges.mid.formatted}`);

// Get all available spells
const spells = await client.getSpells();
console.log(`Found ${spells.length} spells`);

// Get market analytics
const analytics = await client.getSpellAnalytics();
analytics.forEach(spell => {
  console.log(`Spell combo ${spell.spell_combo}: +${spell.avg_percent}% premium`);
});
```
