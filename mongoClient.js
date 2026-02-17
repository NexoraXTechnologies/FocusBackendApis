// mongoClient.js
const { MongoClient } = require('mongodb');
const { mongoURI, dbName } = require('./config/config'); // import dbName from config

const client = new MongoClient(mongoURI);
let db = null;

async function connectDB() {
    try {
        // Connect once and cache the db handle
        if (!db) {
            if (!client.topology || client.topology.isDestroyed()) {
                await client.connect();
            }
            db = client.db(dbName); // ? select DB from .env
            console.log(`? MongoDB connected to database: ${dbName}`);
        }
        return db;
    } catch (err) {
        console.error('? MongoDB connection failed:', err);
        throw err;
    }
}

module.exports = {
    connectDB,
    client,
};
