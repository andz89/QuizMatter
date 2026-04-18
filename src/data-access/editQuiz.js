import { createClient } from "../app/utils/supabase/server";
import { redirect } from "next/navigation";

export async function requireUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const userInfo = {
    id: user.id,
    email: user.email,
    name:
      user.user_metadata?.full_name || user.user_metadata?.name || user.email,
    avatar: user.user_metadata?.avatar_url || null,
  };

  return { supabase, user: userInfo };
}
export const saveDetails = async (details) => {
  const { supabase, user } = await requireUser();
  if (!details?.isDirty) return;

  const fields = Object.keys(details.dirtyFields || {});
  if (fields.length === 0) return;

  const payload = fields.reduce((acc, key) => {
    acc[key] = details[key];
    return acc;
  }, {});

  payload.id = details.id; // must exist for upsert

  const { error } = await supabase
    .from("quiz")
    .upsert(payload, { onConflict: "id" });

  if (error) throw error;
};
export const saveQuestions = async (questions) => {
  const { supabase, user } = await requireUser();
  const dirty = questions.filter((q) => q.isDirty);
  if (dirty.length === 0) return;

  const payload = dirty.map((q) => ({
    id: q.id,
    quiz_id: q.quiz_id,
    question: q.question,
    order: q.order,
  }));

  const { error } = await supabase
    .from("questions")
    .upsert(payload, { onConflict: "id" });

  if (error) throw error;
};
export const saveOptions = async (options) => {
  const { supabase, user } = await requireUser();
  const dirty = options.filter((o) => o.isDirty);
  if (dirty.length === 0) return;

  const payload = dirty.map((o) => ({
    id: o.id,
    question_id: o.question_id,
    text: o.text,
    is_correct: o.is_correct,
  }));

  const { error } = await supabase
    .from("options")
    .upsert(payload, { onConflict: "id" });

  if (error) throw error;
};
