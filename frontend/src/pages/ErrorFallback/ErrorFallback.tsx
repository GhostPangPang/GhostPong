import { Grid, Text, CommonButton } from '@/common';
export const logError = (error: Error, info: { componentStack: string }) => {
  // Do something with the error, e.g. log to an external API
  console.log(error, info);
};

type FallbackComponentProps = {
  error: Error;
  resetErrorBoundary: () => void;
};

export const FallbackComponent = ({ error, resetErrorBoundary }: FallbackComponentProps) => {
  // const history = useHistory();
  const goBack = () => {
    resetErrorBoundary();
    window.history.back();
  };

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
