"use server";

import { z } from "zod";
import bcrypt from "bcrypt";
import dbConnect from "./db";
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

type FormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export default async function singUp(
  state: FormState,
  formData: FormData
): Promise<FormState | undefined> {
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { name, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = await dbConnect();

  const data = await sql`
    INSERT INTO "user" (name, email, password) 
    VALUES (${name}, ${email}, ${hashedPassword})
    RETURNING id
  `;

  const user = data[0];

  if (!user) {
    return { message: "there is some troubles with creating this user." };
  }

  await createSession(user.id);

  redirect("/profile");
}

export async function logout() {
  deleteSession()
  redirect('/login')
}