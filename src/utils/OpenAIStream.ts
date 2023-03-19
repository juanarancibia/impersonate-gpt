/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  createParser,
  type ParsedEvent,
  type ReconnectInterval,
} from "eventsource-parser";
import { type OpenAIStreamPayload } from "~/models/ChatGPT.model";

export async function OpenAIStream(payload: OpenAIStreamPayload) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  let counter = 0;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
  };

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: requestHeaders,
    method: "POST",
    body: JSON.stringify(payload),
  });

  const stream = new ReadableStream({
    async start(controller) {
      //callback
      function onParse(event: ParsedEvent | ReconnectInterval) {
        if (event.type === "event") {
          const data = event.data;

          if (data === "[DONE]") {
            console.log("DONE");
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(data);
            const text: string =
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              (json.choices[0].delta?.content as string) || "";

            if (counter < 2 && (text.match(/\n/) || []).length) {
              return;
            }
            const queue = encoder.encode(text);
            controller.enqueue(queue);
            counter++;
          } catch (e) {
            controller.error(e);
          }
        }
      }

      const parser = createParser(onParse);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for await (const chunk of res.body as any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return stream;
}
