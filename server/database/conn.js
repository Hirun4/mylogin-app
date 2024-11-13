import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

async function connect(params) {
    const mongod = await MongoMemoryServer.create();
    const getUri = mongod.getUri();
}

export default connect;