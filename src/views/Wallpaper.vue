<template>
  <section>
    <p>Wallpaper</p>

    <button @click="onNotification">设置成功-发送通知</button>
  </section>
</template>

<script setup lang="ts">
const onNotification = () => {
  const notification = new Notification("Click Event Notification", {
    body: "these are the notification contents. 通知的内容",
  });
  notification.onclick = () => console.log("Notification clicked");
};
</script>

<style scoped lang="scss"></style>
