import { createGlobalStyle } from "styled-components";
import { palette } from "./palette";

const fontFamily = `system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`;

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background-color: ${palette.gray.dark};
    display: flex;
    font-family: ${fontFamily};
    color: white;
    min-height: 100vh;
    width: 100%;
  }

  #root {
    display: flex;
    flex-direction: column;
    flex: 1;
  }


  button {
    font-family: ${fontFamily};
  }
`;
