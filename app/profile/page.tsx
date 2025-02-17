import { getUser } from "@/lib/getUser";

export default async function Profile() {
    const user = await getUser();

    return (
        <main>
            <h1>Hi, {user?.name}!</h1>
        </main>
    )
}