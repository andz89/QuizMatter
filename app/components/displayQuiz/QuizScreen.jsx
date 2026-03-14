"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";

export default function QuizScreen({ questions, onFinish }) {
  const { handleSubmit, setValue, watch, trigger } = useForm();
  const [current, setCurrent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  const BASE_WIDTH = 620;
  const BASE_HEIGHT = 500;

  const [scale, setScale] = useState(0.9);

  const q = questions[current];
  const selected = watch(`q_${q.id}`);
  const isLast = current === questions.length - 1;

  const progress = Math.round(((current + 1) / questions.length) * 100);

  const selectOption = (value) => {
    setValue(`q_${q.id}`, value, { shouldValidate: true });
  };

  const nextQuestion = async () => {
    const valid = await trigger(`q_${q.id}`);
    if (!valid) return;
    setCurrent((prev) => prev + 1);
  };

  const submitQuiz = (data) => {
    onFinish(data);
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen();
      setIsFullscreen(true);
      setScale(1.5);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
      setScale(0.9);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: `${BASE_WIDTH * scale}px`,
        padding: `${4 * scale}px`,
      }}
      className="max-h-screen overflow-auto mx-auto bg-white"
    >
      <div className="flex items-center justify-center w-full h-full">
        <div style={{ width: `${BASE_WIDTH * scale}px` }} className="bg-white">
          <button
            onClick={toggleFullscreen}
            className="text-xs border border-gray-300 rounded px-3 py-1 w-[100px] hover:bg-gray-100"
          >
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </button>

          <form onSubmit={handleSubmit(submitQuiz)}>
            <div className="flex flex-col gap-4">
              <div>
                <p
                  style={{
                    fontSize: `${24 * scale}px`,
                    marginBottom: `${24 * scale}px`,
                  }}
                  className="font-semibold"
                >
                  {q.question}
                </p>

                <div className="flex flex-col gap-4 w-full">
                  {q.options.map((opt) => {
                    const isSelected = selected === opt.value;

                    return (
                      <div
                        key={opt.id}
                        onClick={() => selectOption(opt.value)}
                        style={{
                          padding: `${10 * scale}px`,
                          borderRadius: `${8 * scale}px`,
                          fontSize: `${21 * scale}px`,
                        }}
                        className={`w-full border-2 cursor-pointer transition 
                        ${
                          isSelected
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 bg-red-50 hover:border-blue-400"
                        }`}
                      >
                        <span className="font-medium">{opt.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {!isLast && (
                <button
                  type="button"
                  onClick={nextQuestion}
                  style={{
                    fontSize: `${16 * scale}px`,
                    height: `${48 * scale}px`,
                  }}
                  className="mt-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Next
                </button>
              )}

              {isLast && (
                <button
                  type="submit"
                  className="mt-2 bg-green-600 text-white rounded px-4 py-3 hover:bg-green-700 transition"
                >
                  Submit Quiz
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
