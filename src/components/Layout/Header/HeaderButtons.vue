<template>
  <span class="header__buttons">
    <el-icon class="small" @click="onSmall"><Minus /></el-icon>
    <el-icon class="full" @click="onFull"><FullScreen /></el-icon>
    <el-icon class="close" @click="onClose"><Close /></el-icon>
  </span>
</template>

<script setup lang="ts">
import { ipcRenderer } from "electron";

const onSmall = () => {
  ipcRenderer.send("onSmall");
};

const onClose = () => {
  ipcRenderer.send("onClose");
};

const onFull = () => {
  ipcRenderer.send("onFull");
};
</script>

<style scoped lang="scss">
.header__buttons {
  height: 100%;
  display: flex;
  align-items: center;

  .close {
    height: 100%;
    box-sizing: border-box;
    color: #fff;
    font-size: 22px;
    width: 40px;
    &:hover {
      background: rgb(228, 1, 62);
    }
  }

  .small {
    padding: 2px;
    box-sizing: border-box;
    color: #fff;
    font-size: 22px;
    margin-right: 10px;
    &:hover {
      color: rgb(255, 217, 3);
    }
  }

  .full {
    padding: 2px;
    box-sizing: border-box;
    color: #fff;
    font-size: 20px;
    &:hover {
      color: rgb(5, 255, 80);
    }
  }
}
</style>
