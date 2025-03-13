interface ColorPalette {
  [key: string]: string;
}

interface ColorPalettes {
  primary: ColorPalette;
  secondary: ColorPalette;
  background: ColorPalette;
  danger: ColorPalette;
  success: ColorPalette;
  warning: ColorPalette;
}

const colorPalettes: ColorPalettes = {
  primary: {
    100: '#0E291C',
    200: '#007A12',
    300: '#A7EFB2',
    400: '#E0F9E4',
    DEFAULT: '#5DC76D'
  },
  secondary: {
    100: '#1D3257',
    200: '#6FACCD',
    DEFAULT: '#0E1829'
  },
  background: {
    '100': '#F3F3F3',
    '200': '#6B7280',
    '300': '#111827',
    DEFAULT: '#FFFFFF'
  },
  danger: {
    DEFAULT: '#C0113C'
  },
  warning: {
    DEFAULT: '#B75F19'
  },
  success: {
    '100': '#088477',
    '200': '#007A12',
    DEFAULT: '#088477'
  }
};

const getColor = (palette: keyof ColorPalettes, shade: string): string =>
  colorPalettes[palette][shade] || 'transparent';

export const generateColors = (palette: keyof ColorPalettes): ColorPalette => ({
  50: getColor(palette, '50'),
  100: getColor(palette, '100'),
  200: getColor(palette, '200'),
  300: getColor(palette, '300'),
  400: getColor(palette, '400'),
  500: getColor(palette, '500'),
  600: getColor(palette, '600'),
  700: getColor(palette, '700'),
  800: getColor(palette, '800'),
  900: getColor(palette, '900'),
  DEFAULT: getColor(palette, 'DEFAULT')
});
