import React from "react";

import QuestionBuilder from "@/src/app/edit/UI/QuestionBuilder";

import { getQuizById } from "../../../data-access/quiz";
export default async function Page({ params }) {
  const { id } = await params;

  const quiz = await getQuizById(id);

  return (
    <div>
      <QuestionBuilder quiz={quiz} />
    </div>
  );
}
