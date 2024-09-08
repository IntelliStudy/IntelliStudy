export type AnswerReference = {
  fileName: string;
  pageNumber: string;
};

export type McqOption = {
  key: string;
  value: string;
};

export type MultChoiceQuestionType = {
  id: string;
  question: string;
  options: McqOption[];
  answer: McqOption;
  type: string;
  answerReference: AnswerReference;
};

export type ShortAnswerQuestionType = {
  id: string;
  question: string;
  answer: string;
  type: string;
  answerReference: AnswerReference;
};

export type LongAnswerQuestionType = {
  id: string;
  question: string;
  answer: string;
  type: string;
  answerReference: AnswerReference;
};

export type TrueFalseQuestionType = {
  id: string;
  question: string;
  answer: McqOption;
  type: string;
  answerReference: AnswerReference;
};

export type FillInBlankQuestionType = {
  id: string;
  question: string;
  options: string[];
  answer: string;
  type: string;
  answerReference: AnswerReference;
};

export type QuizQuestions = {
  mcq: MultChoiceQuestionType[];
  s_ans: ShortAnswerQuestionType[];
  l_ans: LongAnswerQuestionType[];
  tf: TrueFalseQuestionType[];
  fill_in_blank: FillInBlankQuestionType[];
};

export type Quiz = {
  files: string[];
  questions: QuizQuestions;
};

export interface QuizFormValues {
  mcq: { [key: string]: string };
  tf: { [key: string]: string };
  s_ans: { [key: string]: string };
  l_ans: { [key: string]: string };
  fill_in_blank: { [key: string]: string };
}

export interface QuizValidationAnswers {
  mcq: { [key: string]: boolean };
  tf: { [key: string]: boolean };
  s_ans: { [key: string]: boolean };
  l_ans: { [key: string]: boolean };
  fill_in_blank: { [key: string]: boolean };
}

export type AttemptedQuestion = {
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  pointsScored: number;
};
