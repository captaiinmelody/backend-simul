import express from "express";
import db from "./config/Database.js";
import router from "./routes/index.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();


const app = express();

const port = process.env.PORT || 3000;

try{
    await db.authenticate();
    console.log("Database Connected...");
}catch(e){
    console.error(e);
}

app.use(cors({credentialsorigin: `${port}`}));
app.use(cookieParser());
app.use(express.json());
app.use('/auth', router);

app.listen(5000, ()=> console.log(`Server running at ${port}`));