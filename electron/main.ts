import { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage } from "electron";
import path from "node:path";
import { createWindow, createTray } from "./utils";

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
let win: BrowserWindow | null;

// app.whenReady().then(() => {});

// 2
// app
// 两种方式执行 createWindow
// - 1. app.on("ready", () => {})
// - 2. app.whenReady().then(createWindow);
app.on("ready", () => {
  win = createWindow(win);

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      win = createWindow(win);
    }
  });

  // if (process.platform == "darwin") app.dock.hide();

  createTray();
});

// app.on("browser-window-created", () => {
//   console.log("browser-window-created");
// });

// window-all-closed
// - 最后一个窗口被关闭时退出应用
app.on("window-all-closed", () => {
  app.quit();
});

// 3
// 进程通信
// Home.vue <--> main.js
// 接收数据
ipcMain.on("message_from_ipcRenderer", (e, data) => {
  console.log("data", data);
  e.reply("message_from_ipcMain", "主进程to渲染进程"); // 发数据
});

ipcMain.on("coordinate", (e, data) => {
  console.log("e", e);
  win?.setPosition(data.cx, data.cy);
});
ipcMain.on("onSmall", () => {
  win?.minimize();
});
ipcMain.on("onFull", () => {
  win?.isMaximized() ? win?.unmaximize() : win?.maximize();
});
ipcMain.on("onClose", () => {
  win?.close();
});
