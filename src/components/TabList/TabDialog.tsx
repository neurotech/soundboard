import { TabEntity } from "../../utilities/store";
import { Dialog } from "../Dialog/Dialog";
import { Input } from "../Input";

export type TabForm = Partial<TabEntity> & {
  open: boolean;
};

interface NewTabDialogProps {
  handleSaveTab: (tabForm: TabForm) => void;
  handleOpenNewTabDialog: (open: boolean) => void;
  setTabDialogForm: (tabForm: TabForm) => void;
  tabDialogForm: TabForm | null | undefined;
}

export const NewTabDialog = ({
  handleSaveTab,
  handleOpenNewTabDialog,
  setTabDialogForm,
  tabDialogForm,
}: NewTabDialogProps) => {
  const handleInput = (key: string) => {
    if (key === "Enter" && tabDialogForm && tabDialogForm.name) {
      setTabDialogForm({ ...tabDialogForm, open: false });
      handleSaveTab(tabDialogForm);
      handleOpenNewTabDialog(false);
    }
  };

  return (
    <Dialog
      dialogHeader={"Add a new tab"}
      dialogContent={
        <Input
          autoFocus
          onKeyDown={(event) => handleInput(event.key)}
          onChange={(value) =>
            tabDialogForm &&
            setTabDialogForm({
              ...tabDialogForm,
              name: value || "",
            })
          }
          placeholder={"Name of new tab"}
          value={(tabDialogForm && tabDialogForm.name) || ""}
        />
      }
      setDialogOpen={(open) => {
        handleOpenNewTabDialog(open);
        setTabDialogForm({ ...tabDialogForm, open });
      }}
    />
  );
};
