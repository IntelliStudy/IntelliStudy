import { Text, Container, Title } from "@mantine/core";
import {
  FillInBlankQuestionType,
  LongAnswerQuestionType,
  MultChoiceQuestionType,
  QuizValidationAnswers,
  ShortAnswerQuestionType,
  TrueFalseQuestionType,
} from "../../types/quiz";
import FillInBlankQuestion from "./FillInBlankQuestion";
import MultipleChoiceQuestion from "./MultipleChoiceQuestion";
import TypedAnswerQuestion from "./TypedAnswerQuestion";

interface props {
  sectionType: string;
  sectionLabel: string;
  questions:
    | MultChoiceQuestionType[]
    | ShortAnswerQuestionType[]
    | LongAnswerQuestionType[]
    | TrueFalseQuestionType[]
    | FillInBlankQuestionType[];
  onAnswerChange: (
    sectionType: string,
    questionId: string,
    answer: string
  ) => void;
  validationResults: QuizValidationAnswers;
  disabled: boolean;
  isSubmitted: boolean;
  userAnswer: { [key: string]: string };
  attemptData: {
    correctAnswer: string;
    pointsScored: number;
    question: string;
    questionId: string;
    userAnswer: string;
  }[];
}

const SectionWrapper = ({
  sectionType,
  sectionLabel,
  questions,
  onAnswerChange,
  validationResults,
  disabled,
  isSubmitted,
  userAnswer,
  attemptData,
}: props) => {
  // True or false options
  const trueFalseOptions = {
    options: [
      { key: "A", value: "True" },
      { key: "B", value: "False" },
    ],
  };

  const renderQuestions = () => {
    switch (sectionType) {
      case "mcq":
        return questions.map((q, index) => (
          <MultipleChoiceQuestion
            key={index}
            question={q.question}
            questionId={q.id}
            options={q.options}
            answerReference={q.answerReference}
            correctAnswer={q.answer}
            sectionType={sectionType}
            onAnswerChange={onAnswerChange}
            isCorrect={validationResults.mcq[q.id]}
            disabled={disabled}
            isSubmitted={isSubmitted}
            userAnswer={userAnswer[q.id]}
            // Fallback to null if attemptData is undefined
            attemptData={
              isSubmitted
                ? attemptData?.find((item) => item.questionId === q.id)
                : null
            }
          />
        ));

      case "tf":
        return questions.map((q, index) => (
          <MultipleChoiceQuestion
            key={index}
            question={q.question}
            questionId={q.id}
            options={trueFalseOptions.options}
            answerReference={q.answerReference}
            correctAnswer={q.answer}
            sectionType={sectionType}
            onAnswerChange={onAnswerChange}
            isCorrect={validationResults.tf[q.id]}
            disabled={disabled}
            isSubmitted={isSubmitted}
            userAnswer={userAnswer[q.id]}
            // Fallback to null if attemptData is undefined
            attemptData={
              isSubmitted
                ? attemptData?.find((item) => item.questionId === q.id)
                : null
            }
          />
        ));

      case "s_ans":
        return questions.map((q, index) => (
          <TypedAnswerQuestion
            key={index}
            question={q.question}
            questionId={q.id}
            answerReference={q.answerReference}
            sectionType={sectionType}
            ansBoxSize={2}
            onAnswerChange={onAnswerChange}
            disabled={disabled}
            isSubmitted={isSubmitted}
            userAnswer={userAnswer[q.id]}
            correctAnswer={q.answer}
            // Fallback to null if attemptData is undefined
            attemptData={
              isSubmitted
                ? attemptData?.find((item) => item.questionId === q.id)
                : null
            }
          />
        ));

      case "l_ans":
        return questions.map((q, index) => (
          <TypedAnswerQuestion
            key={index}
            question={q.question}
            questionId={q.id}
            answerReference={q.answerReference}
            sectionType={sectionType}
            ansBoxSize={6}
            onAnswerChange={onAnswerChange}
            disabled={disabled}
            isSubmitted={isSubmitted}
            userAnswer={userAnswer[q.id]}
            correctAnswer={q.answer}
            // Fallback to null if attemptData is undefined
            attemptData={
              isSubmitted
                ? attemptData?.find((item) => item.questionId === q.id)
                : null
            }
          />
        ));

      case "fill_in_blank":
        return questions.map((q, index) => (
          <FillInBlankQuestion
            key={index}
            question={q.question}
            questionId={q.id}
            options={q.options}
            answerReference={q.answerReference}
            sectionType={sectionType}
            onAnswerChange={onAnswerChange}
            isCorrect={validationResults.fill_in_blank[q.id]}
            disabled={disabled}
            isSubmitted={isSubmitted}
            userAnswer={userAnswer[q.id]}
            // Fallback to null if attemptData is undefined
            attemptData={
              isSubmitted
                ? attemptData?.find((item) => item.questionId === q.id)
                : null
            }
          />
        ));

      default:
        return null;
    }
  };

  return (
    <Container fluid maw={1000} py="45px">
      <Title order={2} fw={700} fz={"30px"} pb="35px">
        {questions.length > 0 && sectionLabel}
      </Title>
      {renderQuestions()}
    </Container>
  );
};

export default SectionWrapper;
