import { getUser } from "@/lib/getUser";
import PhotoManager from "@/lib/PhotoManager";

export default async function Profile() {
  const user = await getUser();
  return (
    <main>
      <h1>Hi, {user?.name}!</h1>
      <PhotoManager />
    </main>
  );
}
