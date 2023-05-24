export interface NewChat {
  channelId: string;
  senderId: number;
  senderNickname: string;
  createdAt: Date | string;
  content: string;
}
