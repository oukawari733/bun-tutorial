import {Client} from 'pg';
import {drizzle} from "drizzle-orm/node-postgres";


// Load environment variables
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 5432;
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'your_password';
const DB_NAME = process.env.DB_NAME || 'your_db';

// Create a PostgreSQL client
const client = new Client({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
});

export const connectToDatabase = async () => {
    try {
        await client.connect();
        console.log('✅ Connected to PostgreSQL');
    } catch (error) {
        console.error('❌ Error connecting to PostgreSQL:', error.message);
        throw error;
    }
};

export const getDbClient = () => {
    if (!client) {
        throw new Error('Database not connected. Call connectToDatabase() first.');
    }
    return client;
};

// Create Drizzle ORM instance
export const db = drizzle(client);


