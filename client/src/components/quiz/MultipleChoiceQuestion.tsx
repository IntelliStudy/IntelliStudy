import { Flex, Radio, Title } from '@mantine/core';
import { useState } from 'react';
import { AnswerReference, McqOption } from '../../types/quiz';
import AnswerReferenceBox from './AnswerReferenceBox';
import MultipleChoiceOption from './MultipleChoiceOption';

interface props {
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
}: props) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionChange = (optionKey: string) => {
    setSelectedOption(optionKey);
    onAnswerChange(sectionType, questionId, optionKey);
  };

  return (
    <Flex direction="column" mb="30px">
      <Title order={2} fw={500} fz={'22px'} pb={'10px'}>
        {question}
      </Title>

      {options.map((option, index) => {
        const optionColour =
          isCorrect === undefined
            ? undefined
            : selectedOption === option.key
            ? isCorrect
              ? 'limeGreen'
              : 'red'
            : option.key === correctAnswer.key
            ? 'limeGreen'
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

      {isCorrect === false && (
        <AnswerReferenceBox
          file={answerReference.fileName}
          page={answerReference.pageNumber}
        />
      )}
    </Flex>
  );
};

export default MultipleChoiceQuestion;
