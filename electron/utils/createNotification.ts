import { Notification } from "electron";
import type { TWin } from "../main";

export const createNotification = (win: TWin) => {
  new Notification({
    title: "8-electron-tool is running",
    body: "Notification from the Main process",
  }).show();
};
