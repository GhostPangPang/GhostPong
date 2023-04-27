export interface MessageResponse {
  messages: {
    id: number;
    senderId: number;
    content: string;
    createdAt: Date;
  }[];
}
