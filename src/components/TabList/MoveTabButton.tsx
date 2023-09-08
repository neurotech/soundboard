import styled from "styled-components";
import { palette } from "../../styles/palette";
import { ReactNode } from "react";

interface MoveTabButtonProps {
  children: string | ReactNode;
  onClick: () => void;
}

const MoveButton = styled.div`
  background-color: ${palette.gray.light};
  border: 1px solid ${palette.gray.darker};
  border-radius: 4px;
  box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.15);
  padding: 0.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 12px;

  :hover {
    background-color: ${palette.yellow.default};
    box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.5);
  }

  :active {
    background-color: ${palette.yellow.dark};
    box-shadow: inset 0 1px 0 0 rgba(0, 0, 0, 0.33);
  }
`;

export const MoveTabButton = ({ children, onClick }: MoveTabButtonProps) => (
  <MoveButton onClick={onClick}>{children}</MoveButton>
);
