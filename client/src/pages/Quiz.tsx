import { Button, Center } from "@mantine/core";
import { useForm } from "@mantine/form";
import { collection, getDocs } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../App";
import { SectionWrapper } from "../components";
import { QuestionLabel, QuestionType } from "../constants";
import { db } from "../firebase/firebase";
import { QuizFormValues, QuizValidationAnswers } from "../types/quiz";
import { createAttemptDocument } from "../Utilities/quizUtilities";

const Quiz = () => {
  const { currentUser } = useContext(UserContext);
  const { courseId } = useParams();
  const { quizId } = useParams();

  const [quizQuestions, setQuizQuestions] = useState<any>();

  useEffect(() => {
    const fetchQuiz = async () => {
      const questionsCollectionRef = collection(
        db,
        `users/${currentUser?.uid}/courses/${courseId}/quizzes/${quizId}/questions`
      );
      const allQuestionsQuery = await getDocs(questionsCollectionRef);
      const allQuestions = allQuestionsQuery.docs.map((doc) => doc.data());
      console.log("all questions", allQuestions);
      setQuizQuestions(allQuestions);
    };
    fetchQuiz();
  }, []);

  console.log(quizQuestions, "questions");

  const quiz = {
    quiz: {
      files: ["file1.pdf", "file2.pdf"],
      questions: {
        mcq: quizQuestions
          ? quizQuestions.filter((question: any) => question.type === "mcq")
          : [],
        s_ans: quizQuestions
          ? quizQuestions.filter((question: any) => question.type === "s_ans")
          : [],
        l_ans: quizQuestions
          ? quizQuestions.filter((question: any) => question.type === "l_ans")
          : [],
        tf: quizQuestions
          ? quizQuestions.filter((question: any) => question.type === "tf")
          : [],
        fill_in_blank: quizQuestions
          ? quizQuestions.filter(
              (question: any) => question.type === "fill_in_blank"
            )
          : [],
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

  const handleQuizSubmit = async (event: { preventDefault: () => void }) => {
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
    quiz.quiz.questions.mcq.forEach((question: any) => {
      const userAnswer = quizForm.values.mcq[question.id];
      results.mcq[question.id] = userAnswer === question.answer.key;
    });

    // Validate TF answers
    quiz.quiz.questions.tf.forEach((question: any) => {
      const userAnswer = quizForm.values.tf[question.id];
      results.tf[question.id] = userAnswer === question.answer.key;
    });

    // Validate Fill in the Blank
    quiz.quiz.questions.fill_in_blank.forEach((question: any) => {
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
        quiz.quiz,
        quizForm.values,
        validationResults
      );
      // Reset the trigger after the attempt has been created
      setShouldCreateAttempt(false);
    }
  }, [shouldCreateAttempt, validationResults, disabled]);

  // REMOVE
  // useEffect(() => {
  //   console.log(quizForm.values);
  //   console.log(validationResults);
  // }, [validationResults]);

  return (
    <>
      <form onSubmit={handleQuizSubmit}>
        {/* MCQ */}
        {quiz.quiz.questions.mcq.length > 0 && (
          <SectionWrapper
            sectionType={QuestionType.mcq}
            sectionLabel={QuestionLabel.mcq}
            questions={quiz.quiz.questions.mcq}
            onAnswerChange={handleAnswerChange}
            validationResults={validationResults}
            disabled={disabled}
          />
        )}

        {/* TF */}
        {quiz.quiz.questions.tf.length > 0 && (
          <SectionWrapper
            sectionType={QuestionType.tf}
            sectionLabel={QuestionLabel.tf}
            questions={quiz.quiz.questions.tf}
            onAnswerChange={handleAnswerChange}
            validationResults={validationResults}
            disabled={disabled}
          />
        )}

        {/* SHORT ANS */}

        {quiz.quiz.questions.s_ans.length > 0 && (
          <SectionWrapper
            sectionType={QuestionType.s_ans}
            sectionLabel={QuestionLabel.s_ans}
            questions={quiz.quiz.questions.s_ans}
            onAnswerChange={handleAnswerChange}
            validationResults={validationResults}
            disabled={disabled}
          />
        )}

        {/* LONG ANS */}
        {quiz.quiz.questions.l_ans.length > 0 && (
          <SectionWrapper
            sectionType={QuestionType.l_ans}
            sectionLabel={QuestionLabel.l_ans}
            questions={quiz.quiz.questions.l_ans}
            onAnswerChange={handleAnswerChange}
            validationResults={validationResults}
            disabled={disabled}
          />
        )}

        {/* FILL IN BLANK */}

        {quiz.quiz.questions.fill_in_blank.length > 0 && (
          <SectionWrapper
            sectionType={QuestionType.fill_in_blank}
            sectionLabel={QuestionLabel.fill_in_blank}
            questions={quiz.quiz.questions.fill_in_blank}
            onAnswerChange={handleAnswerChange}
            validationResults={validationResults}
            disabled={disabled}
          />
        )}

        <Button type="submit" w={"90px"} ml="115px" mb="70px">
          Submit
        </Button>
      </form>
    </>
  );
};

export default Quiz;
