import styled from "styled-components";

interface IconProps {
  iconSize?: number;
}

export type CommonIconProps = Partial<IconProps> & {
  color?: string;
};

export const Icon = styled.div<IconProps>`
  height: ${(props) => props.iconSize || 1.5}rem;
  width: ${(props) => props.iconSize || 1.5}rem;
`;
