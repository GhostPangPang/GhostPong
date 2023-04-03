const color = {
  primary: '#7875FF',
  background: '#2F2F2F',
  foreground: '#FFFFFF',
};

const weight = {
  bold: 700,
  medium: 500,
  regular: 400,
  light: 300,
  thin: 100,
};

const fontSize = {
  xxs: '1.2rem', // 12px
  xs: '1.4rem', // 14px
  sm: '1.6rem', // 16px
  md: '1.8rem', // 18px
  lg: '2rem', // 20px
  xl: '2.4rem', // 24px
};

const responsive = {
  mobile: '@media (max-width: 767px)',
  tablet: '@media (min-width: 768px) and (max-width: 1059px)',
  pc: '@media (min-width: 1060px)',
};

const borderRadius = {
  sm: '4px',
  md: '8px',
};

const theme = {
  color,
  weight,
  fontSize,
  responsive,
  borderRadius,
};

export default theme;
