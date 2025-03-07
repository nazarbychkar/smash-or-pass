"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import dbConnect, { dbCreateUser, dbGetUserByEmail, dbRedisIsRefilmentNeeded } from "./db";
import { createSession, deleteSession } from "./session";
import { redirect } from "next/navigation";

const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .trim(),
  email: z.string().email().trim(),
  password: z
    .string()
    .min(8)
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
});

const LoginFormSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().trim(),
});

type RegistrationFormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

type LoginFormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export default async function singUp(
  state: RegistrationFormState,
  formData: FormData
): Promise<RegistrationFormState | undefined> {
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { name, email, password } = validatedFields.data;
  
  const user = await dbCreateUser(name, email, password);

  if (!user) {
    return { message: "there is some troubles with creating this user." };
  }

  await createSession(user.id);

// TODO: maybe find a better spot for redis photo refilment
  dbRedisIsRefilmentNeeded(user.id);
  
  redirect("/profile");
}

export async function logout() {
  deleteSession();
  redirect("/");
}

export async function login(
  state: LoginFormState,
  formData: FormData
): Promise<LoginFormState | undefined> {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { email, password } = validatedFields.data;
  const user = await dbGetUserByEmail(email);

  if (!user || email !== user.email) {
    return { errors: { email: ["email or password is incorrect."] } };
  }

  const passwordCheck = await bcrypt.compare(password, user.password);
  if (!passwordCheck) {
    return { errors: { email: ["email or password is incorrect."] } };
  }

  await createSession(user.id);
  
// TODO: maybe find a better spot for redis photo refilment
  dbRedisIsRefilmentNeeded(user.id);

  redirect("/profile");
}
