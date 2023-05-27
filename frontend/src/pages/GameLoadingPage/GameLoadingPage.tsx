import { Grid, Loading, Text } from '@/common';
import { useGameStart } from '@/hooks/game';
import { post } from '@/libs/api';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const postCancelRandomGame = async () => {
  return await post('/game/random/cancel');
};

export const GameLoadingPage = () => {
  const navigate = useNavigate();
  const { mutate: cancelRandomGame } = useMutation(postCancelRandomGame);

  useGameStart({
    onGameStart: () => {
      console.log('random game start');
    },
  });

  useEffect(() => {
    window.onpopstate = function (event) {
      event.preventDefault();
      cancelRandomGame();
      navigate('/');
    };
  }, []);

  return (
    <Grid container="flex" direction="column" alignItems="center" gap={2}>
      <Loading />
      <AnimateText size="md">게임을 기다리는 중입니다...</AnimateText>
    </Grid>
  );
};

const moveUpDown = keyframes`
  0%, 100% {
      transform: translateY(0);
  }
  50% {
      transform: translateY(-10px);
  }
`;

const AnimateText = styled(Text)`
  animation: ${moveUpDown} 2s linear infinite;
`;
