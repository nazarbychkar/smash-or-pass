import Link from "next/link";

export default function Home() {

  // TODO: if user is logged, then provide "logout" option instead of "register".
  return (
    <main>
      <h1>Smash or Pass</h1>
        <Link href="/register">Register</Link>
    </main>
  );
}
