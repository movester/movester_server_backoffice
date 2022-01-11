const redis = require('redis');

const redisClient = redis.createClient(process.env.REDIS_PORT);

redisClient.on('connect', () => {
  console.log('redis client connected');
});

module.exports = redisClient;
