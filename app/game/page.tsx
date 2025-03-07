import { dbRedisFill } from "@/lib/db"
import Game from "@/lib/Game";
import { getUser } from "@/lib/getUser"
import RedisRefillButton from "@/lib/RedisRefillButton";

export default async function Page() {
    // TODO: there is an idea to work up the Redis, but, currently I am on Windows, give me time to think, before installing WSL. I guess that is not so much space and, of course, you can remove it later.
    const user = await getUser();
    return (
        <div>
            <Game userId={user?.id}></Game>
            <RedisRefillButton userId={user?.id} />
        </div>
    );
}