import { Grid, Text, CommonButton } from '@/common';
import { ApiError } from '@/libs/api';
import { useRouteError } from 'react-router-dom';
import { RouteErrorPage } from '../RouteErrorPage';

export const logError = (error: Error, info: { componentStack: string }) => {
  // Do something with the error, e.g. log to an external API
  console.log(error, info);
};

type FallbackComponentProps = {
  error: ApiError;
  resetErrorBoundary: () => void;
};

export const FallbackComponent = ({ error, resetErrorBoundary }: FallbackComponentProps) => {
  const goBack = () => {
    resetErrorBoundary();
    window.history.back();
  };

  if (error.statusCode === 404 || error.statusCode === 500) {
    return <RouteErrorPage code={error.statusCode} message={error.message} />;
  }
  return (
    <div>
      <Text size="md">{'error : ' + error.message}</Text>
      <Grid
        container="flex"
        direction="row"
        gap={3}
        justifyContent="center"
        alignItems="center"
        size={{ padding: 'md' }}
      >
        <CommonButton size="md" onClick={resetErrorBoundary}>
          다시시도
        </CommonButton>
        <CommonButton size="md" onClick={goBack}>
          뒤로가기
        </CommonButton>
      </Grid>
    </div>
  );
};
