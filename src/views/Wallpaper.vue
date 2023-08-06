<template>
  <section>
    <p>Wallpaper</p>

    <button @click="onNotification">设置成功-发送通知</button>
    <button>发送消息-send</button>
    <button @click="onInvoke">发送消息-invoke渲染进程/handle主进程</button>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

const { ipcRenderer } = require("electron");

const onNotification = () => {
  const notification = new Notification("Click Event Notification", {
    body: "these are the notification contents. 通知的内容",
  });
  notification.onclick = () => console.log("Notification clicked");
};

const onInvoke = () => {
  ipcRenderer
    .invoke("TEST:invoke-message", {
      data: "render send message to main through invoke",
    })
    .then((value) => {
      console.log("value", value);
    });
};

onMounted(() => {
  ipcRenderer.on("TEST:main-to-render", (e, data) => {
    console.log("data", data);
  });
});
</script>

<style scoped lang="scss"></style>
