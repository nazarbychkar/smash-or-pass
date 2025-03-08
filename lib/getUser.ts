import "server-only";
// import { cookies } from "next/headers";
// import { decrypt } from "./session";
import { dbGetUser } from "./db";
import { verifySession } from "./dal";
import { cache } from "react";

// export default async function getUser() {
//   const userCookie = (await cookies()).get("session")?.value;
//   const session = await decrypt(userCookie);
//   const user = await dbGetUser(session?.userId);

//   return user || null;
// }

export const getUser = cache(async () => {
  const session = await verifySession();
  if (!session) return null;

  try {
    const user = await dbGetUser(session?.userId);
    return user;
  } catch (error) {
    console.log("failed to fetch user:", error);
    return null;
  }
});
