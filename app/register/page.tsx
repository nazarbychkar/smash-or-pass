"use client"

import { useActionState } from "react"
import singUp from "@/lib/registration"
import Link from "next/link"
import { useState } from "react"

const Registration = () => {
  const [state, action, pending] = useActionState(singUp, undefined)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary">Create Account</h1>
          <p className="text-base-content/70 mt-2">Join Smash or Pass today</p>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <form action={action} className="space-y-6">
              <div className="form-control">
                <label className="label" htmlFor="name">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Your name"
                  className={`input input-bordered w-full ${state?.errors?.name ? "input-error" : ""}`}
                  required
                />
                {state?.errors?.name && (
                  <label className="label">
                    <span className="label-text-alt text-error">{state.errors.name}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label" htmlFor="email">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="your.email@example.com"
                  className={`input input-bordered w-full ${state?.errors?.email ? "input-error" : ""}`}
                  required
                />
                {state?.errors?.email && (
                  <label className="label">
                    <span className="label-text-alt text-error">{state.errors.email}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label" htmlFor="password">
                  <span className="label-text">Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className={`input input-bordered w-full pr-10 ${state?.errors?.password ? "input-error" : ""}`}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/50 hover:text-base-content"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>

                {state?.errors?.password && (
                  <div className="mt-2 p-3 bg-error/10 rounded-lg border border-error/20">
                    <p className="font-medium text-error text-sm mb-1">Password must:</p>
                    <ul className="text-sm text-error space-y-1 pl-5 list-disc">
                      {state.errors.password.map((error) => (
                        <li key={error}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="form-control mt-6">
                <button type="submit" className={`btn btn-primary ${pending ? "loading" : ""}`} disabled={pending}>
                  {pending ? "Creating Account..." : "Sign Up"}
                </button>
              </div>

              {state?.message && (
                <div className={`alert ${state ? "alert-success" : "alert-error"} shadow-lg`}>
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current flex-shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      {state ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      )}
                    </svg>
                    <span>{state.message}</span>
                  </div>
                </div>
              )}
            </form>

            <div className="divider mt-6">OR</div>

            <div className="text-center">
              <p className="text-base-content/70">Already have an account?</p>
              <Link href="/login" className="btn btn-outline btn-sm mt-2">
                Login
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="link link-hover text-sm text-base-content/70">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Registration

