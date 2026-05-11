// const { createClient } = require('redis');

// const redisClient = createClient({
//     username: 'default',
//     password: process.env.REDIS_PASS,
//     socket: {
//         host: process.env.REDIS_HOST,
//         port: process.env.REDIS_PORT
//     }
// });

// Temporary Mock Redis Client
const mockRedisClient = {
    connect: async () => { console.log("⚠️  Mock Redis connected (Bypassed real Redis connection)"); },
    exists: async (key) => 0,
    incr: async (key) => 1,
    expire: async (key, time) => 1,
    set: async (key, value) => 'OK',
    expireAt: async (key, timestamp) => 1,
};

module.exports = mockRedisClient;