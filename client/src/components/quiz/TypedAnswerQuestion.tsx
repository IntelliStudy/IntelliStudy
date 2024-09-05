import { Flex, Textarea, Title } from "@mantine/core";
import { useState } from "react";
import { AnswerReference } from "../../types/quiz";

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
}

const TypedAnswerQuestion = ({
  question,
  questionId,
  sectionType,
  ansBoxSize,
  onAnswerChange,
  disabled,
}: props) => {
  const [userAnswer, setUserAnswer] = useState<string>("");

  const handleAnswerChange = (answer: string) => {
    setUserAnswer(answer);
    onAnswerChange(sectionType, questionId, answer);
  };
  return (
    <Flex direction="column" mb="30px">
      <Title order={2} fw={500} fz={"22px"} pb={"10px"}>
        {question}
      </Title>

      <Textarea
        autosize
        value={userAnswer}
        placeholder="Enter your answer"
        minRows={ansBoxSize}
        disabled={disabled}
        onChange={(event) => handleAnswerChange(event.currentTarget.value)}
      />
    </Flex>
  );
};

export default TypedAnswerQuestion;
