import { CommonButton, Grid, Text } from '@/common';
import { useNavigate } from 'react-router-dom';

interface RouteErrorPageProps {
  code: number;
  message?: string;
}

export const RouteErrorPage = ({ code, message }: RouteErrorPageProps) => {
  const navigate = useNavigate();
  return (
    <Grid
      as="section"
      container="flex"
      direction="row"
      alignItems="center"
      justifyContent="center"
      size={{ height: '100%' }}
    >
      <Grid
        container="flex"
        direction="column"
        alignItems="center"
        justifyContent="center"
        gap={2}
        size={{ width: '50%', height: '50%' }}
      >
        <Grid container="flex" direction="row" alignItems="center" justifyContent="center" gap={2}>
          <Text size="xxxl" fontFamily="game">
            {code.toString()}
          </Text>
          <img src="/svg/error_ghost.svg" alt="404" height="80px" />
        </Grid>
        <Text size="lg">{message ?? 'Page Not Found...'}</Text>
        <Grid
          container="flex"
          direction="row"
          gap={1}
          justifyContent="center"
          alignItems="center"
          size={{ padding: 'md' }}
        >
          <CommonButton size="md" onClick={() => navigate('/', { replace: true })}>
            로비로돌아가기
          </CommonButton>
          <CommonButton size="md" onClick={() => navigate(-1)}>
            뒤로가기
          </CommonButton>
        </Grid>
      </Grid>
    </Grid>
  );
};
