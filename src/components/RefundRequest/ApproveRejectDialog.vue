<template>
  <div class="text-center pa-4">
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog v-model="dialogOperation" max-width="500" persistent>
      <v-card elevation="0">
        <v-toolbar density="compact" color="primary" class="muktaFont">
          <v-toolbar-title>
            {{
              StoreObj.action === "APPROVE"
                ? "Approve Refund Request"
                : StoreObj.action === "RESOLVE"
                ? "Resolve Withdraw Request"
                : "Reject Refund Request"
            }}
          </v-toolbar-title>
          <v-spacer />
          <v-btn icon flat class="closeBtn" @click="ApproveRejectDialogEmit(1)"
            ><v-icon color="white" size="small">mdi-close-circle</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pa-5 muktaFont">
          <div class="tableFontSize" v-if="StoreObj.action !== 'REJECT'">
            Are you sure want to
            {{
              StoreObj.action === "APPROVE"
                ? "approve"
                : StoreObj.action === "RESOLVE"
                ? "resolve"
                : "reject"
            }}
            <strong>{{ StoreObj.analysis_id }}</strong
            >?
          </div>
          <div v-else>
            <v-text-field
              v-model="rejectionReason"
              density="compact"
              rounded
              variant="outlined"
              color="primary muktaFont"
              label="Reason for rejection"
            />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            density="compact"
            :loading="btnLoader"
            rounded
            class="text-capitalize btnColorPrimary"
            @click="approveRejectRefReqMethod()"
          >
            {{
              StoreObj.action === "APPROVE"
                ? "Approve"
                : StoreObj.action === "RESOLVE"
                ? "Resolve"
                : "Reject"
            }}
            <v-icon small class="pl-2">{{
              StoreObj.action === "APPROVE" || "RESOLVE"
                ? "mdi-check"
                : "mdi-close"
            }}</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Snackbar from "@/components/Extras/MySnackbar.vue";
import {
  settleWithdrawalRequest,
  manageRefundRequest,
} from "@/graphql/mutations.js";
import { generateClient } from "aws-amplify/api";
const client = generateClient();

export default {
  props: {
    ApproveRejectDialog: Boolean,
    StoreObj: Object,
  },
  components: { Snackbar },
  data() {
    return {
      rejectionReason: "",
      SnackBarComponent: {},
      btnLoader: false,
    };
  },

  computed: {
    dialogOperation: {
      get() {
        return this.ApproveRejectDialog;
      },
    },
  },

  methods: {
    async approveRejectRefReqMethod() {
      try {
        this.btnLoader = true;
        const mutationName =
          this.StoreObj.action == "RESOLVE"
            ? settleWithdrawalRequest
            : manageRefundRequest;
        const mutationNameString =
          this.StoreObj.action == "RESOLVE"
            ? "settleWithdrawalRequest"
            : "manageRefundRequest";
        const result = await client.graphql({
          query: mutationName,
          variables: {
            input: {
              request_id: this.StoreObj.request_id,
              rejection_reason:
                this.StoreObj.action == "REJECT"
                  ? this.rejectionReason || undefined
                  : undefined,
              action:
                this.StoreObj.action == "RESOLVE"
                  ? undefined
                  : this.StoreObj.action,
            },
          },
        });
        const response = JSON.parse(result.data[mutationNameString]);
        if (response.status === 200) {
          this.SnackBarComponent = {
            SnackbarVModel: true,
            Message: response.status_message,
            color: "text-green",
          };
          setTimeout(() => {
            this.ApproveRejectDialogEmit(2);
            this.btnLoader = false;
          }, 3000);
        } else if (response.status === 500) {
          this.SnackBarComponent = {
            SnackbarVModel: true,
            Message: response.status_message,
            color: "text-red",
          };
          this.btnLoader = false;
        }
      } catch (error) {
        this.btnLoader = false;
        this.SnackBarComponent = {
          SnackbarVModel: true,
          Message: error.errors[0].message,
          color: "text-red",
        };
        console.log("Error", error);
      }
    },
    ApproveRejectDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
