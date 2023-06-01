<template>
  <section ref="recordRef">
    <div class="start__layer" v-if="state.isShow">
      <div class="button__start" @click="onStartRecord">录屏</div>
    </div>
    <video src="" ref="videoRef" autoplay muted></video>
    <div class="end__layer" @click="onStopRecord" v-if="!state.isShow">
      <div class="button__end">关闭</div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
// 注意
// 这里渲染进程 之所以可以使用node是因为 我们设置了 ( nodeIntegration contextIsolation )
// const { ipcRenderer } = require("electron");

// 发数据
// const send = () => {
//   ipcRenderer.send("message_from_ipcRenderer", "渲染进程to主进程");
// };

// 接收数据
// ipcRenderer.on("message_from_ipcMain", (e, data) => {
//   console.log("e", e);
//   console.log("data", data);
// });

const videoRef = ref();
const recordRef = ref();

const state = reactive({
  isShow: true,
});

const onStartRecord = () => {
  state.isShow = false;
  init();
};

const init = async () => {
  console.log("first", recordRef.value.clientWidth);
  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      width: recordRef.value.offsetWidth,
      height: recordRef.value.offsetHeight + 6,
    },
  });
  videoRef.value.srcObject = stream;
  videoRef.value.play();
};

const onStopRecord = () => {
  state.isShow = true;

  videoRef.value.srcObject.getTracks()[0].stop();
};

// const onShareScreen = async () => {
//   const stream = await navigator.mediaDevices.getDisplayMedia({
//     video: { width: 600, height: 300, displaySurface: "window" },
//     audio: false,
//   });
//   console.log("stream", stream);
//   videoRef.value.srcObject = stream;
//   videoRef.value.play();
// };
</script>

<style scoped lang="scss">
section {
  width: 100%;
  height: 100%;
  position: relative;

  .start__layer {
    @include flex-center();
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: linear-gradient(to bottom, #27323c, #1f272f);
    z-index: 999;

    .button__start {
      @include flex-center();
      width: 130px;
      height: 130px;
      background: #1a1f23;
      border-radius: 100%;
      border: 6px solid #2190c1;
      color: #fff;
      box-shadow: -1px -1px -1px 100px #1a1f23;
      cursor: pointer;
    }
  }

  .end__layer {
    @include flex-center();
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 30px;
    background: rgb(24, 24, 24);
    cursor: pointer;
    color: #fff;
  }
}
</style>
