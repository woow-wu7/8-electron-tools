<template>
  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Install
    <a href="https://github.com/vuejs/language-tools" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>

  <button @click="send">发消息</button>
</template>

<script setup lang="ts">
import { ref } from "vue";

// 注意
// 这里渲染进程 之所以可以使用node是因为 我们设置了 ( nodeIntegration contextIsolation )
const { ipcRenderer } = require("electron");

defineProps<{ msg: string }>();

const count = ref(0);

const send = () => {
  ipcRenderer.send("message_from_ipcRenderer", "渲染进程to主进程");
};
</script>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
