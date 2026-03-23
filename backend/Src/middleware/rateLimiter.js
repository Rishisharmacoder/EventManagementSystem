    const redisClient = require('../config/redis'); // tumhara Redis client import

    const RATE_LIMIT_WINDOW = 60; // seconds (1 minute)
    const RATE_LIMIT_MAX = 5;      // maximum submissions allowed per window

    const submitRateLimiter = async (req, res, next) => {
        try {
            // User ID (assuming user is authenticated and req.result._id exists)
            const userId = req.result?._id;
            if (!userId) {
                // Agar kisi reason se user ID nahi mili, toh allow kar do (ya IP use karo)
                return next();
            }

            const key = `rate:submit:${userId}`; // Redis key

            // Redis multi/transaction se increment and expiry set
            const currentCount = await redisClient.incr(key);
            
            // Agar first request hai, toh expiry set karo
            if (currentCount === 1) {
                await redisClient.expire(key, RATE_LIMIT_WINDOW);
            }

            // Check limit
            if (currentCount > RATE_LIMIT_MAX) {
                return res.status(429).json({
                    message: 'Too many submissions. Please try again later.'
                });
            }

            next(); // Allow request
        } catch (err) {
            console.error('Rate limiter error:', err);
            next(); // Agar Redis down ho toh allow kar do (fail open)
        }
    };

    module.exports = submitRateLimiter;