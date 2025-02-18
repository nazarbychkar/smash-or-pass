import { getUser } from "@/lib/getUser";
import LogoutButton from "@/lib/LogoutButton";
import { logout } from "@/lib/registration";
import Link from "next/link";

export default async function Home() {
  const user = await getUser();
  // TODO: if user is logged, then provide "logout" option instead of "register".
  return (
    <main>
      <h1>Smash or Pass</h1>
      {user ? (
        <>
          <Link href="/profile">Profile</Link>
          <LogoutButton />
        </>
      ) : (
        <>
          <Link href="/register">Register</Link>
          <Link href="/login">Login</Link>
        </>
      )}
    </main>
  );
}
