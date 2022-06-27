import { useState } from "react";
import styled from "styled-components";
import { TabEntity } from "../../utilities/store";
import { ConfirmDialog } from "../Dialog/ConfirmDialog";
import { Panel } from "../Panel/Panel";
import { DeleteTabButton } from "./DeleteTabButton";
import { AddTabButton } from "./NewTabButton";
import { TabForm } from "./TabDialog";
import { TabButton } from "./TabButton";

interface TabListProps {
  activeTab: string;
  confirmDialogOpen: boolean;
  handleDeleteTab: (id: string) => void;
  handleOpenNewTabDialog: (open: boolean) => void;
  handleTabChange: (id: string) => void;
  setConfirmDialogOpen: (open: boolean) => void;
  setTabDialogForm: (tabForm: TabForm) => void;
  tabsList: TabEntity[];
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 250px;
`;

const Tabs = styled.div`
  display: flex;
  flex-direction: column;

  :first-child {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }

  :last-child {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
`;

export const TabList = ({
  activeTab,
  confirmDialogOpen,
  handleDeleteTab,
  handleOpenNewTabDialog,
  handleTabChange,
  setConfirmDialogOpen,
  setTabDialogForm,
  tabsList,
}: TabListProps) => {
  const [tabToDelete, setTabToDelete] = useState<TabEntity>();

  return (
    <Container>
      {confirmDialogOpen && tabToDelete && (
        <ConfirmDialog
          dialogHeader={`Are you sure you wish to delete the tab: ${tabToDelete.name}?`}
          onSubmit={() => {
            setConfirmDialogOpen(false);
            handleDeleteTab(tabToDelete.id);
          }}
          setDialogOpen={setConfirmDialogOpen}
        />
      )}
      <Panel flex>
        <Tabs>
          {tabsList.map((tab) => (
            <TabButton
              key={tab.id}
              isActive={tab.id === activeTab}
              onClick={() => handleTabChange(tab.id)}
              onContextMenu={() => {
                handleOpenNewTabDialog(true);
                setTabDialogForm({ ...tab, open: true });
              }}
            >
              {tab.name}
              <DeleteTabButton
                onClick={() => {
                  handleTabChange(activeTab);
                  setTabToDelete(tab);
                  setConfirmDialogOpen(true);
                }}
              />
            </TabButton>
          ))}
        </Tabs>
        <AddTabButton
          onClick={() => {
            handleOpenNewTabDialog(true);
            setTabDialogForm({
              name: undefined,
              open: true,
            });
          }}
        />
      </Panel>
    </Container>
  );
};
