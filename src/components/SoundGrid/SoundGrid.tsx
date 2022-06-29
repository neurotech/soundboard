import {
  Column,
  Columns,
  JustifyContent,
  Space,
  Stack,
} from "@neurotech/elements";
import { SoundEntity } from "../../App";
import { ValidKeys } from "../../ValidKeys";
import { SoundTile } from "../SoundTile/SoundTile";
import chunk from "lodash.chunk";
import { EmptySoundTile } from "../SoundTile/EmptySoundTile";
import { Panel } from "../Panel/Panel";
import { SoundForm } from "../Dialog/SoundDialog/SoundDialog";
import { useEffect } from "react";

interface SoundGridProps {
  activeSound: string;
  handleOpenSoundDialog: (open: boolean) => void;
  handleSaveSound: (sound: SoundForm | null | undefined) => void;
  playSound: (path: string, id: string, volume?: number, rate?: number) => void;
  setSoundDialogForm: (soundForm: SoundForm | null) => void;
  soundDialogForm: SoundForm | null | undefined;
  sounds: SoundEntity[];
}

export const SoundGrid = ({
  activeSound,
  handleOpenSoundDialog,
  handleSaveSound,
  playSound,
  setSoundDialogForm,
  sounds,
}: SoundGridProps) => {
  const paginated = chunk(ValidKeys, 6);
  const renderTile = (
    itemIndex: number,
    shortcutKey: string,
    sound?: SoundEntity
  ) => {
    if (sound) {
      return (
        <SoundTile
          id={sound.id}
          isActive={activeSound === sound.id}
          description={sound.description}
          key={itemIndex}
          onClick={() =>
            playSound(sound.path, sound.id, sound.volume, sound.rate)
          }
          onRightClick={() => {
            handleOpenSoundDialog(true);
            setSoundDialogForm({ ...sound, open: true });
          }}
          name={sound.name}
          shortcutKey={sound.shortcutKey}
          color={sound.color}
        />
      );
    } else {
      return (
        <EmptySoundTile
          key={itemIndex}
          onClick={() => {
            handleOpenSoundDialog(true);
            setSoundDialogForm({ open: true, shortcutKey });
          }}
          shortcutKey={shortcutKey}
        />
      );
    }
  };

  useEffect(() => {
    const dropzone = document.getElementById("dropzone");

    dropzone?.addEventListener("dragover", (e) => {
      e.stopPropagation();
      e.preventDefault();
    });

    dropzone?.addEventListener("drop", (e) => {
      if (e.dataTransfer && e.dataTransfer.files.length <= 24) {
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          const readableName = window.Main.getReadableName(
            e.dataTransfer.files[i].path
          );
          handleSaveSound({
            open: false,
            color: "red",
            name: readableName,
            path: e.dataTransfer.files[i].path,
            shortcutKey: ValidKeys[i],
          });
        }
      }

      e.stopPropagation();
      e.preventDefault();
    });
  }, []);

  return (
    <Panel flex marginLeft={0.5}>
      <div id="dropzone">
        <Stack space={Space.XSmall}>
          {paginated.map((page, pageIndex) => {
            return (
              <Columns
                key={pageIndex}
                space={Space.XSmall}
                justifyContent={JustifyContent.SpaceBetween}
              >
                {page.map((shortcutKey, itemIndex) => {
                  const sound = sounds.find(
                    (sound) => sound.shortcutKey === shortcutKey
                  );

                  return (
                    <Column columnWidth={"16.5%"} key={itemIndex}>
                      {renderTile(itemIndex, shortcutKey, sound)}
                    </Column>
                  );
                })}
              </Columns>
            );
          })}
        </Stack>
      </div>
    </Panel>
  );
};
