"use client";

import { useActionState } from "react";
import { login } from "@/lib/registration";
import { error } from "console";

const Login = () => {
  const [state, action, pending] = useActionState(login, undefined);

  // TODO: Email/username duplicate checking
  return (
    <main>
      <form action={action}> 
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

export default Login;
