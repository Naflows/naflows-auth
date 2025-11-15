import mongoose from "mongoose";


function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = async () => {

    try {
        if (mongoose.connection.readyState === 0) {
            console.log("Connecting to database...");
            await mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/nass");
            console.log("Database connected");
        }
    } catch (error) {
        console.error("Failed to connect to the database:", error);
        throw error; 
    }


};
