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
import {
  S3Config,
  s3StoreDefaults,
  Store,
  storeDefaults,
} from "../src/utilities/store";
import shortUUID from "short-uuid";
import { backup, restore } from "../src/utilities/s3";

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
  const configFile = join(app.getPath("userData"), "config.json");
  const s3ConfigFile = join(app.getPath("userData"), "s3.json");

  const configAdapter = new JSONFile<Store>(configFile);
  const s3Adapter = new JSONFile<S3Config>(s3ConfigFile);

  const store = new Low(configAdapter);
  const s3Store = new Low(s3Adapter);

  await store.read();
  await s3Store.read();

  store.data ||= storeDefaults;
  s3Store.data ||= s3StoreDefaults;

  await store.write();
  await s3Store.write();

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

  ipcMain.on("s3Store-get", async (event: IpcMainEvent) => {
    await s3Store.read();
    event.returnValue = s3Store.data;
  });

  ipcMain.on("s3Store-set", async (event: IpcMainEvent, config: S3Config) => {
    s3Store.data = config;
    await s3Store.write();
    event.returnValue = "ok";
  });

  ipcMain.handle("s3-backup", async (_event) => {
    await s3Store.read();
    const configDirectory = app.getPath("userData");
    const soundDirectory = join(configDirectory, "sounds");

    if (s3Store.data) {
      await backup(s3Store.data, configDirectory, soundDirectory);
    }
    return "ok";
  });

  ipcMain.handle("s3-restore", async (_event) => {
    await s3Store.read();
    const configDirectory = app.getPath("userData");
    const soundDirectory = join(configDirectory, "sounds");

    if (s3Store.data) {
      await restore(s3Store.data, configDirectory, soundDirectory);
    }

    return "ok";
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
