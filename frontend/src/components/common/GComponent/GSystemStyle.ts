import theme from '@/assets/styles/theme';
import { WithoutNullableValues } from '@/types';

export type Theme = typeof theme;

export type GSystemProps = {
  [key in keyof Theme]?: keyof Theme[key];
};

export type GSystemStyle = {
  [key in keyof Theme]?: Theme[key][keyof Theme[key]];
};

// This function gets the system style from the current theme and the system props.
// It loops through the system props and gets the css prop and css prop key, then it gets the css value from the current theme.
// If the css value exists, then it is added to the styles object.
// It returns the styles object.

export const getSystemStyle = (currentTheme: Theme | undefined, sysProps: GSystemProps) => {
  const styles: WithoutNullableValues<GSystemStyle> = {};

  if (!currentTheme) return {};

  for (const prop in sysProps) {
    const cssProp = prop as keyof GSystemProps; // color
    const cssPropKey = sysProps[cssProp] as keyof GSystemProps[typeof cssProp];
    const cssValue = currentTheme[cssProp] && currentTheme[cssProp][cssPropKey];

    if (cssValue) {
      styles[cssProp] = cssValue;
    }
  }
  return styles;
};
