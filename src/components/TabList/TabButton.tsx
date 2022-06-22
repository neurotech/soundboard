import styled from "styled-components";
import { palette } from "../../styles/palette";

export const TabButton = styled.button<{ isActive: boolean }>`
  cursor: pointer;
  background-color: ${(props) =>
    props.isActive ? palette.yellow.default + 20 : palette.gray.dark};

  border: 1px solid ${palette.gray.darker};
  border-right-width: ${(props) => (props.isActive ? "2px" : "1px")};
  border-right-color: ${(props) =>
    props.isActive ? palette.yellow.default : palette.gray.darker};

  box-shadow: ${(props) =>
    props.isActive ? "" : `inset 0 1px 0 ${palette.gray.lighter}`};
  color: white;
  font-size: 14px;
  padding: 0.5rem;
  user-select: none;
  text-shadow: 1px 1px 0 ${palette.gray.darker};
  text-align: left;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  min-height: 2.75rem;
  outline: none;

  :hover {
    background-color: ${(props) =>
      props.isActive ? palette.blue.darker : palette.gray.dark + "80"};
    cursor: ${(props) => (props.isActive ? "not-allowed" : "pointer")};
  }

  :active {
    background-color: ${palette.gray.light};
    color: ${palette.gray.bright};
  }

  transition: border-color 0.12s, background-color 0.12s, box-shadow 0.12s,
    color 0.12s;

  :first-child {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }

  :last-child {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
`;
