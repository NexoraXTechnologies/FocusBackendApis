const mongoose = require("mongoose");
const { errorCodes, ApiError } = require("../utils/ResponseHandlers");

/* =========================
   MONGODB CONNECTION
========================= */
const connectDatabase = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new ApiError(
      500,
      "MongoDB connection string is missing",
      errorCodes.DATABASE_ERROR
    );
  }

  try {
    mongoose.set("strictQuery", true);

    await mongoose.connect(mongoUri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 10000, // fail fast
    });

    console.log("MongoDB connected successfully");

    /* =========================
       CONNECTION EVENTS
    ========================= */
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB runtime error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected");
    });

  } catch (err) {
    throw new ApiError(
      500,
      "Failed to connect to MongoDB",
      errorCodes.DATABASE_ERROR,
      err.message
    );
  }
};

/* =========================
   GRACEFUL SHUTDOWN
========================= */
const disconnectDatabase = async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed gracefully");
  } catch (err) {
    console.error("Error closing MongoDB connection", err);
  }
};

module.exports = {
  connectDatabase,
  disconnectDatabase,
};
