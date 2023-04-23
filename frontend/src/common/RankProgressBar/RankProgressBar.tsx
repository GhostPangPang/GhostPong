import Iron from '@/svgs/iron.svg';
import Bronze from '@/svgs/bronze.svg';
import Silver from '@/svgs/silver.svg';
import Gold from '@/svgs/gold.svg';
import Platinum from '@/svgs/platinum.svg';
import Diamond from '@/svgs/diamond.svg';
import { ProgressBar } from '../ProgressBar';
import { useMemo } from 'react';
import styled from 'styled-components';
import { Grid } from '@/layout/Grid';

const IRON_MAX = 22;
const BRONZE_MAX = 42;
const SILVER_MAX = 84;
const GOLD_MAX = 126;
const PLATINUM_MAX = 168;
const DIAMOND_MAX = 210;

const IRON = 'iron';
const BRONZE = 'bronze';
const SILVER = 'silver';
const GOLD = 'gold';
const PLATINUM = 'platinum';
const DIAMOND = 'diamond';

type Rank = typeof IRON | typeof BRONZE | typeof SILVER | typeof GOLD | typeof PLATINUM | typeof DIAMOND;

const getRank = (exp: number): Rank => {
  if (exp >= PLATINUM_MAX) return DIAMOND;
  else if (exp >= GOLD_MAX) return PLATINUM;
  else if (exp >= SILVER_MAX) return GOLD;
  else if (exp >= BRONZE_MAX) return SILVER;
  else if (exp >= IRON_MAX) return BRONZE;
  else return IRON;
};

const getRankRange = (rank: Rank): [number, number] => {
  switch (rank) {
    case IRON:
      return [0, IRON_MAX];
    case BRONZE:
      return [IRON_MAX, BRONZE_MAX];
    case SILVER:
      return [BRONZE_MAX, SILVER_MAX];
    case GOLD:
      return [SILVER_MAX, GOLD_MAX];
    case PLATINUM:
      return [GOLD_MAX, PLATINUM_MAX];
    case DIAMOND:
      return [PLATINUM_MAX, DIAMOND_MAX];
    default:
      return [0, 0];
  }
};

const Badge = styled.img`
  position: absolute;
  left: 0;
`;

interface RankPrgressBarProps {
  exp: number;
}

export const RankProgressBar = ({ exp = 0 }: RankPrgressBarProps) => {
  const rank = useMemo(() => getRank(exp), [exp]);
  const [minExp, maxExp] = useMemo(() => getRankRange(rank), [rank]);
  const percentage = useMemo(() => {
    return Math.floor(((exp - minExp) / (maxExp - minExp)) * 100);
  }, [rank]);

  const badges: Record<Rank, string> = {
    iron: Iron,
    bronze: Bronze,
    silver: Silver,
    gold: Gold,
    platinum: Platinum,
    diamond: Diamond,
  };

  return (
    <Grid container="flex" alignItems="center">
      <Badge src={badges[rank]} />
      <ProgressBar percentage={percentage} />
    </Grid>
  );
};
