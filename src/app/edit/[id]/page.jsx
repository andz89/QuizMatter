import React from "react";

import QuestionBuilder from "@/src/app/edit/UI/components/QuestionBuilder";

import { getQuizById } from "../../../data-access/quiz";
export default async function Page({ params }) {
  const { id } = await params;

  const quiz = await getQuizById(id);

  return (
    <div className={"bg-orange-50 pb-10"}>
      <QuestionBuilder quiz={quiz} />
    </div>
  );
}
