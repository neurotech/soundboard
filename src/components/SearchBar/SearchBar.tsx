import { KeyboardEvent, useEffect, useState } from "react";
import styled from "styled-components";
import { SoundEntity } from "../../App";
import { TabEntity } from "../../utilities/store";
import { Input } from "../Input";
import { Panel } from "../Panel/Panel";
import { SearchResults } from "./SearchResults";

interface SearchBarProps {
  handleTabChange: (id: string) => void;
  searchResults: SoundEntity[];
  searchValue: string;
  setSearchResults: (searchResults: SoundEntity[]) => void;
  setSearchValue: (searchValue: string) => void;
  tabsList: TabEntity[];
  playSound: (path: string, id: string, volume?: number, rate?: number) => void;
}

const Container = styled.div`
  flex: 1;
`;

export const SearchBar = ({
  handleTabChange,
  searchResults,
  searchValue,
  setSearchResults,
  setSearchValue,
  tabsList,
  playSound,
}: SearchBarProps) => {
  const [selectedItem, setSelectedItem] = useState<number>(-1);

  const handleSearchInput = (searchInput: string) => {
    const allSounds: SoundEntity[] = [];

    if (searchInput === "") {
      setSearchValue(searchInput);
      setSearchResults([]);
    } else {
      tabsList.forEach((tab) => {
        tab.sounds.forEach((sound) =>
          allSounds.push({ tabId: tab.id, tabName: tab.name, ...sound })
        );
      });

      const results = allSounds
        .filter((sound) => {
          const nameMatch = sound.name
            .toLowerCase()
            .includes(searchInput.toLowerCase());
          const descriptionMatch =
            sound.description &&
            sound.description.toLowerCase().includes(searchInput.toLowerCase());

          return nameMatch || descriptionMatch;
        })
        .sort((a, b) => (a.name < b.name ? 1 : -1));

      setSearchValue(searchInput);
      setSearchResults(results);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (searchResults.length > 0) {
      if (event.key === "ArrowDown" || event.key === "Tab") {
        if (selectedItem === searchResults.length - 1) {
          setSelectedItem(0);
        } else {
          setSelectedItem(selectedItem + 1);
        }
        event.preventDefault();
      }

      if (event.key === "ArrowUp" || (event.shiftKey && event.key === "Tab")) {
        if (selectedItem === 0) {
          setSelectedItem(searchResults.length - 1);
        } else {
          setSelectedItem(selectedItem - 1);
        }
        event.preventDefault();
      }

      if (event.key === "Enter") {
        handleSubmit();
        event.preventDefault();
      }
    }
  };

  const handleSubmit = () => {
    if (searchResults.length > 0) {
      const item = searchResults[selectedItem === -1 ? 0 : selectedItem];

      item.tabId && handleTabChange(item.tabId);
      playSound(item.path, item.id, item.volume, item.rate);
      setSearchResults([]);
      document.getElementById("search-bar")?.blur();
    }
  };

  useEffect(() => {
    if (searchResults.length > 0) {
      setSelectedItem(0);
    }
  }, [searchResults]);

  return (
    <Container>
      <Panel flex>
        <Input
          id={"search-bar"}
          onBlur={() => {
            setSearchResults([]);
          }}
          onChange={handleSearchInput}
          onFocus={() => {
            handleSearchInput(searchValue);
          }}
          onKeyDown={handleKeyDown}
          placeholder={"Search"}
          value={searchValue}
        />
      </Panel>
      {Boolean(searchResults.length) && (
        <SearchResults
          searchResults={searchResults}
          selectedItem={selectedItem}
        />
      )}
    </Container>
  );
};
