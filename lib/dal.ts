import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";
import { decrypt } from "./session";

export const verifySession = cache(async () => {
  const sessionCookie = (await cookies()).get("session")?.value;
  // console.log("sessionCookie", sessionCookie);
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    return null;
  }

  return { isAuth: true, userId: session.userId };
});
