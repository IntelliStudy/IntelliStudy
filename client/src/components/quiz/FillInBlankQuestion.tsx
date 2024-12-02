import { Badge, Flex, Select, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { AnswerReference } from "../../types/quiz";
import AnswerReferenceBox from "./AnswerReferenceBox";

interface Props {
  question: string;
  questionId: string;
  options: string[];
  answerReference: AnswerReference;
  sectionType: string;
  onAnswerChange: (
    sectionType: string,
    questionId: string,
    answer: string
  ) => void;
  isCorrect: boolean;
  disabled: boolean;
  isSubmitted: boolean;
  userAnswer: string;
  attemptData: {
    correctAnswer: string;
    pointsScored: number;
    question: string;
    questionId: string;
    userAnswer: string;
  } | null; // Make attemptData optional or nullable
}

const FillInBlankQuestion = ({
  question,
  questionId,
  options,
  sectionType,
  onAnswerChange,
  isCorrect,
  disabled,
  answerReference,
  isSubmitted,
  userAnswer,
  attemptData, // Handle nullable attemptData
}: Props) => {
  const [selectedOption, setSelectedOption] = useState<string | null>("");

  useEffect(() => {
    isSubmitted ? setSelectedOption(userAnswer) : setSelectedOption(null);
  }, [isSubmitted]);

  const handleOptionChange = (optionKey: string) => {
    setSelectedOption(optionKey);
    onAnswerChange(sectionType, questionId, optionKey);
  };

  const questionParts = question.split("***");

  const optionColour =
    isCorrect === undefined
      ? ""
      : selectedOption && isCorrect
        ? "limeGreen"
        : selectedOption && !isCorrect
          ? "red"
          : "";

  const borderWidth = optionColour !== "" ? "2px" : "";

  // Safely access pointsScored, defaulting to 0 if attemptData is null
  const pointsScored = attemptData ? attemptData.pointsScored : 0;

  return (
    <>
      <Title order={2} fw={500} fz={"22px"} pb={"10px"}>
        {/* Only render the Badge if attemptData is available */}
        {attemptData && (
          <Badge color={isCorrect ? "green" : "red"} size="xl" mb="5px">
            {pointsScored} {" / 1"}
          </Badge>
        )}
      </Title>
      <Flex align="center" gap="xs">
        <span>{questionParts[0]}</span>
        <Select
          placeholder="Select..."
          mx="10px"
          data={options}
          value={selectedOption}
          onChange={(option) => handleOptionChange(option as string)}
          disabled={disabled}
          maw="150px"
        />
        <span>{questionParts[1]}</span>
      </Flex>
      {isCorrect === false && attemptData && attemptData.correctAnswer && (
        <AnswerReferenceBox
          file={answerReference.fileName}
          page={answerReference.pageNumber}
          correctAnswer={attemptData.correctAnswer}
        />
      )}
    </>
  );
};

export default FillInBlankQuestion;
