import { Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { SectionWrapper } from '../components';
import { QuestionType } from '../constants';

const Quiz = () => {
  const temp = {
    quiz: {
      files: ['file1.pdf', 'file2.pdf'],
      questions: {
        mcq: [
          {
            id: 'mcq1',
            question: 'Question mcq 1 here?',
            options: [
              { key: 'A', value: 'Option A here' },
              { key: 'B', value: 'Option B here' },
              { key: 'C', value: 'Option C here' },
              { key: 'D', value: 'Option D here' },
            ],
            answer: { key: 'A', value: 'Option A here' },
            type: 'mcq',
            answerReference: {
              fileName: 'File name here',
              pageNumber: 2,
            },
          },
          {
            id: 'mcq2',
            question: 'Question mcq 2 here?',
            options: [
              { key: 'A', value: 'Option A here' },
              { key: 'B', value: 'Option B here' },
              { key: 'C', value: 'Option C here' },
              { key: 'D', value: 'Option D here' },
            ],
            answer: { key: 'A', value: 'Option A here' },
            type: 'mcq',
            answerReference: {
              fileName: 'File name here',
              pageNumber: 2,
            },
          },
        ],
        s_ans: [
          {
            id: 's_ans1',
            question: 'Question text here?',
            answer: 'Sample answer here',
            type: 's_ans',
            answerReference: {
              fileName: 'File name here',
              pageNumber: 5,
            },
          },
        ],
        l_ans: [
          {
            id: 'l_ans1',
            question: 'Question text here?',
            answer: 'Sample answer here',
            type: 'l_ans',
            answerReference: {
              fileName: 'File name here',
              pageNumber: 10,
            },
          },
        ],
        tf: [
          {
            id: 'tf1',
            question: 'True or false here?',
            answer: { key: 'A', value: 'True' },
            type: 'tf',
            answerReference: {
              fileName: 'File name here',
              pageNumber: 3,
            },
          },
        ],
        fill_in_blank: [
          {
            id: 'f_in_b1',
            question: 'Question text *** here?',
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            answer: 'Option C',
            type: 'fill_in_blank',
            answerReference: {
              fileName: 'File name here',
              pageNumber: 1,
            },
          },
        ],
      },
    },
  };

  const quizForm = useForm({
    initialValues: {
      mcqAnswers: {},
      tfAnswers: {},
      s_ansAnswers: {},
      l_ansAnswers: {},
      fill_in_blankAnswers: {},
    },
  });

  // Handle answer change
  const handleAnswerChange = (
    sectionType: string,
    questionId: string,
    answer: string
  ) => {
    quizForm.setFieldValue(`${sectionType}Answers.${questionId}`, answer);
  };

  const handleQuizSubmit = (event) => {
    event.preventDefault();
    console.log(quizForm.values);
  };

  return (
    <>
      <form onSubmit={handleQuizSubmit}>
        {/* MCQ */}
        <SectionWrapper
          sectionType={'mcq'}
          sectionLabel={QuestionType.mcq}
          questions={temp.quiz.questions.mcq}
          onAnswerChange={handleAnswerChange}
        />

        {/* TF */}
        <SectionWrapper
          sectionType={'tf'}
          sectionLabel={QuestionType.tf}
          questions={temp.quiz.questions.tf}
          onAnswerChange={handleAnswerChange}
        />

        {/* SHORT ANS */}
        <SectionWrapper
          sectionType={'s_ans'}
          sectionLabel={QuestionType.s_ans}
          questions={temp.quiz.questions.s_ans}
          onAnswerChange={handleAnswerChange}
        />

        {/* LONG ANS */}
        <SectionWrapper
          sectionType={'l_ans'}
          sectionLabel={QuestionType.l_ans}
          questions={temp.quiz.questions.l_ans}
          onAnswerChange={handleAnswerChange}
        />

        {/* FILL IN BLANK */}
        <SectionWrapper
          sectionType={'fill_in_blank'}
          sectionLabel={QuestionType.fill_in_blank}
          questions={temp.quiz.questions.fill_in_blank}
          onAnswerChange={handleAnswerChange}
        />

        <Button type="submit" w={'90px'} ml="115px" mb="70px">
          Submit
        </Button>
      </form>
    </>
  );
};

export default Quiz;
