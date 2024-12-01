import { Badge, Flex, Textarea, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { AnswerReference } from "../../types/quiz";
import AnswerReferenceBox from "./AnswerReferenceBox";

interface Props {
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
  attemptData: {
    correctAnswer: string;
    pointsScored: number;
    question: string;
    questionId: string;
    userAnswer: string;
  } | null;
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
  attemptData,
}: Props) => {
  const [answerEntered, setAnswerEntered] = useState<string>("");

  useEffect(() => {
    isSubmitted ? setAnswerEntered(userAnswer) : setAnswerEntered("");
  }, [isSubmitted]);

  const handleAnswerChange = (answer: string) => {
    setAnswerEntered(answer);
    onAnswerChange(sectionType, questionId, answer);
  };

  const badgeColour = () => {
    if (!attemptData) return "gray"; // Default color if no attemptData is available

    const total = sectionType === "s_ans" ? 2 : 5;
    const percentage = attemptData.pointsScored / total;
    if (percentage > 0 && percentage < 1) return "yellow";
    if (percentage === 0) return "red";
    return "green";
  };

  const pointsScored = attemptData ? attemptData.pointsScored : 0; // Safe access to pointsScored

  return (
    <Flex direction="column" mb="30px">
      <Title order={2} fw={500} fz={"22px"} pb={"10px"}>
        {attemptData && ( // Only show the badge if attemptData is available
          <Badge color={badgeColour()} size="xl">
            {pointsScored} {" / "} {sectionType === "s_ans" ? "2" : "5"}
          </Badge>
        )}
        <br />
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

      {isSubmitted && attemptData && (
        <AnswerReferenceBox
          file={answerReference.fileName}
          page={answerReference.pageNumber}
          correctAnswer={correctAnswer}
          type={true}
        />
      )}
    </Flex>
  );
};

export default TypedAnswerQuestion;
