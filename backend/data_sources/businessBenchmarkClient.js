const fs = require('fs');
const path = require('path');
const { getCache, setCache } = require('./cache');

async function getBusinessBenchmark(category) {
  const cacheKey = `benchmark_${category}`;
  const cached = getCache(cacheKey);
  if (cached) return { ...cached, cached: true };

  const seedPath = path.join(__dirname, '../seed/business_benchmark_seed.json');
  try {
    const rawData = fs.readFileSync(seedPath, 'utf8');
    const benchmarkSeed = JSON.parse(rawData);
    
    const data = benchmarkSeed[category] || {
      business_category: category,
      unit: "Standard Unit",
      typical_project_cost_range: [100000, 500000],
      capacity: "Standard",
      estimated_revenue_range: [200000, 700000],
      operating_cost_ratio: 0.60,
      working_capital_ratio: 0.15,
      equipment_categories: ["Standard Equipment"],
      input_categories: ["Standard Inputs"],
      risk_categories: ["Market fluctuation", "Execution risk"],
      assumption_notes: "Generic illustrative prototype benchmark",
      source_type: "prototype_benchmark"
    };

    const result = {
      source_name: data.source_type,
      source_url: 'Internal Knowledge Base',
      fetched_at: new Date().toISOString(),
      status: 'success',
      records: [data],
      error: null,
      cached: false
    };

    setCache(cacheKey, result, 168);
    return result;
  } catch (err) {
    return { status: 'error', error: 'Benchmark data unavailable' };
  }
}

module.exports = { getBusinessBenchmark };
