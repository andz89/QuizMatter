const isQuestion = (type) => ["multiple", "short"].includes(type);

function addQuestionNumbers(items) {
  let questionNumber = 0;

  return items?.map((item) => {
    if (isQuestion(item.type)) {
      questionNumber++;

      return {
        ...item,
        questionNumber,
      };
    }

    return item;
  });
}

export default addQuestionNumbers;
