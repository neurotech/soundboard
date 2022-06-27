import { contextBridge, ipcRenderer } from "electron";
import { Store } from "../src/utilities/store";

export const api = {
  store: {
    get: () => ipcRenderer.sendSync("store-get"),
    set: (store: Store) => ipcRenderer.sendSync("store-set", store),
  },
  browseForFile: () => ipcRenderer.sendSync("browseForFile"),
  getReadableName: (pathToFile: string) =>
    ipcRenderer.sendSync("getReadableName", pathToFile),
  getSoundsPath: (filename: string) =>
    ipcRenderer.sendSync("getSoundsPath", filename),
  copySoundToUserData: (pathToFile: string, oldFilePath?: string) =>
    ipcRenderer.sendSync("copySoundToUserData", pathToFile, oldFilePath),
  cleanupSounds: (soundFileNames: string[]) =>
    ipcRenderer.sendSync("cleanupSounds", soundFileNames),
};

contextBridge.exposeInMainWorld("Main", api);
