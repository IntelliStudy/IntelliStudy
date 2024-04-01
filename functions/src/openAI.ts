import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { doc, setDoc } from "firebase/firestore"; 
import { db } from '../../client/src/firebase/firebase';
import OpenAI from 'openai';

function waitForOneSecond() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(1);
    }, 1000); // 1000 milliseconds = 1 second
  });
}

export const openAI = onDocumentCreated('users/{userId}/quizzes/{quizId}', async (event) => {

  console.log("EVENT",event);
  const openai = new OpenAI();
  
  const assistant = await openai.beta.assistants.retrieve(
    'asst_qtulEJHXsBw9v8vlFWf4TH0F'
  );

  const thread = await openai.beta.threads.create();

  // const message =
  await openai.beta.threads.messages.create(thread.id, {
    role: 'user',
    content: 'Make and output a 5 question multiple choice quiz in JSON format based on the file provided with multiple choice options and the correct answers both provided. Do not respond with anything else except the JSON. Do not introduce or explain anything in plain text. Your response should strictly be a JSON object. DO NOT include "```json" at the start or "```" at the end. Your response should follow the format of the example given in the instructions.',
  });

  const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: assistant.id,
  });

  let status = '';

  do {
  const result = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    await waitForOneSecond();
    status = result.status;


    console.log("STATUS",status);

  } while (status === 'in_progress' || status ==='queued')



  console.log("STATUS",status);

  if (status === 'failed'){

    const quizzesRef = doc(db, 'users', event.params.userId,'quizzes',event.params.quizId);
    await setDoc(quizzesRef,{success: false, loading: false, quiz: "There was an error generating your quiz."},{merge: true});
    const result = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    console.log("ERROR", result.last_error);

  } else {
    const messages = await openai.beta.threads.messages.list(thread.id);
    messages.data.forEach((message) => {
      console.log("MESS",message.content);
    });
  
    const quiz = (messages.data[0].content[0] as { text: { value: string } }).text.value;
  
    const quizzesRef = doc(db, 'users', event.params.userId,'quizzes',event.params.quizId);
    await setDoc(quizzesRef,{success: true, loading: false, quiz: quiz},{merge: true});

  }


});


