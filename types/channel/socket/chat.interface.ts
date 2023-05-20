export interface Chat {
  channelId: string;
  senderId: number;
  createdAt: Date | string;
  content: string;
}
