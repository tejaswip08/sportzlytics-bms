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
        identityPoolId: process.env.VUE_APP_IDENTITY_POOL_ID,
        userPoolId: process.env.VUE_APP_AWS_COGNITO_USER_POOL_ID,
        userPoolClientId: process.env.VUE_APP_AWS_USER_POOL_WEB_CLIENT_ID,
        loginWith: {
          email: true,
        },
        signUpVerificationMethod: "code",
      },
    },
    Storage: {
      S3: {
        bucket: process.env.VUE_APP_AWS_BUCKET_NAME,
        region: process.env.VUE_APP_AWS_PROJECT_REGION,
      },
    },
    API: {
      GraphQL: {
        endpoint: process.env.VUE_APP_AWS_GRAPHQL_ENDPOINT,
        region: process.env.VUE_APP_AWS_PROJECT_REGION,
        defaultAuthMode: "userPool", // userPool = Cognito User Pools
      },
    },
  });
}
initApp().then(() => {
  createApp(App).use(router).use(store).use(vuetify).mount("#app");
});
