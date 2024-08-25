import { onDocumentWritten } from "firebase-functions/v2/firestore";
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
    async function saveQuestions(questions: any) {
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

          if (question.type === "mcq" || question.type === "fill_in_blank") {
            await addDoc(questionCollection, {
              question: question.question,
              options: question.options,
              answer: question.answer,
              type: question.type,
              answerReference: question.answerReference,
            });
          } else if (
            question.type === "s_ans" ||
            question.type === "l_ans" ||
            question.type === "tf"
          ) {
            await addDoc(questionCollection, {
              question: question.question,
              answer: question.answer,
              type: question.type,
              answerReference: question.answerReference,
            });
          }
        }
      } catch (error) {
        console.error("Error writing mcq questions to Firebase:", error);
      }
    }

    const data = event.data?.after.data();
    const pdfPath = data?.fileReference;

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
        pageNumber: index,
        text: pageText,
        fileName: data?.fileName,
      }));

    //question generation
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
            `Generate 5 multiple choice questions from these notes: ` +
            JSON.stringify(pageContents),
        },
      ],
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
    });

    const shortAnswerQuestions = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemInstructions,
        },
        {
          role: "user",
          content:
            `Generate 5 short answer questions from these notes: ` +
            JSON.stringify(pageContents),
        },
      ],
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
    });

    const longAnswerQuestions = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemInstructions,
        },
        {
          role: "user",
          content:
            `Generate 5 long answer questions from these notes: ` +
            JSON.stringify(pageContents),
        },
      ],
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
    });

    const tfQuestions = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemInstructions,
        },
        {
          role: "user",
          content:
            `Generate 5 true or false questions from these notes: ` +
            JSON.stringify(pageContents),
        },
      ],
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
    });

    const fillInBlankQuestions = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemInstructions,
        },
        {
          role: "user",
          content:
            `Generate 5 fill in the blank questions from these notes: ` +
            JSON.stringify(pageContents),
        },
      ],
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
    });

    //split questions into collections based on type

    const generatedMcq = multipleChoiceQuestions.choices[0].message.content;
    console.log(generatedMcq);

    const generatedShortAns = shortAnswerQuestions.choices[0].message.content;
    console.log(generatedShortAns);

    const generatedLongAns = longAnswerQuestions.choices[0].message.content;
    console.log(generatedLongAns);

    const generatedTf = tfQuestions.choices[0].message.content;
    console.log(generatedTf);

    const generatedFillBlank = fillInBlankQuestions.choices[0].message.content;
    console.log(generatedFillBlank);

    generatedMcq
      ? saveQuestions(JSON.parse(generatedMcq).questions)
      : undefined;
    generatedShortAns
      ? saveQuestions(JSON.parse(generatedShortAns).questions)
      : undefined;
    generatedLongAns
      ? saveQuestions(JSON.parse(generatedLongAns).questions)
      : undefined;
    generatedTf ? saveQuestions(JSON.parse(generatedTf).questions) : undefined;
    generatedFillBlank
      ? saveQuestions(JSON.parse(generatedFillBlank).questions)
      : undefined;
  }
);
