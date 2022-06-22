import { useEffect, useState } from "react";
import { GlobalStyles } from "./styles/GlobalStyle";
import { Howl } from "howler";
import findIndex from "lodash/findIndex";
import { createPlayer } from "./Player";
import { ValidKeys } from "./ValidKeys";
import { SoundGrid } from "./components/SoundGrid/SoundGrid";
import { Column, Columns, Space } from "@neurotech/elements";
import { TabList } from "./components/TabList/TabList";
import { SearchBar } from "./components/SearchBar/SearchBar";
import styled from "styled-components";
import { TabEntity } from "./utilities/store";

export type Color =
  | "red"
  | "yellow"
  | "blue"
  | "green"
  | "purple"
  | "pink"
  | "gray";

export interface SoundEntity {
  id: string;
  color: Color;
  description: string;
  name: string;
  shortcutKey: string;
  path: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0.5rem;
`;

export const App = () => {
  const store = window.Main.store;
  const [soundList, setSoundList] = useState<SoundEntity[]>([]);
  const [tabsList, setTabsList] = useState<TabEntity[]>(store.get().tabs);
  const [activeTab, setActiveTab] = useState<string>(store.get().activeTab);
  const [activeSound, setActiveSound] = useState<string>("");
  const [player, setPlayer] = useState<Howl | null>();

  const playSound = async (path: string, id: string) => {
    player && player.stop();

    setActiveSound(id);
    const soundPath = window.Main.getSoundsPath(path);

    const newPlayer = createPlayer(soundPath, id, setActiveSound);
    newPlayer.play();
    setPlayer(() => newPlayer);

    newPlayer.once("load", function () {
      newPlayer.play();
    });

    newPlayer.on("end", function () {
      setActiveSound("");
    });
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (
      ValidKeys.indexOf(event.key) !== -1 &&
      !event.ctrlKey &&
      !event.altKey &&
      !event.shiftKey
    ) {
      player && player.stop();

      const matchedSound = soundList.find(
        (sound: SoundEntity) => sound.shortcutKey === event.key
      );
      if (matchedSound) {
        playSound(matchedSound.path, matchedSound.id);
      }
    }

    if (event.code === "Space") {
      player && player.stop();
      setActiveSound(() => "");
    }

    if (event.key === "/") {
      // TODO: Search
      // handleSearchOverlayOpen(true);
    }
  };

  const handleTabChange = (id: string) => {
    store.set({ ...store.get(), activeTab: id });
    setActiveTab(id);
    const index = findIndex(tabsList, ["id", id]);
    setSoundList(() => store.get().tabs[index].sounds || []);
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress, false);
    return () => document.removeEventListener("keydown", handleKeyPress, false);
  }, [activeSound, player, soundList]);

  useEffect(() => {
    const index = findIndex(tabsList, ["id", activeTab]);
    setSoundList(() => store.get().tabs[index].sounds || []);
  }, []);

  return (
    <Container>
      <GlobalStyles />
      <SearchBar />
      <Columns space={Space.None}>
        <Column>
          <TabList
            activeTab={activeTab}
            handleTabChange={handleTabChange}
            tabsList={tabsList}
            setTabsList={setTabsList}
          />
        </Column>
        <Column flexGrow={1}>
          <SoundGrid
            activeSound={activeSound}
            playSound={playSound}
            sounds={soundList}
          />
        </Column>
      </Columns>
    </Container>
  );
};
