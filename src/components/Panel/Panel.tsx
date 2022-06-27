import { ReactNode } from "react";
import styled from "styled-components";
import { palette } from "../../styles/palette";

interface PanelProps {
  children: ReactNode;
  flex?: boolean;
  isActive?: boolean;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  marginTop?: number;
}

const StyledPanel = styled.div<
  Pick<
    PanelProps,
    | "flex"
    | "isActive"
    | "marginBottom"
    | "marginLeft"
    | "marginRight"
    | "marginTop"
  >
>`
  background-color: ${(props) =>
    props.isActive ? palette.gray.light : palette.gray.default};
  border-width: 1px;
  border-style: solid;
  border-color: ${(props) =>
    props.isActive ? palette.gray.bright + "cc" : palette.gray.light};
  border-radius: 4px;
  box-shadow: ${(props) =>
    props.isActive
      ? `inset 0 0 0 4px ${palette.gray.lighter}`
      : "0 0 0 1px black"};
  margin-bottom: ${(props) =>
    props.marginBottom ? props.marginBottom + "rem" : "unset"};
  margin-left: ${(props) =>
    props.marginLeft ? props.marginLeft + "rem" : "unset"};
  margin-right: ${(props) =>
    props.marginRight ? props.marginRight + "rem" : "unset"};
  margin-top: ${(props) =>
    props.marginTop ? props.marginTop + "rem" : "unset"};
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex: ${(props) => (props.flex ? "1" : "unset")};
`;

export const Panel = ({
  children,
  flex,
  isActive,
  marginBottom,
  marginLeft,
  marginRight,
  marginTop,
}: PanelProps) => (
  <StyledPanel
    isActive={isActive}
    flex={flex}
    marginBottom={marginBottom}
    marginLeft={marginLeft}
    marginRight={marginRight}
    marginTop={marginTop}
  >
    {children}
  </StyledPanel>
);
