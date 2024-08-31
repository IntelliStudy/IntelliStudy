import { Container, Title } from '@mantine/core';
import {
  FillInBlankQuestionType,
  LongAnswerQuestionType,
  McqOption,
  MultChoiceQuestionType,
  ShortAnswerQuestionType,
  TrueFalseQuestionType,
} from '../../types/quiz';
import FillInBlankQuestion from './FillInBlankQuestion';
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
  onAnswerChange: (
    sectionType: string,
    questionId: string,
    answer: string
  ) => void;
}

const SectionWrapper = ({
  sectionType,
  sectionLabel,
  questions,
  onAnswerChange,
}: props) => {
  // True or false options
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
            questionId={q.id}
            options={q.options}
            correctAnswer={q.answer}
            answerReference={q.answerReference}
            sectionType={sectionType}
            onAnswerChange={onAnswerChange}
          />
        ));

      case 'tf':
        return questions.map((q, index) => (
          <MultipleChoiceQuestion
            key={index}
            question={q.question}
            questionId={q.id}
            options={trueFalseOptions.options}
            correctAnswer={q.answer}
            answerReference={q.answerReference}
            sectionType={sectionType}
            onAnswerChange={onAnswerChange}
          />
        ));

      case 's_ans':
        return questions.map((q, index) => (
          <TypedAnswerQuestion
            key={index}
            question={q.question}
            questionId={q.id}
            correctAnswer={q.answer as string}
            answerReference={q.answerReference}
            sectionType={sectionType}
            ansBoxSize={2}
            onAnswerChange={onAnswerChange}
          />
        ));

      case 'l_ans':
        return questions.map((q, index) => (
          <TypedAnswerQuestion
            key={index}
            question={q.question}
            questionId={q.id}
            correctAnswer={q.answer as string}
            answerReference={q.answerReference}
            sectionType={sectionType}
            ansBoxSize={6}
            onAnswerChange={onAnswerChange}
          />
        ));

      case 'fill_in_blank':
        return questions.map((q, index) => (
          <FillInBlankQuestion
            key={index}
            question={q.question}
            questionId={q.id}
            options={q.options}
            correctAnswer={q.answer as string}
            answerReference={q.answerReference}
            sectionType={sectionType}
            onAnswerChange={onAnswerChange}
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
