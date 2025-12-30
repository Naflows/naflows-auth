import mongoose from 'mongoose';
import { uploadPicture } from '../software/data-management/manage-pictures';


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


        /*
        
            NOT USABLE IN PRODUCTION
        
        */


        function executePicturesSafeCleanup() {
            const db = mongoose.connection.db;
            
            const services = db.collection("services");
            const users = db.collection("users");

            // Execute uploadPicture for all services and users to ensure pictures are stored correctly
            (async () => {
                const allServices = await services.find({}).toArray();
                for (const service of allServices) {
                    if (service.picture) {
                        console.log("Re-uploading service picture for service ID:", service.id);
                        const id = await uploadPicture(service.id, service.picture.buffer, "service");
                        // Replace service.picture & service.banner to the returned
                        await services.updateOne({ id: service.id }, { $set: { picture: id } });
                    }
                    if (service.banner) {
                        console.log("Re-uploading service banner for service ID:", service.id);
                        const id = await uploadPicture(service.id, service.banner.buffer, "banner");
                        await services.updateOne({ id: service.id }, { $set: { banner: id } });
                    }
                }

                const allUsers = await users.find({}).toArray();
                for (const user of allUsers) {
                    if (user.profile_picture) {
                        console.log("Re-uploading profile picture for user ID:", user.id);
                        const id = await uploadPicture(user.id, user.profile_picture.buffer, "user");
                        await users.updateOne({ id: user.id }, { $set: { profile_picture: id } });
                    }
                }

                console.log("Picture safe cleanup completed.");
            })();
        }

        // Uncomment the following line to execute picture safe cleanup
       // executePicturesSafeCleanup();



    });
}