import { Container, Title } from '@mantine/core';
import {
  FillInBlankQuestionType,
  LongAnswerQuestionType,
  McqOption,
  MultChoiceQuestionType,
  ShortAnswerQuestionType,
  TrueFalseQuestionType,
} from '../../types/quiz';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import TypedAnswerQuestion from './TypedAnswerQuestion';

interface props {
  sectionType: string;
  sectionLabel: string;
  questions:
    | MultChoiceQuestionType[]
    | ShortAnswerQuestionType[]
    | LongAnswerQuestionType[]
    | TrueFalseQuestionType[]
    | FillInBlankQuestionType[];
}

const SectionWrapper = ({ sectionType, sectionLabel, questions }: props) => {
  const trueFalseOptions = {
    options: [
      { key: 'A', value: 'True' },
      { key: 'B', value: 'False' },
    ],
  };

  const renderQuestions = () => {
    switch (sectionType) {
      case 'mcq':
        return questions.map((q, index) => (
          <MultipleChoiceQuestion
            key={index}
            question={q.question}
            options={q.options}
            answer={q.answer}
            answerReference={q.answerReference}
          />
        ));

      case 'tf':
        return questions.map((q, index) => (
          <MultipleChoiceQuestion
            key={index}
            question={q.question}
            options={trueFalseOptions.options}
            answer={q.answer}
            answerReference={q.answerReference}
          />
        ));

      case 's_ans':
        return questions.map((q, index) => (
          <TypedAnswerQuestion
            key={index}
            question={q.question}
            answer={q.answer as string}
            answerReference={q.answerReference}
            ansBoxSize={2}
          />
        ));

      case 'l_ans':
        return questions.map((q, index) => (
          <TypedAnswerQuestion
            key={index}
            question={q.question}
            answer={q.answer as string}
            answerReference={q.answerReference}
            ansBoxSize={6}
          />
        ));
    }
  };

  return (
    <>
      <Container fluid w="57%" py="45px" ml="5%">
        <Title order={2} fw={700} fz={'30px'} pb="35px">
          {questions.length > 0 && sectionLabel}
        </Title>
        {renderQuestions()}
      </Container>
    </>
  );
};

export default SectionWrapper;
