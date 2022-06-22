import styled from "styled-components";
import { palette } from "../../styles/palette";
import { Plus } from "../Icons/Plus";

interface AddTabButtonProps {
  handleAddTab: () => void;
}

const StyledButton = styled.button`
  background-color: ${palette.gray.light};
  border: 1px solid ${palette.gray.lighter};
  margin-top: 0.5rem;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  padding: 0.25rem 0;
  justify-content: center;

  :hover {
    background-color: ${palette.gray.lighter};
    border: 1px solid ${palette.gray.dark};
  }

  transition: border-color 0.12s, background-color 0.12s, box-shadow 0.12s,
    color 0.12s;
`;

export const AddTabButton = ({ handleAddTab }: AddTabButtonProps) => (
  <StyledButton onClick={() => handleAddTab()}>
    <Plus />
  </StyledButton>
);
