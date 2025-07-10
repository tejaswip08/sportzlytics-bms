<template>
  <div class="text-center pa-4">
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog v-model="dialogOperation" max-width="500" persistent>
      <v-card elevation="0">
        <v-toolbar density="compact" color="primary" class="muktaFont">
          <v-toolbar-title>
            {{
              StoreObj.action === "APPROVE"
                ? "Approve Certicate"
                : "Reject Certicate"
            }}
          </v-toolbar-title>
          <v-spacer />
          <v-btn
            icon
            flat
            class="closeBtn"
            @click="ApprovetRejectCertificateDialogEmit(1)"
            ><v-icon color="white" size="small">mdi-close-circle</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pa-5 muktaFont">
          <div class="tableFontSize">
            {{
              StoreObj.action === "APPROVE"
                ? "Do you want to approve "
                : "Do you want to reject "
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
            @click="approveRejectCertificateMethod()"
          >
            {{ StoreObj.action === "APPROVE" ? "Approve" : "Reject"
            }}<v-icon class="pl-2" size="17">{{
              StoreObj.action === "APPROVE"
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
import { editCoachCertificates } from "@/graphql/mutations.js";
import { generateClient } from "aws-amplify/api";
const client = generateClient();

import Snackbar from "@/components/Extras/MySnackbar.vue";
import { setTimeout } from "core-js";
export default {
  props: {
    ApprovetRejectCertificateDialog: Boolean,
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
      return this.ApprovetRejectCertificateDialog;
    },
  },

  methods: {
    async approveRejectCertificateMethod() {
      const selectedCertificate = JSON.parse(
        this.StoreObj.coach_info.certificates[this.StoreObj.to_approve_index]
      );
      const is_certified = selectedCertificate.is_certified ? false : true;
      selectedCertificate.is_certified = is_certified;
      this.StoreObj.coach_info.certificates.splice(
        this.StoreObj.to_approve_index,
        1,
        JSON.stringify(selectedCertificate)
      );
      console.log("CHECK_IS_THAT", this.StoreObj.coach_info.certificates);
      try {
        this.btnLoader = true;
        const result = await client.graphql({
          query: editCoachCertificates,
          variables: {
            input: {
              coach_user_id: this.StoreObj.coach_info.user_id,
              certificates: this.StoreObj.coach_info.certificates,
            },
          },
        });
        const response = JSON.parse(result.data.editCoachCertificates);
        if (response.status === 200) {
          this.SnackBarComponent = {
            SnackbarVModel: true,
            color: "text-green",
            Message: response.status_message,
          };
          setTimeout(() => {
            this.ApprovetRejectCertificateDialogEmit(2);
            this.btnLoader = false;
          }, 2000);
        }
        console.log("ACT_DEA_RESP", result);
      } catch (error) {
        this.btnLoader = false;
        //
      }
    },

    ApprovetRejectCertificateDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
