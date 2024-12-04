"use server";

import { createUser, getUser } from "../db";
import { signIn } from "./auth";

export interface LoginActionState {
  status: "idle" | "in_progress" | "success" | "failed";
}

export async function login(
  data: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  try {
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      return { status: "failed" };
    }

    const result = await signIn("credentials", {
      email: email.toString(),
      password: password.toString(),
      redirect: false,
    });

    // NextAuth palauttaa error-kentän jos kirjautuminen epäonnistuu
    if (result?.error) {
      console.log("Login failed:", result.error);
      return { status: "failed" };
    }

    // Jos error-kenttää ei ole, kirjautuminen onnistui
    return { status: "success" };
  } catch (error) {
    console.error("Login error:", error);
    return { status: "failed" };
  }
}

export interface RegisterActionState {
  status: "idle" | "in_progress" | "success" | "failed" | "user_exists";
}

export async function register(
  data: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> {
  try {
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
      return { status: "failed" };
    }

    // Tarkista onko käyttäjä olemassa
    const user = await getUser(email);
    if (user.length > 0) {
      return { status: "user_exists" };
    }

    // Luo uusi käyttäjä ja salaa salasana
    await createUser(email, password);

    // Kirjaudu sisään
    try {
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      return { status: "success" };
    } catch (signInError) {
      console.error("Auto-login failed:", signInError);
      return { status: "success" }; // Käyttäjä luotu, mutta automaattinen kirjautuminen epäonnistui
    }
  } catch (error) {
    console.error("Registration error:", error);
    return { status: "failed" };
  }
}
