require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");

const { connectDatabase } = require("./config/dbConnect");
const routes = require("./routes/IndexRoutes");
const { ApiResponse, ApiError, errorCodes } = require("./utils/ResponseHandlers");
const { errorMiddleware } = require("./utils/middlewares/globalErrHandlers");

const { startProductAutoPostCron } = require('./utils/cron/autoPostCron');
const config = require("./config/config");

const app = express();

/* =========================
   GLOBAL PROCESS SAFETY
========================= */
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

/* =========================
   SECURITY & CORE MIDDLEWARE
========================= */
app.use(helmet());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

/* =========================
   HEALTH CHECK
========================= */
app.get("/health", (req, res) => {
  return new ApiResponse({
    message: "Focus backend is running",
    data: {
      environment: process.env.NODE_ENV,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  }).send(res);
});

/* =========================
   API ROUTES
========================= */
app.use("/api/v1", routes);

/* =========================
   404 HANDLER
========================= */
app.use((req, res, next) => {
  next(
    new ApiError(
      404,
      `Route ${req.originalUrl} not found`,
      errorCodes.ROUTE_NOT_FOUND
    )
  );
});

/* =========================
   GLOBAL ERROR HANDLER
========================= */
app.use(errorMiddleware);

/* =========================
   SERVER STARTUP
========================= */
const startServer = async () => {
  try {
    await connectDatabase();
    console.log("✅ Database connection established");

    // 🔥 Start cron jobs AFTER DB is ready
    await startProductAutoPostCron();
    console.log("✅ Product AutoPost cron started");

    const server = app.listen(config.port, "0.0.0.0", () => {
      console.log(
        `🚀 ${config.nodeEnv.toUpperCase()} API running on port ${config.port} (BasePath: ${config.basePath})`
      );
    });

    /* =========================
       GRACEFUL SHUTDOWN
    ========================= */
    const shutdown = async (signal) => {
      console.log(`${signal} received. Closing server...`);
      server.close(() => {
        console.log("HTTP server closed.");
        process.exit(0);
      });
    };

    ["SIGINT", "SIGTERM"].forEach((sig) =>
      process.on(sig, () => shutdown(sig))
    );
  } catch (err) {
    console.error("❌ Startup failed:", err.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;