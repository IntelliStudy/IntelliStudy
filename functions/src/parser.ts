import { Storage } from "@google-cloud/storage";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { collection, doc, updateDoc, writeBatch } from "firebase/firestore";
import OpenAI from "openai";
import pdf from "pdf-parse";
import { db } from "../../client/src/firebase/firebase";
import { systemInstructions } from "./instructions";

const storage = new Storage();

export const parser = onDocumentCreated(
  "users/{userId}/courses/{courseId}/files/{fileId}",
  async (event) => {
    try {
      const data = event.data?.data();
      const pdfPath = data?.fileReference;

      if (!pdfPath) {
        console.error("No PDF path found in document.");
        return;
      }

      console.log("Processing file at path:", pdfPath);

      const bucketName = "intellistudy-capstone.appspot.com";
      const filePath = pdfPath.replace(
        `https://storage.googleapis.com/${bucketName}/`,
        ""
      );

      // Retrieve the PDF file from Cloud Storage
      const bucket = storage.bucket(bucketName);
      const file = bucket.file(filePath);
      const fileName = filePath.split("/").pop();

      const [fileBuffer] = await file.download();

      // Parse the PDF file
      const pdfData = await pdf(fileBuffer);
      const pageContents = pdfData.text
        .split("\n\n")
        .map((text, index) => ({ pageNumber: index, text }));

      console.log("PDF parsed successfully.");

      // Function to call OpenAI and generate questions
      const generateQuestions = async (
        type: string,
        chunk: any[],
        fileName: string
      ) => {
        const openai = new OpenAI();
        const response = await openai.chat.completions.create({
          messages: [
            { role: "system", content: systemInstructions },
            {
              role: "user",
              content: `Generate 5 ${type} questions from these notes: ${JSON.stringify(
                chunk
              )}. For each question, include an answerReference field that specifies the file name as "${fileName}" and the page number.`,
            },
          ],
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
        });

        // Ensure content is not null before parsing
        const content = response.choices[0]?.message?.content;
        if (!content) {
          throw new Error(
            `Failed to generate ${type} questions: Content is null or undefined.`
          );
        }

        return JSON.parse(content).questions;
      };

      // Break the page contents into smaller chunks for OpenAI
      const splitIntoChunks = (data: any[], maxTokens: number) => {
        let chunks: any[] = [];
        let currentChunk: any[] = [];

        data.forEach((page) => {
          const tokenCount = JSON.stringify(page).length;
          if (tokenCount > maxTokens) {
            console.warn("Skipping a page that exceeds the token limit.");
          } else if (
            currentChunk.reduce(
              (sum, item) => sum + JSON.stringify(item).length,
              0
            ) +
              tokenCount <=
            maxTokens
          ) {
            currentChunk.push(page);
          } else {
            chunks.push(currentChunk);
            currentChunk = [page];
          }
        });

        if (currentChunk.length > 0) {
          chunks.push(currentChunk);
        }

        return chunks;
      };

      const chunks = splitIntoChunks(pageContents, 1000);

      // Generate questions in parallel for all types
      const [
        mcqQuestions,
        shortAnswerQuestions,
        longAnswerQuestions,
        tfQuestions,
        fillInBlankQuestions,
      ] = await Promise.all([
        generateQuestions("multiple choice", chunks, fileName),
        generateQuestions("short answer", chunks, fileName),
        generateQuestions("long answer", chunks, fileName),
        generateQuestions("true or false", chunks, fileName),
        generateQuestions("fill in the blank", chunks, fileName),
      ]);

      console.log("Questions generated successfully.");

      // Save questions using Firestore batch writes
      const saveQuestions = async (questions: any[], type: string) => {
        const batch = writeBatch(db);
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

        questions.forEach((question) => {
          const questionDocRef = doc(questionCollection);
          batch.set(questionDocRef, {
            id: questionDocRef.id,
            type,
            ...question,
          });
        });

        await batch.commit();
      };

      // Save all questions to Firestore
      await Promise.all([
        saveQuestions(mcqQuestions, "mcq"),
        saveQuestions(shortAnswerQuestions, "short_answer"),
        saveQuestions(longAnswerQuestions, "long_answer"),
        saveQuestions(tfQuestions, "true_false"),
        saveQuestions(fillInBlankQuestions, "fill_in_blank"),
      ]);

      console.log("Questions saved to Firestore.");

      // Update the file document to mark it as processed
      const fileDocRef = doc(
        db,
        "users",
        event.params.userId,
        "courses",
        event.params.courseId,
        "files",
        event.params.fileId
      );
      await updateDoc(fileDocRef, { processed: true });

      console.log("File marked as processed.");
    } catch (error) {
      console.error("Error processing file:", error);
    }
  }
);
