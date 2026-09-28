const fs = require('fs');
const path = require('path');
const { getCache, setCache } = require('./cache');

async function getMarketData(category, district) {
  const cacheKey = `market_${category}_${district}`;
  const cached = getCache(cacheKey);
  if (cached) return { ...cached, cached: true };

  // Read from seed fallback
  const seedPath = path.join(__dirname, '../seed/market_seed.json');
  try {
    const rawData = fs.readFileSync(seedPath, 'utf8');
    const marketSeed = JSON.parse(rawData);
    
    // Exact match or generic fallback
    const data = marketSeed[category] || {
      commodity: `Generic ${category} Product`,
      market: district || 'Local Market',
      state: 'Local',
      district: district || 'Local',
      modal_price: "Varies",
      min_price: "Varies",
      max_price: "Varies",
      unit: "Unit",
      arrival_date: new Date().toISOString().split('T')[0],
      price_trend: "unknown",
      source: "Illustrative Baseline",
      source_url: "Local Assessment"
    };

    const result = {
      source_name: data.source,
      source_url: data.source_url,
      fetched_at: new Date().toISOString(),
      data_date: data.arrival_date,
      status: 'success',
      records: [data],
      error: null,
      cached: false
    };

    setCache(cacheKey, result, 6);
    return result;
  } catch (err) {
    return { status: 'error', error: 'Market data unavailable' };
  }
}

module.exports = { getMarketData };
