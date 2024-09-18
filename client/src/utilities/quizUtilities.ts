import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebase";
import {
  AttemptedQuestion,
  Quiz,
  QuizFormValues,
  QuizQuestions,
  QuizValidationAnswers,
} from "../types/quiz";

export const createAttemptDocument = async (
  userId: string,
  courseId: string,
  quizId: string,
  quiz: Quiz,
  quizFormValues: QuizFormValues,
  validationResults: QuizValidationAnswers
) => {
  try {
    // Create attempt under users/{userId}/courses/{courseId}/quizzes/{quizId}/attempts
    const quizAttempsCollection = collection(
      db,
      `users/${userId}/courses/${courseId}/quizzes/${quizId}/attempt`
    );

    const questions: QuizQuestions = quiz.questions;
    const attemptedQuestions: Record<string, AttemptedQuestion[]> = {};

    Object.keys(questions).forEach((questionType) => {
      const answers = quizFormValues as any;
      const answerPoints = validationResults as any;

      // Iterate over each question in the current question type
      attemptedQuestions[questionType] = (questions[questionType] as any[]).map(
        (question) => {
          // Determining where correctAnswer is located based on question type
          let correctAnswer;
          if (questionType === "mcq" || questionType === "tf") {
            correctAnswer = question.answer.key;
          } else {
            correctAnswer = question.answer;
          }

          return {
            questionId: question.id,
            userAnswer: answers[questionType][question.id] ?? "",
            correctAnswer: correctAnswer,
            pointsScored: Number(answerPoints[questionType][question.id] ?? 0),
          };
        }
      );
    });

    // Create attempts doc mapping to current quiz structure
    await addDoc(quizAttempsCollection, {
      graded: false,
      files: quiz.files,
      questions: attemptedQuestions,
    });
  } catch (error) {
    console.error("Error creating quiz attempt", error);
  }
};
