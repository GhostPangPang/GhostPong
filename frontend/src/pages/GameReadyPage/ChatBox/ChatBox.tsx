import { ChatContent } from './Chatcontent';
import { ChatInput } from './ChatInput';
import { useState } from 'react';
import { Grid } from '@/common';

export const ChatBox = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputFocus, setInputFocus] = useState(false);

  const addMessage = (message: string) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleInputFocus = () => {
    setInputFocus(true);
  };

  const handleInputBlur = () => {
    setInputFocus(false);
  };

  return (
    <Grid container="flex" direction="column-reverse" overflowY="hidden" style={{ transition: 'height 0.3s ease-out' }}>
      <ChatInput onSend={addMessage} onFocus={handleInputFocus} onBlur={handleInputBlur} />
      <ChatContent messages={messages} inputFocus={inputFocus} />
    </Grid>
  );
};
