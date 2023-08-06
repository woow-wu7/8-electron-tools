import { Notification } from "electron";
import type { TWin } from "../main";

export const createNotification = (win: TWin) => {
  const notification = new Notification({
    title: "8-electron-tool is running",
    body: "Notification from the Main process",
  });
  // notification.show(); // show() 方法表示触发 Notification
};
