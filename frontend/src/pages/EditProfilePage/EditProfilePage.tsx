import { Grid, Text, Box, Avatar, CommonButton, InputBox, Toggle, IconButton } from '@/common';
import { ReactComponent as TrashIcon } from '@/svgs/trash.svg';
import styled from 'styled-components';
import { UploadFile } from './UploadFile';
import {
  useFileUpload,
  usePatchNickName,
  useAuth,
  use2FA,
  use2FAMutation,
  use2FADeleteMutation,
  use2FAVerifyMutation,
  useInput,
} from '@/hooks';
import { useState } from 'react';

interface EditFormProps {
  desc: string;
  label: string;
  value: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
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
          {onClick && (
            <Box backgroundColor="gray200" width="64rem">
              <Grid container="flex" justifyContent="end" alignItems="center" size={{ height: '100%', padding: 'sm' }}>
                <CommonButton size="md" onClick={onClick}>
                  {value}
                </CommonButton>
              </Grid>
            </Box>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export const EditProfilePage = () => {
  const [toggle, setToggle] = useState(false);
  const handleToggle = () => {
    setToggle(!toggle);
  };

  const { userInfo, refetch: refetchAuth } = useAuth();
  const { data, refetch: refetch2FA } = use2FA();

  const { selectedFile, handleFileChange, handleUpload } = useFileUpload();

  const { value: nickName, onChange: handleNickName } = useInput(userInfo.nickname);
  const { value: email, onChange: handleEmail } = useInput(data.twoFa ? data.twoFa : '');
  const { value: verify, onChange: handleVerify } = useInput('');
  const { handleSubmit: handleNickNameSubmit } = usePatchNickName({ nickName, onSuccess: refetchAuth });
  const { handleSubmit: handleEmailSubmit } = use2FAMutation({ twoFAEmail: email ?? '' });
  const { handleSubmit: handleVerifySubmit } = use2FAVerifyMutation({ code: verify, onSuccess: refetch2FA });
  const { handleSubmit: handleDeleteSubmit } = use2FADeleteMutation({ onSuccess: refetch2FA });

  return (
    <Grid container="flex" direction="column" justifyContent="center" size={{ maxWidth: '100rem' }}>
      <EditForm desc="Profile" label="Avatar" value="Upload & Save" onClick={handleUpload}>
        <Grid container="flex" alignItems="center" gap={3}>
          <Avatar size="lg" src={selectedFile ? URL.createObjectURL(selectedFile) : userInfo.image} />
          <UploadFile onChange={handleFileChange} />
        </Grid>
      </EditForm>
      <StyledLine />
      <EditForm desc="Account Information" label="UserName" value="Save" onClick={handleNickNameSubmit}>
        <InputBox sizes="sm" placeholder={userInfo.nickname} onChange={handleNickName} />
      </EditForm>
      <StyledLine />
      <EditForm desc="Two-factor authentication" label="2FA" value="Verify">
        {data.twoFa ? (
          <Grid container="flex" direction="row" justifyContent="space-between" alignItems="center">
            <Text size="md" color="primary">
              {data.twoFa}
            </Text>
            <IconButton onClick={handleDeleteSubmit}>
              <TrashIcon />
            </IconButton>
          </Grid>
        ) : (
          <Grid container="flex" direction="column" justifyContent="space-between" alignItems="start" gap={3}>
            <Toggle isToggle={toggle} onChange={handleToggle} />
            <Grid container="flex" direction="row-reverse" justifyContent="end" alignItems="center" gap={2}>
              {toggle ? (
                <Grid container="flex" direction="column" justifyContent="end" alignItems="center" gap={2}>
                  <Grid container="flex" direction="row-reverse" justifyContent="space-between" alignItems="center">
                    <CommonButton size="md" onClick={handleEmailSubmit}>
                      Send Verify Code
                    </CommonButton>
                    <InputBox sizes="sm" placeholder="Email" onChange={handleEmail} />
                  </Grid>
                  <Grid container="flex" direction="row-reverse" justifyContent="space-between" alignItems="center">
                    <CommonButton size="md" onClick={handleVerifySubmit}>
                      Verify
                    </CommonButton>
                    <InputBox sizes="sm" placeholder="CODE" onChange={handleVerify} />
                  </Grid>
                </Grid>
              ) : (
                <Text size="md">Disabled</Text>
              )}
            </Grid>
          </Grid>
        )}
      </EditForm>
    </Grid>
  );
};
