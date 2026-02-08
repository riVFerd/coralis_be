import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRouter from "./router/auth-router.js";
import userRouter from "./router/user-router.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

const app = express();
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req,res,next) =>{
    req.time = new Date(Date.now()).toString();
    console.log(req.method,req.hostname, req.path, req.time);
    next();
});
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(3000, () => console.log('Server running on port 3000'));