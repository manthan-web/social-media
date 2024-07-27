"use server";

import { isRedirectError } from "next/dist/client/components/redirect";
import { LoginSchema, LoginValues } from "@/lib/validation";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { verify } from "@node-rs/argon2";
import { lucia } from "@/auth";
import { cookies } from "next/headers";

export async function Login(
  credentials: LoginValues,
): Promise<{ error: string }> {
  try {
    const { username, password } = LoginSchema.parse(credentials); // assuring the types of the values aswell for frontend validation

    const existingUser = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (!existingUser || !existingUser.passwordHash) {
      return {
        error: "Incorrect username or password",
      };
    }

    // if user does not exist throw error
    // else decode the password or verify the pass

    const validPassword = await verify(existingUser.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    if (!validPassword) {
      return {
        error: "Incorrect username or password",
      };
    }


    // if pass correct or verified make a session and redirect to home page
    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );



    return redirect("/")

  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error(error);
    return {
      error: "Something went wrong. please try again later",
    };
  }
}
