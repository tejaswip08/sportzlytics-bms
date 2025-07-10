import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    name: "loginPage",
    path: "/",
    component: () => import("@/views/MainPages/LoginPage.vue"),
  },
  {
    name: "landingPage",
    path: "/landing-page",
    component: () => import("@/views/MainPages/LandingPage.vue"),
    children: [
      {
        name: "Coaches",
        path: "/coaches",
        component: () => import("@/views/ChildPages/CoachPage.vue"),
      },
      {
        path: "/app-users",
        name: "App Users",
        component: () => import("@/views/ChildPages/AppUsers.vue"),
      },
      {
        name: "Coaching Videos",
        path: "/coaching-videos",
        component: () => import("@/views/ChildPages/CabinetPage.vue"),
      },
      {
        name: "Refund Requests",
        path: "/refund-requests",
        component: () => import("@/views/ChildPages/RefundRequests.vue"),
      },
      {
        name: "Admins",
        path: "/all-admins",
        component: () => import("@/views/ChildPages/AdminPage.vue"),
      },
      {
        name: "Dashboard",
        path: "/dashboard",
        component: () => import("@/views/ChildPages/Dashboard.vue"),
      },
      {
        name: "Sports",
        path: "/sports",
        component: () => import("@/views/ChildPages/SportsPage.vue"),
      },
      {
        path: "/appguide",
        name: "App Guide",
        component: () => import("@/views/ChildPages/AppGuide.vue"),
      },
      {
        path: "/featured-ads",
        name: "Featured",
        component: () => import("@/views/ChildPages/FeaturedAds.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
