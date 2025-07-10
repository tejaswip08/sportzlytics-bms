<template>
  <div class="text-center pa-4">
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog v-model="dialogOperation" max-width="500" persistent>
      <v-card elevation="0">
        <v-toolbar density="compact" color="primary" class="muktaFont">
          <v-toolbar-title>
            {{
              StoreObj.command === "reactivateCoach"
                ? "Activate Coach"
                : "Deactivate Coach"
            }}
          </v-toolbar-title>
          <v-spacer />
          <v-btn
            icon
            flat
            class="closeBtn"
            @click="ActivateDeactivateCoachDialogEmit(1)"
            ><v-icon color="white" size="small">mdi-close-circle</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pa-5 muktaFont">
          <div class="tableFontSize">
            {{
              StoreObj.command === "reactivateCoach"
                ? "Do you want to activate "
                : "Do you want to deactivate "
            }}
            <strong>{{ StoreObj.user_name }}</strong
            >?
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            density="compact"
            :loading="btnLoader"
            rounded
            class="text-capitalize btnColorPrimary"
            @click="actionMethod()"
          >
            {{
              StoreObj.command === "reactivateCoach"
                ? "Activate"
                : "Deactivate"
            }}<v-icon class="pl-2" size="17">{{
              StoreObj.command === "reactivateCoach"
                ? "mdi-check-circle"
                : "mdi-alert-circle"
            }}</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { editCoachStatus } from "@/graphql/mutations.js";
import { generateClient } from "aws-amplify/api";
const client = generateClient();

import Snackbar from "@/components/Extras/MySnackbar.vue";
export default {
  //   mixins: [activateDeactivateCoaches],
  props: {
    ActivateDeactivateCoachDialog: Boolean,
    StoreObj: Object,
  },
  components: { Snackbar },
  data() {
    return {
      SnackBarComponent: {},
      btnLoader: false,
    };
  },

  computed: {
    dialogOperation() {
      return this.ActivateDeactivateCoachDialog;
    },
  },

  methods: {
    async actionMethod() {
      try {
        this.btnLoader = true;
        const result = await client.graphql({
          query: editCoachStatus,
          variables: {
            input: {
              coach_user_id: this.StoreObj.user_id,
              action:
                this.StoreObj.command === "reactivateCoach"
                  ? "ENABLE"
                  : "DISABLE",
            },
          },
        });
        const response = JSON.parse(result.data.editCoachStatus);
        if (response.status === 200) {
          this.SnackBarComponent = {
            SnackbarVModel: true,
            color: "text-green",
            Message: response.status_message,
          };
          setTimeout(() => {
            this.ActivateDeactivateCoachDialogEmit(2);
            this.btnLoader = false;
          }, 2000);
        }
        console.log("ACT_DEA_RESP", result);
      } catch (error) {
        this.btnLoader = false;
        //
      }
      // this.btnLoader = true;
      // const response = await this.activateDeactivateCoachesMethod(
      //   this.StoreObj.user_phone_number,
      //   this.StoreObj.command
      // );
      // if (response.status === 200) {
      //   this.SnackBarComponent = {
      //     SnackbarVModel: true,
      //     color: "text-green",
      //     Message: response.status_message,
      //   };
      //   this.btnLoader = false;
      //   this.ActivateDeactivateCoachDialogEmit(2);
      // } else {
      //   this.btnLoader = false;
      // }
    },

    ActivateDeactivateCoachDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
