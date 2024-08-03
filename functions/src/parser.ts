import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
// import { doc, setDoc } from "firebase/firestore";
// import { db } from "../../client/src/firebase/firebase";
import { Storage } from '@google-cloud/storage';
import pdf from 'pdf-parse';
// import OpenAI from "openai";

const storage = new Storage();

export const parser = onDocumentUpdated(
  'users/{userId}/courses/{courseId}/files/{file}',
  async (event) => {
    const data = event.data?.after.data();
    const pdfPath = data?.fileReference;

    console.log(pdfPath);

    if (!pdfPath) {
      console.error('No PDF path found in document.');
      return;
    }

    console.log('pdfPath', pdfPath);

    const bucketName = 'intellistudy-capstone.appspot.com';
    const filePath = pdfPath.replace(
      `https://storage.googleapis.com/${bucketName}/`,
      ''
    );

    // Retrieve the PDF file from Cloud Storage
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(filePath);
    const [fileBuffer] = await file.download();

    // Parse the PDF file using pdf-parse
    const pdfData = await pdf(fileBuffer);

    // Extract text content from each page
    const pageContents: { pageNumber: number; text: string }[] = pdfData.text
      .split('\n\n')
      .map((pageText: any, index: number) => ({
        pageNumber: index + 1,
        text: pageText,
      }));

    console.log('pagecontent', pageContents);
    return pageContents;
  }
);
