interface PaletteColor {
  bright?: string;
  lighter?: string;
  light: string;
  default: string;
  dark: string;
  darker?: string;
}

export const palette: Record<string, PaletteColor> = {
  blue: {
    light: "#7d9cff",
    default: "#5c83ff",
    dark: "#374f99",
  },
  gray: {
    bright: "#d3d3d4",
    lighter: "#37393d",
    light: "#2c2e33",
    default: "#212328",
    dark: "#17181c",
    darker: "#0e0e11",
  },
  green: {
    bright: "#9dffc4",
    lighter: "#6bffa6",
    light: "#3aff89",
    default: "#09ff6b",
    dark: "#07cc56",
  },
  pink: {
    light: "#ffa4f3",
    default: "#ff7dee",
    dark: "#b358a7",
  },
  purple: {
    light: "#c4b1ff",
    default: "#a78aff",
    dark: "#4f3f80",
  },
  red: {
    light: "#ff92ad",
    default: "#ff386a",
    dark: "#460012",
  },
  yellow: {
    light: "#ffc561",
    default: "#ffb83c",
    dark: "#68460b",
  },
};
