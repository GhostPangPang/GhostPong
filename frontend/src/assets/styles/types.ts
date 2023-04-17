import theme from './theme';

export type Theme = typeof theme;
export type Color = keyof Theme['color'];
export type FontSize = keyof Theme['fontSize'];
export type FontWeight = keyof Theme['fontWeight'];
