import { Menu } from "electron";
import type { TWin } from "../main";

export const createMenu = (win: TWin) => {
  const menuTemplate = [
    {
      label: "文件",
      submenu: [
        { label: "新建", accelerator: "CmdOrCtrl+N", click: () => {} },
        { label: "打开", accelerator: "CmdOrCtrl+O", click: () => {} },
        { label: "保存", accelerator: "CmdOrCtrl+S", click: () => {} },
        { label: "退出", click: () => {} },
      ],
    },
    {
      label: "编辑",
      submenu: [
        { label: "撤销", click: () => {} },
        { label: "重做", click: () => {} },
        { label: "复制", click: () => {} },
        { label: "剪切", click: () => {} },
        { label: "粘贴", click: () => {} },
      ],
    },
    {
      label: "视图",
      submenu: [{ label: "全屏切换", click: () => {} }],
    },
    {
      label: "关于",
      submenu: [{ label: "主页", accelerator: "CmdOrCtrl+N", click: () => {} }],
    },
  ];

  // const nativeMenu = Menu.getApplicationMenu();
  var list = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(list);
};
