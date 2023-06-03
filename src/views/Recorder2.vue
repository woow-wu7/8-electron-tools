<template>
  <section ref="recordRef">
    <div class="start__layer" v-show="state.isShow">
      <div class="button__start" @click="onStartRecord">
        <el-icon class="clockwise font-30" v-if="state.loading"
          ><Refresh
        /></el-icon>
        <div v-else>录屏</div>
      </div>
    </div>
    <video src="" ref="videoRef" autoplay muted></video>
    <div class="end__layer" @click="onStopRecord" v-show="!state.isShow">
      <div class="button__end">关闭</div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";

const videoRef = ref();
const recordRef = ref();

const state = reactive({
  isShow: true,
  loading: false,
});

const onStartRecord = async () => {
  await init();
  state.isShow = false;
};

const init = async () => {
  state.loading = true;
  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      width: recordRef.value.offsetWidth,
      height: recordRef.value.offsetHeight - 10,
    },
  });
  videoRef.value.srcObject = stream;
  videoRef.value.play();
  state.loading = false;
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

// 注意
// 这里渲染进程 之所以可以使用node是因为 我们在 electron main.js 中 设置了 ( nodeIntegration contextIsolation )
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
</script>

<style scoped lang="scss">
section {
  flex: 1;
  position: relative;

  .start__layer {
    @include flex-center();
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: #262839;
    z-index: 999;

    .button__start {
      @include flex-center();
      width: 130px;
      height: 130px;
      background: #1a1f23;
      border-radius: 100%;
      border: 6px solid #25b493;
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
    background: #1f272f;
    cursor: pointer;
    color: #fff;
  }
}
</style>
