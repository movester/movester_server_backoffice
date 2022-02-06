const redis = require('redis');

const redisClient = redis.createClient({ host: process.env.host, port: process.env.REDIS_PORT, db: 0 });

redisClient.on('connect', () => {
  console.log('redis client connected');
});

module.exports = redisClient;
