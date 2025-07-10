<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-app>
      <v-card>
        <v-layout>
          <v-app-bar rounded="0" color="#464646" app elevation="0">
            <v-app-bar-nav-icon
              variant="text"
              @click.stop="drawer = !drawer"
            ></v-app-bar-nav-icon>

            <v-toolbar-title tile>
              <div class="d-flex align-center">
                <div>
                  <v-img src="@/assets/FinalLogo.png" :width="70" cover />
                </div>
                <div class="ml-2" style="font-size: 17px">
                  <span><strong> v1.0.3 </strong></span>
                </div>
              </div>
            </v-toolbar-title>

            <v-spacer></v-spacer>
            <v-menu transition="slide-x-transition">
              <template v-slot:activator="{ props }">
                <v-avatar color="white" size="50" v-bind="props" class="mr-4">
                  <p class="text-blue">
                    <strong>{{ userName.slice(0, 2).toUpperCase() }}</strong>
                  </p>
                </v-avatar>
              </template>
              <v-card :width="300" class="pa-5">
                <div class="muktaFont">
                  <span style="font-size: 20px"
                    >Hello,
                    <span style="color: #0981c5"
                      ><strong>{{ userDetails[0].user_name }}</strong></span
                    ></span
                  >
                  <p style="font-size: 15px; color: grey">
                    <v-icon class="mr-1" color="grey" size="17"
                      >mdi-gmail</v-icon
                    >{{ userDetails[0].user_email_id }}
                  </p>
                  <v-divider></v-divider>
                  <!-- <div class="flex-class2">
                    <div>
                      <v-card
                        class="pa-3"
                        :class="{ 'selected-theme': !$vuetify.theme.dark }"
                        @click="toggleTheme('light')"
                      >
                        <v-icon class="d-flex justify-center" color="white"
                          >mdi-white-balance-sunny</v-icon
                        >
                        <p><span class="fontSize15px">Light Mode</span></p>
                      </v-card>
                    </div>
                    <div>
                      <v-card
                        class="pa-3"
                        :class="{ 'selected-theme': $vuetify.theme.dark }"
                        @click="toggleTheme('dark')"
                      >
                        <v-icon class="d-flex justify-center"
                          >mdi-weather-night</v-icon
                        >
                        <p><span class="fontSize15px">Dark Mode</span></p>
                      </v-card>
                    </div>
                  </div>
                  <v-divider /> -->
                  <div class="mt-4">
                    <v-btn
                      block
                      rounded
                      class="text-capitalize btnColorPrimary"
                      @click="logoutMethod()"
                      >Logout<v-icon size="17" color="white" class="pl-1"
                        >mdi-exit-to-app</v-icon
                      ></v-btn
                    >
                  </div>
                </div>
              </v-card>
            </v-menu>
          </v-app-bar>
          <div class="layoutContainer">
            <v-navigation-drawer
              color="primary"
              v-model="drawer"
              :permanent="$vuetify.display.mdAndUp"
              :temporary="!$vuetify.display.mdAndUp"
              :location="$vuetify.display.mobile ? 'bottom' : 'left'"
              class="pl-3 pr-3"
              :width="240"
            >
              <v-list>
                <v-list-item
                  v-for="(menu, index) in menuList"
                  :key="index"
                  @click="$router.push(menu.MenuRoute)"
                  density="compact"
                  rounded="xl"
                  class="mt-1 mb-1 menuList menuFont"
                  :class="{ activeMenu: menu.MenuName === $route.name }"
                >
                  <v-list-item-title class="menuFont">
                    <div class="d-flex align-center">
                      <div>
                        {{ menu.MenuName }}
                      </div>
                      <v-spacer />
                      <div>
                        <v-icon size="small">{{ menu.MenuIcon }}</v-icon>
                      </div>
                    </div>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-navigation-drawer>
            <div
              v-if="mainLoader"
              style="position: absolute; top: 40%; left: 40%"
            >
              <v-main class="main-content">
                <v-progress-circular
                  :size="60"
                  :width="6"
                  color="primary"
                  indeterminate
                ></v-progress-circular>
              </v-main>
            </div>
            <div v-else>
              <v-main class="main-content">
                <router-view />
              </v-main>
            </div>
          </div>
        </v-layout>
      </v-card>
    </v-app>
  </div>
</template>

<script>
import MenuListJson from "@/JSON/Router.json";

import Snackbar from "@/components/Extras/MySnackbar.vue";

import { signOut } from "aws-amplify/auth";
import { getCurrentUserMethod } from "@/mixins/GetCurrentUserData.js";

export default {
  components: {
    Snackbar,
  },
  data() {
    return {
      userName: "",
      drawer: true,
      group: null,
      menuList: [],
      userDetails: { user_name: "User" },
      SnackBarComponent: {},
      mainLoader: true,
    };
  },

  async mounted() {
    this.menuList = MenuListJson;
    const userInfo = await getCurrentUserMethod();
    if (userInfo === "/") {
      this.$router.push(userInfo);
    } else {
      this.$store.commit("SET_USER_INFO", userInfo);
      this.userDetails = this.$store.getters.get_user_info;
      this.userName = this.userDetails[0].user_name;
      if (this.$store.getters.get_initial_login) {
        this.SnackBarComponent = {
          SnackbarVModel: true,
          color: "text-green",
          Message: "Logged in successfully!",
        };
        this.$store.commit("SET_INITIAL_LOGIN", false);
        this.$router.push("/coaches");
      }
    }
    this.mainLoader = false;
  },
  methods: {
    async logoutMethod() {
      try {
        await signOut({ global: true });
        this.$router.push("/");
        this.$store.commit("SET_INITIAL_LOGOUT", true);
      } catch (error) {
        // handle error if needed
      }
    },
  },
};
</script>

<style scoped>
.layoutContainer {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.v-navigation-drawer {
  flex: 0 0 auto;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  height: 100%;
  width: 100vw;
}

.menuList {
  transition: 0.4s ease;
}

.menuList:hover {
  background-color: rgb(41, 40, 40);
}

.activeMenu {
  background-color: black !important;
  color: white !important;
}
</style>
