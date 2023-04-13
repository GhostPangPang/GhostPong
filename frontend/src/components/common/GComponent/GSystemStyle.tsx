import theme from '@/assets/styles/theme';

export type Theme = typeof theme;

export type GSystemProps = {
  [key in keyof typeof theme]?: keyof (typeof theme)[key];
};

export const getSystemStyle = (
  currentTheme: Theme | undefined,
  { color, backgroundColor, weight, fontSize, borderRadius }: GSystemProps,
) => {
  if (!currentTheme) return {};
  return {
    color: color ? currentTheme.color[color] : undefined,
    backgroundColor: backgroundColor ? currentTheme.color[backgroundColor] : undefined,
    fontWeight: weight ? currentTheme.weight[weight] : undefined,
    fontSize: fontSize ? currentTheme.fontSize[fontSize] : undefined,
    borderRadius: borderRadius ? currentTheme.borderRadius[borderRadius] : undefined,
  };
};
