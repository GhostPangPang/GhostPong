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

export type Rank = typeof IRON | typeof BRONZE | typeof SILVER | typeof GOLD | typeof PLATINUM | typeof DIAMOND;

export const getRank = (exp: number): Rank => {
  if (exp >= PLATINUM_MAX) return DIAMOND;
  else if (exp >= GOLD_MAX) return PLATINUM;
  else if (exp >= SILVER_MAX) return GOLD;
  else if (exp >= BRONZE_MAX) return SILVER;
  else if (exp >= IRON_MAX) return BRONZE;
  else return IRON;
};

export const getRankRange = (rank: Rank): [number, number] => {
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
