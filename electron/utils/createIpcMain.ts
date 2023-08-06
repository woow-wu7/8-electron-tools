import { ipcMain, shell, webContents } from "electron";
import type { BrowserWindow } from "electron";

// 3
// 进程通信
// Home.vue <--> main.js
// 接收数据

// ipcMain <-> ipcRender

const createIpcMain = (win: BrowserWindow) => {
  // A. 渲染进程->主进程 on/send
  ipcMain.on("message_from_ipcRenderer", (e, data) => {
    console.log("data", data);
    e.reply("message_from_ipcMain", "主进程to渲染进程"); // 发数据
  });
  // B. 渲染进程->主进程 handle/invoke
  ipcMain.handle("TEST:invoke-message", (e, data) => {
    console.log("data", data);
    return "这是 主进程 通过 handle 返回给 渲染进程 的数据";
    // 注意: 主进程通过 handle 返回的数据，是 promise 对象，在渲染进程中需要通过 then 来接收
  });
  // C. 主进程 -> 渲染进程
  // win.webContents.openDevTools(); // 打开 electron 的调试窗口
  // - const { webContents } = require('electron')
  // - webContents.getAllWebContents()
  // - webContents.getFocusedWebContents()
  setTimeout(() => {
    win.webContents.send(
      "TEST:main-to-render",
      "主进程主动发送的数据，在wallpaper页面接收"
    );
  }, 3000);

  // 1
  // 拖动 最大化  最小化 关闭
  ipcMain.on("coordinate", (e, data) => {
    // console.log("e", e);
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

  // 2
  // 打开文件夹
  ipcMain.on("open-dir", (e, path) => {
    shell.showItemInFolder(path);
  });
};

export { createIpcMain };
