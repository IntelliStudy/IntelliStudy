import { addDoc, collection, getDocs, setDoc } from "firebase/firestore";
import { QuestionType } from "../constants";
import { db } from "../firebase/firebase";
import {
  AttemptedQuestion,
  GradedQuestions,
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
    // Create attempt under users/{userId}/courses/{courseId}/quizzes/{quizId}/attempt
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
          console.log("qyestions", question);
          // Determining where correctAnswer is located based on question type
          let correctAnswer;
          if (questionType === "mcq" || questionType === "tf") {
            correctAnswer = question.answer.key;
          } else {
            correctAnswer = question.answer;
          }

          return {
            questionId: question.id,
            question: question.question,
            userAnswer: answers[questionType][question.id] ?? "",
            correctAnswer: correctAnswer,
            pointsScored: Number(answerPoints[questionType][question.id] ?? 0),
          };
        }
      );
    });

    const gradedFlag =
      questions.s_ans.length > 0 || questions.l_ans.length > 0 ? false : true;

    // Create attempts doc mapping to current quiz structure
    await addDoc(quizAttempsCollection, {
      graded: gradedFlag,
      files: quiz.files,
      questions: attemptedQuestions,
    });
  } catch (error) {
    console.error("Error creating quiz attempt", error);
  }
};

// Helper function to validate answers based on question type
export const validateAnswers = (
  questionType: string,
  questions: any[],
  userAnswers: { [key: string]: any }
) => {
  const validationResults: { [key: string]: boolean } = {};

  questions.forEach((question) => {
    const userAnswer = userAnswers[question.id];
    let isCorrect = false;

    // Validate based on the type of question
    switch (questionType) {
      case QuestionType.mcq:
        isCorrect = userAnswer === question.answer.key;
        break;
      case QuestionType.tf:
        isCorrect = userAnswer === question.answer.key;
        break;
      case QuestionType.fill_in_blank:
        isCorrect = userAnswer === question.answer;
        break;
      default:
        console.warn(`Unknown question type: ${questionType}`);
    }

    validationResults[question.id] = isCorrect;
  });

  return validationResults;
};

export const validateAnswersForAttempt = (
  questionAttempts: AttemptedQuestion[]
) => {
  const validationResults: { [key: string]: boolean } = {};

  questionAttempts.forEach((question) => {
    let isCorrect = false;

    isCorrect = question.correctAnswer === question.userAnswer;

    validationResults[question.questionId] = isCorrect;
  });

  return validationResults;
};

export const calculateFinalScore = async (
  userId: string,
  courseId: string,
  quizId: string
) => {
  const attemptCollection = collection(
    db,
    `users/${userId}/courses/${courseId}/quizzes/${quizId}/attempt`
  );

  // Fetch the existing documents in the collection
  const attemptDocsSnap = await getDocs(attemptCollection);

  if (attemptDocsSnap.empty) {
    throw new Error("No documents found in the collection.");
  }

  const multipleChoiceQuestions = new Set(["mcq", "tf", "fill_in_blank"]);

  let totalScore = 0;
  let userScore = 0;

  // Loop through each document in the collection
  attemptDocsSnap.forEach((docSnap) => {
    const questions = docSnap.data().questions;

    if (!questions) {
      console.log(`No questions found for document: ${docSnap.id}`);
      return;
    }

    // Loop through each question type
    Object.keys(questions).forEach((key) => {
      const questionArray = questions[key];

      questionArray.forEach((question: GradedQuestions) => {
        // Updating total score
        if (multipleChoiceQuestions.has(key)) {
          totalScore++;
        } else if (key === "s_ans") {
          totalScore += 2;
        } else {
          totalScore += 5;
        }

        // Updating userScore
        userScore += question.pointsScored ?? 0;
      });
    });
  });

  // Update Firestore
  const firstDocRef = attemptDocsSnap.docs[0].ref;
  await setDoc(
    firstDocRef,
    {
      userScore: userScore,
      totalScore: totalScore,
    },
    { merge: true }
  );

  return { userScore, totalScore };
};
