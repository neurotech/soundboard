import { Column, Columns, JustifyContent } from "@neurotech/elements";
import { findIndex } from "lodash";
import { useState } from "react";
import styled from "styled-components";
import { SoundEntity } from "../../../App";
import { palette } from "../../../styles/palette";
import { S3Config, TabEntity } from "../../../utilities/store";
import { Dialog } from "../Dialog";
import { ConfigDialogContent } from "./ConfigDialogContent";

export interface ConfigDialogProps {
  setActiveTab: (id: string) => void;
  setDialogOpen: (open: boolean) => void;
  setSoundList: (soundList: SoundEntity[]) => void;
  setTabsList: (tabs: TabEntity[]) => void;
}

const BaseButton = styled.button`
  background-color: ${palette.gray.light};
  border: 1px solid ${palette.gray.darker};
  border-radius: 4px;
  box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.15);
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: ${palette.gray.bright};
  text-shadow: 1px 1px 0 ${palette.gray.darker};
`;
const CancelButton = styled(BaseButton)`
  :hover {
    background-color: ${palette.gray.dark};
    box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.15);
    color: white;
    text-shadow: 1px 1px 0 ${palette.gray.dark};
  }
`;

const SaveButton = styled(BaseButton)`
  :hover {
    background-color: ${palette.blue.default};
    box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.5);
    color: white;
    text-shadow: 1px 1px 0 ${palette.purple.dark};
  }
`;

export const ConfigDialog = ({
  setActiveTab,
  setDialogOpen,
  setSoundList,
  setTabsList,
}: ConfigDialogProps) => {
  const [s3config, setS3config] = useState<S3Config>(window.Main.s3Store.get());

  return (
    <Dialog
      dialogContent={
        <ConfigDialogContent s3config={s3config} setS3config={setS3config} />
      }
      dialogHeader={"Configuration"}
      setDialogOpen={setDialogOpen}
      dialogFooter={
        <Columns justifyContent={JustifyContent.FlexEnd}>
          <Column>
            <CancelButton onClick={() => setDialogOpen(false)}>
              {"Cancel"}
            </CancelButton>
          </Column>
          <Column>
            <SaveButton
              onClick={async () => {
                const config = window.Main.store.get();
                const index = findIndex(config.tabs, ["id", config.activeTab]);
                await window.Main.s3Store.set(s3config);
                setTabsList(config.tabs);
                setSoundList(config.tabs[index]?.sounds || []);
                setActiveTab(config.activeTab);
                setDialogOpen(false);
              }}
            >
              {"Save"}
            </SaveButton>
          </Column>
        </Columns>
      }
    />
  );
};
