import styled from "styled-components";
import { Color } from "../../App";
import { palette } from "../../styles/palette";
import { Icon } from "./Icon";

const StyledSVG = styled.svg<{ color?: Color }>`
  stroke: ${(props) => (props.color ? palette[props.color].light : "white")};
`;

export const Plus = ({ color }: { color?: Color }) => (
  <Icon>
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
        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
      />
    </StyledSVG>
  </Icon>
);
