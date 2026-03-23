require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const main = require("./Src/config/db");
const redisClient = require("./Src/config/redis");
const cors = require('cors')

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

// Middleware
app.use(express.json());      // MUST be before routes
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
const authRouter = require("./Src/routes/userAuth");
const eventRoutes = require("./Src/routes/eventRoutes");
const registrationRoutes = require("./Src/routes/registrationRoutes");

app.use("/user", authRouter);
app.use("/events", eventRoutes);
app.use("/registrations", registrationRoutes);

// Test route to verify body parsing
app.post("/test", (req, res) => {
    console.log("Test route body:", req.body);
    res.json({ received: req.body });
});

// Start server
const InitializeConnection = async () => {
    try {
        await Promise.all([main(), redisClient.connect()]);
        console.log("DB & Redis connected");
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    } catch (err) {
        console.error("Startup error:", err);
        process.exit(1);
    }
};
InitializeConnection();