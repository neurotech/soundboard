import { contextBridge, ipcRenderer } from "electron";
import { Store } from "../src/utilities/store";

export const api = {
  store: {
    get: () => ipcRenderer.sendSync("store-get"),
    set: (store: Store) => ipcRenderer.sendSync("store-set", store),
  },
  getSoundsPath: (filename: string) =>
    ipcRenderer.sendSync("getSoundsPath", filename),
};

contextBridge.exposeInMainWorld("Main", api);
