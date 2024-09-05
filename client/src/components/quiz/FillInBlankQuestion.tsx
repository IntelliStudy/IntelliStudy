import { Flex, Select, Title } from "@mantine/core";
import { useState } from "react";
import { AnswerReference } from "../../types/quiz";
import AnswerReferenceBox from "./AnswerReferenceBox";

interface props {
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
}: props) => {
  const [selectedOption, setSelectedOption] = useState<string | null>("");

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

  return (
    <Flex direction="column" mb="30px">
      <Title order={2} fw={500} fz={"22px"} pb={"10px"}>
        <Flex direction="row" align="center">
          {questionParts[0]}
          <Select
            placeholder="Pick a value"
            mx="10px"
            data={options}
            value={selectedOption}
            onChange={(option) => handleOptionChange(option as string)}
            disabled={disabled}
            style={{
              borderColor: optionColour,
              borderWidth: borderWidth,
              borderRadius: "6px",
            }}
          />
          {questionParts[1]}
        </Flex>
      </Title>

      {isCorrect === false && (
        <AnswerReferenceBox
          file={answerReference.fileName}
          page={answerReference.pageNumber}
        />
      )}
    </Flex>
  );
};

export default FillInBlankQuestion;
