"use client";

import { useActionState } from "react";
import singUp from "@/lib/registration";
import { error } from "console";

const Registration = () => {
  const [state, action, pending] = useActionState(singUp, undefined);

  // TODO: Email/username duplicate checking
  return (
    <main>
      <form action={action}> 
        <label htmlFor="name">Name:</label>
        <input type="text" name="name" id="name" required />
        {state?.errors?.name && <p>{state.errors.name}</p>}

        <label htmlFor="email">Email:</label>
        <input type="email" name="email" id="email" required />
        {state?.errors?.email && <p>{state.errors.email}</p>}

        <label htmlFor="password">Password:</label>
        <input type="password" name="password" id="password" required />
        {state?.errors?.password && (
          <div>
            <p>Password must:</p>
            <ul>
              {state.errors.password.map((error) => (
                <li key={error}>- {error}</li>)
              )}
            </ul>
          </div>)}

        <input type="submit" value="Sign up" />
      </form>
    </main>
  );
};

export default Registration;
