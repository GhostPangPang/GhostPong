import { GameButton } from '@/common/Button/GameButton';
import { Text } from '@/common/Text';
import { Grid } from '@/layout/Grid';
import { post } from '@/libs/api';
import { Color } from '@/types/style';
import { useState } from 'react';
import styled from 'styled-components';

export const RegisterPage = () => {
  const [nickname, setNickname] = useState<string>('');

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.toLowerCase();
    setNickname(e.target.value);
  };

  const handleRegister = async () => {
    try {
      await post('user', { nickname });
    } catch (e) {
      console.log('error', e);
    }
  };

  return (
    <Grid
      as="section"
      container="flex"
      direction="column"
      justifyContent="center"
      alignItems="center"
      rowGap={3}
      size={{ height: '100%' }}
    >
      <GameText size="xl" weight="black">
        닉네임을 입력해주세요
      </GameText>
      <GameInput color="secondary" placeholder="nickname" onInput={handleInput} value={nickname} />
      <GameButton size="md" color="primary" onClick={handleRegister}>
        START
      </GameButton>
    </Grid>
  );
};

const GameText = styled(Text)`
  font-family: 'CookieRun', 'ChailceNoggin';
`;

export interface GameInputProps {
  color?: Color;
}

const GameInput = styled.input<GameInputProps>`
  width: 36rem;
  height: 4.8rem;
  border-radius: 0.8rem;
  padding: 0.8rem 1.6rem;

  font-family: 'ChailceNoggin';
  color: ${(props) => props.theme.color.foreground};
  font-weight: ${(props) => props.theme.fontWeight.bold};
  font-size: 2rem;

  text-decoration: none;

  border: 3px solid;
  border-color: ${(props) => (props.color ? props.theme.color[props.color] : props.theme.color.primary)};
`;
