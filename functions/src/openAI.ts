import OpenAI from "openai";
import { onRequest } from "firebase-functions/v2/https";

export const openAI = onRequest(async (request, response) => {
  const openai = new OpenAI();

  const assistant = await openai.beta.assistants.create({
    name: "Math Tutor",
    instructions: "You are a personal math tutor. Write and run code to answer math questions.",
    tools: [{ type: "code_interpreter" }],
    model: "gpt-3.5-turbo"
  });

  response.send(assistant);
});
