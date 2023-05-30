<template>
  <Header />

  <section>
    <RouterView />
  </section>
</template>

<script setup lang="ts">
import Header from "@src/components/Header/Header.vue";
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
