const redis = require('redis');

const redisClient = redis.createClient({ host: '127.0.0.1', port: process.env.REDIS_PORT, db: 0 });

redisClient.on('connect', () => {
  console.log('redis client connected');
});

module.exports = redisClient;
