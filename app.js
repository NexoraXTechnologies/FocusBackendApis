require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");

const { connectDatabase } = require('./config/dbConnect');
const companyRoutes = require('./routes/IndexRoutes');
const { ApiResponse, ApiError, errorCodes } = require("./utils/ResponseHandlers");
const {errorMiddleware} = require("./utils/middlewares/globalErrHandlers");

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


app.use(express.json());

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
app.use("/api/v1/", companyRoutes);

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

/* =========================`
   GLOBAL ERROR HANDLER
========================= */
app.use(errorMiddleware);

/* =========================
   DB CONNECT & SERVER START
========================= */
const startApp = async () => {
  try {
    await connectDatabase();
    console.log("Database connection established");
  } catch (err) {
    console.error("Startup failed:", err.message);
    process.exit(1);
  }
};

startApp();

module.exports = app;
