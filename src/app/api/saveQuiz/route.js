import { NextResponse } from "next/server";
import { requireUser } from "../../../data-access/quiz";

export async function POST(req) {
  try {
    const { supabase, user } = await requireUser();

    const body = await req.json();
    const {
      questions = [],
      options = [],
      details,
      deletedQuestions = [],
      deletedOptions = [],
    } = body;

    if (!Array.isArray(questions) || !Array.isArray(options)) {
      throw new Error("Invalid payload");
    }
    const questionsWithUser = questions.map(({ isNew, ...q }) => ({
      ...q,
      isNew,
      user_id: user.id,
    }));

    const optionsWithUser = options.map(({ isNew, ...o }) => ({
      ...o,
      isNew,
      user_id: user.id,
    }));
    console.log("Received payload:", {
      options: optionsWithUser,
    });
    // Save only changed question columns. New rows are inserted, existing rows
    // are patched so omitted columns keep their current database values.
    for (const question of questionsWithUser) {
      const { question_id, isNew, ...values } = question;

      if (!question_id) {
        throw new Error("Missing question_id");
      }

      if (isNew) {
        const { error } = await supabase.from("questions").insert({
          question_id,
          ...values,
        });
        if (error) throw error;
        continue;
      }

      const { data, error } = await supabase
        .from("questions")
        .update(values)
        .eq("question_id", question_id)
        .eq("user_id", user.id)
        .select("question_id");

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error(`Question update failed: ${question_id} not found`);
      }
    }

    // Save only changed option columns.
    for (const option of optionsWithUser) {
      const { option_id, isNew, ...values } = option;

      if (!option_id) {
        throw new Error("Missing option_id");
      }

      if (isNew) {
        const { error } = await supabase.from("options").insert({
          option_id,
          ...values,
        });
        if (error) throw error;
        continue;
      }

      const { data, error } = await supabase
        .from("options")
        .update(values)
        .eq("option_id", option_id)
        .eq("user_id", user.id)
        .select("option_id");

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error(`Option update failed: ${option_id} not found`);
      }
    }

    // Delete removed questions
    if (deletedQuestions.length) {
      const { error: dError } = await supabase
        .from("questions")
        .delete()
        .in("question_id", deletedQuestions)
        .eq("user_id", user.id);
      console.log(deletedQuestions, "questions deleted");
      if (dError) throw dError;
    }
    // Delete removed options
    if (deletedOptions.length) {
      const { error: dError } = await supabase
        .from("options")
        .delete()
        .in("option_id", deletedOptions)
        .eq("user_id", user.id);
      console.log(deletedOptions, "options deleted");
      if (dError) throw dError;
    }
    if (details && typeof details === "object") {
      if (!details.id) throw new Error("Missing details.id");
      console.log("Updating quiz details:", details.id);
      const { data, error: dError } = await supabase
        .from("quizzes")
        .update({
          ...details,
          user_id: user.id,
        })
        .eq("id", details.id) // ✅ keep as string
        .eq("user_id", user.id)
        .select();

      console.log("Update result:", data);

      if (dError) throw dError;

      if (!data || data.length === 0) {
        throw new Error("Update failed: no matching row");
      }
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    const status = err.message === "Unauthorized" ? 401 : 500;

    return NextResponse.json(
      { success: false, error: err.message },
      { status },
    );
  }
}
