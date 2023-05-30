<template>
  <span class="header__buttons">
    <el-space>
      <el-icon class="close"><Close /></el-icon>
      <el-icon class="full"><FullScreen /></el-icon>
    </el-space>
  </span>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.header__buttons {
  display: flex;
  align-items: center;

  .close {
    padding: 2px;
    box-sizing: border-box;
    color: #fff;
    font-size: 24px;
  }

  .full {
    padding: 2px;
    box-sizing: border-box;
    color: #fff;
    font-size: 20px;
  }
}
</style>
