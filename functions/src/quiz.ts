// import { onDocumentCreated } from "firebase-functions/v2/firestore";
// import { Storage } from "@google-cloud/storage";
// import pdf from "pdf-parse";
// import { systemInstructions } from "./instructions";
// import { onRequest } from "firebase-functions/v1/https";
// import OpenAI from "openai";
// import { addDoc, collection, getDocs } from "firebase/firestore";
// import { db } from "../../client/src/firebase/firebase";
// const storage = new Storage();

// export const quiz = onDocumentCreated(
//   "users/{userId}/courses/{courseId}/quiz/{quizId}",
//   async (event) => {
//     const allQuestions = [];
//     // Get all documents from the 'files' collection
//     const filesSnapshot = await getDocs(
//       collection(
//         db,
//         "users",
//         event.params.userId,
//         "courses",
//         event.params.courseId,
//         "files"
//       )
//     );

//     // Loop through each file
//     for (const fileDoc of filesSnapshot.docs) {
//       const questionsSnapshot = await getDocs(
//         collection(
//           db,
//           "users",
//           event.params.userId,
//           "courses",
//           event.params.courseId,
//           "files",
//           fileDoc.id,
//           "questions"
//         )
//       );

//       // Add each question to the array
//       questionsSnapshot.forEach((questionDoc) => {
//         allQuestions.push({ id: questionDoc.id, ...questionDoc.data() });
//       });
//     }
//   }

//   //setDoc
// );
