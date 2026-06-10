import Quizes from "./UI/Quizes";
import { redirect } from "next/navigation";

import { getQuiz } from "../../data-access/quiz";

export default async function Home() {
  const quizzes = await getQuiz();

  return (
    <div className="min-h-screen ">
      <div className="w-full mx-auto p-2">
        {/* Quiz Content */}
        <div
          className="
            bg-white
            border border-slate-200
            rounded-2xl
            shadow-sm
            overflow-hidden
          "
        >
          {/* Content */}
          <div>
            <Quizes quizzesList={quizzes} />
          </div>
        </div>
      </div>
    </div>
  );
}
