import { onRequest } from 'firebase-functions/v2/https';
import OpenAI from 'openai';

function waitForOneSecond() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(1);
    }, 1000); // 1000 milliseconds = 1 second
  });
}

export const openAI = onRequest(async (request, response) => {
  const openai = new OpenAI();

  
  const assistant = await openai.beta.assistants.retrieve(
    'asst_qtulEJHXsBw9v8vlFWf4TH0F'
  );

  const thread = await openai.beta.threads.create();

  // const message =
  await openai.beta.threads.messages.create(thread.id, {
    role: 'user',
    content: 'What is 10 * 50?',
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

  console.log(JSON.stringify(messages, null, 2));

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

  response.status(200).send('OK')
});
