import { mix } from 'polished';

const surface = 'rgba(161, 161, 161, 0.28)';
const surfaceDark = 'rgba(16, 16, 16, 0.28)';
const gray100t = 'rgba(212, 212, 212, 0.85)';
const foregroundt = 'rgba(255, 255, 255, 0.85)';

const color = {
  primary: '#7875FF',
  secondary: '#61FFE3',
  background: '#2F2F2F',
  foreground: '#FFFFFF',
  foregroundt,
  gray100t,
  gray100: '#D4D4D4',
  gray150: '#A1A1A1',
  gray200: '#4A4A4A',
  gray300: '#3D3D3D',
  gray500: '#222222',
  surface,
  surfaceDark,
  surfaceMix: mix(0.4, surface, surfaceDark),
  online: '#70DFC5',
  gradient: 'linear-gradient(268.76deg, #7875ff, #61ffe3)',
  warning: '#FFC107',
  transparent: 'transparent',
};

const backgroundColor = color;

const fontWeight = {
  black: 900,
  bold: 700,
  medium: 500,
  regular: 400,
  light: 300,
  thin: 100,
};

const fontSize = {
  xxxs: '1rem', // 10px
  xxs: '1.2rem', // 12px
  xs: '1.4rem', // 14px
  sm: '1.6rem', // 16px
  md: '1.8rem', // 18px
  lg: '2rem', // 20px
  xl: '2.4rem', // 24px
  xxl: '3.2rem', // 32px
  xxxl: '4.8rem', // 48px
};

const borderRadius = {
  sm: '4px',
  md: '8px',
};

const boxShadow = {
  sm: '0px 2px 4px rgba(0, 0, 0, 0.25)',
  md: '0px 4px 8px rgba(0, 0, 0, 0.25)',
  lg: '0px 8px 16px rgba(0, 0, 0, 0.25)',
};

const textShadow = boxShadow;

const padding = {
  sm: '0.8rem',
  md: '1.6rem',
  lg: '2.4rem',
  layout: '0 2.5rem',
  header: '0 2.5rem',
  content: '0 4rem 4rem 4rem',
};

const theme = {
  color,
  backgroundColor,
  fontWeight,
  fontSize,
  borderRadius,
  boxShadow,
  textShadow,
  padding,
};

export default theme;
