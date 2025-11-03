import express from "express";
import { MongoClient } from "mongodb";

const app = express();
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI;

let mongoClient;

app.get("/health", async(_req, res) => {
    try {
        if (!mongoClient)
            throw new Error("mongo not initialized");

        await mongoClient.db().admin().ping();
        res.status(200).json({
            ok: 1,
        });
    } catch (e) {
        res.status(500).json({
            ok: 0,
            error: String(e),
        });
    }
});
app.get("/api/hello", (_req, res) => {
    res.json({
        "msg": "ready",
    });
});

(async () => {
    try {
        mongoClient = new MongoClient(mongoURI);
        await mongoClient.connect();
        app.listen(port, () => {
            console.log(`listening :${port}`);
        });
    } catch (e) {
        console.error("Initialization error", e);
        process.exit(1);
    }
})();
