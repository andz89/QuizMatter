// homeActions
"use server";
import { createClient } from "../app/utils/supabase/server";

import { redirect } from "next/navigation";
export async function requireUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  if (error || !user) {
    throw new Error("Unauthorized");
  }

  return {
    supabase,
    user: {
      id: user.id,
      email: user.email,
      displayName: user.user_metadata?.displayName || user.email,
    },
  };
}

export async function createQuiz() {
  const { supabase, user } = await requireUser();

  const { data, error } = await supabase
    .from("quizzes")
    .insert([
      {
        title: "Untitled Quiz",
        grade: "grade 1",
        owner_id: user.id, // 🔥 important for ownership
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Create quiz error:", error);
    return;
  }

  redirect(`/edit/${data.id}`);
}

export async function getQuiz() {
  const { supabase, user } = await requireUser();

  const { data, error } = await supabase
    .from("quizzes")
    .select("*")
    .eq("owner_id", user.id) // 🔥 filter by user
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Get quiz error:", error);
    return [];
  }

  return data;
}

export async function getQuizById(id) {
  if (!id) {
    console.error("Quiz ID is missing");
    return null;
  }

  const { supabase } = await requireUser();

  const { data, error } = await supabase
    .from("quizzes")
    .select(
      `
      *,
      questions (
        *,
        options (*)
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Get quiz error:", error);
    return null;
  }

  return data;
}
