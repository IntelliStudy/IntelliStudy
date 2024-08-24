import { Flex, Textarea, Title } from '@mantine/core';
import { AnswerReference } from '../../types/quiz';

interface props {
  question: string;
  answer: string;
  answerReference: AnswerReference;
  ansBoxSize: number;
}

const TypedAnswerQuestion = ({
  question,
  // answer,
  // answerReference,
  ansBoxSize,
}: props) => {
  return (
    <Flex direction="column" mb="30px">
      <Title order={2} fw={500} fz={'22px'} pb={'10px'}>
        {question}
      </Title>

      <Textarea autosize placeholder="Enter your answer" minRows={ansBoxSize} />
    </Flex>
  );
};

export default TypedAnswerQuestion;
