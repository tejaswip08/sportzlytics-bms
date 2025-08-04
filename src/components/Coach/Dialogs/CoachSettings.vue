<template>
  <div class="text-center pa-4">
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog v-model="dialogOperation" max-width="500" persistent>
      <v-card elevation="0">
        <v-toolbar density="compact" color="primary" class="muktaFont">
          <v-toolbar-title> Coach Settings </v-toolbar-title>
          <v-spacer />
          <v-btn icon flat class="closeBtn" @click="CoachSettingsDialogEmit(1)"
            ><v-icon color="white" size="small">mdi-close-circle</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pa-5 muktaFont">
          <v-form ref="settingForm">
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
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            density="compact"
            :loading="btnLoader"
            rounded
            class="text-capitalize btnColorPrimary"
            @click="coachSettingsMethod()"
          >
            Done
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { editPriceSlabForCoach } from "@/graphql/mutations.js";
import { generateClient } from "aws-amplify/api";
const client = generateClient();

import { getPriceRangeForCoach } from "@/mixins/GetPriceRangeForCoach.js";

import Snackbar from "@/components/Extras/MySnackbar.vue";

export default {
  mixins: [getPriceRangeForCoach],
  props: {
    CoachSettingsDialog: Boolean,
  },
  components: { Snackbar },
  data() {
    return {
      maxPrice: "",
      minPrice: "",
      incValue: "",
      priceRangeObj: {},
      SnackBarComponent: {},
      btnLoader: false,
    };
  },

  computed: {
    dialogOperation: {
      get() {
        return this.CoachSettingsDialog;
      },
    },
  },

  watch: {
    CoachSettingsDialog: {
      immediate: true,
      async handler(val) {
        if (val) {
          console.log("DIALOG_BOX");
          await this.getPriceRangeForCoachMethod();
          this.maxPrice = this.priceRangeObj.maximum_price || "0";
          this.minPrice = this.priceRangeObj.minimum_price || "0";
          this.incValue = this.priceRangeObj.increment_value || "0";
        }
      },
    },
  },

  methods: {
    async coachSettingsMethod() {
      if (this.$refs.settingForm.validate()) {
        try {
          this.btnLoader = true;
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
            setTimeout(() => {
              this.CoachSettingsDialogEmit(2);
              this.btnLoader = false;
            }, 3000);
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

    CoachSettingsDialogEmit(Toggle) {
      this.$refs.settingForm.reset();
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
