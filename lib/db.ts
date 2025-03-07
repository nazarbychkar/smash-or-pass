"use server";

import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import { getUser } from "./getUser";
import redis from "redis";

const USERS_DATABASE_NAME = "users";
const PHOTOS_DATABASE_NAME = "photos";

const redisClient = redis.createClient();
await redisClient.connect();

export default async function dbConnect() {
  if (!process.env.DATABASE_URL) {
    throw Error("there is no DATABASE_URL in .env somehow.");
  }
  const sql = neon(process.env.DATABASE_URL);

  await sql`CREATE TABLE IF NOT EXISTS "users" (
    id SERIAL PRIMARY KEY,
    name TEXT,
    email TEXT,
    password TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (name, email)
  )`;

  await sql`CREATE TABLE IF NOT EXISTS "photos" (
    photo_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    imgur_link VARCHAR(255) NOT NULL,
    rating FLOAT DEFAULT 0,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
  )`;
  try {
    await sql`DROP TRIGGER IF EXISTS limit_user_photos ON photos;`;

    await sql`
  CREATE OR REPLACE FUNCTION limit_user_photos()
  RETURNS TRIGGER AS $$
  BEGIN
      IF (SELECT COUNT(*) FROM photos WHERE user_id = NEW.user_id) >= 5 THEN
          RAISE EXCEPTION 'User cannot upload more than 5 photos.';
      END IF;
      RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;
`;

    await sql`
  CREATE TRIGGER limit_user_photos
  BEFORE INSERT ON photos
  FOR EACH ROW
  EXECUTE FUNCTION limit_user_photos();
`;
  } catch (e) {
    console.log("some bullshit with trigger in postgreSQL");
  }
  return sql;
}

export async function dbCreateUser(
  name: string,
  email: string,
  password: string
) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = await dbConnect();

  const data = await sql`
      INSERT INTO "users" (name, email, password) 
      VALUES (${name}, ${email}, ${hashedPassword})
      RETURNING id
    `;

  const user = data[0];

  return user;
}

export async function dbCreatePhoto(link: string, user_id: number) {
  const sql = await dbConnect();

  await sql`
    INSERT INTO "photos" (user_id, imgur_link) 
    VALUES (${user_id}, ${link})
  `;
}

export async function dbGetUser(user_id: string | unknown = "") {
  if (!user_id) throw new Error("User ID is required.");

  const sql = await dbConnect();
  const user = await sql`SELECT * FROM "users" WHERE id = ${user_id}`;

  return user[0] || null;
}

export async function dbGetUserByEmail(userEmail: string | unknown = "") {
  if (!userEmail) throw new Error("User Email is required.");

  const sql = await dbConnect();
  const user = await sql`SELECT * FROM "users" WHERE email = ${userEmail}`;

  return user[0] || null;
}

export async function dbGetPhotosByUser(user_id: number) {
  const sql = await dbConnect();

  const photos = await sql`SELECT * FROM "photos" WHERE user_id = ${user_id}`;

  return photos;
}

export async function dbRedisFill(userId: number) {
  const sql = await dbConnect();
  await redisClient.flushAll();

  const userIdString = userId.toString();
  const photos = await sql`SELECT photo_id FROM "photos"`;
  const photoIds = photos.map((photo) => photo.photo_id.toString());

  await redisClient.lPush(userIdString, photoIds);
  // TODO: to coment
  // const userRedisListAfter = await redisClient.lRange(userIdString, 0, -1);
  // console.log("redis fillment", userRedisListAfter);

  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 7);
  await redisClient.expireAt(userIdString, currentDate);
}

export async function dbRedisIsRefilmentNeeded(userId: number) {
  const userIdString = userId.toString();
  const userRedisList = await redisClient.lRange(userIdString, 0, -1);
  console.log("din", userRedisList);

  if (!userRedisList || userRedisList.length == 0) {
    // TODO: something is wrong with trigers
    // console.log("don");
    await dbRedisFill(userId);
  }
  // TODO: to coment
  // const userRedisListAfter = await redisClient.lRange(userIdString, 0, -1);
  // console.log("redis refilment", userRedisListAfter);
}

export async function dbRedisGetPhoto(userId: number) {
  const sql = await dbConnect();

  const userIdString = userId.toString();

  const photoId = await redisClient.rPop(userIdString);

  const photo =
    await sql`SELECT * FROM "photos" WHERE photos.photo_id = ${photoId}`;
  // console.log("photo DB retrieve", photo);

  return photo[0];
}

export async function dbAddPhotoRating(photoId: number, rating: number) {
  const sql = await dbConnect();

  console.log("add rate, rating and photo id:", rating, photoId);

  const res = await sql`UPDATE "photos"
  SET rating = rating + ${rating}
  WHERE photo_id = ${photoId}
  RETURNING rating`;

  // console.log(res);
  // console.log(`UPDATE "photos"
  // SET rating = rating + ${rating}
  // WHERE photo_id = ${photoId}
  // RETURNING rating`);

}
