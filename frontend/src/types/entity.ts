import { UserInfo } from '@/dto/user';
import { FriendResponse } from '@/dto/friend/response';
import { MessageResponse } from '@/dto/message/response';

export type User = UserInfo;

export type Message = MessageResponse['messages'][number];

export type Friend = FriendResponse['friends'][number];
