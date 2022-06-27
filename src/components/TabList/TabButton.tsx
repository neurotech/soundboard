import styled, { css } from "styled-components";
import { palette } from "../../styles/palette";

const inactiveTab = css`
  background: ${palette.gray.dark};
`;

const activeTab = css`
  background: linear-gradient(
    270deg,
    ${palette.yellow.light} 0%,
    ${palette.yellow.light} 2px,
    ${palette.yellow.default + 50} 2px,
    ${palette.yellow.default + 50} 100%
  );
`;

const activeTabHover = css`
  background: ${palette.yellow.default + 10};
`;

export const TabButton = styled.button<{ isActive: boolean }>`
  cursor: pointer;
  ${(props) => (props.isActive ? activeTab : inactiveTab)};

  border: 1px solid ${palette.gray.darker};

  box-shadow: ${(props) =>
    props.isActive ? "" : `inset 0 1px 0 ${palette.gray.lighter}`};
  color: ${(props) => (props.isActive ? palette.yellow.lighter : "white")};
  font-size: 14px;
  padding: 0.5rem;
  user-select: none;
  text-shadow: 1px 1px 0 ${palette.gray.darker};
  text-align: left;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  min-height: 2.85rem;
  outline: none;
  text-overflow: ellipsis;
  min-width: 0;

  :hover {
    ${(props) => (props.isActive ? activeTab : activeTabHover)};
    box-shadow: none;
    cursor: ${(props) => (props.isActive ? "not-allowed" : "pointer")};
    transition: background-color 0.2s, background-image 0.2s;
  }

  :active {
    ${activeTabHover};
    color: ${palette.gray.bright};
  }

  transition: border-color 0.12s, background-color 2s, background-image 2s,
    box-shadow 0.12s, color 0.12s;

  :hover :nth-child(1) {
    display: flex;
  }

  :first-child {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }

  :last-child {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
`;
