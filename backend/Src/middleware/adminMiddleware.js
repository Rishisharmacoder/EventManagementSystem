const jwt = require('jsonwebtoken');
const User = require('../models/user');

const adminMiddleware = async (req, res, next) => {
    try {
        // Token cookie se lo
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        // Token verify karo
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const redisClient = require('../config/redis');
        const IsBlocked = await redisClient.exists(`token:${token}`);
        if(IsBlocked) {
            return res.status(401).json({ message: "Unauthorized: Invalid Token" });
        }
        
        // User database se fetch karo
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        // Role check – agar sirf admin allowed hai to
        if (user.role !== 'admin') {
            return res.status(403).json({ message: "Forbidden: Admin access required" });
        }

        
      req.result = user;

        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized: " + err.message });
    }
};

module.exports = adminMiddleware;