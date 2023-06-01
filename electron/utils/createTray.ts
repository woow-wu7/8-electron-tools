import { Tray, Menu, app } from "electron";
import type { TWin } from "../main";

const path = require("path");

const createTray = (win: TWin) => {
  const tray = new Tray(
    path.join(__dirname, "../electron/images/cTemplate@2x.png")
  );
  const contextMenu = Menu.buildFromTemplate([
    { label: "最大化", click: () => win?.maximize() },
    { type: "separator" },
    { label: "退出", click: () => app.quit() },
  ]);
  tray.setToolTip("8-electron-tools");
  tray.setContextMenu(contextMenu);
};

export { createTray };
