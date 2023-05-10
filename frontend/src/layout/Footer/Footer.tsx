import { ReactComponent as GithubIcon } from '@/svgs/Github.svg';
import { ReactComponent as GhostIcon } from '@/svgs/GhostIcon.svg';
import { Grid } from '../Grid';
import { Text } from '@/common/Text';
import { Box } from '@/common/Box';

export const Footer = () => {
  return (
    <Grid container="flex" direction="column" rowGap={1.5} size={{ maxWidth: '100rem' }}>
      <Box as="section" height="100%" width="100rem" backgroundColor="transparent">
        <Grid container="flex" direction="column" justifyContent="center" alignItems="center" columnGap={3} margin={2}>
          <Text size="xs" color="gray100">
            © 2023. All rights reserved.
          </Text>
          <Grid container="flex" direction="row" justifyContent="center" alignItems="center" columnGap={3} margin={2}>
            <GithubIcon />
            <GhostIcon />
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};
