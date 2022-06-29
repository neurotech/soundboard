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

interface SoundGridProps {
  activeSound: string;
  handleOpenSoundDialog: (open: boolean) => void;
  playSound: (path: string, id: string, volume?: number, rate?: number) => void;
  setSoundDialogForm: (soundForm: SoundForm | null) => void;
  soundDialogForm: SoundForm | null | undefined;
  sounds: SoundEntity[];
}

export const SoundGrid = ({
  activeSound,
  handleOpenSoundDialog,
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
            setSoundDialogForm({ open: true, ...sound });
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

  return (
    <Panel flex marginLeft={0.5}>
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
    </Panel>
  );
};
