import { TextField } from "@mui/material";
import React from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ChatInputProps {
  inputText: string;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  onEnter: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputText,
  setInputText,
  onEnter,
}) => {
  return (
    <TextField
      variant="outlined"
      color="secondary"
      fullWidth
      sx={{
        input: { color: "#c7c7c7" },
      }}
      InputLabelProps={{
        style: { color: "#c7c7c7" },
      }}
      id="input-outlined"
      label="Ingresa los ingredientes"
      value={inputText}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(event.target.value);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onEnter();
        }
      }}
    />
  );
};

export default ChatInput;
