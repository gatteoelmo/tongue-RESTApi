import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRoute from "./routes/userRoute.js";
import postRoute from "./routes/postRoute.js";
import interactionRoute from "./routes/interactionRoute.js";

const app = express();
dotenv.config();
connectDB();

app.disable("x-powered-by");
app.use(express.json())

// setting up routes
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/interactions", interactionRoute);

// setting up a server 
const PORT = process.env.PORT || 1234;

// starting the server at the specified port
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});