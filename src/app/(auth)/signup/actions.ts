"use server";

import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { SignUpSchema, SignUpValues } from "@/lib/validation";
import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { isRedirectError } from "next/dist/client/components/redirect";

// our route is this way because of more good project structure

export const SignUp = async (
  credentials: SignUpValues, // so this for confiming we get the correct values
): Promise<{ error: string }> => {
  try {
    const { username, email, password } = SignUpSchema.parse(credentials); // assuring the types of the values aswell for frontend validation

    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    const userId = generateIdFromEntropySize(10);

    const existingUsername = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (existingUsername) {
      return {
        error: "Username already exist",
      };
    }

    const existingEmail = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    if (existingEmail) {
      return {
        error: "Email already taken",
      };
    }

    await prisma.user.create({
      data: {
        id: userId,
        username,
        displayName: username,
        email,
        passwordHash,
      },
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );


    return redirect("/")


  } catch (error) {
    if (isRedirectError(error)) {
        throw error
    }   
    console.error(error);
    return {
      error: "Something went wrong. please try again later",
    };
  }
};
