import styled from "styled-components";
import { palette } from "../../styles/palette";
import { TabEntity } from "../../utilities/store";
import { AddTabButton } from "./AddTabButton";
import { TabButton } from "./TabButton";

interface TabListProps {
  activeTab: string;
  handleTabChange: (id: string) => void;
  setTabsList: (tabsList: TabEntity[]) => void;
  tabsList: TabEntity[];
}

const Container = styled.div`
  background-color: ${palette.gray.default};
  border: 1px solid ${palette.gray.light};
  border-radius: 4px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 250px;
`;

export const TabList = ({
  activeTab,
  handleTabChange,
  setTabsList,
  tabsList,
}: TabListProps) => {
  const handleAddTab = () => {
    const currentConfig = window.Main.store.get();
    const newTabsList = [...currentConfig.tabs];

    newTabsList.push({
      id: "ajkshdfjakds",
      name: "Blah",
      sequence: newTabsList[newTabsList.length - 1].sequence + 1,
      sounds: [],
    });

    window.Main.store.set({ ...currentConfig, tabs: newTabsList });
    setTabsList(newTabsList);
  };

  return (
    <Container>
      {tabsList.map((tab) => (
        <TabButton
          isActive={tab.id === activeTab}
          key={tab.id}
          onClick={() => handleTabChange(tab.id)}
        >
          {tab.name}
        </TabButton>
      ))}
      <AddTabButton handleAddTab={handleAddTab} />
    </Container>
  );
};
