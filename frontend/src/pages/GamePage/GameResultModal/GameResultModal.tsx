import { gamePlayerState, gameResultState } from '@/stores';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { MemberInfo } from '@/dto/channel/socket';
import { Grid, WideModal, Text, Avatar, GameButton } from '@/common';

export const GameResultModal = ({ isEnd }: { isEnd: boolean }) => {
  const gamePlayer = useRecoilValue(gamePlayerState);
  const gameResult = useRecoilValue(gameResultState);

  const [winner, setWinner] = useState<MemberInfo>({
    userId: 0,
    nickname: 'nkim',
    image: 'https://avatars.githubusercontent.com/u/51353146?s=400&u=5dac46f1a37fee992df5da1b537262e917f5de42&v=4',
    role: 'admin',
  });
  const [loser, setLoser] = useState<MemberInfo>({
    userId: 0,
    nickname: 'hannkim',
    image: 'https://avatars.githubusercontent.com/u/51353146?s=400&u=5dac46f1a37fee992df5da1b537262e917f5de42&v=4',
    role: 'admin',
  });

  useEffect(() => {
    if (gameResult && gamePlayer.leftPlayer && gamePlayer.rightPlayer) {
      if (gameResult.winner.id === gamePlayer.leftPlayer.userId) {
        setWinner(gamePlayer.leftPlayer);
        setLoser(gamePlayer.rightPlayer);
      }
    }
  }, [gameResult]); // depth 고민해보기

  return (
    <WideModal isOpen={isEnd}>
      <Grid
        container="flex"
        direction="column"
        alignItems="center"
        justifyContent="center"
        gap={3}
        size={{ width: '50%' }}
      >
        <Text
          as="h1"
          fontFamily="game"
          color="primary"
          size="xxxl"
          shadow="lg"
          style={{ textShadow: '0.5px 0.5px 0.5px white' }}
        >
          Game Result
        </Text>
        <Grid container="flex" justifyContent="center" alignItems="center" gap={1.5}>
          <UserGameProfile nickname={winner.nickname} image={winner?.image} />

          <Text fontFamily="game" size="xxl" color="secondary">
            {gameResult.winner.score.toString()}
          </Text>

          <Text fontFamily="game" size="xxl" color="gray100">
            :
          </Text>

          <Text fontFamily="game" size="xxl" color="gray100">
            {gameResult.loser.score.toString()}
          </Text>

          <UserGameProfile nickname={loser.nickname} image={loser?.image} style={{ filter: 'grayscale(100%)' }} />
        </Grid>
        <Grid container="flex" justifyContent="center" alignItems="center" gap={2}>
          <GameButton size="md" color="foreground">
            나가기
          </GameButton>
          <GameButton size="md">대기페이지로</GameButton>
        </Grid>
      </Grid>
    </WideModal>
  );
};

interface UserGameProfileProps {
  nickname: string;
  image?: string;
  style?: React.CSSProperties;
}

const UserGameProfile = ({ nickname, image, style }: UserGameProfileProps) => {
  return (
    <Grid container="flex" direction="column" alignItems="center" gap={0.5} size={{ width: 'auto', padding: 'sm' }}>
      <Avatar size="llg" src={image} style={style} />
      <Text size="md">{nickname}</Text>
    </Grid>
  );
};
