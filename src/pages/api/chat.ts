import {
  ChatGPTMessage,
  ChatGPTRequest,
  OpenAIStreamPayload,
} from "~/models/ChatGPT.model";
import { OpenAIStream } from "~/utils/OpenAIStream";

export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  const body: ChatGPTRequest = (await req.json()) as ChatGPTRequest;
  console.log({ body });

  const messages: ChatGPTMessage[] = [
    {
      role: "system",
      content: `Quiero que actues como un chef profesional que se dedica a dar recetas en la revista de cocina con más prestigio del mundo. Te voy a enviar una serie de ingredientes separados por comas con los que tenes que armar una receta que se puedan cocinar en casa.`,
    },
  ];
  messages.push(...body?.messages);

  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing Enviroment variable OPENAI_API_KEY");
  }

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: messages,
    temperature: 0.7,
    max_tokens: 500,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    user: body?.user,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
};

export default handler;
