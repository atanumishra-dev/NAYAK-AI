// Simple in-memory cache for the prototype
const cache = new Map();

function getCache(key) {
  const cached = cache.get(key);
  if (!cached) return null;
  if (Date.now() > cached.expiry) {
    cache.delete(key);
    return null;
  }
  return cached.value;
}

function setCache(key, value, ttlHours) {
  cache.set(key, {
    value,
    expiry: Date.now() + (ttlHours * 60 * 60 * 1000)
  });
}

module.exports = { getCache, setCache };
