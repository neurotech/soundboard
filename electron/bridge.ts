import { contextBridge, ipcRenderer } from "electron";
import { S3Config, Store } from "../src/utilities/store";

export const api = {
  store: {
    get: () => ipcRenderer.sendSync("store-get"),
    set: (store: Store) => ipcRenderer.sendSync("store-set", store),
  },
  s3Store: {
    get: () => ipcRenderer.sendSync("s3Store-get"),
    set: (config: S3Config) => ipcRenderer.sendSync("s3Store-set", config),
  },
  s3Backup: () => ipcRenderer.invoke("s3-backup"),
  s3Restore: () => ipcRenderer.invoke("s3-restore"),
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
