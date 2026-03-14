"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { BiDuplicate, BiPlus, BiSolidTrash } from "react-icons/bi";
export default function QuestionBuilder() {
  const { register, control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      questions: [
        {
          id: 1,
          question: "",
          layout: "col", // new field
          options: [
            { id: 1, label: "option 1", value: "A" },
            { id: 2, label: "option 2", value: "B" },
            { id: 3, label: "option 3", value: "C" },
            { id: 4, label: "option 4", value: "D" },
          ],
          correct: "",
        },
      ],
    },
  });

  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: "questions",
  });
  const onSubmit = (data) => {
    console.log(data);
  };
  const duplicateQuestion = (index) => {
    const question = watch(`questions.${index}`);

    insert(index + 1, {
      ...question,
      id: Date.now(), // new unique id
      options: question.options.map((opt) => ({
        ...opt,
        id: Math.random(),
      })),
    });
  };
  return (
    <div className="bg-white  min-h-screen  ">
      <div className="max-w-[720px] mx-auto   ">
        <div className="fixed bottom-4 right-4">
          <button
            type="submit"
            className="bg-blue-600 text-white text-lg px-6 py-3 rounded hover:bg-blue-700"
          >
            Save Quiz
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col ">
            {fields.map((field, index) => {
              const layout = watch(`questions.${index}.layout`);
              return (
                <div key={field.id} className=" p-6  border border-gray-200  ">
                  <div className="flex flex-col gap-4">
                    <div className="bg-gray-50 border border-gray-300  p-1 flex">
                      {" "}
                      <span className="font-bold text-gray-600">
                        {index + 1}.
                      </span>
                      <div
                        contentEditable
                        className="  w-full min-h-[40px] focus:outline-none"
                        onInput={(e) =>
                          setValue(
                            `questions.${index}.question`,
                            e.currentTarget.textContent
                          )
                        }
                      ></div>
                    </div>
                    <div className="flex gap-2 text-sm">
                      <span>Options layout:</span>

                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          value="col"
                          {...register(`questions.${index}.layout`)}
                        />
                        Column
                      </label>

                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          value="row"
                          {...register(`questions.${index}.layout`)}
                        />
                        Row
                      </label>
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          value="grid"
                          {...register(`questions.${index}.layout`)}
                        />
                        Grid
                      </label>
                    </div>

                    <div
                      className={`gap-2 ${
                        layout === "row"
                          ? "flex flex-row flex-wrap justify-around"
                          : layout === "grid"
                          ? "grid grid-cols-2"
                          : "flex flex-col"
                      }`}
                    >
                      {field.options.map((opt, optIndex) => (
                        <div
                          key={opt.id}
                          className="flex flex-row items-start   gap-1 "
                        >
                          <label className="flex items-start mt-[11px] gap-1 ">
                            <input
                              type="radio"
                              value={opt.id}
                              {...register(`questions.${index}.correct`)}
                            />
                          </label>
                          <span className="w-[20px] font-bold mt-[6px]">
                            {opt.value}.
                          </span>

                          <div
                            contentEditable
                            suppressContentEditableWarning
                            className="focus:outline-none bg-gray-50 border border-gray-300 rounded p-1 w-full min-h-[30px]"
                            onInput={(e) =>
                              setValue(
                                `questions.${index}.options.${optIndex}.label`,
                                e.currentTarget.textContent
                              )
                            }
                          >
                            {" "}
                            {opt.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-3 mt-5 w-full">
                    <button
                      type="button"
                      onClick={() =>
                        insert(index + 1, {
                          id: Date.now(),
                          layout: "col",
                          question: "",
                          options: [
                            { id: 1, label: "option 1", value: "A" },
                            { id: 2, label: "option 2", value: "B" },
                            { id: 3, label: "option 3", value: "C" },
                            { id: 4, label: "option 4", value: "D" },
                          ],
                          correct: "",
                        })
                      }
                      className="flex cursor-pointer items-center justify-center w-9 h-9 rounded-md border border-slate-300 hover:bg-slate-100 hover:border-slate-400 transition"
                    >
                      <BiPlus size={18} className="text-slate-700" />
                    </button>

                    <button
                      type="button"
                      onClick={() => duplicateQuestion(index)}
                      className="flex cursor-pointer items-center justify-center w-9 h-9 rounded-md border border-slate-300 hover:bg-blue-50 hover:border-blue-400 transition"
                    >
                      <BiDuplicate
                        size={18}
                        className="text-slate-700 hover:text-blue-600"
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="flex cursor-pointer items-center justify-center w-9 h-9 rounded-md border border-slate-300 hover:bg-red-50 hover:border-red-400 transition"
                    >
                      <BiSolidTrash
                        size={18}
                        className="text-slate-700 hover:text-red-600"
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </form>
      </div>
    </div>
  );
}
