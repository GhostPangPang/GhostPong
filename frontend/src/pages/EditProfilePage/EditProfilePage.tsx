import { Grid } from '@/layout/Grid';
import { Text } from '@/common/Text';
import { Box } from '@/common/Box';
import styled from 'styled-components';
import { Avatar } from '@/common/Avatar';
import { backgrounds } from 'polished';
// import { CommonButton } from '@/common/CommonButton';
import { darken, lighten } from 'polished';

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

const ChcekBox = styled.input`
  width: 1.5rem;
  height: 1.5rem;
  border: 0.05rem solid;
  font-size: 1.5rem;
  background-color: transparent;
  border-radius: 0.375rem;
  border-color: white;
  color: white;
`;

const InputBox = styled.input`
  width: 50%;
  height: 3rem;
  border: 0.05rem solid;
  font-size: 1.5rem;
  background-color: transparent;
  border-radius: 0.375rem;
  border-color: white;
  color: white;
`;

const EditButton = styled.button`
  width: 20%;
  height: 100%;
  border: 0.05rem solid;
  font-size: 1.5rem;
  background-color: ${(props) => props.theme.color.gray100};
  border-radius: 0.375rem;
  border-color: white;
  padding-top: 1rem;
  padding-bottom: 1rem;
  &:hover {
    background: ${(props) => lighten(0.1, props.theme.color.gray100)};
  }
  &:active {
    background: ${(props) => darken(0.1, props.theme.color.gray100)};
  }
`;

const EditButton2 = styled.button`
  width: 20%;
  height: 100%;
  border: 0.05rem solid;
  font-size: 1.5rem;
  background-color: ${(props) => props.theme.color.gray200};
  border-radius: 0.375rem;
  border-color: #ffffff;
  color: #ffffff;
  padding-top: 1rem;
  padding-bottom: 1rem;
  &:hover {
    background: ${(props) => lighten(0.1, props.theme.color.gray100)};
  }
  &:active {
    background: ${(props) => darken(0.1, props.theme.color.gray100)};
  }
`;

const EditForm = ({ desc, label, value, children }: EditFormProps) => {
  return (
    <Grid container="grid" rows={1} columns={3}>
      <Grid gridColumn="span 1/span 1" size={{ height: '100%', padding: 'md' }}>
        <Text size="xl">{desc}</Text>
      </Grid>
      <Grid gridColumn="span 2/span 2" size={{ height: '100%', padding: 'md' }}>
        <Grid container="flex" direction="column" justifyContent="center" alignItems="center">
          <Box backgroundColor="gray300">
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
          <Box backgroundColor="gray200">
            <Grid container="flex" justifyContent="end" alignItems="center" size={{ height: '100%', padding: 'sm' }}>
              <EditButton>{value}</EditButton>
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
      <EditForm desc="Account Information" label="UserName" value="Save">
        <InputBox type="text" />
      </EditForm>
      <StyledLine />
      <EditForm desc="Email" label="Email" value="Save">
        <Grid container="flex" justifyContent="space-between" alignItems="center">
          <InputBox type="text" />
          <Grid container="flex" justifyContent="end" alignItems="center" gap={2}>
            <Text size="xs" color="gray100">
              2FA Setting
            </Text>
            <ChcekBox type="checkbox" />
          </Grid>
        </Grid>
      </EditForm>
      <StyledLine />
      <EditForm desc="Profile" label="Avatar" value="Upload & Save">
        <Grid container="flex" alignItems="center" gap={3}>
          <Avatar size="lg" />
          <EditButton2>Upload</EditButton2>
        </Grid>
      </EditForm>
    </Grid>
  );
};
