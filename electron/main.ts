import { app, BrowserWindow, ipcMain, IpcMainEvent, protocol } from "electron";
import { join } from "path";
import { Howl } from "howler";
import { Low, JSONFile } from "lowdb";
import { Store, storeDefaults } from "../src/utilities/store";

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
  console.warn(file);
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
