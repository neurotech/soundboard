import styled from "styled-components";

interface HeadingProps {
  children: string;
}

const StyledHeading = styled.h1`
  font-size: 20px;
  font-weight: 600;
  line-height: 20px;
  user-select: none;
`;

export const Heading = ({ children }: HeadingProps) => (
  <StyledHeading>{children}</StyledHeading>
);
