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
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0;
  margin: 0;

  height: 34px;
  background: #4b4a58;
  margin: 0;

  cursor: pointer;
}
</style>
