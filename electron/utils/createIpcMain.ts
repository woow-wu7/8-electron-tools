import { ipcMain, shell } from "electron";
import type { BrowserWindow } from 'electron';

// 3
// 进程通信
// Home.vue <--> main.js
// 接收数据

// ipcMain <-> ipcRender

const createIpcMain = async (win: BrowserWindow) => {
  ipcMain.on("message_from_ipcRenderer", (e, data) => {
    console.log("data", data);
    e.reply("message_from_ipcMain", "主进程to渲染进程"); // 发数据
  });

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

  // 打开文件夹
  ipcMain.on("open-dir", (e, path) => {
    shell.showItemInFolder(`/Users/xiawu/Downloads/video/${path}`);
  });
};

export { createIpcMain };
