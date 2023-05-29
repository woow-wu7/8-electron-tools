<template>
  <div v-show="!isFullscreen" :class="$style.control">
    <button
      type="button"
      :class="[$style.btn, $style.min]"
      :aria-label="$t('min')"
    >
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xlink="http://www.w3.org/1999/xlink"
        height="60%"
        viewBox="0 0 24 24"
        space="preserve"
      >
        <use xlink:href="#icon-window-minimize-2" />
      </svg>
    </button>
    <button
      type="button"
      :class="[$style.btn, $style.close]"
      :aria-label="$t('close')"
    >
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xlink="http://www.w3.org/1999/xlink"
        height="60%"
        viewBox="0 0 24 24"
        space="preserve"
      >
        <use xlink:href="#icon-window-close-2" />
      </svg>
    </button>
  </div>
</template>

<script setup></script>

<style lang="less" module></style>
