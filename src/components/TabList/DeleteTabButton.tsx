import styled from "styled-components";
import { palette } from "../../styles/palette";
import { Trash } from "../Icons/Trash";

interface DeleteTabButtonProps {
  onClick: () => void;
}

const DeleteButton = styled.div`
  background-color: ${palette.gray.light};
  border: 1px solid ${palette.gray.darker};
  border-radius: 4px;
  box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.15);
  padding: 0.2rem;
  cursor: pointer;
  display: none;
  align-items: center;
  font-size: 12px;

  :hover {
    background-color: ${palette.red.default};
    box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.5);
  }

  :active {
    background-color: ${palette.red.dark};
    box-shadow: inset 0 1px 0 0 rgba(0, 0, 0, 0.33);
  }
`;

export const DeleteTabButton = ({ onClick }: DeleteTabButtonProps) => (
  <DeleteButton onClick={onClick}>
    <Trash iconSize={1} />
  </DeleteButton>
);
