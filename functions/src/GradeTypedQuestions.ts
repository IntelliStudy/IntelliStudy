import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { doc, getDoc, setDoc } from "firebase/firestore";
import OpenAI from "openai";
import { db } from "../../client/src/firebase/firebase";
import { gradingInstructions } from "./instructions";
import { TypedGradedQuestions, TypedQuestion } from "./types";

export const GradeTypedQuestions = onDocumentCreated(
  "users/{userId}/courses/{courseId}/quizzes/{quizId}/attempt/{attemptId}",
  async (event) => {
    try {
      // Obtaining questions
      const quizQuestions = event.data?.data().questions;

      // Deleting other question types and only keeping s_ans and l_ans
      delete quizQuestions.mcq;
      delete quizQuestions.tf;
      delete quizQuestions.fill_in_blank;

      // Grading long and short answer questions
      const openai = new OpenAI();
      const response = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: gradingInstructions,
          },
          {
            role: "user",
            content:
              `Grade the following short answer and long answer questions provided: ` +
              JSON.stringify(quizQuestions),
          },
        ],
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
      });

      const gradedQuestions = response.choices[0].message.content;
      const gradedQuestionsObject: TypedGradedQuestions = JSON.parse(
        gradedQuestions!
      ).questions;

      // Get attempt collection
      const attemptDocument = doc(
        db,
        "users",
        event.params.userId,
        "courses",
        event.params.courseId,
        "quizzes",
        event.params.quizId,
        "attempt",
        event.params.attemptId
      );

      // Fetch the existing attempt document data
      const attemptDocSnap = await getDoc(attemptDocument);
      if (!attemptDocSnap.exists()) {
        throw new Error("Attempt document not found.");
      }

      const currentData = attemptDocSnap.data();
      const updatedQuestions = { ...currentData.questions };

      let userScore = currentData.userScore;

      // Iterate over the graded questions and update only the pointsScored field
      Object.keys(gradedQuestionsObject).forEach((questionType) => {
        if (updatedQuestions[questionType]) {
          // Update each question in the relevant array based on questionId
          updatedQuestions[questionType] = updatedQuestions[questionType].map(
            (question: TypedQuestion) => {
              const gradedQuestion = gradedQuestionsObject[questionType].find(
                (gq: TypedQuestion) => gq.questionId === question.questionId
              );
              if (gradedQuestion) {
                userScore = userScore + gradedQuestion.pointsScored;

                return {
                  ...question,
                  pointsScored: gradedQuestion.pointsScored,
                };
              } else {
                return question;
              }
            }
          );
        }
      });

      // await calculateFinalScore(attemptDocument);

      // Perform the Firestore update
      await setDoc(
        attemptDocument,
        {
          questions: updatedQuestions,
          graded: true,
          userScore: userScore,
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error grading short and long answer questions:", error);
    }
  }
);
