import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";



const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(express.json({limit: "16kb"}));

app.use(express.urlencoded({limit: "16kb", extended: true}));
app.use(express.static("public"));
app.use(cookieParser(process.env.COOKIE_SECRET)); 
app.get("/healthcheck", (req, res) => {
    res.status(200).json({ status: "OK" });
});
//routes
import userRoutes  from "./routes/user.routes.js"; 

//route declaration
app.use("/api/v1/users", userRoutes);


export  {app};