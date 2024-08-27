import { Flex, Radio, Title } from '@mantine/core';
import { useState } from 'react';
import { AnswerReference, McqOption } from '../../types/quiz';
import MultipleChoiceOption from './MultipleChoiceOption';

interface props {
  question: string;
  options: McqOption[];
  answer: McqOption | string;
  answerReference: AnswerReference;
}

const MultipleChoiceQuestion = ({
  question,
  options,
}: // answer,
// answerReference,
props) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  return (
    <Flex direction="column" mb="30px">
      <Title order={2} fw={500} fz={'22px'} pb={'10px'}>
        {question}
      </Title>

      {options.map((option, index) => {
        return (
          <Radio.Group key={index}>
            <MultipleChoiceOption
              option={option}
              checked={selectedOption === option.key}
              setChecked={() => setSelectedOption(option.key)}
            />
          </Radio.Group>
        );
      })}
    </Flex>
  );
};

export default MultipleChoiceQuestion;
