import { MongoClient } from "mongodb";

let client: MongoClient | null = null;

async function getClient(): Promise<MongoClient> {
  if (client) return client;
  const password = process.env.ATLAS_PSW;
  if (!password) {
    throw new Error("ATLAS_PSW environment variable not set");
  }
  const uri = `mongodb+srv://quicksolver02:${password}@bacobaxcluster.dympued.mongodb.net/?retryWrites=true&w=majority&appName=bacobaxcluster`;
  
  console.log(uri);
  client = new MongoClient(uri);
  await client.connect();
  return client;
}

export async function getCollection<T>(name: string) {
  const client = await getClient();
  const db = client.db("gallery");
  return db.collection<T>(name);
}
