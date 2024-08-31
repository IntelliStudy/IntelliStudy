export type AnswerReference = {
  fileName: string;
  pageNumber: number;
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
  answer: McqOption;
  type: string;
  answerReference: AnswerReference;
};
