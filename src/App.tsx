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
import { NewTabDialog, TabForm } from "./components/TabList/TabDialog";
import shortUUID from "short-uuid";
import {
  SoundDialog,
  SoundForm,
} from "./components/Dialog/SoundDialog/SoundDialog";

export const ColorKeys = [
  "red",
  "yellow",
  "blue",
  "green",
  "purple",
  "pink",
  "gray",
] as const;

export type Color = typeof ColorKeys[number];

export interface SoundEntity {
  color: Color;
  description: string;
  id: string;
  name: string;
  path: string;
  rate?: number;
  shortcutKey: string;
  tabId?: string;
  tabName?: string;
  volume?: number;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0.5rem;
`;

const Filter = styled.div<{ isActive: boolean }>`
  margin-top: 0.5rem;
  display: flex;
  flex: 1;
  filter: ${(props) =>
    props.isActive ? "blur(8px) grayscale(0.5)" : "blur(0px) grayscale(0)"};
  transition: filter 0.25s;
`;

export const App = () => {
  const store = window.Main.store;
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [soundList, setSoundList] = useState<SoundEntity[]>([]);
  const [tabsList, setTabsList] = useState<TabEntity[]>(store.get().tabs);
  const [activeTab, setActiveTab] = useState<string>(store.get().activeTab);
  const [activeSound, setActiveSound] = useState<string>("");
  const [player, setPlayer] = useState<Howl | null>();
  const [hushed, setHushed] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchBarFocused, setSearchBarFocused] = useState<boolean>(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<SoundEntity[]>([]);
  const [soundDialogForm, setSoundDialogForm] = useState<
    SoundForm | null | undefined
  >();
  const [tabDialogForm, setTabDialogForm] = useState<
    TabForm | null | undefined
  >();

  const playSound = async (
    path: string,
    id: string,
    volume?: number,
    rate?: number
  ) => {
    player && player.stop() && player.unload();
    setPlayer(() => null);
    setActiveSound(id);

    const soundPath = window.Main.getSoundsPath(path);
    const newPlayer = createPlayer(soundPath, id, setActiveSound, volume, rate);

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
      !hushed &&
      ValidKeys.indexOf(event.key) !== -1 &&
      !event.ctrlKey &&
      !event.altKey &&
      !event.shiftKey
    ) {
      player && player.stop() && player.unload();

      const matchedSound = soundList.find(
        (sound: SoundEntity) => sound.shortcutKey === event.key
      );
      if (matchedSound) {
        setPlayer(() => null);
        playSound(
          matchedSound.path,
          matchedSound.id,
          matchedSound.volume,
          matchedSound.rate
        );
      }
    }

    if (event.code === "Space") {
      player && player.stop();
      setActiveSound(() => "");
    }

    if (event.code === "Escape") {
      setConfirmDialogOpen(false);
      setSearchBarFocused(false);
      setSoundDialogForm({ ...soundDialogForm, open: false });
      setTabDialogForm({ ...tabDialogForm, open: false });
      setHushed(false);
    }

    if (
      event.key === "/" &&
      document.getElementById("search-bar") !== document.activeElement
    ) {
      document.getElementById("search-bar")?.focus();
      setSearchBarFocused(true);
      setHushed(true);
      event.preventDefault();
    }
  };

  const handleTabChange = (id: string) => {
    const index = findIndex(tabsList, ["id", id]);
    setSoundList(() => store.get().tabs[index]?.sounds || []);

    setActiveTab(id);
    store.set({ ...store.get(), activeTab: id });
  };

  const handleSaveTab = async (tabForm: TabForm) => {
    const currentConfig = window.Main.store.get();
    const newTabsList = [...currentConfig.tabs];
    const id = shortUUID.generate();

    if (tabForm.id) {
      // Update
      const tabIndex = findIndex(newTabsList, ["id", tabForm.id]);
      newTabsList[tabIndex] = { ...newTabsList[tabIndex], name: tabForm.name };
    } else {
      // Create
      newTabsList.push({
        id,
        name: tabForm.name,
        sequence: newTabsList[newTabsList.length - 1].sequence + 1,
        sounds: [],
      });
    }

    await window.Main.store.set({ ...currentConfig, tabs: newTabsList });
    setTabsList(() => newTabsList);
    handleTabChange(tabForm.id || id);
  };

  const handleDeleteTab = async (id: string) => {
    let newSequence = 0;
    const currentConfig = window.Main.store.get();
    const updatedTabs = [...tabsList];
    const tabToRemoveIndex = findIndex(updatedTabs, ["id", id]);

    window.Main.cleanupSounds(
      updatedTabs[tabToRemoveIndex].sounds.map((sound) => sound.path)
    );

    updatedTabs.splice(tabToRemoveIndex, 1);

    for (const updatedTab of updatedTabs) {
      updatedTab.sequence = newSequence;
      newSequence++;
    }

    const newActiveTabIndex =
      tabToRemoveIndex + 1 === tabsList.length
        ? tabToRemoveIndex - 1
        : tabToRemoveIndex + 1;
    const newActiveTab = tabsList[newActiveTabIndex];

    await window.Main.store.set({ ...currentConfig, tabs: updatedTabs });
    setTabsList(updatedTabs);

    handleTabChange(newActiveTab?.id ?? "");
  };

  const handleOpenNewTabDialog = (open: boolean) => {
    setTabDialogForm({ ...tabDialogForm, open });
    setHushed(open);
  };

  const handleDeleteSound = async (soundForm: SoundForm) => {
    const currentConfig = window.Main.store.get();
    const updatedTabs = [...tabsList];
    const tabToUpdateIndex = findIndex(updatedTabs, ["id", activeTab]);
    const updatedTab = updatedTabs[tabToUpdateIndex];
    const updatedSounds = [...updatedTab.sounds];
    const soundToRemoveIndex = findIndex(updatedSounds, ["id", soundForm.id]);

    soundForm.path && window.Main.cleanupSounds([soundForm.path]);

    updatedSounds.splice(soundToRemoveIndex, 1);

    updatedTab.sounds = updatedSounds;

    await window.Main.store.set({ ...currentConfig, tabs: updatedTabs });
    setSoundList(updatedSounds);
  };

  const handleSaveSound = async (
    updatedSoundForm: SoundForm | null | undefined
  ) => {
    if (updatedSoundForm) {
      const currentConfig = window.Main.store.get();
      const tabIndex = findIndex(currentConfig.tabs, ["id", activeTab]);
      const soundListToUpdate = currentConfig.tabs[tabIndex].sounds;

      if (updatedSoundForm.id) {
        // Update sound
        const soundIndex = findIndex(soundListToUpdate, [
          "id",
          updatedSoundForm.id,
        ]);

        if (
          updatedSoundForm.path &&
          updatedSoundForm.path !== soundListToUpdate[soundIndex].path
        ) {
          const updatedPath = window.Main.copySoundToUserData(
            updatedSoundForm.path,
            soundListToUpdate[soundIndex].path
          );
          updatedSoundForm.path = updatedPath;
        }

        soundListToUpdate[soundIndex] = updatedSoundForm;
        await window.Main.store.set({
          ...currentConfig,
          lastColorSelected: updatedSoundForm.color,
          tabs: currentConfig.tabs,
        });
        setTabsList(() => currentConfig.tabs);
        setSoundList(() => currentConfig.tabs[tabIndex].sounds);
      } else {
        // Create sound
        updatedSoundForm.id = shortUUID.generate();

        soundListToUpdate.push(updatedSoundForm);

        if (updatedSoundForm.path) {
          const updatedPath = window.Main.copySoundToUserData(
            updatedSoundForm.path
          );
          updatedSoundForm.path = updatedPath;
        }

        await window.Main.store.set({
          ...currentConfig,
          lastColorSelected: updatedSoundForm.color,
          tabs: currentConfig.tabs,
        });
        setTabsList(() => currentConfig.tabs);
        setSoundList(() => currentConfig.tabs[tabIndex].sounds);
      }
    }
  };

  const handleOpenSoundDialog = (open: boolean) => {
    setSoundDialogForm({ ...soundDialogForm, open });
    setHushed(open);
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress, false);
    return () => document.removeEventListener("keydown", handleKeyPress, false);
  }, [
    activeSound,
    configDialogOpen,
    confirmDialogOpen,
    hushed,
    searchResults,
    searchBarFocused,
    soundDialogForm,
    soundList,
    tabDialogForm,
    tabsList,
  ]);

  useEffect(() => {
    if (searchBarFocused) {
      document.getElementById("search-bar")?.focus();
      setHushed(true);
    } else {
      document.getElementById("search-bar")?.blur();
      setHushed(false);
    }
  }, [searchBarFocused]);

  useEffect(() => {
    const index = findIndex(tabsList, ["id", activeTab]);
    setSoundList(() => store.get().tabs[index].sounds || []);
  }, []);

  useEffect(() => {
    setHushed(searchResults.length > 0);
  }, [searchResults]);

  return (
    <Container>
      <GlobalStyles />
      {tabDialogForm?.open && (
        <NewTabDialog
          handleSaveTab={handleSaveTab}
          handleOpenNewTabDialog={handleOpenNewTabDialog}
          setTabDialogForm={setTabDialogForm}
          tabDialogForm={tabDialogForm}
        />
      )}
      {soundDialogForm?.open && (
        <SoundDialog
          handleDeleteSound={handleDeleteSound}
          handleSaveSound={handleSaveSound}
          handleOpenSoundDialog={handleOpenSoundDialog}
          setSoundDialogForm={setSoundDialogForm}
          soundForm={soundDialogForm}
        />
      )}
      <SearchBar
        handleTabChange={handleTabChange}
        searchValue={searchValue}
        searchResults={searchResults}
        setSearchResults={setSearchResults}
        setSearchValue={setSearchValue}
        setHushed={setHushed}
        tabsList={tabsList}
        playSound={playSound}
      />
      <Filter isActive={searchResults.length > 0}>
        <Columns space={Space.None}>
          <Column>
            <TabList
              activeTab={activeTab}
              confirmDialogOpen={confirmDialogOpen}
              setConfirmDialogOpen={setConfirmDialogOpen}
              handleDeleteTab={handleDeleteTab}
              handleOpenNewTabDialog={handleOpenNewTabDialog}
              handleTabChange={handleTabChange}
              tabsList={tabsList}
              setTabDialogForm={setTabDialogForm}
            />
          </Column>
          <Column flexGrow={1}>
            <SoundGrid
              activeSound={activeSound}
              handleOpenSoundDialog={handleOpenSoundDialog}
              playSound={playSound}
              setSoundDialogForm={setSoundDialogForm}
              soundDialogForm={soundDialogForm}
              sounds={soundList}
            />
          </Column>
        </Columns>
      </Filter>
    </Container>
  );
};
