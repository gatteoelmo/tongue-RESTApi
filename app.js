import espress from "express";
import dotenv from "dotenv";

dotenv.config();
const app = espress();
app.disable("x-powered-by");

app.get("/", (req, res) => {
    res.json({ message: "Hello World!" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});