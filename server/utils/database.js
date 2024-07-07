require('dotenv').config();
const uri = process.env.MONGODB_URI;
const { MongoClient} = require('mongodb');

let db;

const initConnectDB = async () => {
    if (db) return db;
    const client = new MongoClient(uri, {});
    await client.connect();
    db = client.db('CodeBlocksDB');
    console.log('Connected to MongoDB');
    return db;
};


module.exports = { initConnectDB };
