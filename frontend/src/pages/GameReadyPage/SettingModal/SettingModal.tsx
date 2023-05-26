import { useChannelMutation } from '@/hooks/channel';
import { Grid, Text, InputBox, GameButton } from '@/common';
import { SettingDropdown } from './SettingDropdown';
import { validatePassword } from '@/libs/utils/validate';
import { useState } from 'react';
import { useInput } from '@/hooks';
import { useRecoilValue } from 'recoil';
import { channelIdState } from '@/stores';

interface SettingModalProps {
  setIsOpen: (value: boolean) => void;
}

interface TypeSettingProps {
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}
interface PasswordSettingProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage: string;
}

const TypeSetting = ({ onChange: handleSelectedChange }: TypeSettingProps) => {
  return (
    <Grid container="flex" direction="row" justifyContent="space-between" alignItems="center">
      <Text size="md" weight="bold">
        Type
      </Text>
      <SettingDropdown onChange={handleSelectedChange} />
    </Grid>
  );
};

const PasswordSetting = ({ onChange: onChangePassword, errorMessage: errorPasswordMessage }: PasswordSettingProps) => {
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

export const SettingModal = ({ setIsOpen }: SettingModalProps) => {
  const { updateChannel } = useChannelMutation();
  const channelId = useRecoilValue(channelIdState);
  // mode info 추가되면 current mode로 초기화시킬에정
  const [selectedOption, setSelectedOption] = useState<'public' | 'protected' | 'private'>('public');
  const handleSelectedChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value as 'public' | 'protected' | 'private');
  };
  const {
    value: password,
    onChange: onChangePassword,
    errorMessage: errorPasswordMessage,
  } = useInput('', validatePassword);

  return (
    <Grid container="flex" direction="column" alignItems="center" size={{ height: '100%', padding: 'lg' }} gap={4}>
      <Text size="xl" weight="bold">
        Create a new game
      </Text>
      <TypeSetting onChange={handleSelectedChange} />
      {selectedOption === 'protected' && (
        <PasswordSetting onChange={onChangePassword} errorMessage={errorPasswordMessage} />
      )}
      <GameButton
        size="md"
        onClick={() => {
          updateChannel({
            channelId,
            mode: selectedOption,
            password: selectedOption !== 'protected' ? undefined : password,
          });
          setIsOpen(false);
        }}
      >
        UPDATE SETTING
      </GameButton>
    </Grid>
  );
};
