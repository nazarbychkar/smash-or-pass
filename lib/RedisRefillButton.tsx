"use client"

import { dbRedisFill } from "./db"

export default function RedisRefillButton(props: any) {
    return (
        <button type="button" onClick={() => dbRedisFill(props.userId)}>Refil Redis</button>
    )
}