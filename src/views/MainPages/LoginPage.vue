<template>
  <div class="mainLoginDiv muktaFont">
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-container fluid class="pa-0">
      <v-card elevation="0">
        <v-row class="rowHeight ma-0">
          <v-col cols="12" lg="6" md="6" sm="12" xs="12" class="row1Col1">
            <div class="loginFont text-white">
              Welcome to Sportzlytics, Tejaswi
            </div>
            <div>
              <v-img src="@/assets/FinalLogo.png" :width="350" />
            </div>
          </v-col>
          <v-col cols="12" lg="6" md="6" sm="12" xs="12" class="row1Col2">
            <div>
              <v-card elevation="5" rounded="lg" width="500px">
                <v-window v-model="step">
                  <v-window-item :value="1">
                    <v-card-text class="centeredCardContent pa-5">
                      <div>
                        <v-img
                          src="@/assets/emailVerify.png"
                          class="mx-auto"
                          :width="100"
                        />
                      </div>
                      <div class="loginFont text-center">
                        Email Verification
                      </div>
                      <div class="text-center customTable mt-3">
                        Enter your email id
                      </div>
                      <div>
                        <v-form ref="emailForm">
                          <v-text-field
                            v-model="email"
                            density="compact"
                            flat
                            variant="outlined"
                            persistent-clear
                            style="border-color: #b4d6ea"
                            append-inner-icon="mdi-email"
                            :rules="[
                              (v) => !!v || 'Kindly provide valid email..!',
                              (v) =>
                                /.+@.+\..+/.test(v) ||
                                'Please enter a valid email address..!',
                            ]"
                          >
                          </v-text-field>
                        </v-form>
                      </div>
                      <div class="mt-3">
                        <v-btn
                          :loading="loginLoader"
                          class="text-capitalize btnColorPrimary"
                          block
                          @click="validateEmail()"
                          >Verify Email</v-btn
                        >
                      </div>
                      <!-- <p class="text-center mt-3">Change Email</p> -->
                    </v-card-text>
                  </v-window-item>
                  <v-window-item :value="2">
                    <v-card-text class="centeredCardContent pa-5">
                      <div>
                        <v-img
                          src="@/assets/otpPic.png"
                          class="mx-auto"
                          :width="100"
                        />
                      </div>
                      <div class="text-center customTable mt-3">
                        Enter OTP send to your email
                      </div>
                      <div>
                        <v-otp-input
                          :height="80"
                          length="6"
                          v-model="otpPassword"
                        />
                      </div>
                      <div class="mt-3">
                        <v-btn
                          :loading="loginLoader"
                          class="text-capitalize btnColorPrimary"
                          block
                          @click="verifyOTP()"
                          >Verify OTP & Login</v-btn
                        >
                      </div>
                      <p class="text-center mt-3">OR</p>
                      <div class="mt-3">
                        <v-btn class="text-capitalize" block @click="step = 1"
                          >Re-enter email</v-btn
                        >
                      </div>
                    </v-card-text>
                  </v-window-item>
                </v-window>
              </v-card>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { confirmSignIn, signIn, signOut } from "aws-amplify/auth";
import Snackbar from "@/components/Extras/MySnackbar.vue";
export default {
  components: {
    Snackbar,
  },
  data: () => ({
    step: 1,
    email: "",
    otpPassword: "",
    SnackBarComponent: {},
    loginLoader: false,
  }),

  mounted() {
    if (this.$store.getters.get_initial_logout) {
      this.SnackBarComponent = {
        SnackbarVModel: true,
        color: "text-red",
        Message: "You have been logged out!",
      };
      this.$store.commit("SET_INITIAL_LOGOUT", false);
    }
  },

  methods: {
    async validateEmail() {
      const isValid = await this.$refs.emailForm.validate();

      if (isValid.valid) {
        this.loginLoader = true;
        this.GenerateOTPMethod();
      } else {
        this.SnackBarComponent = {
          SnackbarVModel: true,
          color: "text-red",
          Message: "Kindly provide valid email !",
        };
      }
    },

    async GenerateOTPMethod(Toggle) {
      try {
        const logInResult = await signIn({
          username: this.email,
          options: {
            authFlowType: "CUSTOM_WITHOUT_SRP",
          },
        });

        if (
          logInResult.nextStep.signInStep ===
          "CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE"
        ) {
          this.SnackBarComponent = {
            SnackbarVModel: true,
            color: "text-green",
            Message: "OTP has been sent to your email",
          };
          if (Toggle !== 2) {
            this.step++;
          }
          this.loginLoader = false;
        }
      } catch (error) {
        if (error.message === "There is already a signed in user.") {
          await signOut({ global: true });
          this.GenerateOTPMethod();
        }
        this.SnackBarComponent = {
          SnackbarVModel: true,
          color: "text-red",
          Message: "Couldn't find your email",
        };
        this.loginLoader = false;
        console.log("Error", error);
      }
    },

    reenterEmailMethod() {
      this.step--;
      this.otpPassword = "";
    },

    async verifyOTP() {
      try {
        this.loginLoader = true;
        const otpValidationResult = await confirmSignIn({
          challengeResponse: this.otpPassword,
        });
        if (otpValidationResult.isSignedIn === true) {
          // this.$store.commit("SET_USER_EMAIL", this.email);
          this.navigateToLandingPage();
          this.loginLoader = false;
        }
      } catch (error) {
        this.SnackBarComponent = {
          SnackbarVModel: true,
          color: "text-red",
          Message: "Invalid OTP try again!",
        };
        this.loginLoader = false;
        this.otpPassword = "";
      }
    },

    resendOtpBtn() {
      this.otpPassword = "";
      this.CallCountdownMethod();
      this.GenerateOTPMethod(2);
    },

    CallCountdownMethod() {
      this.countdownFrom = 30;
      this.hideResendOTPBtn = true;
      this.showCountdown = true;
      let intervalId = setInterval(() => {
        if (this.countdownFrom > 0) {
          this.countdownFrom = this.countdownFrom - 1;
        } else {
          this.showCountdown = false;
          this.hideResendOTPBtn = false;
          clearInterval(intervalId);
        }
      }, 1000);
    },

    navigateToLandingPage() {
      this.loginLoader = false;
      this.$router.push("/landing-page");
      this.$store.commit("SET_INITIAL_LOGIN", true);
      // this.$store.commit("SET_ROUTE_TO_SPECIFIED_MENU", true);
      // const sessionStorageObj = JSON.stringify({
      //   navigateToCoach: true,
      //   loggedIn: true,
      //   loggedOut: false,
      // });
      // sessionStorage.setItem("sessionStorageObj", sessionStorageObj);
    },

    getTimeOfDay() {
      const now = new Date();
      const hour = now.getHours();
      if (hour >= 5 && hour < 12) {
        this.dayType = "Morning";
      } else if (hour >= 12 && hour < 18) {
        this.dayType = "Afternoon";
      } else {
        this.dayType = "Evening";
      }
    },

    getCurrentYear() {
      const date = new Date();
      this.current_year = date.getFullYear();
      if (date >= 12 && date < 18) {
        this.datType = "Afternoon";
      } else {
        this.dayType = "Evening";
      }
    },

    // getCurrentYear() {
    //   const date = new Date();
    //   this.current_year = date.getFullYear();
    // },
  },
};
</script>

<style scoped>
/* .mainLoginDiv {
  height: 100vh !important;
  width: 100vw !important;
  background-color: blue;
} */

.rowHeight {
  height: 100vh !important;
}

.row1Col1 {
  background: linear-gradient(to top, #0981c5, black);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.row1Col2 {
  background-color: #b4d6ea;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.centeredCardContent {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
