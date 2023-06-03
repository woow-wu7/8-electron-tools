import { ipcMain, desktopCapturer, screen } from "electron";
import type { TWin } from "../main";

const createCapture = async (win: TWin) => {
  ipcMain.on("start-get-desktop-source", async (e) => {
    const sizeInfo = getSize();

    const source = await desktopCapturer.getSources({
      types: ["window", "screen"],
      thumbnailSize: sizeInfo, // 媒体源缩略图应缩放到的尺寸大小
    });
    e.reply("end-get-desktop-source", source?.[0]);
  });
};

const getSize = () => {
  const { scaleFactor } = screen.getPrimaryDisplay();
  return {
    width: 144 * scaleFactor,
    height: 196 * scaleFactor, // 输出设备的像素比例因子
  };
};

export { createCapture };
