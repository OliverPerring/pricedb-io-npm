/**
 * Example usage of the @pricedb-io/client package
 * 
 * This example demonstrates the main features of the PriceDB client
 */

import { PriceDBClient } from '@pricedb-io/client';

async function main() {
  // Initialize the client
  const client = new PriceDBClient();

  console.log('=== PriceDB.io Client Examples ===\n');

  // 1. Health Check
  console.log('1. Health Check');
  try {
    const health = await client.health();
    console.log(`API Status: ${health.status}, DB Status: ${health.db}\n`);
  } catch (error) {
    console.error('Health check failed:', error);
  }

  // 2. Get a specific item
  console.log('2. Get Specific Item (Strange Professional Killstreak Backburner)');
  try {
    const item = await client.getItem('40;11;kt-3');
    console.log(`Name: ${item.name}`);
    console.log(`SKU: ${item.sku}`);
    console.log(`Buy: ${item.buy.keys} keys, ${item.buy.metal} ref`);
    console.log(`Sell: ${item.sell.keys} keys, ${item.sell.metal} ref`);
    console.log(`Source: ${item.source}`);
    console.log(`Last updated: ${new Date(item.time * 1000).toLocaleString()}\n`);
  } catch (error) {
    console.error('Failed to get item:', error);
  }

  // 3. Search for items
  console.log('3. Search for Items (Rocket Launcher)');
  try {
    const results = await client.search({ query: 'Rocket Launcher', limit: 5 });
    console.log(`Found ${results.total} matches (showing ${results.results.length}):`);
    results.results.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.name} (${item.sku})`);
      console.log(`     Buy: ${item.buy.keys}k ${item.buy.metal}ref | Relevance: ${item.relevance}`);
    });
    console.log();
  } catch (error) {
    console.error('Search failed:', error);
  }

  // 4. Get item statistics
  console.log('4. Get Item Statistics');
  try {
    const stats = await client.getItemStats('40;11;kt-3');
    console.log('Buy Statistics:');
    console.log(`  Min: ${stats.buy.keys.min}k ${stats.buy.metal.min}ref`);
    console.log(`  Avg: ${stats.buy.keys.avg.toFixed(2)}k ${stats.buy.metal.avg.toFixed(2)}ref`);
    console.log(`  Max: ${stats.buy.keys.max}k ${stats.buy.metal.max}ref`);
    console.log(`  Sample size: ${stats.buy.count}`);
    console.log();
  } catch (error) {
    console.error('Failed to get stats:', error);
  }

  // 5. Get bulk items
  console.log('5. Bulk Item Query');
  try {
    const items = await client.getItemsBulk(['40;11;kt-3', '202;11;australium']);
    console.log(`Retrieved ${items.length} items:`);
    items.forEach(item => {
      console.log(`  ${item.name}: ${item.buy.keys}k ${item.buy.metal}ref`);
    });
    console.log();
  } catch (error) {
    console.error('Bulk query failed:', error);
  }

  // 6. Get price history
  console.log('6. Get Recent Price History (last 30 days)');
  try {
    const thirtyDaysAgo = Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60);
    const history = await client.getItemHistory('40;11;kt-3', {
      start: thirtyDaysAgo,
    });
    console.log(`Found ${history.length} price entries in the last 30 days`);
    if (history.length > 0) {
      const latest = history[history.length - 1];
      const oldest = history[0];
      console.log(`  Oldest: ${oldest.buy.keys}k ${oldest.buy.metal}ref (${new Date(oldest.time * 1000).toLocaleDateString()})`);
      console.log(`  Latest: ${latest.buy.keys}k ${latest.buy.metal}ref (${new Date(latest.time * 1000).toLocaleDateString()})`);
    }
    console.log();
  } catch (error) {
    console.error('Failed to get history:', error);
  }

  // 7. Compare items
  console.log('7. Compare Two Items');
  try {
    const comparison = await client.compareItems('40;11;kt-3', '202;11;australium');
    const item1 = comparison.items['40;11;kt-3'];
    const item2 = comparison.items['202;11;australium'];
    
    console.log(`Item 1: ${item1.name}`);
    console.log(`  Buy: ${item1.buy.keys}k ${item1.buy.metal}ref`);
    console.log(`Item 2: ${item2.name}`);
    console.log(`  Buy: ${item2.buy.keys}k ${item2.buy.metal}ref`);
    console.log(`Buy Price Difference: ${comparison.comparison.buyDifference.keys}k ${comparison.comparison.buyDifference.metal}ref`);
    console.log();
  } catch (error) {
    console.error('Comparison failed:', error);
  }

  // 8. Get cache stats
  console.log('8. Cache Statistics');
  try {
    const stats = await client.getCacheStats();
    console.log(`Cache: ${stats.cache.size}/${stats.cache.maxSize} items`);
    console.log(`Database: ${stats.database.totalPrices} prices, ${stats.database.uniqueItems} unique items`);
    console.log(`Last update: ${new Date(stats.database.latestUpdate * 1000).toLocaleString()}`);
    console.log();
  } catch (error) {
    console.error('Failed to get cache stats:', error);
  }

  // 9. Get graph URL
  console.log('9. Price Chart URL');
  const chartUrl = client.getGraphUrl('40;11;kt-3', { header: false, height: 400 });
  console.log(`Chart URL: ${chartUrl}\n`);

  console.log('=== Examples Complete ===');
}

// Run the examples
main().catch(console.error);
