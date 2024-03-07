import { onRequest } from 'firebase-functions/v2/https';
import OpenAI from 'openai';

export const openAI = onRequest(async (request, response) => {
  const openai = new OpenAI();

  const assistant = await openai.beta.assistants.retrieve(
    'asst_qtulEJHXsBw9v8vlFWf4TH0F'
  );

  console.log(assistant);
  const thread = await openai.beta.threads.create();

  const message = await openai.beta.threads.messages.create(thread.id, {
    role: 'user',
    content: 'What is 10 * 3?',
  });

  const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: assistant.id,
  });

  const result = await openai.beta.threads.runs.retrieve(thread.id, run.id);

  const messages = await openai.beta.threads.messages.list(thread.id);

  messages.data.forEach((message) => {
    console.log(message.content);
  });

  // const assistant = await openai.beta.assistants.create({
  //   name: "Math Tutor",
  //   instructions: "You are a personal math tutor. Write and run code to answer math questions.",
  //   tools: [{ type: "code_interpreter" }],
  //   model: "gpt-3.5-turbo"
  // });

  // response.send(assistant);
});
