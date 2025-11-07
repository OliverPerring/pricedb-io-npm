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

## 🏗️ Development

### Prerequisites

- Node.js >= 16.0.0
- npm >= 7.0.0

### Setup

```bash
# Clone the repository
git clone <url>
cd pricedb-io-npm

# Install dependencies
npm install

# Build all packages
npm run build

# Lint code
npm run lint

# Format code
npm run format
```

### Project Structure

```
pricedb-io-npm/
├── packages/
│   ├── pricedb-client/       # Main PriceDB API client
│   │   ├── src/
│   │   │   ├── client.ts     # Client implementation
│   │   │   ├── types.ts      # TypeScript type definitions
│   │   │   └── index.ts      # Package entry point
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── spells-client/        # Spells API client
│       ├── src/
│       │   ├── client.ts     # Client implementation
│       │   ├── types.ts      # TypeScript type definitions
│       │   └── index.ts      # Package entry point
│       ├── package.json
│       └── tsconfig.json
├── .github/
│   └── workflows/
│       └── ci-cd.yml         # CI/CD pipeline
├── package.json              # Root package with workspaces
├── tsconfig.json             # Base TypeScript configuration
└── README.md                 # This file
```

## 📖 Documentation

- [Main PriceDB Client Documentation](./packages/pricedb-client/README.md)
- [Spells Client Documentation](./packages/spells-client/README.md)
- [PriceDB.io API Documentation](https://pricedb.io/api-docs)
- [Spells API Documentation](https://spells.pricedb.io/api-docs)

## 🔑 Features

### Main PriceDB Client
- ✅ Full TypeScript support with type definitions
- ✅ Get latest prices for items
- ✅ Search items by name (fuzzy search)
- ✅ Access historical price data
- ✅ Get item statistics (min, max, avg)
- ✅ Bulk item queries
- ✅ Price snapshots at specific timestamps
- ✅ Compare two items
- ✅ Rate limiting handled automatically

### Spells Client
- ✅ Full TypeScript support with type definitions
- ✅ Get spell predictions with low/mid/high ranges
- ✅ Calculate spell premiums for specific items
- ✅ Access comprehensive spell analytics
- ✅ Convert between spell IDs and names
- ✅ Get all available spells
- ✅ Monitor data collection status
- ✅ Rate limiting handled automatically

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Made with ❤️ for the TF2 community
