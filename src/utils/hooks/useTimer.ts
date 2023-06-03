import { reactive, computed } from "vue";

export const useTimer = () => {
  const state = reactive<any>({
    second: 0,
    minute: 0,
    hour: 0,
    count: 0,
    time: "",
    timer: 0,
  });

  const run = () => {
    state.timer = setInterval(() => {
      state.count = state.count + 1;

      state.second = state.count % 60;

      state.minute = Math.floor(state.count / 60);
      if (state.minute >= 60) {
        state.minute = state.minute % 60;
      }

      state.hour = Math.floor(state.count / 3600);
      if (state.hour >= 60) {
        state.hour = state.hour % 60;
      }

      formatTimer();
    }, 1000);
  };

  const clearTimer = () => {
    clearState();
    clearInterval(state.timer);
  };

  const clearState = () => {
    state.count = 0;
    state.time = "00:00:00";
    state.minute = 0;
    state.second = 0;
    state.hour = 0;
  };

  const formatTimer = () => {
    let hour, minute, second;

    hour = state.hour < 10 ? `0${state.hour} ` : `${state.hour}`;
    minute = state.minute < 10 ? `0${state.minute} ` : `${state.minute}`;
    second = state.second < 10 ? `0${state.second} ` : `${state.second}`;

    state.time = `${hour}:${minute}:${second}`;
  };

  return {
    run,
    clearTimer,
    time: computed(() => state.time), // 注意: 这里解构就没有响应式了，所以要用 computed 包装，或者导出整个 state
    // timer: state.timer, // 不具有响应式
    // state, // 直接导出state具有响应式
  };
};
