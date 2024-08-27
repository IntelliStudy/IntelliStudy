import { Flex, Select, Title } from '@mantine/core';
import { useState } from 'react';
import { AnswerReference } from '../../types/quiz';

interface props {
  question: string;
  options: string[];
  answer: string;
  answerReference: AnswerReference;
}

const FillInBlank = ({ question, options, answer, answerReference }: props) => {
  const [value, setValue] = useState<string | null>('');

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
            value={value}
            onChange={setValue}
          />
          {questionParts[1]}
        </Flex>
      </Title>
    </Flex>
  );
};

export default FillInBlank;
