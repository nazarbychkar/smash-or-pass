import { neon } from "@neondatabase/serverless";

export default async function dbConnect() {
  if (!process.env.DATABASE_URL) {
    throw Error("there is no DATABASE_URL in .env somehow.");
  }
  const sql = neon(process.env.DATABASE_URL);
  await sql`CREATE TABLE IF NOT EXISTS "user" (
    id SERIAL PRIMARY KEY,
    name TEXT,
    email TEXT,
    password TEXT,
    UNIQUE (name, email)
  )`;

  return sql;
}

export async function dbGetUser(userId: string | unknown = "") {
  if (!userId) throw new Error("User ID is required.");

  const sql = await dbConnect();
  const user = await sql`SELECT * FROM "user" WHERE id = ${userId}`;

  return user[0] || null;
}
