import styled from "styled-components";
import { SoundEntity } from "../../App";
import { palette } from "../../styles/palette";

type SoundTileProps = Pick<
  SoundEntity,
  "color" | "description" | "id" | "name" | "shortcutKey"
> & {
  isActive: boolean;
  onClick: () => void;
};

const getTileShadow = ({
  color,
  isActive,
}: Pick<SoundTileProps, "color" | "isActive">) => {
  let shadow = "";

  if (isActive) {
    shadow += `0 0 0 4px ${palette[color].default}40`;
  } else {
    shadow += `0 2px 0 ${palette.gray.darker}, inset 0 1px 0 ${palette.gray.lighter}`;
  }

  return shadow;
};

const Tile = styled.button<Pick<SoundTileProps, "color" | "isActive">>`
  background-color: ${(props) =>
    props.isActive ? palette.gray.darker : palette.gray.dark};
  border-radius: 4px;
  border: 1px solid
    ${(props) =>
      props.isActive ? palette[props.color].default : palette.gray.darker};
  box-shadow: ${(props) =>
    getTileShadow({ color: props.color, isActive: props.isActive })};
  color: ${palette.gray.bright};
  font-size: 18px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  user-select: none;
  text-shadow: 1px 1px 0 ${palette.gray.darker};
  flex: 1;
  outline: none;

  :hover {
    background-color: ${palette.gray.dark}80;
    color: white;
    cursor: pointer;
  }

  :active {
    background-color: ${palette.gray.darker};
    color: ${palette.gray.bright};
  }

  transition: border-color 0.12s, background-color 0.12s, box-shadow 0.12s,
    color 0.12s;
`;

const SoundName = styled.div<Pick<SoundTileProps, "color">>`
  color: ${(props) => palette[props.color].default};
  font-weight: 600;
`;
const SoundDescription = styled.div`
  margin-top: 0.25rem;
  font-style: italic;
  font-size: 80%;
  color: #909194;
  flex: 1;
  text-shadow: none;
`;
const SoundShortcutKey = styled.div<Pick<SoundTileProps, "color">>`
  align-self: flex-end;
  color: ${(props) => palette[props.color].default};
  font-weight: 600;
  text-transform: uppercase;
`;

export const SoundTile = ({
  color = "blue",
  description,
  isActive,
  onClick,
  name,
  shortcutKey,
}: SoundTileProps) => (
  <Tile color={color} isActive={isActive} onClick={onClick}>
    <SoundName color={color}>{name}</SoundName>
    <SoundDescription>{description}</SoundDescription>
    <SoundShortcutKey color={color}>{shortcutKey}</SoundShortcutKey>
  </Tile>
);
