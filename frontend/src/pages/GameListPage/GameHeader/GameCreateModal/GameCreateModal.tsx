import { GameButton, Grid, InputBox, Text } from '@/common';
import { validatePassword, validateTitle } from '@/libs/utils/validate';
import { useState } from 'react';
import { useInput } from '@/hooks';
import { useChannelMutation } from '@/hooks/channel';
import { Dropdown } from '@/common/Dropdown';

interface GameTypeSettingProps {
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

interface GameTitleSettingProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage: string;
}

interface GamePasswordSettingProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage: string;
}

const GameTypeSetting = ({ onChange: handleSelectedChange }: GameTypeSettingProps) => {
  return (
    <Grid container="flex" direction="row" justifyContent="space-between" alignItems="center">
      <Text size="md" weight="bold">
        Type
      </Text>
      <Dropdown onChange={handleSelectedChange}>
        <Text as="option">public</Text>
        <Text as="option">protected</Text>
        <Text as="option">private</Text>
      </Dropdown>
    </Grid>
  );
};

const GameTitleSetting = ({ onChange: onChangeTitle, errorMessage: errorTitleMessage }: GameTitleSettingProps) => {
  return (
    <Grid container="flex" direction="row" justifyContent="space-between" alignItems="center">
      <Text size="md" weight="bold">
        Title
      </Text>
      <Grid container="flex" direction="column" alignItems="end">
        <Text size="sm" weight="bold" color="warning">
          {errorTitleMessage}
        </Text>
        <InputBox sizes="md" placeholder="방 제목을 입력해주세요." onChange={onChangeTitle} />
      </Grid>
    </Grid>
  );
};

const GamePasswordSetting = ({
  onChange: onChangePassword,
  errorMessage: errorPasswordMessage,
}: GamePasswordSettingProps) => {
  return (
    <Grid container="flex" direction="row" justifyContent="space-between" alignItems="center">
      <Text size="md" weight="bold">
        Password
      </Text>
      <Grid container="flex" direction="column" alignItems="end">
        <Text size="sm" weight="bold" color="warning">
          {errorPasswordMessage}
        </Text>
        <InputBox type="password" sizes="md" placeholder="비밀번호" onChange={onChangePassword} />
      </Grid>
    </Grid>
  );
};

export const GameCreateModal = () => {
  const { createChannel } = useChannelMutation();
  const [selectedOption, setSelectedOption] = useState<'public' | 'protected' | 'private'>('public');
  const { value: title, onChange: onChangeTitle, errorMessage: errorTitleMessage } = useInput('', validateTitle);
  const {
    value: password,
    onChange: onChangePassword,
    errorMessage: errorPasswordMessage,
  } = useInput('', validatePassword);

  const handleSelectedChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value as 'public' | 'protected' | 'private');
  };

  return (
    <Grid container="flex" direction="column" alignItems="center" size={{ height: '100%', padding: 'lg' }} gap={4}>
      <Text size="xl" weight="bold">
        Create a new game
      </Text>
      <GameTypeSetting onChange={handleSelectedChange} />
      <GameTitleSetting onChange={onChangeTitle} errorMessage={errorTitleMessage} />
      {selectedOption === 'protected' && (
        <GamePasswordSetting onChange={onChangePassword} errorMessage={errorPasswordMessage} />
      )}
      <GameButton
        size="md"
        onClick={() =>
          createChannel({
            name: title,
            mode: selectedOption,
            password: selectedOption !== 'protected' ? undefined : password,
          })
        }
      >
        CREATE GAME
      </GameButton>
    </Grid>
  );
};
