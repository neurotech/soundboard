import { useEffect } from "react";
import styled from "styled-components";
import { Color, ColorKeys } from "../../../App";
import { palette } from "../../../styles/palette";
import { Check } from "../../Icons/Check";
import { SoundForm } from "./SoundDialog";

interface ColorPickerProps {
  soundForm: SoundForm;
  setSoundDialogForm: (soundForm: SoundForm | null | undefined) => void;
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Swatch = styled.div<{ color: Color; isActive: boolean }>`
  border-width: 2px;
  border-style: solid;
  border-color: ${(props) =>
    props.isActive ? palette.gray.default : "transparent"};
  box-shadow: 0 0 0 4px
    ${(props) =>
      props.isActive ? palette[props.color].dark + 40 : "transparent"};
  background-color: ${(props) => palette[props.color].default};
  border-radius: 4px;
  height: 48px;
  width: 48px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ColorPicker = ({
  soundForm,
  setSoundDialogForm,
}: ColorPickerProps) => {
  const lastColorSelected = window.Main.store.get().lastColorSelected;

  useEffect(() => {
    if (!soundForm.color) {
      setSoundDialogForm({ ...soundForm, color: lastColorSelected });
    }
  }, []);

  return (
    <Container>
      {ColorKeys.filter((c) => c !== "gray").map((colorKey) => {
        const isActive = soundForm.color === colorKey;

        return (
          <Swatch
            color={colorKey}
            isActive={isActive}
            key={colorKey}
            onClick={() =>
              setSoundDialogForm({ ...soundForm, color: colorKey })
            }
          >
            {isActive && <Check color={palette.gray.default} iconSize={2} />}
          </Swatch>
        );
      })}
    </Container>
  );
};
