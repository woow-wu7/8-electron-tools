import { BrowserWindow } from "electron";
import type { TWin } from "../main";
import path from "node:path";

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];

// 1
// BrowserWindow
// - https://www.electronjs.org/zh/docs/latest/api/browser-window
function createWindow(win: TWin) {
  win = new BrowserWindow({
    icon: path.join(process.env.PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),

      // nodeIntegration contextIsolation 配合使用
      // - 在 html 文件中使用 node
      // - integration 是集成的意思
      nodeIntegration: true, // 是否开启node
      contextIsolation: false, // 是否开启上下文隔离
    },
    width: 800,
    height: 600,
    frame: false, // 有/无边框窗口
    resizable: true,
    show: false, // 窗口是否在创建时显示 [ 存在白屏，我们将 show 设置为false，然后再 read-to-show 中进行 show() ]
    skipTaskbar: true,
    movable: false, // 允许拖动
    // backgroundColor: "red",
  });

  win.once("ready-to-show", () => {
    win?.show();
  });

  // 重置窗口，并且移动窗口到指定的位置. 任何未提供的属性将默认为其当前值
  // win.setBounds({ x: 440, y: 225, width: 800, height: 600 });

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    // win.loadURL(VITE_DEV_SERVER_URL);
    // - 加载远程文件
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    // - 加载本地文件，相对/绝对路径都可以
    // - 可以加载 html css 等文件
    win.loadFile(path.join(process.env.DIST, "index.html"));
  }

  return win;
}

export { createWindow };
