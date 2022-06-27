import {
  Column,
  Columns,
  JustifyContent,
  Space,
  Stack,
} from "@neurotech/elements";
import styled, { keyframes } from "styled-components";
import { SoundEntity } from "../../../App";
import { palette } from "../../../styles/palette";
import { Input } from "../../Input";
import { Slider } from "../../Slider/Slider";
import { Dialog, HorizontalRule } from "../Dialog";
import { ColorPicker } from "./ColorPicker";

export type SoundForm = Partial<SoundEntity> & {
  open: boolean;
};

interface SoundDialogProps {
  handleDeleteSound: (soundForm: SoundForm) => void;
  handleOpenSoundDialog: (open: boolean) => void;
  handleSaveSound: (soundForm: SoundForm | null | undefined) => void;
  setSoundDialogForm: (soundForm: SoundForm | null | undefined) => void;
  soundForm: SoundForm;
}

const RainbowButton = styled.button`
  background-color: ${palette.purple.default}40;
  border: 2px solid ${palette.gray.darker};
  padding: 1.2rem;
  width: 100%;
  border-radius: 6px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 600;
  color: white;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);

  :hover {
    background-color: ${palette.purple.default}80;
  }

  transition: background-color 0.2s linear;
`;

const rainbowLoop = keyframes`
  0% {
    color: #ff00c8;
  }

  25% {
    color: #ff9900;
  }

  50% {
    color: #ffee00;
  }

  75% {
    color: #21EB95;
  }

  100% {
    color: #00B1FC;
  }
`;

const wobbleLoop = keyframes`
  0% {
    transform: translate3d(0px, -1px, 0);
  }
  100% {
    transform: translate3d(0px, 1px, 0);
  }
`;

const RainbowCharacter = styled.span<{ delay: number }>`
  animation-delay: ${(props) => props.delay}ms;
  animation-direction: alternate, alternate;
  animation-duration: 1500ms, 375ms;
  animation-iteration-count: infinite, infinite;
  animation-name: ${rainbowLoop}, ${wobbleLoop};
  animation-timing-function: linear, ease-in-out;
  display: inline-block;
`;

const rainbowText = (text: string) => {
  let delay = -Array.from(text).length * 100;
  return Array.from(text).map((char, index) => {
    return (
      <RainbowCharacter delay={(delay += 100)} key={index}>
        {char}
      </RainbowCharacter>
    );
  });
};

const BaseButton = styled.button`
  background-color: ${palette.gray.light};
  border: 1px solid ${palette.gray.darker};
  border-radius: 4px;
  box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.15);
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: ${palette.gray.bright};
  text-shadow: 1px 1px 0 ${palette.gray.darker};
`;

const DeleteButton = styled(BaseButton)`
  :hover {
    background-color: ${palette.red.default};
    box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.5);
    color: white;
    text-shadow: 1px 1px 0 ${palette.purple.dark};
  }
`;

const CancelButton = styled(BaseButton)`
  :hover {
    background-color: ${palette.gray.dark};
    box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.15);
    color: white;
    text-shadow: 1px 1px 0 ${palette.gray.dark};
  }
`;

const SaveButton = styled(BaseButton)`
  :hover {
    background-color: ${palette.purple.default};
    box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.5);
    color: white;
    text-shadow: 1px 1px 0 ${palette.purple.dark};
  }
`;

export const SoundDialog = ({
  handleDeleteSound,
  handleOpenSoundDialog,
  handleSaveSound,
  setSoundDialogForm,
  soundForm,
}: SoundDialogProps) => {
  const handleBrowse = async () => {
    const pathToFile = await window.Main.browseForFile();

    if (pathToFile && pathToFile.length > 0) {
      const readableName = await window.Main.getReadableName(pathToFile[0]);
      setSoundDialogForm({
        ...soundForm,
        name: readableName,
        path: pathToFile[0],
      });
    }
  };

  const deleteButton = (
    <DeleteButton
      key={"delete-sound-dialog"}
      onClick={() => {
        handleDeleteSound(soundForm);
        handleOpenSoundDialog(false);
        setSoundDialogForm(null);
      }}
    >
      {"Delete"}
    </DeleteButton>
  );

  const cancelButton = (
    <CancelButton
      key={"cancel-sound-dialog"}
      onClick={() => {
        handleOpenSoundDialog(false);
        setSoundDialogForm({ ...soundForm, open: false });
      }}
    >
      {"Cancel"}
    </CancelButton>
  );

  const saveButton = (
    <SaveButton
      key={"save-sound-dialog"}
      onClick={() => {
        handleSaveSound(soundForm);
        handleOpenSoundDialog(false);
        setSoundDialogForm({ ...soundForm, open: false });
      }}
    >
      {"Save"}
    </SaveButton>
  );

  return (
    <Dialog
      dialogHeader={
        soundForm.id
          ? `Edit sound for key: ${soundForm.shortcutKey?.toUpperCase()}`
          : `Add a new sound to key: ${soundForm.shortcutKey?.toUpperCase()}`
      }
      dialogFooter={
        <Columns
          justifyContent={
            soundForm.id ? JustifyContent.SpaceBetween : JustifyContent.FlexEnd
          }
        >
          {soundForm.id && <Column>{deleteButton}</Column>}
          <Column>
            <Columns space={Space.XSmall}>
              <Column>{cancelButton}</Column>
              <Column>{saveButton}</Column>
            </Columns>
          </Column>
        </Columns>
      }
      dialogContent={
        <Stack>
          <Columns justifyContent={JustifyContent.SpaceBetween}>
            <Column columnWidth={"49%"}>
              <Stack space={Space.Medium} flexGrow={1}>
                <RainbowButton onClick={handleBrowse}>
                  {rainbowText("Browse...")}
                </RainbowButton>
                <ColorPicker
                  soundForm={soundForm}
                  setSoundDialogForm={setSoundDialogForm}
                />
              </Stack>
            </Column>
            <Column columnWidth={"49%"}>
              <Stack flexGrow={1}>
                <Input
                  label={"Sound name"}
                  onChange={(value) =>
                    setSoundDialogForm({ ...soundForm, name: value })
                  }
                  placeholder={"Sound name"}
                  value={soundForm.name || ""}
                />
                <Input
                  label={"Sound description"}
                  onChange={(value) =>
                    setSoundDialogForm({ ...soundForm, description: value })
                  }
                  placeholder={"Sound description"}
                  value={soundForm.description || ""}
                />
              </Stack>
            </Column>
          </Columns>
          <HorizontalRule />
          <Slider
            setSliderValue={(value) =>
              setSoundDialogForm({ ...soundForm, volume: value })
            }
            sliderValue={soundForm.volume}
          />
        </Stack>
      }
      setDialogOpen={(open: boolean) => {
        handleOpenSoundDialog(open);
        setSoundDialogForm({ ...soundForm, open });
      }}
    />
  );
};
