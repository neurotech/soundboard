import styled from "styled-components";
import { SoundEntity } from "../../App";
import { palette } from "../../styles/palette";

type EmptySoundTileProps = Pick<SoundEntity, "shortcutKey">;

const Tile = styled.button`
  background-color: ${palette.gray.lighter}40;
  border-radius: 4px;
  border: 1px solid ${palette.gray.lighter}80;
  color: ${palette.gray.bright};
  font-size: 18px;
  height: 200px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  user-select: none;
  text-shadow: 1px 1px 0 ${palette.gray.darker};
  flex: 1;

  :hover {
    background-color: ${palette.gray.lighter};
    color: white;
    cursor: pointer;
  }

  :active {
    background-color: ${palette.gray.light};
    color: ${palette.gray.bright};
  }

  transition: border-color 0.12s, background-color 0.12s, box-shadow 0.12s,
    color 0.12s;
`;

const SoundShortcutKey = styled.div`
  align-self: flex-end;
  color: ${palette.gray.lighter};
  font-weight: 700;
  text-shadow: none;
  text-transform: uppercase;
`;

export const EmptySoundTile = ({ shortcutKey }: EmptySoundTileProps) => (
  <Tile>
    <SoundShortcutKey>{shortcutKey}</SoundShortcutKey>
  </Tile>
);
