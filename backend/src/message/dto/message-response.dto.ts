type MessageInfo = {
  id: number;
  senderId: number;
  content: string;
  createdAt: Date;
};

export class MessageResponseDto {
  messages: MessageInfo[];
}
