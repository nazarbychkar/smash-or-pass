"use client";

import { dbRedisFill } from "./db";

interface RedisRefillButtonProps {
  userId: number;
}

export default function RedisRefillButton(props: RedisRefillButtonProps) {
  return (
    <button
      type="button"
      onClick={() => {
        dbRedisFill(props.userId);
        window.location.reload();
      }}
    >
      Refill Redis
    </button>
  );
}
