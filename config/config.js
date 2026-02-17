// config/config.js
require('dotenv').config();

module.exports = {
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/focusdb',
    dbName: process.env.DB_NAME || 'focusdb',
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    basePath: process.env.BASE_PATH || '',

    // AutoPost Configuration
    autoPost: {
        baseUrl: process.env.AUTOPOST_BASE_URL || 'http://localhost:3000',
        basePath: process.env.BASE_PATH || '',
        cronExpr: process.env.AUTOPOST_CRON || '0 0 * * *',
        timezone: process.env.AUTOPOST_TZ || 'Asia/Kolkata',
        serviceUser: process.env.AUTOPOST_SERVICE_USER || 'system',
        internalUser: process.env.SYSTEM_INTERNAL_USER || 'system',
        internalToken: process.env.SYSTEM_INTERNAL_TOKEN || 'your-internal-token-here'
    }
};
