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
                : "Reject Refund Request"
            }}
          </v-toolbar-title>
          <v-spacer />
          <v-btn icon flat class="closeBtn" @click="ApproveRejectDialogEmit(1)"
            ><v-icon color="white" size="small">mdi-close-circle</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pa-5 muktaFont">
          <div class="tableFontSize">
            Are you sure want to
            {{ StoreObj.action === "APPROVE" ? "approve" : "reject" }}
            <strong>{{ StoreObj.analysis_id }}</strong
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
            @click="approveRejectRefReqMethod()"
          >
            {{ StoreObj.action === "APPROVE" ? "Approve" : "Reject" }}
            <v-icon small class="pl-2">{{
              StoreObj.action === "APPROVE" ? "mdi-check" : "mdi-close"
            }}</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Snackbar from "@/components/Extras/MySnackbar.vue";
import { approveOrRejectRefund } from "@/graphql/mutations.js";
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
        const result = await client.graphql({
          query: approveOrRejectRefund,
          variables: {
            input: {
              request_id: this.StoreObj.request_id,
              action: this.StoreObj.action,
            },
          },
        });
        const response = JSON.parse(result.data.approveOrRejectRefund);
        if (response.status === 200) {
          this.SnackBarComponent = {
            SnackbarVModel: true,
            Message: response.status_message,
            color: "text-green",
          };
          this.btnLoader = false;
          this.ApproveRejectDialogEmit(2);
        } else if (response.status === 500) {
          this.SnackBarComponent = {
            SnackbarVModel: true,
            Message: response.status_message,
            color: "text-red",
          };
          this.btnLoader = false;
          this.ApproveRejectDialogEmit(2);
        }
      } catch (error) {
        this.btnLoader = false;
        console.log("Error", error);
      }
    },
    ApproveRejectDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
