import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';
import { initMongoSchemas } from '../models/index.ts';

dotenv.config();

let mongoClientInstance: MongoClient | null = null;
let mongoDbInstance: Db | null = null;

export async function getMongoDb(): Promise<Db | null> {
    if (mongoDbInstance) return mongoDbInstance;
    const uri = process.env.MONGODB_URI;
    if (!uri || uri.trim() === '') return null;

    try {
        if (!mongoClientInstance) {
            mongoClientInstance = new MongoClient(uri, {
                connectTimeoutMS: 5000,
                serverSelectionTimeoutMS: 5000,
            });
            await mongoClientInstance.connect();
            console.log('Successfully connected to MongoDB Atlas!');
        }
        mongoDbInstance = mongoClientInstance.db('msbullethub');
        await initMongoSchemas(mongoDbInstance);
        return mongoDbInstance;
    } catch (err) {
        console.error('Failed to connect to MongoDB Atlas:', err);
        mongoClientInstance = null;
        mongoDbInstance = null;
        return null;
    }
}

export async function closeMongoDb(): Promise<void> {
    if (mongoClientInstance) {
        await mongoClientInstance.close();
        mongoClientInstance = null;
        mongoDbInstance = null;
    }
}
