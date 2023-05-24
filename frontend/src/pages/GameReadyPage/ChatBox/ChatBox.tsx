import { ChatContent } from './Chatcontent';
import { ChatInput } from './ChatInput';
import { useState } from 'react';
import { Grid } from '@/common';

export const ChatBox = () => {
  const [inputFocus, setInputFocus] = useState(false);

  const handleInputFocus = () => {
    setInputFocus(true);
  };

  const handleInputBlur = () => {
    setInputFocus(false);
  };

  return (
    <Grid container="flex" direction="column-reverse" overflowY="hidden" style={{ transition: 'height 0.3s ease-out' }}>
      <ChatInput onFocus={handleInputFocus} onBlur={handleInputBlur} />
      <ChatContent inputFocus={inputFocus} />
    </Grid>
  );
};
