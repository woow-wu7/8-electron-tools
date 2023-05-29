# Electron + Vue3 + TypeScript + Vite

### 一些单词

```
Electron 电子
```

### (1) app 模块

```
app
- 作用: 控制应用程序的生命周期
- 进程: 主进程
---

1
生命周期
- ready ---------------------- Electron 完成初始化时，触发出一次
- browser-window-crated ------ 窗口创建完成时触发
- before-quit ---------------- 窗口关闭前触发
- will-quit ------------------ 窗口关闭了 但是程序还没有关闭，即将关闭
- quit ----------------------- 应用程序关闭触发
- requestSingleInstanceLock -- 返回 boolean，应用程序实例是否成功取得了锁，即 ( 禁止双开，配合 second-instance 事件使用 )
```
