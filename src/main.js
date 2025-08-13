import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import { Amplify } from "aws-amplify";

loadFonts();
async function initApp() {
  Amplify.configure({
    Auth: {
      Cognito: {
        identityPoolId: "",
        userPoolId: "",
        userPoolClientId: "",
        loginWith: {
          email: true,
        },
        signUpVerificationMethod: "code",
      },
    },
    Storage: {
      S3: {
        bucket: "",
        region: "",
      },
    },
    API: {
      GraphQL: {
        endpoint:
          "",
        region: "",
        defaultAuthMode: "", // userPool = Cognito User Pools
      },
    },
  });
}
initApp().then(() => {
  createApp(App).use(router).use(store).use(vuetify).mount("#app");
});
