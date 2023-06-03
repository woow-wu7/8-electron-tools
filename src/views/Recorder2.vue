<template>
  <section ref="recordRef">
    <div class="record__top">
      <div class="record__left">
        <div class="start__container">
          <div class="start__button" @click="onStartRecord">
            <el-icon class="start__icon" v-if="!state.isStaring"
              ><VideoPlay
            /></el-icon>
            <el-icon class="start__icon loading-clockwise" v-else
              ><Refresh
            /></el-icon>
            <div class="start__text" v-if="!state.isStaring">开始录屏</div>
            <div class="start__text" v-else>{{ time ? time : "00:00:00" }}</div>
          </div>
        </div>

        <div class="full__container">
          <div class="full__button" @click="onEndRecord">
            <el-icon class="full__icon"><VideoPause /></el-icon>
            <div class="full__text">结束录屏</div>
          </div>
        </div>
      </div>

      <div class="record__content">
        <img :src="state.previewImageUrl" class="screen__img" />
      </div>
    </div>

    <div class="record__list">
      <!-- <video :src="state.previewImage" ref="videoRef" autoplay muted></video> -->
      <div
        v-for="item in state.recordList"
        :class="['record__item', { 'is-selected': item.isSelected }]"
        @click="onSelect(item)"
      >
        <div class="record__name">{{ item.name }}</div>
        <div class="record__time">{{ item.time }}</div>
        <div class="record__size">{{ item.size }}</div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from "vue";
const { ipcRenderer } = require("electron");
import { useTimer } from "../utils/hooks/useTimer";
const fs = require("fs");

const recordRef = ref();
const { time, clearTimer, run: timerRun } = useTimer();
console.log("time", time);

const state = reactive<any>({
  previewImageUrl: "",
  recordRef: {},
  isStaring: false,
  recordList: [
    {
      name: "列表111.map4",
      time: "23:00",
      size: "100Mb",
      key: 1,
    },
    {
      name: "列表111.map4",
      time: "23:00",
      size: "100Mb",
      key: 2,
    },
    {
      name: "列表111.map4",
      time: "23:00",
      size: "100Mb",
      key: 3,
    },
    {
      name: "列表111.map4",
      time: "23:00",
      size: "100Mb",
      key: 4,
    },
    {
      name: "列表111.map4",
      time: "23:00",
      size: "100Mb",
      key: 5,
    },
    {
      name: "列表111.map4",
      time: "23:00",
      size: "100Mb",
      key: 6,
    },
    {
      name: "列表111.map4",
      time: "23:00",
      size: "100Mb",
      key: 7,
    },
    {
      name: "列表111.map4",
      time: "23:00",
      size: "100Mb",
      key: 8,
    },
  ],
});

onMounted(() => {
  initPreviewImg();
});
onUnmounted(() => {
  clearTimer();
});

const getPreviewResource = () => {
  return new Promise((resolve) => {
    ipcRenderer.send("start-get-desktop-source");
    ipcRenderer.on("end-get-desktop-source", (e, data) => {
      console.log("e", e);
      resolve(data);
    });
  });
};

const initPreviewImg = async () => {
  const source: any = await getPreviewResource();
  state.previewImageUrl = source.thumbnail.toDataURL();
};

const getStream = async () => {
  const source: any = await getPreviewResource();
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      // @ts-ignore
      mandatory: {
        chromeMediaSource: "desktop",
        chromeMediaSourceId: source.id,
        minWidth: 1280,
        maxWidth: 1280,
        minHeight: 720,
        maxHeight: 720,
      },
    },
  });
  console.log("stream", stream);
  return stream;
};

const onStartRecord = async () => {
  state.isStaring = true;
  timerRun();

  const stream = await getStream();
  startRecord(stream);
};

const onEndRecord = () => {
  clearTimer();
  state.isStaring = false;
  state.recordRef.onstop();
};

const startRecord = async (stream: any) => {
  const list: any = [];
  state.recordRef = new MediaRecorder(stream, {
    mimeType: "video/webm",
  });
  if (state.recordRef) {
    state.recordRef.start(1000);
    state.recordRef.ondataavailable = (event: any) => {
      list.push(event.data);
    };
    state.recordRef.onstop = async () => {
      console.log("stop");
      const blob = new Blob([...list], {
        type: "video/webm",
      });
      saveVideo(blob).then(() => {
        console.log("保存成功 ");
      });
    };
    state.recordRef.onerror = (err: any) => {
      console.log("err", err);
    };
  }
};

const saveVideo = (blob: any) => {
  return new Promise((resolve, reject) => {
    const times = new Date().getTime();

    if (!fs.existsSync("/Users/xiawu/Downloads/video")) {
      fs.mkdirSync("/Users/xiawu/Downloads/video", { recursive: true });
    }

    const reader: any = new FileReader();
    reader.readAsArrayBuffer(blob);
    reader.onload = () => {
      console.log("111", reader);
      const buffer = Buffer.from(reader?.result);
      fs.writeFile(
        `/Users/xiawu/Downloads/video/${times}.mp4`,
        buffer,
        {},
        (err: any) => console.log(err)
      );
    };

    reader.onloadend = () => {
      resolve(true);
    };
    reader.onerror = (err: any) => {
      reject(err);
    };
  });
};

const onSelect = (item: any) => {
  state.recordList.forEach((current: any) => {
    if (current.key === item.key) {
      current.isSelected = true;
    } else {
      current.isSelected = false;
    }
  });
};

// const init = async () => {
//   const stream = await navigator.mediaDevices.getUserMedia({
//     video: {
//       width: recordRef.value.offsetWidth,
//       height: recordRef.value.offsetHeight - 10,
//     },
//   });
//   videoRef.value.srcObject = stream;
//   videoRef.value.play();
// };
</script>

<style scoped lang="scss">
section {
  flex: 1;
  position: relative;
  background: #262839;
  color: #fff;
  box-sizing: border-box;

  @include flex-column();

  .record__top {
    height: 200px;
    box-sizing: border-box;
    border-bottom: 1px solid #191919;
    @include flex-r-between-center();

    .record__left {
      @include flex-r-start-center();
      flex: 1;

      .full__container {
        flex: 1;
      }
      .start__container,
      .full__container {
        height: 200px;
        width: 200px;
        @include flex-center();
        position: relative;

        .start__button,
        .full__button {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          cursor: pointer;

          .start__icon,
          .full__icon {
            font-size: 40px;
            color: #6c78c7;
          }
          .start__text,
          .full__text {
            margin-top: 10px;
            font-size: 14px;
            color: #7077a3;
          }
        }
      }

      .button__full {
        flex: 1;
        height: 200px;
        @include flex-center();
      }
    }

    .record__content {
    }
  }

  .record__list {
    padding: 14px 0;

    .record__item {
      padding: 10px;
      // background: #315359;
      color: #6c78c7;
      font-size: 14px;

      @include flex-r-between-center();

      .record__name {
        margin-right: 30px;
      }

      .record__time {
        margin-right: 30px;
      }
    }
  }

  .screen__img {
  }
}
.is-selected {
  background: #315359;
}
</style>
