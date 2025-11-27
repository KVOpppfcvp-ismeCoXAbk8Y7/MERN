import express from "express";
import { MongoClient } from "mongodb";

const app = express();
const port = process.env.PORT || 3000;
const mongoDb = process.env.MONGO_DB;
const mongoURI = process.env.MONGO_URI;

let mongoClient;

app.get("/health", async(_req, res) => {
    console.log("health");
    try {
        if (!mongoClient)
            throw new Error("mongo not initialized");

        console.log("client exists");
        await mongoClient.db(mongoDb).command({ ping: 1 });
        console.log("pinged");
        res.status(200).json({ ok: 1 });
        console.log("success");
    } catch (e) {
        console.log("error");
        res.status(500).json({ ok: 0, error: String(e) });
        console.log("error sent");
    }
});
app.get("/api/hello", (_req, res) => {
    res.json({ "msg": "ready" });
});

(async () => {
    try {
        console.log(`MONGO_URI: ${mongoURI}`);
        mongoClient = new MongoClient(mongoURI, { maxPoolSize: 5 });
        console.log("Client created");
        await mongoClient.connect();
        console.log("Connected");
        await mongoClient.db(mongoDb).command({ ping: 1 });
        console.log("Pinged");
        app.listen(port, () => {
            console.log(`listening :${port}`);
        });
    } catch (e) {
        console.error("Initialization error", e);
        process.exit(1);
    }
})();
