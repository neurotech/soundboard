import {
  Column,
  Columns,
  JustifyContent,
  Space,
  Stack,
} from "@neurotech/elements";
import styled from "styled-components";
import { SoundEntity } from "../../App";
import { palette } from "../../styles/palette";
import { ValidKeys } from "../../ValidKeys";
import { SoundTile } from "../SoundTile/SoundTile";
import chunk from "lodash.chunk";
import { EmptySoundTile } from "../SoundTile/EmptySoundTile";

interface SoundGridProps {
  activeSound: string;
  playSound: (path: string, id: string) => void;
  sounds: SoundEntity[];
}

const Container = styled.div`
  background-color: ${palette.gray.default};
  border: 1px solid ${palette.gray.light};
  border-radius: 4px;
  margin-left: 0.5rem;
  padding: 1rem;
  display: flex;
  flex: 1;
  flex-direction: column;
`;

export const SoundGrid = ({
  activeSound,
  playSound,
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
          onClick={() => playSound(sound.path, sound.id)}
          name={sound.name}
          shortcutKey={sound.shortcutKey}
          color={sound.color}
        />
      );
    } else {
      return <EmptySoundTile key={itemIndex} shortcutKey={shortcutKey} />;
    }
  };

  return (
    <Container>
      <Stack>
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
    </Container>
  );
};

/*      <Columns
        space={Space.XSmall}
        justifyContent={JustifyContent.SpaceBetween}
      >
        {sounds.map((sound) => (
          <Column columnWidth={"16.5%"} key={sound.id}>
            <SoundTile
              id={sound.id}
              isActive={activeSound === sound.id}
              description={sound.description}
              onClick={() => playSound(sound.path, sound.id)}
              name={sound.name}
              shortcutKey={sound.shortcutKey}
              color={sound.color}
            />
          </Column>
        ))}
      </Columns> */
