<template>
  <section class="layout__aside">
    <img :src="logo" class="aside__logo" />

    <template v-for="item in state.menuData">
      <div
        :class="['aside__menu', { 'is-selected': item.isSelected }]"
        @click="goPage(item)"
      >
        <el-icon class="aside__icon">
          <component :is="item.icon" />
        </el-icon>
        <div class="aside__text">{{ item.text }}</div>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
import logo from "@src/assets/images/logo.png";

const router = useRouter();

const state = reactive({
  menuData: [
    {
      text: "录屏",
      path: "record",
      icon: "Monitor",
      id: 0,
      isSelected: false,
    },
    {
      text: "壁纸",
      path: "wallpaper",
      icon: "PictureRounded",
      id: 1,
      isSelected: false,
    },
  ],
});

const goPage = (item: any) => {
  router.push({
    name: item.path,
  });

  state.menuData.forEach((menuData) => {
    if (menuData.id == item.id) {
      menuData.isSelected = true;
    } else {
      menuData.isSelected = false;
    }
  });
};
</script>

<style scoped lang="scss">
.layout__aside {
  width: 60px;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: 1px solid rgb(210, 210, 210);

  cursor: pointer;

  .aside__logo {
    width: 40px;
    height: 40px;
    margin-top: 20px;
    filter: drop-shadow(2px 2px 2px #c9c9c9);
    margin-bottom: 40px;
  }

  .aside__menu {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 12px 0;

    color: #4b4a58;

    &:hover {
      color: #76c2af;
    }

    .aside__icon {
      font-size: 24px;
    }
    .aside__text {
      font-size: 14px;
      margin-top: 2px;
    }
  }
}

.is-selected {
  color: #fff !important;
  background: #76c2af;
}
</style>
