import { Grid, Text, Box, Avatar, CommonButton, InputBox, Toggle } from '@/common';
import styled from 'styled-components';
import { UploadFile } from './UploadFile';
import { useFileUpload } from '@/hooks/useFileUpload';
import { usePatchNickName } from '@/hooks/usePatchNickName';
import { useState } from 'react';

interface EditFormProps {
  desc: string;
  label: string;
  value: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;
}

const StyledLine = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${(props) => props.theme.color.gray200};
`;

const EditForm = ({ desc, label, value, onClick, children }: EditFormProps) => {
  return (
    <Grid container="grid" rows={1} columns={3}>
      <Grid gridColumn="span 1/span 1" size={{ height: '100%', padding: 'md' }}>
        <Text size="xl">{desc}</Text>
      </Grid>
      <Grid gridColumn="span 2/span 2" size={{ height: '100%', padding: 'md' }}>
        <Grid container="flex" direction="column" justifyContent="center" alignItems="center">
          <Box backgroundColor="gray300" width="64rem">
            <Grid
              container="flex"
              direction="column"
              justifyContent="center"
              gap={1.5}
              size={{ height: '100%', padding: 'lg' }}
            >
              <Text as="label" size="md" weight="bold">
                {label}
              </Text>
              {children}
            </Grid>
          </Box>
          <Box backgroundColor="gray200" width="64rem">
            <Grid container="flex" justifyContent="end" alignItems="center" size={{ height: '100%', padding: 'sm' }}>
              <CommonButton size="md" onClick={onClick}>
                {value}
              </CommonButton>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export const EditProfilePage = () => {
  const { handleFileChange, fileUploadMutation } = useFileUpload();
  const { handleInputChange, handleSubmit } = usePatchNickName();
  const [email, setEmail] = useState('');

  const handleUpload = () => {
    fileUploadMutation.mutate();
  };

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handleEmail = () => {
    console.log('handleEmail');
  };

  return (
    <Grid container="flex" direction="column" justifyContent="center" size={{ maxWidth: '100rem' }}>
      <EditForm desc="Profile" label="Avatar" value="Upload & Save" onClick={handleUpload}>
        <Grid container="flex" alignItems="center" gap={3}>
          <Avatar size="lg" />
          <UploadFile handleFileChange={handleFileChange} />
        </Grid>
      </EditForm>
      <StyledLine />
      <EditForm desc="Account Information" label="UserName" value="Save" onClick={handleSubmit}>
        <InputBox sizes="sm" placeholder="your nickname" onChange={handleInputChange} />
      </EditForm>
      <StyledLine />
      <EditForm desc="Two-factor authentication" label="Email" value="Verify" onClick={handleEmail}>
        <Grid container="flex" justifyContent="space-between" alignItems="center">
          <InputBox sizes="md" value={email} placeholder="your email" onChange={onEmailChange} />
          <Grid container="flex" justifyContent="end" alignItems="center" gap={2}>
            <Text size="sm" color="gray100" weight="bold">
              2FA
            </Text>
            <Toggle />
          </Grid>
        </Grid>
      </EditForm>
    </Grid>
  );
};
