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
      path: "record2",
      icon: "Monitor",
      id: 0,
      isSelected: true,
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
  @include flex-c-start-center();
  width: 60px;
  border-right: 1px solid #12121c;
  box-sizing: border-box;
  background: #262839;
  cursor: pointer;

  .aside__logo {
    width: 40px;
    height: 40px;
    margin-top: 20px;
    margin-bottom: 40px;
  }

  .aside__menu {
    @include flex-c-start-center();
    width: 100%;
    padding: 10px 0;
    color: #7077a3;
    color: #6c78c7;

    &:hover {
      color: #76c2af;
    }

    .aside__icon {
      font-size: 24px;
    }

    .aside__text {
      margin-top: 2px;
      font-size: 14px;
    }
  }
}

.is-selected {
  color: #3ae9b0 !important;
}
</style>
