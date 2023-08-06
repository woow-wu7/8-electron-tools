import { app, BrowserWindow } from "electron";
import {
  createWindow,
  createTray,
  createIpcMain,
  createCapture,
  createFileSavePath,
  createNotification,
} from "./utils";

import path from "node:path";

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, "../dist");
process.env.PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, "../public");

// 1
// BrowserWindow
// - https://www.electronjs.org/zh/docs/latest/api/browser-window
export type TWin = BrowserWindow | null;
let mainWindow: TWin;

// app.whenReady().then(() => {});

// 2
// app
// 两种方式执行 createWindow
// - 1. app.on("ready", () => {})
// - 2. app.whenReady().then(createWindow);

// ready
// - Electron 完成初始化时触发一次
app.on("ready", () => {
  mainWindow = createWindow(mainWindow);

  // if (process.platform == "darwin") app.dock.hide();

  createIpcMain(mainWindow);
  createCapture(mainWindow);
  createTray(mainWindow);
  createFileSavePath(mainWindow);
  createNotification(mainWindow);
});

// activate
// - 当应用被激活时发出 macOS独享
app.on("activate", function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    mainWindow = createWindow(mainWindow);
  }
});

// window-all-closed
// - 最后一个窗口被关闭时触发
app.on("window-all-closed", () => {
  mainWindow = null;
  app.quit(); // 退出应用
});
