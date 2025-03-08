import { getUser } from "@/lib/getUser"
import PhotoManager from "@/lib/PhotoManager"
import Link from "next/link"

export default async function Profile() {
  const user = await getUser()

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Profile</h1>
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

        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <div className="flex items-center gap-4">
              <div className="avatar placeholder">
                <div className="bg-neutral-focus text-neutral-content rounded-full w-16">
                  <span className="text-xl">{user?.name?.charAt(0) || "?"}</span>
                </div>
              </div>
              <div>
                <h2 className="card-title text-2xl">Hi, {user?.name || "User"}!</h2>
                <p className="text-base-content/70">Manage your photos below</p>
              </div>
            </div>
          </div>
        </div>

        <PhotoManager userId={user?.id} />
      </div>
    </div>
  )
}

