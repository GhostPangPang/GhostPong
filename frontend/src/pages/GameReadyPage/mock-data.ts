import { FriendResponse } from '@/dto/friend/response';
export interface PlayerInfo {
  id: number;
  nickname: string;
  image: string;
  role: 'owner' | 'admin' | 'member';
}

export interface ChannelInfo {
  id: number;
  name: string;
  players: PlayerInfo[];
  observers: PlayerInfo[];
}

export const CurrentUserId = 1;

export const chnnelInfoMockData: ChannelInfo = {
  id: 1,
  name: '방 이름',
  players: [
    {
      id: 1,
      nickname: '플레이어 1',
      image: 'https://i.pravatar.cc/150?img=1',
      role: 'admin',
    },
    {
      id: 2,
      nickname: '플레이어 2',
      image: 'https://i.pravatar.cc/150?img=2',
      role: 'owner',
    },
  ],
  observers: [
    {
      id: 3,
      nickname: '관전자 1',
      image: 'https://i.pravatar.cc/150?img=3',
      role: 'member',
    },
    {
      id: 4,
      nickname: '관전자 2',
      image: 'https://i.pravatar.cc/150?img=4',
      role: 'member',
    },
    {
      id: 5,
      nickname: '관전자 3',
      image: 'https://i.pravatar.cc/150?img=5',
      role: 'member',
    },
    {
      id: 6,
      nickname: '관전자 4',
      image: 'https://i.pravatar.cc/150?img=6',
      role: 'member',
    },
    {
      id: 7,
      nickname: '관전자 5',
      image: 'https://i.pravatar.cc/150?img=7',
      role: 'member',
    },
    {
      id: 8,
      nickname: '관전자 6',
      image: 'https://i.pravatar.cc/150?img=8',
      role: 'member',
    },
    {
      id: 9,
      nickname: '관전자 7',
      image: 'https://i.pravatar.cc/150?img=9',
      role: 'member',
    },
    {
      id: 10,
      nickname: '관전자 8',
      image: 'https://i.pravatar.cc/150?img=10',
      role: 'member',
    },
  ],
};

export const friendMockData: FriendResponse = {
  friends: [
    {
      id: 244,
      lastMessageTime: '2022-05-15T14:52:48.536Z',
      lastViewTime: null,
      status: 'online',
      user: {
        id: 1,
        nickname: 'friend1',
        image: 'https://i.pravatar.cc/150?img=11',
        exp: 42,
      },
    },
    {
      id: 11,
      lastMessageTime: null,
      lastViewTime: null,
      status: 'game',
      user: {
        id: 2,
        nickname: 'friend2',
        image: 'https://i.pravatar.cc/150?img=12',
        exp: 42,
      },
    },
    {
      id: 123,
      lastMessageTime: '2022-07-20T09:30:00.000Z',
      lastViewTime: '2022-07-20T09:25:00.000Z',
      status: 'offline',
      user: {
        id: 3,
        nickname: 'friend3',
        image: 'https://i.pravatar.cc/150?img=13',
        exp: 30,
      },
    },
    {
      id: 456,
      lastMessageTime: '2022-09-05T18:45:30.000Z',
      lastViewTime: '2022-09-05T18:40:00.000Z',
      status: 'online',
      user: {
        id: 4,
        nickname: 'friend4',
        image: 'https://i.pravatar.cc/150?img=14',
        exp: 50,
      },
    },
    {
      id: 789,
      lastMessageTime: '2022-10-10T12:00:00.000Z',
      lastViewTime: '2022-10-10T11:55:00.000Z',
      status: 'offline',
      user: {
        id: 5,
        nickname: 'friend5',
        image: 'https://i.pravatar.cc/150?img=15',
        exp: 20,
      },
    },
    {
      id: 101,
      lastMessageTime: '2022-11-15T08:30:00.000Z',
      lastViewTime: '2022-11-15T08:25:00.000Z',
      status: 'online',
      user: {
        id: 6,
        nickname: 'friend6',
        image: 'https://i.pravatar.cc/150?img=16',
        exp: 70,
      },
    },
    {
      id: 222,
      lastMessageTime: null,
      lastViewTime: null,
      status: 'game',
      user: {
        id: 7,
        nickname: 'friend7',
        image: 'https://i.pravatar.cc/150?img=17',
        exp: 55,
      },
    },
    {
      id: 333,
      lastMessageTime: '2023-01-01T00:00:00.000Z',
      lastViewTime: '2023-01-01T00:00:00.000Z',
      status: 'offline',
      user: {
        id: 8,
        nickname: 'friend8',
        image: 'https://i.pravatar.cc/150?img=18',
        exp: 45,
      },
    },
    {
      id: 444,
      lastMessageTime: '2023-02-14T16:30:00.000Z',
      lastViewTime: '2023-02-14T16:25:00.000Z',
      status: 'online',
      user: {
        id: 9,
        nickname: 'friend9',
        image: 'https://i.pravatar.cc/150?img=19',
        exp: 60,
      },
    },
    {
      id: 555,
      lastMessageTime: '2023-03-20T20:15:30.000Z',
      lastViewTime: '2023-03-20T20:10:00.000Z',
      status: 'offline',
      user: {
        id: 10,
        nickname: 'friend10',
        image: 'https://i.pravatar.cc/150?img=20',
        exp: 35,
      },
    },
  ],
};
