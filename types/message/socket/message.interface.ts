export interface Message {
  id: number;
  receiverId: number;
  createdAt: Date | string;
  content: string;
}
