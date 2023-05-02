export interface Player {
  id: number;
  nickname: string;
  image: string;
  exp: number;
}

export interface HistoryProps {
  id: number;
  winner: Player;
  loser: Player;
  winnerScore: number;
  loserScore: number;
  createdAt: string;
}

export const historyMockData = {
  histories: [
    {
      id: 3,
      winner: {
        id: 1,
        nickname: 'nkim',
        image: '/asset/profile-1.gif',
        exp: 88,
      },
      loser: {
        id: 2,
        nickname: 'hannkim',
        image: '/asset/profile-2.png',
        exp: 42,
      },
      winnerScore: 10,
      loserScore: 3,
      createdAt: '2023-01-01T00:00:00.000Z',
    },
    {
      id: 4,
      winner: {
        id: 3,
        nickname: 'seungsle',
        image: '/asset/profile-1.gif',
        exp: 200,
      },
      loser: {
        id: 2,
        nickname: 'hannkim',
        image: '/asset/profile-2.png',
        exp: 42,
      },
      winnerScore: 10,
      loserScore: 0,
      createdAt: '2023-01-01T00:00:00.000Z',
    },
    {
      id: 5,
      winner: {
        id: 1,
        nickname: 'nkim',
        image: '/asset/profile-1.gif',
        exp: 42,
      },
      loser: {
        id: 2,
        nickname: 'hannkim',
        image: '/asset/profile-2.png',
        exp: 42,
      },
      winnerScore: 10,
      loserScore: 9,
      createdAt: '2023-01-01T00:00:00.000Z',
    },
    {
      id: 6,
      winner: {
        id: 1,
        nickname: 'nkim',
        image: '/asset/profile-1.gif',
        exp: 42,
      },
      loser: {
        id: 2,
        nickname: 'hannkim',
        image: '/asset/profile-2.png',
        exp: 42,
      },
      winnerScore: 10,
      loserScore: 8,
      createdAt: '2023-01-01T00:00:00.000Z',
    },
    {
      id: 7,
      winner: {
        id: 1,
        nickname: 'nkim',
        image: '/asset/profile-1.gif',
        exp: 42,
      },
      loser: {
        id: 2,
        nickname: 'hannkim',
        image: '/asset/profile-2.png',
        exp: 42,
      },
      winnerScore: 10,
      loserScore: 6,
      createdAt: '2023-01-01T00:00:00.000Z',
    },
  ],
  histories_fetch: [
    {
      id: 8,
      winner: {
        id: 1,
        nickname: 'nkim',
        image: '/asset/profile-1.gif',
        exp: 42,
      },
      loser: {
        id: 2,
        nickname: 'hannkim',
        image: '/asset/profile-2.png',
        exp: 42,
      },
      winnerScore: 10,
      loserScore: 1,
      createdAt: '2023-01-01T00:00:00.000Z',
    },
    {
      id: 9,
      winner: {
        id: 1,
        nickname: 'nkim',
        image: '/asset/profile-1.gif',
        exp: 42,
      },
      loser: {
        id: 2,
        nickname: 'hannkim',
        image: '/asset/profile-2.png',
        exp: 42,
      },
      winnerScore: 10,
      loserScore: 2,
      createdAt: '2023-01-01T00:00:00.000Z',
    },
    {
      id: 10,
      winner: {
        id: 1,
        nickname: 'nkim',
        image: '/asset/profile-1.gif',
        exp: 42,
      },
      loser: {
        id: 2,
        nickname: 'hannkim',
        image: '/asset/profile-2.png',
        exp: 42,
      },
      winnerScore: 10,
      loserScore: 3,
      createdAt: '2023-01-01T00:00:00.000Z',
    },
  ],
};
