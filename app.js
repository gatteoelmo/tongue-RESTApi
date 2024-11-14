import espress from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

dotenv.config();
const app = espress();
connectDB();

app.disable("x-powered-by");

app.get("/", (req, res) => {
    res.json({ message: "Hello World!" });
});


// setting up routes
app.use('/users', (req, res) => {
    res.json({ message: "you're on the users page" });
});

app.use('/posts', (req, res) => {
    res.json({ message: "you're on the posts page" });
});

app.use('/interactions', (req, res) => {
    res.json({ message: "you're on the interactions page" });
});


// setting up a server 
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});