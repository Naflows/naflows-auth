import mongoose from 'mongoose';


export function connectToDatabase() {
    const mongoURI = process.env.MONGO_URL || `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@mongo:27017/nass?authSource=admin`;
    console.log("Connecting to MongoDB at:", mongoURI);
    // Authenticate and connect to MongoDB
    if (!process.env.MONGO_INITDB_ROOT_USERNAME || !process.env.MONGO_INITDB_ROOT_PASSWORD) {
        console.error('MongoDB credentials are not set in environment variables');
        process.exit(1);
    }
    mongoose.connect(mongoURI);

    mongoose.connection.on('error', (err: Error) => {
        console.error(`MongoDB connection error: ${err}`);
    });

    // Confirm successful connection
    mongoose.connection.once('open', () => {
        console.log('Connected to MongoDB');
    });
}