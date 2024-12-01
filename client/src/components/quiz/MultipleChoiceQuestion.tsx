import { Badge, Flex, Radio, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { AnswerReference, McqOption } from "../../types/quiz";
import AnswerReferenceBox from "./AnswerReferenceBox";
import MultipleChoiceOption from "./MultipleChoiceOption";

interface Props {
  question: string;
  questionId: string;
  options: McqOption[];
  sectionType: string;
  answerReference: AnswerReference;
  onAnswerChange: (
    sectionType: string,
    questionId: string,
    answer: string
  ) => void;
  correctAnswer: McqOption;
  isCorrect: boolean | undefined;
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

const MultipleChoiceQuestion = ({
  question,
  questionId,
  options,
  sectionType,
  answerReference,
  onAnswerChange,
  correctAnswer,
  isCorrect,
  disabled,
  isSubmitted,
  userAnswer,
  attemptData, // Make sure this is properly passed and not undefined
}: Props) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    isSubmitted ? setSelectedOption(userAnswer) : setSelectedOption(null);
  }, [isSubmitted]);

  const handleOptionChange = (optionKey: string) => {
    setSelectedOption(optionKey);
    onAnswerChange(sectionType, questionId, optionKey);
  };

  return (
    <Flex direction="column" mb="30px">
      <Title order={2} fw={500} fz={"22px"} pb={"10px"}>
        {attemptData && ( // Only render the Badge if attemptData exists
          <Badge color={isCorrect ? "green" : "red"} size="xl" mb="5px">
            {attemptData.pointsScored} {" / 1"}
          </Badge>
        )}
        <br />
        {question}
      </Title>

      {options.map((option, index) => {
        const optionColour =
          isCorrect === undefined
            ? undefined
            : selectedOption === option.key
              ? isCorrect
                ? "limeGreen"
                : "red"
              : option.key === correctAnswer.key
                ? "limeGreen"
                : undefined;

        return (
          <Radio.Group key={index}>
            <MultipleChoiceOption
              option={option}
              checked={selectedOption === option.key}
              setChecked={() => handleOptionChange(option.key)}
              optionColour={optionColour}
              disabled={disabled}
            />
          </Radio.Group>
        );
      })}

      {isCorrect === false && attemptData?.correctAnswer && (
        <AnswerReferenceBox
          file={answerReference.fileName}
          page={answerReference.pageNumber}
        />
      )}
    </Flex>
  );
};

export default MultipleChoiceQuestion;
