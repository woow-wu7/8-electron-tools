<template>
  <section>
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
        <img
          :src="state.previewImageUrl"
          class="screen__img"
          v-if="!state.recordUrl"
        />
        <video :src="state.recordUrl" v-else></video>
      </div>
    </div>

    <div class="record__list">
      <!-- <div class="record__title">视频播放列表</div> -->
      <div
        v-for="(item, i) in state.recordList"
        :class="['record__item', { 'is-selected': item.isSelected }]"
        @click="onSelect(item, i)"
      >
        <div class="record__name">{{ item.name }}</div>
        <div class="record__name" @click="onPlay(item)">播放</div>
        <!-- <div class="record__time">{{ item.time }}</div>
        <div class="record__size">{{ item.size }}</div> -->
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, onMounted, onUnmounted } from "vue";
const { ipcRenderer } = require("electron");
import { useTimer } from "../utils/hooks/useTimer";

const fs = require("fs");
const path = require("path");

const { time, clearTimer, run: timerRun } = useTimer();
console.log("time", time);

const state = reactive<any>({
  previewImageUrl: "",
  isStaring: false,

  recordRef: {},
  recordList: [],
  recordUrl: "",
});

onMounted(() => {
  initPreviewImg();
  initRecordList();
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

const initRecordList = () => {
  state.recordList = readVideo();
  console.log("state.recordList", state.recordList);
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

        state.recordList = readVideo();
      });
    };
    state.recordRef.onerror = (err: any) => {
      console.log("err", err);
    };
  }
};

const readVideo = () => {
  if (fs.existsSync("/Users/xiawu/Downloads/video")) {
    const videoNames = fs.readdirSync("/Users/xiawu/Downloads/video");

    console.log("videoNames", videoNames);
    const fileNames = videoNames.filter((item: any) => {
      const filePath = path.join(`/Users/xiawu/Downloads/video/${item}`);
      console.log("33333", fs.statSync(filePath));
      return fs.statSync(filePath) && item.match(/.mp4$/);
    });

    return fileNames.map((item: any) => ({
      name: item,
    }));
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

const onSelect = (item: any, i: number) => {
  state.recordList.forEach((current: any, index: any) => {
    if (index === i) {
      current.isSelected = true;
    } else {
      current.isSelected = false;
    }
  });
};

const onPlay = (item: any) => {
  state.recordUrl = item.name;
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
    box-sizing: border-box;

    .record__title {
      padding: 12px 30px;
      color: #6c78c7;
      border-bottom: 1px solid #191919;
    }

    .record__item {
      padding: 12px 30px;
      color: #6c78c7;
      font-size: 14px;
      cursor: pointer;

      @include flex-r-start-center();

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
