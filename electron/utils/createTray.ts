import { Tray, Menu } from "electron";
const path = require("path");

const createTray = () => {
  const tray = new Tray(
    path.join(__dirname, "../electron/images/cTemplate@2x.png")
  );
  const contextMenu = Menu.buildFromTemplate([
    { label: "Item1", type: "radio" },
    { label: "Item2", type: "radio" },
    { label: "Item3", type: "radio", checked: true },
    { label: "Item4", type: "radio" },
  ]);
  tray.setToolTip("This is my application.");
  tray.setContextMenu(contextMenu);
};

export { createTray };
