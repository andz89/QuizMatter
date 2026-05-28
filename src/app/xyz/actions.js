"use server";

import { createClient } from "../utils/supabase/server";
import { redirect } from "next/navigation";

export async function login(prevState, formData) {
  const supabase = await createClient();

  const email = formData.get("email");
  const password = formData.get("password");

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/");
}
