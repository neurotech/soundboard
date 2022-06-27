import { Stack } from "@neurotech/elements";
import { ReactNode } from "react";
import styled, { keyframes } from "styled-components";
import { palette } from "../../styles/palette";
import { Heading } from "../Heading/Heading";
import { Cross } from "../Icons/Cross";
import { Panel } from "../Panel/Panel";

export interface DialogProps {
  dialogContent: ReactNode;
  dialogFooter?: ReactNode;
  dialogHeader: string;
  setDialogOpen: (open: boolean) => void;
}

const fade = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Backdrop = styled.div`
  animation: ${fade} 0.1s linear;
  position: fixed;
  inset: 0px;
  width: 100%;
  height: 100%;
  background-color: ${palette.gray.darker}ab;
  padding: 1rem;
  z-index: 1;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background: ${palette.gray.dark};
  padding: 1rem;
  border-radius: 4px;
  border-width: 2px;
  border-style: solid;
  border-color: ${palette.gray.darker};
  margin: 0 auto;
  z-index: 999;
  width: 45%;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.button`
  background-color: ${palette.red.default};
  border: 1px solid ${palette.red.dark};
  border-radius: 4px;
  box-shadow: inset 0 1px 0 0 ${palette.red.lighter};
  padding: 0.25rem;
  cursor: pointer;

  :hover {
    background-color: ${palette.red.light};
  }

  :active {
    background-color: ${palette.red.default};
  }
`;

export const HorizontalRule = styled.hr`
  height: 1px;
  border: none;
  background: ${palette.gray.light};
`;

export const Dialog = ({
  dialogContent,
  dialogFooter,
  dialogHeader,
  setDialogOpen,
}: DialogProps) => (
  <Backdrop>
    <Container>
      <Panel flex>
        <Stack>
          <Header>
            <Heading>{dialogHeader}</Heading>
            <CloseButton onClick={() => setDialogOpen(false)}>
              <Cross />
            </CloseButton>
          </Header>
          <HorizontalRule />
          {dialogContent}
          {dialogFooter && (
            <>
              <HorizontalRule />
              {dialogFooter}
            </>
          )}
        </Stack>
      </Panel>
    </Container>
  </Backdrop>
);
