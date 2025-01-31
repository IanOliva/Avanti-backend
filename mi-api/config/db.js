import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

//URL de conexión
const MONGO_URI = process.env.MONGO_URI;

//Function to connect to the bd
const connectDB = async () =>{
    try {
        await mongoose.connect(MONGO_URI),
        console.log('DB Succesfully Connected');
    } catch (err) {
        console.error('Connection failed to the DB:', err.message);
        process.exit(1);
    }
};

export default connectDB;
