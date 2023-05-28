import styled from 'styled-components';
import { Rank } from '@/libs/utils';

const Iron = '/svg/iron.svg';
const Bronze = '/svg/bronze.svg';
const Silver = '/svg/silver.svg';
const Gold = '/svg/gold.svg';
const Platinum = '/svg/platinum.svg';
const Diamond = '/svg/diamond.svg';

export interface RankBadgeProps {
  rank: Rank;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'auto';
}

const badges: Record<Rank, string> = {
  iron: Iron,
  bronze: Bronze,
  silver: Silver,
  gold: Gold,
  platinum: Platinum,
  diamond: Diamond,
};

export const RankBadge = styled.img.attrs<RankBadgeProps>((props) => ({
  src: badges[props.rank],
}))<RankBadgeProps>`
  ${(props) => {
    switch (props.size) {
      case 'sm':
        return `
        width: 1.8rem;
        height: 1.8rem;
        `;
      case 'md':
        return `
        width: 4rem;
        height: 4rem;
        `;
      case 'lg':
        return `
        width: 6.4rem;
        height: 6.4rem;
        `;
      case 'xl':
        return `
        width: 12rem;
        height: 12rem;
        `;
      case 'auto':
        return `
        width: auto;
        height: auto;
        `;
    }
  }}
  position: relative;
`;
