<template>
  <header
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
    class="layout__header"
  >
    <HeaderButtons />
  </header>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { ipcRenderer } from "electron";
import HeaderButtons from "@src/components/Layout/Header/HeaderButtons.vue";

const state = reactive({
  x: 0,
  y: 0,
  isDown: false,
});

let onMouseDown = (e: MouseEvent) => {
  state.x = e.x;
  state.y = e.y;
  state.isDown = true;
};

let onMouseMove = (e: MouseEvent) => {
  if (state.isDown) {
    const cx = e.screenX - state.x;
    const cy = e.screenY - state.y;
    ipcRenderer.send("coordinate", { cx, cy });
  }
};

let onMouseUp = () => {
  state.isDown = false;
};
</script>

<style scoped lang="scss">
.layout__header {
  @include flex-r-end-center;
  height: 34px;
  padding: 0;
  margin: 0;
  background: #2a2f42;
  cursor: pointer;
  z-index: 99999;

  // -webkit-app-region: drag; // css方式拖动，但是这样的话 header 的按钮 (最大化，最小化，关闭) 就懂不能用了
}
</style>
