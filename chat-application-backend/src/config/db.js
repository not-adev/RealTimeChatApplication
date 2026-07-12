import mongoose from "mongoose";

export async function connectToDb() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const statusMap = {
            0: "Disconnected",
            1: "Connected",
            2: "Connecting",
            3: "Disconnecting"
        };

        console.log(`Connection Status: ${statusMap[mongoose.connection.readyState]}`);
    } catch (error) {
        console.error("Database connection failed:", error.message);
    }
}
