import { getUser } from "@/lib/getUser"
import Game from "@/lib/Game"
import RedisRefillButton from "@/lib/RedisRefillButton"
import Link from "next/link"

export default async function Page() {
  const user = await getUser()

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Smash or Pass</h1>
          <Link href="/" className="btn btn-outline btn-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Home
          </Link>
        </div>

        <Game userId={user?.id} />

        <div className="mt-8 flex justify-center">
          <RedisRefillButton userId={user?.id} />
        </div>
      </div>
    </div>
  )
}

