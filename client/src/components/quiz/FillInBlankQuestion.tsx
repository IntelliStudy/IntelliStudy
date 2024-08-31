import { Flex, Select, Title } from '@mantine/core';
import { useState } from 'react';
import { AnswerReference } from '../../types/quiz';

interface props {
  question: string;
  questionId: string;
  options: string[];
  correctAnswer: string;
  answerReference: AnswerReference;
  sectionType: string;
  onAnswerChange: (
    sectionType: string,
    questionId: string,
    answer: string
  ) => void;
}

const FillInBlankQuestion = ({
  question,
  questionId,
  options,
  correctAnswer,
  sectionType,
  onAnswerChange,
}: props) => {
  const [selectedOption, setSelectedOption] = useState<string | null>('');

  const handleOptionChange = (optionKey: string) => {
    setSelectedOption(optionKey);
    onAnswerChange(sectionType, questionId, optionKey);
  };

  const questionParts = question.split('***');

  return (
    <Flex direction="column" mb="30px">
      <Title order={2} fw={500} fz={'22px'} pb={'10px'}>
        <Flex direction="row" align="center">
          {questionParts[0]}
          <Select
            placeholder="Pick value"
            mx="10px"
            data={options}
            value={selectedOption}
            onChange={(option) => handleOptionChange(option as string)}
          />
          {questionParts[1]}
        </Flex>
      </Title>
    </Flex>
  );
};

export default FillInBlankQuestion;
