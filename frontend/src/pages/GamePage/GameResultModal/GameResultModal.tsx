import {
  channelDataState,
  gameIdState,
  gamePlayerState,
  gameResultState,
  gameStatusState,
  gameTypeState,
} from '@/stores';
import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { MemberInfo } from '@/dto/channel/socket';
import { Grid, WideModal, Text, Avatar, GameButton } from '@/common';
import { useNavigate } from 'react-router-dom';
import { useLeaveChannel, useAuth } from '@/hooks';

export const GameResultModal = ({ isEnd }: { isEnd: boolean }) => {
  const navigate = useNavigate();
  const { refetch: refetchAuth } = useAuth();
  const setChannelData = useSetRecoilState(channelDataState);
  const setGameStatus = useSetRecoilState(gameStatusState);

  const gameId = useRecoilValue(gameIdState);
  const gameType = useRecoilValue(gameTypeState);
  const gamePlayer = useRecoilValue(gamePlayerState);
  const gameResult = useRecoilValue(gameResultState);

  const { leaveChannel } = useLeaveChannel();
  const [count, setCount] = useState(5);
  const [winner, setWinner] = useState<MemberInfo>({
    userId: 0,
    nickname: '',
    image: '',
    role: 'admin',
  });
  const [loser, setLoser] = useState<MemberInfo>({
    userId: 0,
    nickname: '',
    image: '',
    role: 'admin',
  });

  useEffect(() => {
    refetchAuth();
    return () => {
      refetchAuth();
    };
  }, []);

  useEffect(() => {
    if (gameResult && gamePlayer.leftPlayer && gamePlayer.rightPlayer) {
      if (gameResult.winner.id === gamePlayer.leftPlayer.userId) {
        setWinner(gamePlayer.leftPlayer);
        setLoser(gamePlayer.rightPlayer);
      } else {
        setWinner(gamePlayer.rightPlayer);
        setLoser(gamePlayer.leftPlayer);
      }
    }
  }, [gameResult]); // depth 고민해보기

  useEffect(() => {
    if (!isEnd) return;
    if (count === 0) {
      if (gameType === 'normal') {
        handleGoToWaitingPage();
        return;
      } else {
        handleLeave();
        return;
      }
    }

    const countdownInterval = setInterval(() => {
      setCount(count - 1);
    }, 1000);

    return () => clearInterval(countdownInterval); // cleanup 함수
  }, [count, isEnd]);

  const handleLeave = () => {
    leaveChannel(gameId);
    navigate('/');
  };

  const handleGoToWaitingPage = () => {
    setChannelData((prev) => ({ ...prev, isInGame: false }));
    setGameStatus('waiting');
    // 5초 뒤에 ready로 바꾸기
    setTimeout(() => {
      setGameStatus('ready');
    }, 5000);
  };

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
        <Grid container="flex" justifyContent="center" alignItems="center" gap={2}>
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
          <GameButton size="md" color="foreground" onClick={handleLeave}>
            나가기
          </GameButton>
          {gameType === 'normal' && (
            <GameButton size="md" onClick={handleGoToWaitingPage} style={{ display: 'flex', justifyContent: 'center' }}>
              대기페이지로
              <Text size="xs" color="gray100" style={{ alignItems: 'end', marginLeft: '1.5px' }}>
                {count.toString()}
              </Text>
            </GameButton>
          )}
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
