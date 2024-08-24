import { Container } from '@mantine/core';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../App';
import { SectionWrapper } from '../components';
import { QuestionType } from '../constants';

const Quiz = () => {
  const { currentUser } = useContext(UserContext);

  const temp = {
    quiz: {
      files: ['file1.pdf', 'file2.pdf'],
      questions: {
        mcq: [
          {
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
            question: 'Question text here?',
            options: ['Option A here', 'Option B here'],
            answer: 'Option A here',
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

  return (
    <>
      {/* MCQ */}
      <SectionWrapper
        sectionType={'mcq'}
        sectionLabel={QuestionType.mcq}
        questions={temp.quiz.questions.mcq}
      />

      {/* TF */}
      <SectionWrapper
        sectionType={'tf'}
        sectionLabel={QuestionType.tf}
        questions={temp.quiz.questions.tf}
      />

      {/* SHORT ANS */}
      <SectionWrapper
        sectionType={'s_ans'}
        sectionLabel={QuestionType.s_ans}
        questions={temp.quiz.questions.s_ans}
      />

      {/* LONG ANS */}
      <SectionWrapper
        sectionType={'l_ans'}
        sectionLabel={QuestionType.l_ans}
        questions={temp.quiz.questions.l_ans}
      />
    </>
  );
};

export default Quiz;
