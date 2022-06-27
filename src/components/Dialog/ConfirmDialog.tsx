import styled from "styled-components";
import { palette } from "../../styles/palette";
import { Dialog, DialogProps } from "./Dialog";

type ConfirmDialogProps = Pick<
  DialogProps,
  "dialogHeader" | "setDialogOpen"
> & {
  onSubmit: () => void;
};

const YesNoContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const BaseButton = styled.button`
  width: 45%;
  border-width: 2px;
  border-style: solid;
  border-radius: 4px;
  padding: 1rem 0;
  color: white;
  cursor: pointer;
  font-size: 20px;
  font-weight: 600;
`;

const NoButton = styled(BaseButton)`
  background-color: ${palette.gray.lighter};
  border-color: ${palette.gray.darker};
  text-shadow: 1px 1px 0 ${palette.gray.darker};

  :hover {
    background-color: ${palette.gray.light};
  }
`;

const YesButton = styled(BaseButton)`
  background-color: ${palette.red.default};
  border-color: ${palette.red.darker};
  text-shadow: 1px 1px 0 ${palette.red.darker};

  :hover {
    background-color: ${palette.red.lighter};
  }
`;

export const ConfirmDialog = ({
  dialogHeader,
  onSubmit,
  setDialogOpen,
}: ConfirmDialogProps) => (
  <Dialog
    dialogContent={
      <YesNoContainer>
        <NoButton onClick={() => setDialogOpen(false)}>{"No"}</NoButton>
        <YesButton onClick={onSubmit}>{"Yes"}</YesButton>
      </YesNoContainer>
    }
    dialogHeader={dialogHeader}
    setDialogOpen={setDialogOpen}
  />
);
