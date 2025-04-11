import  mongoose from 'mongoose'



const connectDB = async () => {
  console.log(process.env.MONGODB_URI); // Log MONGO_URI to confirm ");
  try {
    const connectionInstance = await mongoose.connect(
      process.env.MONGODB_URI
    );  
    
    console.log(`\nMongoDB connected! DB HOST: ${connectionInstance.connection.host}`);
    return connectionInstance;  
    
  } catch (error) {
    console.log("MongoDB connection error:", error);
    process.exit(1);
  }
};
connectDB()
export default connectDB;
