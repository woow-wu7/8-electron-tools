<template>
  <header
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
  >
    <HeaderButtons />
  </header>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { ipcRenderer } from "electron";
import HeaderButtons from "@src/components/Header/HeaderButtons.vue";

const state = reactive({
  x: 0,
  y: 0,
  isDown: false,
});

const onMouseDown = (e: MouseEvent) => {
  state.x = e.x;
  state.y = e.y;
  state.isDown = true;
};

const onMouseMove = (e: MouseEvent) => {
  if (state.isDown) {
    const cx = e.screenX - state.x;
    const cy = e.screenY - state.y;
    ipcRenderer.send("coordinate", { cx, cy });
  }
};

const onMouseUp = () => {
  state.isDown = false;
};
</script>

<style scoped lang="scss">
header {
  display: flex;
  align-items: center;
  padding: 0;
  margin: 0;

  height: 30px;
  background: #4b4a58;
}
</style>
