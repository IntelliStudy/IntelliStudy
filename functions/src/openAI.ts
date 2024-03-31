import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { addDoc, collection, doc, setDoc } from "firebase/firestore"; 
import { db } from '../../client/src/firebase/firebase';
import OpenAI from 'openai';

function waitForOneSecond() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(1);
    }, 1000); // 1000 milliseconds = 1 second
  });
}

export const openAI = onDocumentCreated('users/{userId}/requests/{requestId}', async (event) => {

  console.log("EVENT",event);
  const openai = new OpenAI();
  
  const assistant = await openai.beta.assistants.retrieve(
    'asst_qtulEJHXsBw9v8vlFWf4TH0F'
  );

  const thread = await openai.beta.threads.create();

  // const message =
  await openai.beta.threads.messages.create(thread.id, {
    role: 'user',
    content: 'Make and output a 5 question multiple choice quiz in JSON format based on the file provided with multiple choice options and the correct answers both provided. Do not respond with anything else except the JSON. Do not introduce or explain anything in plain text. Your response should strictly be a JSON object.',
  });

  const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: assistant.id,
  });

  let status = '';

  do {
  const result = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    await waitForOneSecond();
    status = result.status;

  } while (status === 'in_progress' || status ==='queued')

  const messages = await openai.beta.threads.messages.list(thread.id);

  const quiz = (messages.data[0].content[0] as { text: { value: string } }).text.value;


  // messages.data.forEach((message) => {
  //   console.log(message.content);
  // });

  // const assistant = await openai.beta.assistants.create({
  //   name: "Math Tutor",
  //   instructions: "You are a personal math tutor. Write and run code to answer math questions.",
  //   tools: [{ type: "code_interpreter" }],
  //   model: "gpt-3.5-turbo"
  // });

  // response.send(assistant);

  const quizzesRef = doc(db, 'users', event.params.userId,'quizzes',event.params.requestId);
  setDoc(quizzesRef, {id: event.params.requestId, quiz: quiz});
});


