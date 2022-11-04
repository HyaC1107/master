import mongoose from "mongoose";

export default function mongooseInit() {
    const MONGO_URI:string = process.env.MONGO_URI!;
    if (!MONGO_URI) {
        throw new Error("Please check MONGO_URI in .env.local");
    }
    mongoose.connect(MONGO_URI, { dbName: "airbnbClone" });
}




