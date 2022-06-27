import styled from "styled-components";
import { CommonIconProps, Icon } from "./Icon";

const StyledSVG = styled.svg<{ color?: string }>`
  stroke: ${(props) => props.color || "white"};
`;

export const Check = ({ color, iconSize: size }: CommonIconProps) => (
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
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </StyledSVG>
  </Icon>
);
