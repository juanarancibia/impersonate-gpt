export interface ChatGPTMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

export interface ChatGPTRequest {
  messages: ChatGPTMessage[];
  user: string;
}

export interface OpenAIStreamPayload {
  model: string;
  messages: ChatGPTMessage[];
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  max_tokens: number;
  stream: boolean;
  stop?: string[];
  user?: string;
  n: number;
}
