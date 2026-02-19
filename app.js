require("dotenv").config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
console.log("TLS VALUE:", process.env.NODE_TLS_REJECT_UNAUTHORIZED);
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
 
const { connectDatabase } = require("./config/dbConnect");
const routes = require("./routes/IndexRoutes");
const { ApiResponse, ApiError, errorCodes } = require("./utils/ResponseHandlers");
const { errorMiddleware } = require("./utils/middlewares/globalErrHandlers");
const { startProductAutoPostCron } = require("./utils/cron/autoPostCron");
const config = require("./config/config");
 
const app = express();
 
/* =========================
   IIS VIRTUAL DIRECTORY FIX
========================= */
 
const IIS_BASE_PATH = process.env.IIS_BASE_PATH;
 
app.use((req, res, next) => {
  if (IIS_BASE_PATH && req.url.startsWith(IIS_BASE_PATH)) {
    req.url = req.url.substring(IIS_BASE_PATH.length) || "/";
  }
  next();
});
 
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
    console.log("Database connected");
 
    await startProductAutoPostCron();
    console.log("Cron started");
 
    const server = app.listen(config.port, "0.0.0.0", () => {
      console.log(`API running on port ${config.port}`);
    });
 
    const shutdown = async () => {
      server.close(() => process.exit(0));
    };
 
    ["SIGINT", "SIGTERM"].forEach(sig =>
      process.on(sig, shutdown)
    );
 
  } catch (err) {
    console.error("Startup failed:", err.message);
    process.exit(1);
  }
};
 
startServer();
 
module.exports = app;