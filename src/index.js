import dotenv from 'dotenv';
import connectDB from './db/index.js';

dotenv.config({
   path:'./env'
}); // Load env vars



connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`app is listening on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error:", err);
    throw err;
  });
















/*
const app=express()
(async()=>{
   try{
   await mongoose.connect('${process.env.MONGODB_URI}/${DB_NAME}')
   app.on("error",(error)=>{
    console.log("ERR:",error);
    throw error
   })
   app.listen(process.env.PORT,()=>{
    console.log('app is listening on port ${process.env.PORT}');
   })
   }    catch(error){
    console.error("Error;",error)
    throw err
   }
})()*/