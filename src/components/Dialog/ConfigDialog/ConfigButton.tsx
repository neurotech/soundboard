import styled from "styled-components";
import { palette } from "../../../styles/palette";
import { Panel } from "../../Panel/Panel";

interface ConfigButtonProps {
  onClick: () => void;
}

const StyledConfigButton = styled.button`
  height: 36px;
  width: 36px;
  margin: 0;
  background-color: ${palette.gray.light};
  border: 1px solid ${palette.gray.lighter};
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  padding: 0.25rem 0;
  justify-content: center;
  align-items: center;
  outline: 0;

  font-size: 14px;
  line-height: 0;

  :hover {
    background-color: ${palette.gray.lighter};
    border: 1px solid ${palette.gray.dark};
  }

  transition: border-color 0.12s, background-color 0.12s, box-shadow 0.12s,
    color 0.12s;
`;

export const ConfigButton = ({ onClick }: ConfigButtonProps) => (
  <Panel justifyContent={"center"} marginLeft={0.5}>
    <StyledConfigButton onClick={onClick}>{"⚙️"}</StyledConfigButton>
  </Panel>
);
