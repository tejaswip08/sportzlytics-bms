<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-card elevation="0">
      <v-toolbar density="comfortable" color="white">
        <v-toolbar-title>
          <div class="headingFont">Settings</div>
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <div style="display: flex; flex-direction: row">
          <div class="mr-2" style="width: 50%">
            <v-card class="pa-4" elevation="2" :loading="cardoneLoading">
              <div class="font20px purple-color">Coach Settings</div>
              <v-form ref="settingForm" class="ml-5">
                <div class="mt-3 mb-2 tableItemFont">
                  <strong>Set maximum price</strong>
                </div>
                <v-text-field
                  v-model="maxPrice"
                  density="compact"
                  rounded
                  variant="outlined"
                  color="primary muktaFont"
                  :rules="[(v) => !!v || 'Required']"
                >
                </v-text-field>
                <div class="mt-3 mb-2 tableItemFont">
                  <strong>Set minimum price</strong>
                </div>
                <v-text-field
                  v-model="minPrice"
                  density="compact"
                  rounded
                  variant="outlined"
                  color="primary muktaFont"
                  :rules="[(v) => !!v || 'Required']"
                >
                </v-text-field>
                <div class="mt-3 mb-2 tableItemFont">
                  <strong>Set increment value</strong>
                </div>
                <v-text-field
                  v-model="incValue"
                  density="compact"
                  rounded
                  variant="outlined"
                  color="primary muktaFont"
                  :rules="[(v) => !!v || 'Required']"
                />
              </v-form>
              <div class="d-flex justify-end">
                <v-btn
                  density="compact"
                  :loading="settingABtnLoader"
                  rounded
                  class="text-capitalize btnColorPrimary"
                  @click="coachSettingsMethod()"
                >
                  Done
                </v-btn>
              </div>
            </v-card>
          </div>
          <div class="ml-2 mr-2" style="width: 50%">
            <v-card class="pa-4" elevation="2" :loading="cardtwoLoading">
              <div class="font20px purple-color">Platform Fee</div>
              <v-form ref="platformForm" class="ml-5">
                <div class="mt-3 mb-2 tableItemFont">
                  <strong>User platform fee (₹)</strong>
                </div>
                <v-text-field
                  v-model="userPlatformFee"
                  density="compact"
                  rounded
                  variant="outlined"
                  color="primary muktaFont"
                  :rules="[
                    (v) => !!v || 'Required',
                    (v) => /^[0-9]+$/.test(v) || 'Please enter only numbers..!',
                  ]"
                />
                <div class="mt-3 mb-2 tableItemFont">
                  <strong>Coach platform fee (%)</strong>
                </div>
                <v-text-field
                  v-model="coachPlatformFee"
                  density="compact"
                  rounded
                  variant="outlined"
                  color="primary muktaFont"
                  :rules="[
                    (v) => !!v || 'Required',
                    (v) =>
                      (!isNaN(v) && v >= 0 && v <= 100) ||
                      'Must be between 0 and 100..!',
                  ]"
                />
              </v-form>
              <div class="d-flex justify-end">
                <v-btn
                  density="compact"
                  :loading="settingBBtnLoader"
                  rounded
                  class="text-capitalize btnColorPrimary"
                  @click="platformFeeMethod()"
                >
                  Done
                </v-btn>
              </div>
            </v-card>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { editPriceSlabForCoach, editBmsSettings } from "@/graphql/mutations.js";
import { generateClient } from "aws-amplify/api";
const client = generateClient();

import { getPriceRangeForCoach } from "@/mixins/GetPriceRangeForCoach.js";
import { getPlatformFeeData } from "@/mixins/GetPlatformFeeData.js";

import Snackbar from "@/components/Extras/MySnackbar.vue";
export default {
  mixins: [getPriceRangeForCoach, getPlatformFeeData],
  components: { Snackbar },
  data: () => ({
    maxPrice: "",
    minPrice: "",
    incValue: "",
    userPlatformFee: "",
    coachPlatformFee: "",
    priceRangeObj: {},
    platformFeeObj: {},
    SnackBarComponent: {},
    settingABtnLoader: false,
    cardoneLoading: true,
    cardtwoLoading: true,
    settingBBtnLoader: false,
  }),

  async mounted() {
    await this.callApiOne();
    await this.callApiTwo();
  },

  methods: {
    async callApiOne() {
      await this.getPriceRangeForCoachMethod();
      this.maxPrice = this.priceRangeObj.maximum_price || "0";
      this.minPrice = this.priceRangeObj.minimum_price || "0";
      this.incValue = this.priceRangeObj.increment_value || "0";
      this.cardoneLoading = false;
    },

    async callApiTwo() {
      this.platformFeeObj = await this.getPlatformFeeDataMethod();
      this.coachPlatformFee = this.platformFeeObj?.coach_platform_charge ?? 0;
      this.userPlatformFee = this.platformFeeObj?.platform_fee ?? 0;
      this.cardtwoLoading = false;
    },
    async coachSettingsMethod() {
      const isValid = await this.$refs.settingForm.validate();
      if (isValid.valid) {
        try {
          this.settingABtnLoader = true;
          const result = await client.graphql({
            query: editPriceSlabForCoach,
            variables: {
              input: {
                maximum_price: this.maxPrice,
                minimum_price: this.minPrice,
                increment_value: this.incValue,
              },
            },
          });
          console.log("SETTINGS", result);
          const response = JSON.parse(result.data.editPriceSlabForCoach);
          if (response.status == 200) {
            this.SnackBarComponent = {
              SnackbarVModel: true,
              Message: response.status_message,
              color: "text-green",
            };
            this.settingABtnLoader = false;
          }
        } catch (error) {
          // console.log("Error", error);
        }
      } else {
        this.SnackBarComponent = {
          SnackbarVModel: true,
          Message: "Kindly provide the details..!",
          color: "text-red",
        };
      }
    },

    async platformFeeMethod() {
      const isValid = await this.$refs.platformForm.validate();
      if (isValid.valid) {
        try {
          this.settingBBtnLoader = true;
          const result = await client.graphql({
            query: editBmsSettings,
            variables: {
              input: {
                platform_fee: parseFloat(this.userPlatformFee),
                coach_platform_charge: parseFloat(this.coachPlatformFee),
              },
            },
          });
          console.log("SETTINGS", result);
          const response = JSON.parse(result.data.editBmsSettings);
          if (response.status == 200) {
            this.SnackBarComponent = {
              SnackbarVModel: true,
              Message: response.status_message,
              color: "text-green",
            };
            this.settingBBtnLoader = false;
          }
        } catch (error) {
          // console.log("Error", error);
        }
      } else {
        this.SnackBarComponent = {
          SnackbarVModel: true,
          Message: "Kindly provide the details..!",
          color: "text-red",
        };
      }
    },
  },
};
</script>
