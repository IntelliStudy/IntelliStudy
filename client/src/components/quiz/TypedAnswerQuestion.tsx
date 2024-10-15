import { Flex, Textarea, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { AnswerReference } from "../../types/quiz";
import AnswerReferenceBox from "./AnswerReferenceBox";

interface props {
  question: string;
  questionId: string;
  answerReference: AnswerReference;
  sectionType: string;
  ansBoxSize: number;
  onAnswerChange: (
    sectionType: string,
    questionId: string,
    answer: string
  ) => void;
  disabled: boolean;
  isSubmitted: boolean;
  userAnswer: string;
  correctAnswer: string;
}

const TypedAnswerQuestion = ({
  question,
  questionId,
  sectionType,
  ansBoxSize,
  onAnswerChange,
  disabled,
  isSubmitted,
  userAnswer,
  answerReference,
  correctAnswer,
}: props) => {
  const [answerEntered, setAnswerEntered] = useState<string>("");

  useEffect(() => {
    isSubmitted ? setAnswerEntered(userAnswer) : setAnswerEntered("");
  }, [isSubmitted]);

  const handleAnswerChange = (answer: string) => {
    setAnswerEntered(answer);
    onAnswerChange(sectionType, questionId, answer);
  };
  return (
    <Flex direction="column" mb="30px">
      <Title order={2} fw={500} fz={"22px"} pb={"10px"}>
        {question}
      </Title>

      <Textarea
        autosize
        value={answerEntered}
        placeholder="Enter your answer"
        minRows={ansBoxSize}
        disabled={disabled}
        onChange={(event) => handleAnswerChange(event.currentTarget.value)}
      />

      <AnswerReferenceBox
        file={answerReference.fileName}
        page={answerReference.pageNumber}
        correctAnswer={correctAnswer}
      />
    </Flex>
  );
};

export default TypedAnswerQuestion;
