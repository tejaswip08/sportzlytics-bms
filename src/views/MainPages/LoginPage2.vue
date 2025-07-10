<template>
  <div class="loginDiv mukta-font">
    <!-- <Snackbar :SnackBarComponent="SnackBarComponent" /> -->
    <!-- <v-overlay class="loginOverlay d-flex align-center justify-center"> -->
    <v-card elevation="0" :width="550" class="mx-auto pa-10 loginCard">
      <v-card elevation="0">
        <v-img src="@/assets/FinalLogo.png" class="mx-auto" :width="100" />
      </v-card>
      <div class="cardContent mt-3">
        <div class="text-left" style="line-height: 25px" v-show="step === 1">
          <p style="font-size: 20px; color: #0981c5" class="pl-1">Hello,</p>
          <p
            style="font-size: 50px; color: #0981c5; font-weight: 600"
            class="pa-0 dayGreeting"
          >
            Good {{ dayType }}!
          </p>
          <p style="font-size: 20px; color: #0981c5" class="pl-1">
            Welcome to Sportzlytics,
            <span class="white--text"
              >kindly
              <span
                style="
                  text-decoration: underline #0981c5;
                  text-underline-offset: 2px;
                "
                >login</span
              ></span
            >
          </p>
        </div>
        <v-window v-model="step">
          <v-window-item :value="1">
            <v-card-text>
              <v-form ref="emailForm">
                <v-text-field
                  class="mt-6 mb-6"
                  append-icon="mdi-email"
                  v-model="email"
                  @keydown.enter.prevent="validateEmail()"
                >
                  <template #label>
                    <label style="font-size: 20px">Enter your email</label>
                  </template>
                </v-text-field>
              </v-form>
            </v-card-text>
            <div class="d-flex justify-center ma-2">
              <v-btn
                :loading="loginLoader"
                block
                rounded
                @click="validateEmail()"
                class="loginBtn pt-6 pb-6 text-capitalize"
                ><span
                  class="mainBtns"
                  style="font-size: 20px; letter-spacing: 1px"
                  >Login</span
                ></v-btn
              >
            </div>
          </v-window-item>

          <v-window-item :value="2">
            <v-card-text>
              <p
                style="font-size: 20px; padding: 0; font-weight: 600"
                class="mt-3 mb-5 otpPageMessage"
              >
                Kindly provide the OTP sent to your email for verification.
              </p>
              <v-otp-input
                :height="80"
                length="6"
                v-model="otpPassword"
                @keydown.enter.prevent="verifyOTP()"
              />
            </v-card-text>
            <div v-show="showCountdown" class="text-end mr-2 mb-3 mr-2">
              <p style="font-size: 15px">
                Resend OTP in:
                <span :class="countdownFrom > 10 ? 'blueColorText' : 'text-red'"
                  >{{ countdownFrom }} sec</span
                >
              </p>
            </div>
            <div class="flex-class ma-2">
              <div>
                <v-btn
                  :disabled="hideResendOTPBtn"
                  dense
                  rounded
                  class="pl-5 pr-5 text-capitalize windowBtns"
                  @click="resendOtpBtn()"
                  >Resend OTP<v-icon size="15" class="pl-2 hideIcon"
                    >mdi-refresh</v-icon
                  ></v-btn
                >
              </div>
              <div>
                <v-btn
                  dense
                  rounded
                  @click="reenterEmailMethod()"
                  class="pl-5 pr-5 text-capitalize windowBtns"
                  ><v-icon size="15" class="pr-2 hideIcon"
                    >mdi-arrow-left</v-icon
                  >Re-enter email</v-btn
                >
              </div>
            </div>
            <v-btn
              :disabled="otpPassword.length !== 6"
              :loading="loginLoader"
              block
              rounded
              @click="verifyOTP()"
              class="loginBtn pt-6 pb-6 text-capitalize mt-5"
              ><span
                class="mainBtns"
                style="font-size: 20px; letter-spacing: 1px"
                >Verify & Login</span
              ></v-btn
            >
          </v-window-item>
        </v-window>
      </div>
    </v-card>

    <p class="pa-0 text-center mt-5" style="font-size: 13px">
      © Copyright {{ current_year }} Sportzlytics. All Rights Reserved
    </p>
    <!-- </v-overlay> -->
  </div>
</template>

<script>
import { confirmSignIn, signIn, signOut } from "aws-amplify/auth";
// import Snackbar from "@/components/Extras/MySnackbar.vue";
export default {
  //   components: {
  //     Snackbar,
  //   },
  data() {
    return {
      step: 1,
      emailForm: "",
      email: "",
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+/.test(v) || "E-mail must be valid",
      ],
      loginLoader: false,
      otpPassword: "",
      dayType: "",
      showCountdown: true,
      countdownFrom: 30,
      hideResendOTPBtn: true,
      current_year: undefined,
      SnackBarComponent: {},
      user: "",
    };
  },

  watch: {
    otpPassword(val) {
      val.length === 6 ? this.verifyOTP() : null;
    },

    step(val) {
      if (val === 2) {
        this.CallCountdownMethod();
      }
    },
  },

  mounted() {
    this.getTimeOfDay();
    this.getCurrentYear();
    // const parsedData = JSON.parse(sessionStorage.getItem("sessionStorageObj"));
    // parsedData.loggedOut
    //   ? (this.SnackBarComponent = {
    //       SnackbarVModel: true,
    //       color: "text-red",
    //       Message: "You have been logged out!",
    //     })
    //   : null;
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
        console.log("LOGIN_RES", logInResult);
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
        console.log("LOG_IN_RES", logInResult);
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
        const otpValidationResult = await confirmSignIn({
          challengeResponse: this.otpPassword,
        });
        if (otpValidationResult.isSignedIn === true) {
          this.$store.commit("SET_USER_EMAIL", this.email);
          this.navigateToLandingPage();
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
.loginDiv {
  font-family: "Mukta", sans-serif !important;
}
.loginOverlay {
  background: linear-gradient(to bottom, white, #0981c5);
  min-height: 100vh; /* Ensures overlay takes full height */
}

.loginCard {
  border-radius: 40px !important;
  width: 100%;
  max-width: 550px; /* Ensure max width for the card */
}

.flex-class {
  display: flex;
  justify-content: space-between;
}

.loginBtn {
  background-color: #0981c5 !important;
  color: white !important;
}

.blueColorText {
  color: #0981c5;
}

@media (max-width: 565px) {
  .loginCard {
    width: 330px !important;
    padding-left: 10px !important;
    padding-right: 10px !important;
  }

  .dayGreeting {
    display: none;
  }

  .hideIcon {
    display: none !important;
  }

  .windowBtns {
    margin: 3px 0 3px !important;
  }

  .mainBtns {
    font-size: 18px !important;
  }

  .otpPageMessage {
    font-size: 15px !important;
  }
}
</style>
