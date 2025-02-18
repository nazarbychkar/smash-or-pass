"use client"

import { logout } from "./registration";

export default function LogoutButton() {
    return (
        <button onClick={() => logout()}>Logout</button>
    )
}