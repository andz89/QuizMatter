import QuizPage from "../components/quizList/quizes";
import { logout } from "../app/auth/actions";
import { requireUser, createQuiz, getQuiz } from "../data-access/quiz";
export default async function Home() {
  const { user } = await requireUser();

  const quizzes = await getQuiz();

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Quizzes</h1>
          <p className="text-sm text-gray-500">
            Welcome, <span className="font-medium">{user.displayName}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Create Quiz */}
          <form action={createQuiz}>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition"
            >
              + Create Quiz
            </button>
          </form>

          {/* Logout */}
          <form>
            <button
              formAction={logout}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition"
            >
              Logout
            </button>
          </form>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <QuizPage quizzes={quizzes} />
      </div>
    </div>
  );
}
