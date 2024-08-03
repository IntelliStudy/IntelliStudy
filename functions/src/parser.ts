import { onDocumentWritten } from "firebase-functions/v2/firestore";
// import { doc, setDoc } from "firebase/firestore";
// import { db } from "../../client/src/firebase/firebase";
import { Storage } from "@google-cloud/storage";
import pdf from "pdf-parse";
import { systemInstructions } from "./instructions";
import OpenAI from "openai";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../client/src/firebase/firebase";

const storage = new Storage();

export const parser = onDocumentWritten(
  "users/{userId}/courses/{courseId}/files/{fileId}",
  async (event) => {
    const data = event.data?.after.data();
    const pdfPath = data?.fileReference;

    console.log("TIRGGEREDEDD");

    if (!pdfPath) {
      console.error("No PDF path found in document.");
      return;
    }

    console.log("pdfPath", pdfPath);

    const bucketName = "intellistudy-capstone.appspot.com";
    const filePath = pdfPath.replace(
      `https://storage.googleapis.com/${bucketName}/`,
      ""
    );

    // Retrieve the PDF file from Cloud Storage
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(filePath);
    const [fileBuffer] = await file.download();

    // Parse the PDF file using pdf-parse
    const pdfData = await pdf(fileBuffer);

    // Extract text content from each page
    const pageContents: { pageNumber: number; text: string }[] = pdfData.text
      .split("\n\n")
      .map((pageText: any, index: number) => ({
        pageNumber: index + 1,
        text: pageText,
      }));

    const openai = new OpenAI();
    const multipleChoiceQuestions = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemInstructions,
        },
        {
          role: "user",
          content:
            `Generate 5 multiple-choice questions from these notes: ` +
            JSON.stringify(pageContents),
        },
      ],
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
    });

    async function saveQuestions(questions: any) {
      console.log("questions", questions);
      try {
        for (const question of questions) {
          // Generate a unique document reference
          console.log("single", question);
          const questionCollection = collection(
            db,
            "users",
            event.params.userId,
            "courses",
            event.params.courseId,
            "files",
            event.params.fileId,
            "questions"
          );

          // Set the document with the question data
          await addDoc(questionCollection, {
            question: question.question,
            options: question.options,
            answer: question.answer,
            type: question.type,
          });
        }
      } catch (error) {
        console.error("Error writing questions to Firebase:", error);
      }
    }

    const generatedMcq = multipleChoiceQuestions.choices[0].message.content;

    generatedMcq
      ? saveQuestions(JSON.parse(generatedMcq).questions)
      : undefined;
  }
);
