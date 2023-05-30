<template>
  <Section class="layout__app">
    <Header />
    <main class="layout__main">
      <Aside />
      <RouterView />
    </main>
  </Section>
</template>

<script setup lang="ts">
import Header from "@src/components/Layout/Header/Header.vue";
import Aside from "@src/components/Layout/Aside/Aside.vue";
</script>

<style scoped lang="scss">
.layout__app {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;

  .layout__main {
    display: flex;
    flex-direction: row;

    flex: 1;
  }
}
</style>
