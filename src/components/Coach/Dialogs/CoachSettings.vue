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

import Snackbar from "@/components/Extras/MySnackbar.vue";
export default {
  props: {
    CoachSettingsDialog: Boolean,
  },
  components: { Snackbar },
  data() {
    return {
      maxPrice: "",
      minPrice: "",
      incValue: "",
      SnackBarComponent: {},
      // btnLoader: false,
    };
  },

  computed: {
    dialogOperation: {
      get() {
        return this.CoachSettingsDialog;
      },
    },
  },

  methods: {
    async coachSettingsMethod() {
      if (this.$refs.settingForm.validate()) {
        try {
          // this.btnLoader = true;
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
          // console.log("SETTINGS", result);
        } catch (error) {
          console.log("Error", error);
        }
      } else {
        this.SnackBarComponent = {
          SnackbarVModel: true,
          Message: response.status_message,
          color: "text-green",
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
