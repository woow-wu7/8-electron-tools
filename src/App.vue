<template>
  <header>
    <HeaderButtons />
  </header>

  <section>
    <RouterView />
  </section>
</template>

<script setup lang="ts">
import HeaderButtons from "@src/components/HeaderButtons.vue";
</script>

<style scoped lang="scss">
header {
  display: flex;
  align-items: center;
  padding: 0;
  margin: 0;

  height: 30px;
  background: #4b4a58;
}
</style>
