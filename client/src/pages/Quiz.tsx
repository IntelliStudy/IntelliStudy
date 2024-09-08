import { Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { addDoc, collection } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../App";
import { SectionWrapper } from "../components";
import { QuestionType } from "../constants";
import { db } from "../firebase/firebase";
import { QuizFormValues, QuizValidationAnswers } from "../types/quiz";
import { createAttemptDocument } from "../Utilities/quizUtilities";

const Quiz = () => {
  const { currentUser } = useContext(UserContext);
  const { courseId } = useParams();
  const { quizId } = useParams();

  const temp = {
    quiz: {
      files: ["file1.pdf", "file2.pdf"],
      questions: {
        mcq: [
          {
            id: "mcq1",
            question: "Question mcq 1 here?",
            options: [
              { key: "A", value: "Option A here" },
              { key: "B", value: "Option B here" },
              { key: "C", value: "Option C here" },
              { key: "D", value: "Option D here" },
            ],
            answer: { key: "A", value: "Option A here" },
            type: "mcq",
            answerReference: {
              fileName: "File name here",
              pageNumber: "2",
            },
          },
          {
            id: "mcq2",
            question: "Question mcq 2 here?",
            options: [
              { key: "A", value: "Option A here" },
              { key: "B", value: "Option B here" },
              { key: "C", value: "Option C here" },
              { key: "D", value: "Option D here" },
            ],
            answer: { key: "A", value: "Option A here" },
            type: "mcq",
            answerReference: {
              fileName: "File name here",
              pageNumber: "2",
            },
          },
        ],
        s_ans: [
          {
            id: "s_ans1",
            question: "Question text here?",
            answer: "Sample answer here",
            type: "s_ans",
            answerReference: {
              fileName: "File name here",
              pageNumber: "5",
            },
          },
        ],
        l_ans: [
          {
            id: "l_ans1",
            question: "Question text here?",
            answer: "Sample answer here",
            type: "l_ans",
            answerReference: {
              fileName: "File name here",
              pageNumber: "10",
            },
          },
        ],
        tf: [
          {
            id: "tf1",
            question: "True or false here?",
            answer: { key: "A", value: "True" },
            type: "tf",
            answerReference: {
              fileName: "File name here",
              pageNumber: "3",
            },
          },
        ],
        fill_in_blank: [
          {
            id: "f_in_b1",
            question: "Question text *** here?",
            options: ["Option A", "Option B", "Option C", "Option D"],
            answer: "Option C",
            type: "fill_in_blank",
            answerReference: {
              fileName: "File name here",
              pageNumber: "1",
            },
          },
        ],
      },
    },
  };

  const quizForm = useForm<QuizFormValues>({
    initialValues: {
      mcq: {},
      tf: {},
      s_ans: {},
      l_ans: {},
      fill_in_blank: {},
    },
  });

  // Used to store answer validation results
  const [validationResults, setValidationResults] =
    useState<QuizValidationAnswers>({
      mcq: {},
      tf: {},
      s_ans: {},
      l_ans: {},
      fill_in_blank: {},
    });
  // Used to disable selections after submitting
  const [disabled, setDisabled] = useState(false);
  const [shouldCreateAttempt, setShouldCreateAttempt] = useState(false);

  // Handle answer change
  const handleAnswerChange = (
    sectionType: string,
    questionId: string,
    answer: string
  ) => {
    quizForm.setFieldValue(`${sectionType}.${questionId}`, answer);
  };

  const handleQuizSubmit = async (event) => {
    event.preventDefault();

    // VALIDATION
    const results: QuizValidationAnswers = {
      mcq: {},
      tf: {},
      s_ans: {},
      l_ans: {},
      fill_in_blank: {},
    };

    // Validate MCQ answers
    temp.quiz.questions.mcq.forEach((question) => {
      const userAnswer = quizForm.values.mcq[question.id];
      results.mcq[question.id] = userAnswer === question.answer.key;
    });

    // Validate TF answers
    temp.quiz.questions.tf.forEach((question) => {
      const userAnswer = quizForm.values.tf[question.id];
      results.tf[question.id] = userAnswer === question.answer.key;
    });

    // Validate Fill in the Blank
    temp.quiz.questions.fill_in_blank.forEach((question) => {
      const userAnswer = quizForm.values.fill_in_blank[question.id];
      results.fill_in_blank[question.id] = userAnswer === question.answer;
    });

    // Disbale selection
    setDisabled(true);

    // Set Validation results to state
    setValidationResults(results);

    // Setting flag to indicate that an attempt should be created
    setShouldCreateAttempt(true);
  };

  useEffect(() => {
    if (shouldCreateAttempt) {
      // Create attempt under users/{userId}/courses/{courseId}/quizzes/{quizId}/attempts
      createAttemptDocument(
        currentUser!.uid,
        courseId!,
        quizId!,
        temp.quiz,
        quizForm.values,
        validationResults
      );
      // Reset the trigger after the attempt has been created
      setShouldCreateAttempt(false);
    }
  }, [shouldCreateAttempt, validationResults, disabled]);

  // REMOVE
  useEffect(() => {
    console.log(quizForm.values);
    console.log(validationResults);
  }, [validationResults]);

  return (
    <>
      <form onSubmit={handleQuizSubmit}>
        {/* MCQ */}
        <SectionWrapper
          sectionType={"mcq"}
          sectionLabel={QuestionType.mcq}
          questions={temp.quiz.questions.mcq}
          onAnswerChange={handleAnswerChange}
          validationResults={validationResults}
          disabled={disabled}
        />

        {/* TF */}
        <SectionWrapper
          sectionType={"tf"}
          sectionLabel={QuestionType.tf}
          questions={temp.quiz.questions.tf}
          onAnswerChange={handleAnswerChange}
          validationResults={validationResults}
          disabled={disabled}
        />

        {/* SHORT ANS */}
        <SectionWrapper
          sectionType={"s_ans"}
          sectionLabel={QuestionType.s_ans}
          questions={temp.quiz.questions.s_ans}
          onAnswerChange={handleAnswerChange}
          validationResults={validationResults}
          disabled={disabled}
        />

        {/* LONG ANS */}
        <SectionWrapper
          sectionType={"l_ans"}
          sectionLabel={QuestionType.l_ans}
          questions={temp.quiz.questions.l_ans}
          onAnswerChange={handleAnswerChange}
          validationResults={validationResults}
          disabled={disabled}
        />

        {/* FILL IN BLANK */}
        <SectionWrapper
          sectionType={"fill_in_blank"}
          sectionLabel={QuestionType.fill_in_blank}
          questions={temp.quiz.questions.fill_in_blank}
          onAnswerChange={handleAnswerChange}
          validationResults={validationResults}
          disabled={disabled}
        />

        <Button type="submit" w={"90px"} ml="115px" mb="70px">
          Submit
        </Button>
      </form>
    </>
  );
};

export default Quiz;
