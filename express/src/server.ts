import express from "express";
import { MongoClient } from "mongodb";

function main() {
    const app = express();
    const appPort = Number(process.env.PORT || process.env.EXPRESS_PORT || 3000);
    const mongoUri = process.env.MONGO_URI as string;
    let mongoClient: MongoClient | underfind;

    app.get("/health", async (_req, res) => {
        try {
            if (!mongoClient) {
                throw new Error("mongo client not initialized");
            }

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
            msg: "ready",
        });
    });

    (async () => {
        try {
            if (!mongoUri) {
                throw new Error("mongo uri not set");
            }

            mongoClient = new MongoClient(mongoUri);
            await mongoClient.connect();
            app.listen(appPort, () => {
                console.log(`listening :${appPort}`);
            });
        } catch (e) {
            console.error("initialization error", e);
            process.exit(1);
        }
    })();
}

main();
