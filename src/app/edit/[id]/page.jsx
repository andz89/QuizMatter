import React from "react";

import QuizEditor from "@/src/app/edit/UI/components/QuizEditor";

import { getQuizById } from "../../../data-access/quiz";
export default async function Page({ params }) {
  const { id } = await params;

  const quiz = await getQuizById(id);

  return (
    <div className={"bg-orange-50 pb-10"}>
      <QuizEditor quiz={quiz} />
    </div>
  );
}
