import { UserInfo } from '@/dto/user';
import { FriendResponse } from '@/dto/friend/response';
import { MessageResponse } from '@/dto/message/response';

export type User = Omit<UserInfo, 'id'> & { id: number };

export type Message = MessageResponse['messages'][number];

export type Friend = FriendResponse['friends'][number];
