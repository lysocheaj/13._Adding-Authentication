import { MongoClient } from "mongodb";

export async function ConnectDatabase() {
  const client = await MongoClient.connect(
    "mongodb+srv://test:jnOAoK6cPdj78bDC@cluster0.daiqd60.mongodb.net/auth?retryWrites=true&w=majority"
  );
  return client;
}

export async function InsertDocument(client, collection, document) {
  const db = client.db(); // connect db name signup
  await db.collection(collection).insertOne(document); // create a table name emails and insert query email to it
}
