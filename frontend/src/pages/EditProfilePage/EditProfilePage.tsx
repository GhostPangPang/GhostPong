import { Grid } from '@/layout/Grid';
import { Text } from '@/common/Text';
import { Box } from '@/common/Box';
import styled from 'styled-components';
import { Avatar } from '@/common/Avatar';
import { CommonButton } from '@/common/Button/CommonButton';
import { InputBox } from '@/common/InputBox';
import { Toggle } from '@/common/Toggle';

interface EditFormProps {
  desc: string;
  label: string;
  value: string;
  children?: React.ReactNode;
}

const StyledLine = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${(props) => props.theme.color.gray200};
`;

const EditForm = ({ desc, label, value, children }: EditFormProps) => {
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
              <CommonButton size="md">{value}</CommonButton>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export const EditProfilePage = () => {
  return (
    <Grid container="flex" direction="column" justifyContent="center" size={{ maxWidth: '100rem' }}>
      <EditForm desc="Profile" label="Avatar" value="Upload & Save">
        <Grid container="flex" alignItems="center" gap={3}>
          <Avatar size="lg" />
          <CommonButton size="md" backgroundColor="gray200" color="gray100">
            Upload
          </CommonButton>
        </Grid>
      </EditForm>
      <StyledLine />
      <EditForm desc="Account Information" label="UserName" value="Save">
        <InputBox sizes="sm" value="ghostking" placeholder="your nickname" />
      </EditForm>
      <StyledLine />
      <EditForm desc="Two-factor authentication" label="Email" value="Verify">
        <Grid container="flex" justifyContent="space-between" alignItems="center">
          <InputBox sizes="md" value="ghostking@gmail.com" placeholder="your email" />
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
