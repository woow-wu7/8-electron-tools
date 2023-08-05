<template>
  <section>
    <div class="record__top">
      <div class="record__left">
        <div class="start__container">
          <div class="start__button" @click="onStartRecord">
            <el-icon class="start__icon" v-if="!state.isStaring"
              ><VideoPlay
            /></el-icon>
            <el-icon class="start__icon clockwise" v-else><Refresh /></el-icon>
            <div class="start__text" v-if="!state.isStaring">开始录屏</div>
            <div class="start__text" v-else>{{ time ?? "00:00:00" }}</div>
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
        <video
          :src="`http://localhost:7778/${state.recordUrl}`"
          v-else
          class="screen__img"
          width="300"
          height="400"
          autoplay
        ></video>
      </div>
    </div>

    <div class="record__list" ref="contentRef">
      <el-scrollbar :height="contentHeight">
        <div
          v-for="(item, i) in state.recordList"
          :class="['record__item', { 'is-selected': item.isSelected }]"
          @click="onSelect(item, i)"
        >
          <div class="record__name">{{ item.name }}</div>
          <div class="record__play" @click="onPlay(item)">播放</div>
          <div class="record__open" @click="onOpen(item)">打开文件夹</div>

          <el-popconfirm
            title="确定要删除吗?"
            @confirm="onDelete(item)"
            icon-color="red"
            confirm-button-type="danger"
            confirm-button-text="删除"
          >
            <template #reference>
              <div class="record__del">删除</div>
            </template>
          </el-popconfirm>
        </div>
      </el-scrollbar>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, onMounted, onUnmounted, ref, computed } from "vue";
import { useTimer } from "../utils/hooks/useTimer";
import { httpServer } from "../server";
import { VIDEO_PATH } from "@src/utils/constant";

const { ipcRenderer } = require("electron");
const fs = require("fs");
const path = require("path");

const { time, clearTimer, run: timerRun } = useTimer();

const state = reactive<any>({
  previewImageUrl: "",
  isStaring: false,

  recordRef: {},
  recordList: [],
  recordUrl: "",
});

const contentRef = ref();
const contentHeight = computed(() => contentRef.value?.offsetHeight);

onMounted(() => {
  initPreviewImg();
  initRecordList();
  httpServer();
});
onUnmounted(() => {
  clearTimer();
});

const getPreviewResource = (): Promise<Electron.DesktopCapturerSource> => {
  return new Promise((resolve) => {
    ipcRenderer.send("CAPTURER:start-get-desktop-source");
    ipcRenderer.on("CAPTURER:end-get-desktop-source", (_, data) => {
      resolve(data);
    });
  });
};

const initPreviewImg = async () => {
  const source = await getPreviewResource();
  state.previewImageUrl = source.thumbnail.toDataURL();
};

const initRecordList = () => {
  state.recordList = readVideo();
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
      console.log("stop video recording");
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
  // const path = store.get("VIDEO_SAVE_PATH");
  // console.log("path: ", path);

  const VIDEO_SAVE_PATH = localStorage.getItem("VIDEO_FILE_PATH");

  if (fs.existsSync(VIDEO_SAVE_PATH)) {
    const videoNames = fs.readdirSync(VIDEO_SAVE_PATH);

    const fileNames = videoNames.filter((item: any) => {
      const filePath = path.join(`${VIDEO_SAVE_PATH}/${item}`);
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

    getVideoSavePath().then((path) => {
      const reader: any = new FileReader();
      reader.readAsArrayBuffer(blob);
      reader.onload = () => {
        const buffer = Buffer.from(reader?.result);
        fs.writeFile(`${path}/${times}.mp4`, buffer, {}, (err: any) =>
          console.log(err)
        );
      };

      reader.onloadend = () => {
        resolve(true);
      };
      reader.onerror = (err: any) => {
        reject(err);
      };
    });
  });
};

const getVideoSavePath = (): Promise<string> => {
  return new Promise((resolve) => {
    ipcRenderer.send("DIALOG:create-file-save-path");
    ipcRenderer.on("DIALOG:received-file-save-path", (_, path) => {
      // if (!fs.existsSync(VIDEO_PATH)) {
      //   fs.mkdirSync(VIDEO_PATH, { recursive: true });
      // }
      localStorage.setItem("VIDEO_FILE_PATH", path);
      resolve(path);
    });
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

const onDelete = (item: any) => {
  state.recordList = state.recordList.filter(
    (record: any) => record.name !== item.name
  );

  const VIDEO_SAVE_PATH = localStorage.getItem("VIDEO_FILE_PATH");

  if (VIDEO_SAVE_PATH) {
    fs.rm(`${VIDEO_SAVE_PATH}/${item.name}`);
  }
};

const onOpen = (item: any) => {
  ipcRenderer.send("open-dir", item.name);
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

          &:hover {
            .start__icon,
            .full__icon {
              font-size: 40px;
              color: #8998fb;
            }

            .start__text,
            .full__text {
              margin-top: 10px;
              font-size: 14px;
              color: #939cd4;
              user-select: none;
            }
          }

          .start__icon,
          .full__icon {
            font-size: 40px;
            color: #6c78c7;
            transition: all 0.41s;
          }
          .start__text,
          .full__text {
            margin-top: 10px;
            font-size: 14px;
            color: #7077a3;
            user-select: none;
            transition: all 0.4s;
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
    padding-top: 10px;
    position: absolute;
    top: 200px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;

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
      &:hover {
        background: #2d4449;
      }

      .record__name {
        width: 220px;
      }

      .record__play {
        user-select: none;
        &:hover {
          color: #76c2af;
        }
      }

      .record__del {
        user-select: none;

        &:hover {
          color: rgb(255, 72, 105);
        }
      }

      .record__open {
        user-select: none;
        margin-left: 20px;
        margin-right: 20px;
        &:hover {
          color: #76c2af;
        }
      }

      .record__time {
        margin-right: 30px;
      }
    }
  }

  .screen__img {
    z-index: -111;
    width: 200;
    height: 150;
  }
}
.is-selected {
  background: #315359;
}
</style>
