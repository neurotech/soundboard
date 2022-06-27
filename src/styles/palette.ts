interface PaletteColor {
  bright?: string;
  lighter?: string;
  light: string;
  default: string;
  dark: string;
  darker?: string;
  dim?: string;
}

export const palette: Record<string, PaletteColor> = {
  blue: {
    light: "#7d9cff",
    default: "#5c83ff",
    dark: "#374f99",
    dim: "#5c83ff1f",
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
    dim: "#0560294f",
  },
  pink: {
    light: "#ffa4f3",
    default: "#ff7dee",
    dark: "#b358a7",
    dim: "#ff7dee1a",
  },
  purple: {
    light: "#c4b1ff",
    default: "#a78aff",
    dark: "#4f3f80",
    dim: "#a78aff1a",
  },
  red: {
    lighter: "#ff88a6",
    light: "#ff6088",
    default: "#ff2058",
    dark: "#460012",
    darker: "#2a000b",
    dim: "#400d196e",
  },
  yellow: {
    lighter: "#ffe3b1",
    light: "#ffc561",
    default: "#ffb83c",
    dark: "#68460b",
    dim: "#ffb83c33",
  },
};
