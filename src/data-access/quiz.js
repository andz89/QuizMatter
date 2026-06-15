// homeActions
"use server";
import { revalidatePath } from "next/cache";
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
      id: user?.id,
      email: user?.email,
      displayName: user?.user_metadata?.displayName || user?.email,
    },
  };
}

//homepage
export async function createQuizDetails(formData) {
  const { supabase, user } = await requireUser();

  const payload = {
    title: formData.get("title"),
    grade: formData.get("grade"),
    subject: formData.get("subject"),
    quarter: formData.get("quarter"),
    objectives: formData.get("objectives"),
    user_id: user.id,
  };
  console.log(payload);
  const { data, error } = await supabase
    .from("quizzes")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Failed to create quiz");
  }

  redirect(`/edit/${data.id}`);
}
//homepage
export async function updateQuizDetails(formData) {
  const { supabase, user } = await requireUser();

  const id = formData.get("id");

  const payload = {
    title: formData.get("title"),
    grade: formData.get("grade"),
    subject: formData.get("subject"),
    quarter: formData.get("quarter"),
    objectives: formData.get("objectives"),
  };

  const { data, error } = await supabase
    .from("quizzes")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
//homepage
export async function deleteQuiz(id) {
  const { supabase, user } = await requireUser();

  const { error } = await supabase
    .from("quizzes")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
}
//homepage
export async function getQuiz() {
  const { supabase, user } = await requireUser();

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
    .eq("user_id", user.id); // 🔥 filter by user

  if (error) {
    console.error("Get quiz error:", error);
    return [];
  }

  return data;
}

//edit page
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
    .order("order", { referencedTable: "questions" })
    .eq("id", id)
    .single();

  if (error) {
    console.error("Get quiz error:", error);
    return null;
  }

  return data;
}
