<template>
  <section>
    <main>
      <button type="button" @click="count++">count is {{ count }}</button>
      <button @click="send" class="rounded-pill">发消息</button>

      <div
        class="rounded-circle"
        style="width: 40px; height: 40px; background: red"
      ></div>

      <div
        class="rounded-sm"
        style="width: 100px; height: 60px; background: red"
      ></div>

      <div
        class="rounded-lg"
        style="width: 100px; height: 60px; background: red"
      ></div>

      <div
        class="rounded-xl"
        style="width: 100px; height: 60px; background: red"
      ></div>
    </main>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";

// 注意
// 这里渲染进程 之所以可以使用node是因为 我们设置了 ( nodeIntegration contextIsolation )
const { ipcRenderer } = require("electron");

defineProps<{ msg: string }>();

const count = ref(0);

// 发数据
const send = () => {
  ipcRenderer.send("message_from_ipcRenderer", "渲染进程to主进程");
};

// 接收数据
ipcRenderer.on("message_from_ipcMain", (e, data) => {
  console.log("e", e);
  console.log("data", data);
});
</script>

<style scoped lang="scss">
.read-the-docs {
  color: #888;
}
</style>
