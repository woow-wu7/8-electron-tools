import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "record",
      component: () => import("../views/Home.vue"),
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
