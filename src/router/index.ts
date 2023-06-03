import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/1111",
      name: "record",
      component: () => import("../views/Recorder.vue"),
    },
    {
      path: "/",
      name: "record2",
      component: () => import("../views/Recorder2.vue"),
    },
    {
      path: "/wallpaper",
      name: "wallpaper",
      component: () => import("../views/Wallpaper.vue"),
    },
  ],
});

// router.beforeEach((to, from, next) => {
//   next();
// });

export default router;
