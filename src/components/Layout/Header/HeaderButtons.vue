<template>
  <span class="header__buttons">
    <el-space>
      <el-icon class="small" @click="onSmall"><Minus /></el-icon>
      <el-icon class="full" @click="onFull"><FullScreen /></el-icon>
      <el-icon class="close" @click="onClose"><Close /></el-icon>
    </el-space>
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
  @include flex-center;

  .close {
    height: 100%;
    width: 40px;
    box-sizing: border-box;
    font-size: 22px;
    color: #fff;
    &:hover {
      color: rgb(255, 66, 66);
    }
  }

  .small {
    padding: 2px;
    margin-right: 10px;
    box-sizing: border-box;
    font-size: 22px;
    color: #fff;
    &:hover {
      color: rgb(255, 217, 3);
    }
  }

  .full {
    padding: 2px;
    box-sizing: border-box;
    font-size: 20px;
    color: #fff;
    &:hover {
      color: rgb(5, 255, 80);
    }
  }
}
</style>
