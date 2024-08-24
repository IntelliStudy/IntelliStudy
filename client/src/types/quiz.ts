export type AnswerReference = {
  fileName: string;
  pageNumber: number;
};

export type McqOption = {
  key: string;
  value: string;
};

export type MultChoiceQuestionType = {
  question: string;
  options: McqOption[];
  answer: McqOption;
  type: string;
  answerReference: AnswerReference;
};

export type ShortAnswerQuestionType = {
  question: string;
  answer: string;
  type: string;
  answerReference: AnswerReference;
};

export type LongAnswerQuestionType = {
  question: string;
  answer: string;
  type: string;
  answerReference: AnswerReference;
};

export type TrueFalseQuestionType = {
  question: string;
  answer: McqOption;
  type: string;
  answerReference: AnswerReference;
};

export type FillInBlankQuestionType = {
  question: string;
  options: string[];
  answer: McqOption;
  type: string;
  answerReference: AnswerReference;
};
