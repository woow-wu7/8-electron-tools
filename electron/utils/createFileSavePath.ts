import { ipcMain, dialog } from "electron";
import type { TWin } from "../main";

export const createFileSavePath = (win: TWin) => {
  ipcMain.on("DIALOG:create-file-save-path", (e) => {
    // TODO: remote 已被废除
    dialog
      .showOpenDialog({
        title: "请选择视频保存目录",
        buttonLabel: "保存",
        properties: ["openDirectory"],
      })
      .then((result) => {
        const path = result.filePaths[0];
        e.reply("DIALOG:received-file-save-path", path);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
