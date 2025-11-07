/**
 * Example usage of the @pricedb-io/spells package
 * 
 * This example demonstrates the main features of the Spells client
 */

import { SpellsClient } from '@pricedb-io/spells';

async function main() {
  // Initialize the client
  const client = new SpellsClient();

  console.log('=== Spells.PriceDB.io Client Examples ===\n');

  // 1. Health Check
  console.log('1. Health Check');
  try {
    const health = await client.health();
    console.log(`Status: ${health.status}`);
    console.log(`Uptime: ${health.uptime}`);
    console.log(`Version: ${health.version}\n`);
  } catch (error) {
    console.error('Health check failed:', error);
  }

  // 2. Get all spells
  console.log('2. List All Available Spells');
  try {
    const spells = await client.getSpells();
    console.log(`Found ${spells.length} spells:`);
    spells.slice(0, 10).forEach(spell => {
      console.log(`  ${spell.id}: ${spell.name} (${spell.type})`);
    });
    if (spells.length > 10) {
      console.log(`  ... and ${spells.length - 10} more`);
    }
    console.log();
  } catch (error) {
    console.error('Failed to get spells:', error);
  }

  // 3. Get spell prediction
  console.log('3. Spell Prediction for Strange Rocket Launcher with Exorcism');
  try {
    const prediction = await client.predict({
      spells: 'Exorcism',
      item: 'Strange Rocket Launcher'
    });
    
    console.log(`Item: ${prediction.item_name}`);
    console.log(`Spells: ${prediction.spells.join(', ')}`);
    console.log(`Base Price: ${prediction.base_price.formatted}`);
    console.log('\nPrice Predictions:');
    console.log(`  Low:  ${prediction.predictions.low.formatted}`);
    console.log(`  Mid:  ${prediction.predictions.mid.formatted}`);
    console.log(`  High: ${prediction.predictions.high.formatted}`);
    console.log('\nPremiums:');
    console.log(`  Low:  ${prediction.premium_ranges.low.formatted}`);
    console.log(`  Mid:  ${prediction.premium_ranges.mid.formatted}`);
    console.log(`  High: ${prediction.premium_ranges.high.formatted}`);
    console.log(`\nMarket Data: ${prediction.market_data.sample_size} samples, ${prediction.market_data.confidence} confidence`);
    console.log(`Key Rate: ${prediction.key_rate} ref/key\n`);
  } catch (error) {
    console.error('Prediction failed:', error);
  }

  // 4. POST prediction with spell IDs
  console.log('4. POST Prediction with Multiple Spells');
  try {
    const prediction = await client.predictSpellItem({
      item_name: 'Strange Scattergun',
      spell_ids: [2003, 2002]  // Pumpkin Bombs + Exorcism
    });
    
    console.log(`Item: ${prediction.item_name}`);
    console.log(`Spells: ${prediction.spell_data.spell_names.join(', ')}`);
    console.log(`Base Price: ${prediction.base_price.formatted}`);
    console.log(`Spell Premium: ${prediction.spell_premium.formatted}`);
    console.log(`Total Price: ${prediction.total_price.formatted}`);
    console.log(`Confidence: ${prediction.spell_data.confidence} (${prediction.spell_data.sample_size} samples)\n`);
  } catch (error) {
    console.error('POST prediction failed:', error);
  }

  // 5. Convert spell ID to name
  console.log('5. Spell ID/Name Conversion');
  try {
    const spell = await client.spellIdToName(2002);
    console.log(`Spell #${spell.id}: ${spell.name} (${spell.type})`);
    
    const spellInfo = await client.spellNameToId('Pumpkin Bombs');
    console.log(`${spellInfo.name} has ID: ${spellInfo.id}\n`);
  } catch (error) {
    console.error('Conversion failed:', error);
  }

  // 6. Get spell value
  console.log('6. Calculate Spell Value');
  try {
    const value = await client.getSpellValue('2003,2002');
    console.log(`Spell IDs: ${value.spell_ids.join(', ')}`);
    console.log(`Predicted Flat Premium: ${value.predicted_flat} ref`);
    console.log(`Predicted Percentage: ${value.predicted_percent.toFixed(2)}%`);
    console.log(`Average Flat: ${value.avg_flat} ref`);
    console.log(`Average Percentage: ${value.avg_percent.toFixed(2)}%`);
    console.log(`Confidence: ${value.confidence} (${value.count} samples)\n`);
  } catch (error) {
    console.error('Failed to get spell value:', error);
  }

  // 7. Get spell analytics
  console.log('7. Top 5 Spell Premiums (by percentage)');
  try {
    const analytics = await client.getSpellAnalytics();
    const topSpells = analytics
      .sort((a, b) => b.avg_percent - a.avg_percent)
      .slice(0, 5);
    
    topSpells.forEach((spell, index) => {
      console.log(`  ${index + 1}. Spell ${spell.spell_combo.join(',')}: +${spell.avg_percent.toFixed(1)}% (${spell.count} samples)`);
    });
    console.log();
  } catch (error) {
    console.error('Failed to get analytics:', error);
  }

  // 8. Get item spell premium
  console.log('8. Item Spell Premium Breakdown');
  try {
    const premium = await client.getItemSpellPremium({
      item: 'Strange Scattergun',
      ids: '2003'
    });
    
    console.log(`Item: ${premium.item}`);
    console.log(`Base Price: ${premium.base_price.formatted}`);
    console.log(`Spell Premium: ${premium.spell_premium.formatted} (+${premium.premium_percent.toFixed(1)}%)`);
    console.log(`Total Price: ${premium.total_price.formatted}`);
    console.log(`Market Data: ${premium.market_data.confidence} confidence, ${premium.market_data.sample_size} samples\n`);
  } catch (error) {
    console.error('Failed to get premium:', error);
  }

  // 9. Get fetcher status
  console.log('9. Data Collection Status');
  try {
    const status = await client.getFetcherStatus();
    console.log(`Status: ${status.status}`);
    console.log(`Currently Running: ${status.isRunning}`);
    console.log(`Last Run: ${status.lastRunTime}`);
    console.log(`Next Run: ${status.nextScheduledRun}`);
    console.log(`Schedule: ${status.schedule}`);
    console.log('\nStatistics:');
    console.log(`  Total Fetched: ${status.statistics.totalFetched}`);
    console.log(`  Total Added: ${status.statistics.totalAdded}`);
    console.log(`  Total Updated: ${status.statistics.totalUpdated}`);
    console.log(`  Rate Limits: ${status.statistics.rateLimits}`);
    console.log(`  Errors: ${status.statistics.errors}`);
    console.log('\nPerformance:');
    console.log(`  Items/Minute: ${status.performance.itemsPerMinute.toFixed(1)}`);
    console.log(`  Avg Response Time: ${status.performance.avgResponseTime}\n`);
  } catch (error) {
    console.error('Failed to get fetcher status:', error);
  }

  // 10. Get comprehensive stats
  console.log('10. Service Statistics');
  try {
    const stats = await client.getStats();
    console.log(`Status: ${stats.status}`);
    console.log('\nDatabase:');
    console.log(`  Total Spelled Items: ${stats.database.totalSpelledItems}`);
    console.log(`  Analyzed Combinations: ${stats.database.analyzedCombos}`);
    console.log('\nKey Prices:');
    console.log(`  Refined: ${stats.keyPrices.ref} ref`);
    console.log(`  USD: $${stats.keyPrices.usd}`);
    console.log('\nPerformance:');
    console.log(`  Avg Response Time: ${stats.performance.avgResponseTime}`);
    console.log(`  Requests/Min: ${stats.performance.requestsPerMinute}`);
    console.log(`  Cache Hit Rate: ${stats.performance.cacheHitRate}`);
    console.log('\nSpells:');
    console.log(`  Total Available: ${stats.spells.totalAvailable}`);
    console.log(`  With Market Data: ${stats.spells.withMarketData}`);
    console.log(`  Avg Premium: ${stats.spells.avgPremium}\n`);
  } catch (error) {
    console.error('Failed to get stats:', error);
  }

  console.log('=== Examples Complete ===');
}

// Run the examples
main().catch(console.error);
