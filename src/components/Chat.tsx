/* eslint-disable @typescript-eslint/no-misused-promises */
import { Button, Card, CardContent, Typography } from "@mui/material";
import { useState } from "react";
import ChatInput from "./ChatInput";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ChatProps {}

const Chat: React.FC<ChatProps> = () => {
  const [inputText, setInputText] = useState("");
  const [chatGPTResponse, setChatGPTResponse] = useState("");

  const submitInput = async () => {
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
      throw new Error(response.statusText);
    }

    const data = response.body;
    if (!data) {
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
  };

  return (
    <div className="flex h-screen w-full flex-col items-center">
      <Typography className="mt-4" color="white" variant="h4">
        Recetas-GPT
      </Typography>
      <Card
        className="m-8 h-5/6 w-5/6 max-w-lg flex-1"
        sx={{ background: "#ffffff1c" }}
        variant="outlined"
      >
        <CardContent className="flex h-full  flex-col">
          <div className="border-1 mb-4 flex-1 border border-[#262339]">
            <Typography
              className="m-4 text-ellipsis"
              variant="body1"
              color="#c7c7c7"
            >
              {chatGPTResponse}
            </Typography>
          </div>
          <ChatInput
            inputText={inputText}
            setInputText={setInputText}
            onEnter={submitInput}
          />
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            className="mt-2 p-2"
            onClick={submitInput}
          >
            Aceptar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chat;
