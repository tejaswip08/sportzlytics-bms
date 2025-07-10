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
        identityPoolId: "us-east-1:5d51df7e-d160-43db-bed7-0f636d93fd76",
        userPoolId: "us-east-1_XHrv2PFvB",
        userPoolClientId: "3480qig1bcujchnuj3g9shogou",
        loginWith: {
          email: true,
        },
        signUpVerificationMethod: "code",
      },
    },
    Storage: {
      S3: {
        bucket: "slts-app-users",
        region: "us-east-1",
      },
    },
    API: {
      GraphQL: {
        endpoint:
          "https://3aoybc333vbffmquaojhw4aasa.appsync-api.us-east-1.amazonaws.com/graphql",
        region: "us-east-1",
        defaultAuthMode: "userPool", // userPool = Cognito User Pools
      },
    },
  });
}
initApp().then(() => {
  createApp(App).use(router).use(store).use(vuetify).mount("#app");
});
