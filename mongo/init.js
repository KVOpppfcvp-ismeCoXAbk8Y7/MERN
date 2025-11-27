const dbName = process.env.MONGO_DB;
const dbUser = process.env.MONGO_USER;
const dbPassword = process.env.MONGO_PASSWORD;

let errorMessages = [];

if (!dbName)
    errorMessages.push(`${errorMessagePrefix} MONGO_DB not set`);
if (!dbUser)
    errorMessages.push(`${errorMessagePrefix} MONGO_USER not set`);
if (!dbPassword)
    errorMessages.push(`${errorMessagePrefix} MONGO_PASSWORD not set`);
if (errorMessages.length > 0)
    throw new Error(errorMessages.join("\n"));

const db = db.getSiblingDB(dbName);

db.createUser({
    user: dbUser,
    pwd: dbPassword,
    roles: [{
        role: "readWrite",
        db: dbName,
    }],
});
