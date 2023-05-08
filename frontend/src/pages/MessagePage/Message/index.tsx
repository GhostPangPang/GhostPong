import { Box } from '@/common/Box';
import { Grid } from '@/layout/Grid';
import { useUserInfo } from '@/stores/userInfo';
import { MessageResponse } from '@/dto/message/response';
import { MessageContent } from './MessageContent';
import { MessageInput } from './MessageInput';

export const Message = ({ messages }: { messages: MessageResponse['messages'] }) => {
  const { userInfo } = useUserInfo();

  return (
    <>
      <Box display="flex" direction="column" height="100%" backgroundColor="surfaceMix" gap={1} overflowY="auto">
        <Grid container="flex" direction="column" justifyContent="end" flexGrow={1} rowGap={2} size={{ padding: 'sm' }}>
          {messages.map((item) => {
            return (
              <MessageContent
                side={item.senderId == userInfo.id ? 'right' : 'left'}
                content={item.content}
                key={item.id}
              />
            );
          })}
        </Grid>
      </Box>
      <MessageInput />
    </>
  );
};
