import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  IpcMainEvent,
  protocol,
} from "electron";
import { basename, extname, join } from "path";
import { copyFileSync, mkdirSync, unlinkSync } from "fs";
import _case from "case";
import { Howl } from "howler";
import { Low, JSONFile } from "lowdb";
import { Store, storeDefaults } from "../src/utilities/store";
import shortUUID from "short-uuid";

let mainWindow: BrowserWindow | null;

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// const assetsPath =
//   process.env.NODE_ENV === 'production'
//     ? process.resourcesPath
//     : app.getAppPath()

function createWindow() {
  mainWindow = new BrowserWindow({
    // icon: path.join(assetsPath, 'assets', 'icon.png'),
    autoHideMenuBar: true,
    backgroundColor: "#181a20",
    darkTheme: true,
    width: 1100,
    height: 700,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
    show: false,
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow?.show();
  });

  // Name the protocol whatever you want.
  const protocolName = "howl-loader";

  protocol.registerFileProtocol(protocolName, (request, callback) => {
    const url = request.url.replace(`${protocolName}://`, "");
    try {
      return callback(decodeURIComponent(url));
    } catch (error) {
      // Handle the error as needed
      console.error(error);
    }
  });
}

async function registerListeners() {
  const file = join(app.getPath("userData"), "config.json");
  const adapter = new JSONFile<Store>(file);
  const store = new Low(adapter);
  await store.read();

  store.data ||= storeDefaults;
  await store.write();

  ipcMain.on("getSoundsPath", async (event: IpcMainEvent, filename: string) => {
    event.returnValue = join(app.getPath("userData"), "sounds", filename);
  });

  ipcMain.on("getPlayer", async (event: IpcMainEvent, soundPath: string) => {
    event.returnValue = new Howl({
      src: soundPath,
    });
  });

  ipcMain.on("store-get", async (event: IpcMainEvent) => {
    await store.read();
    event.returnValue = store.data;
  });

  ipcMain.on("store-set", async (event: IpcMainEvent, config: Store) => {
    store.data = config;
    await store.write();
    event.returnValue = "ok";
  });

  ipcMain.on(
    "getReadableName",
    async (event: IpcMainEvent, pathToFile: string) => {
      event.returnValue = _case.capital(
        basename(pathToFile, extname(pathToFile))
      );
    }
  );

  ipcMain.on("browseForFile", async (event: IpcMainEvent) => {
    const filePath = dialog.showOpenDialogSync({
      properties: ["openFile"],
      filters: [
        { name: "Audio files", extensions: ["m4a", "mp3", "ogg", "wav"] },
      ],
    });
    event.returnValue = filePath;
  });

  ipcMain.on(
    "copySoundToUserData",
    async (event: IpcMainEvent, pathToFile: string, oldFilePath?: string) => {
      const userDataPath = app.getPath("userData");
      const id = shortUUID.generate();
      const soundFileName = id + extname(pathToFile);
      const destinationPath = join(userDataPath, "sounds", soundFileName);

      mkdirSync(join(userDataPath, "sounds"), {
        recursive: true,
      });

      if (oldFilePath) {
        const basePath = join(app.getPath("userData"), "sounds");
        unlinkSync(join(basePath, oldFilePath));
      }

      copyFileSync(pathToFile, destinationPath);

      event.returnValue = soundFileName;
    }
  );

  ipcMain.on(
    "cleanupSounds",
    async (event: IpcMainEvent, soundFileNames: string[]) => {
      const basePath = join(app.getPath("userData"), "sounds");

      soundFileNames.forEach((fileName) =>
        unlinkSync(join(basePath, fileName))
      );

      event.returnValue = "ok";
    }
  );
}

app
  .on("ready", createWindow)
  .whenReady()
  .then(registerListeners)
  .catch((e) => console.error(e));

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
