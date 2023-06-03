import { ipcMain } from "electron";

// 3
// 进程通信
// Home.vue <--> main.js
// 接收数据

const createIpcMain = async (win: any) => {
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


};

export { createIpcMain };
