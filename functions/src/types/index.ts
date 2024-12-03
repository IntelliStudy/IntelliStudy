export type TypedGradedQuestions = {
  [key: string]: TypedQuestion[];
};

export type TypedQuestion = {
  questionId: string;
  pointsScored: number;
};

export type GradedQuestions = {
  correctAnswwer: string;
  pointsScored: number;
  questionId: string;
  userAnswer: string;
};
