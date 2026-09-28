const fs = require('fs');
const path = require('path');
const { getCache, setCache } = require('./cache');

async function getWeatherData(district) {
  const cacheKey = `weather_${district}`;
  const cached = getCache(cacheKey);
  if (cached) return { ...cached, cached: true };

  // Read from seed fallback
  const seedPath = path.join(__dirname, '../seed/weather_seed.json');
  try {
    const rawData = fs.readFileSync(seedPath, 'utf8');
    const weatherSeed = JSON.parse(rawData);
    
    const data = weatherSeed[district] || {
      temperature: 25,
      humidity: 50,
      rainfall: "Unknown",
      forecast: "Clear",
      warnings: [],
      observation_date: new Date().toISOString().split('T')[0],
      source: "IMD (Mock Baseline)",
      source_url: "https://mausam.imd.gov.in"
    };

    const result = {
      source_name: data.source,
      source_url: data.source_url,
      fetched_at: new Date().toISOString(),
      data_date: data.observation_date,
      status: 'success',
      records: [data],
      error: null,
      cached: false
    };

    setCache(cacheKey, result, 3);
    return result;
  } catch (err) {
    return { status: 'error', error: 'Weather data unavailable' };
  }
}

module.exports = { getWeatherData };
