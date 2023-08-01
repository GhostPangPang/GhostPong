import { ReactComponent as Ghost } from '@/svgs/ghost-sm.svg';
import { Grid, Text, Box } from '@/common';

export const Footer = () => {
  return (
    <Grid
      container="flex"
      direction="column"
      alignItems="center"
      rowGap={1.5}
      size={{ width: '100vw', paddingTB: 4 }}
      style={{ marginTop: '5rem', backgroundColor: '#1E1E1E' }}
    >
      <Box as="section" height="100%" width="100rem" backgroundColor="transparent">
        <Grid container="flex" direction="column" justifyContent="center" alignItems="center" gap={1} margin={2}>
          <Ghost />
          <Text size="xs" color="gray100">
            © 2023. GhostPong. All rights reserved.
          </Text>
          <Text size="xxs" color="gray100t">
            nkim, jiskim, hannkim, san, seungsle
          </Text>
        </Grid>
      </Box>
    </Grid>
  );
};
