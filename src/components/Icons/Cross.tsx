import styled from "styled-components";
import { Color } from "../../App";
import { palette } from "../../styles/palette";
import { CommonIconProps, Icon } from "./Icon";

const StyledSVG = styled.svg<{ color?: Color }>`
  stroke: ${(props) => (props.color ? palette[props.color].light : "white")};
`;

export const Cross = ({ color, iconSize: size }: CommonIconProps) => (
  <Icon iconSize={size}>
    <StyledSVG
      color={color}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </StyledSVG>
  </Icon>
);
