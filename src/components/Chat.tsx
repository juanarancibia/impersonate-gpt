/* eslint-disable @typescript-eslint/no-misused-promises */
import { Button, Card, CardContent, Typography } from "@mui/material";
import { useState } from "react";
import ChatInput from "./ChatInput";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ChatProps {}

const Chat: React.FC<ChatProps> = () => {
  const [inputText, setInputText] = useState("");
  const [chatGPTResponse, setChatGPTResponse] = useState("");
  const [isChatStreaming, setIsChatStreaming] = useState(false);

  const submitInput = async () => {
    setIsChatStreaming(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: inputText }],
        user: "Juan",
      }),
    });

    console.log("Edge function returned");

    if (!response.ok) {
      setIsChatStreaming(false);
      throw new Error(response.statusText);
    }

    const data = response.body;
    if (!data) {
      setIsChatStreaming(false);
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    setChatGPTResponse("");

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      setChatGPTResponse((prevValue) => prevValue + chunkValue);
    }

    setIsChatStreaming(false);
  };

  return (
    <div className="flex h-[95vh] w-full flex-col items-center">
      <Typography className="mt-4" color="white" variant="h4">
        Recetas-GPT
      </Typography>
      <Card
        className="m-8 h-5/6 w-5/6 max-w-lg flex-1"
        sx={{ background: "#ffffff1c" }}
        variant="outlined"
      >
        <CardContent className="flex h-full  flex-col">
          <div className="border-1 mb-4 h-[83%] flex-1 border border-[#262339]">
            <p className="m-4 h-[95%] overflow-scroll  overflow-x-hidden whitespace-pre-wrap text-[#c7c7c7]">
              {chatGPTResponse}
            </p>
          </div>
          <ChatInput
            inputText={inputText}
            setInputText={setInputText}
            onEnter={() => {
              console.log(inputText);
            }}
          />
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            className="mt-2 p-2"
            onClick={submitInput}
            disabled={isChatStreaming}
          >
            Aceptar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chat;
