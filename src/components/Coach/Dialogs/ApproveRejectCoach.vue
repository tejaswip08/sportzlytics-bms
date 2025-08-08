<template>
  <div class="text-center pa-4">
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog v-model="dialogOperation" max-width="500" persistent>
      <v-card elevation="0">
        <v-toolbar density="compact" color="primary" class="muktaFont">
          <v-toolbar-title>
            {{
              StoreObj.action === "APPROVE" ? "Approve Coach" : "Reject Coach"
            }}
          </v-toolbar-title>
          <v-spacer />
          <v-btn
            icon
            flat
            class="closeBtn"
            @click="ApproveRejectCoachDialogEmit(1)"
            ><v-icon color="white" size="small">mdi-close-circle</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pa-5 muktaFont">
          <div class="tableFontSize">
            {{
              StoreObj.action === "APPROVE"
                ? "Do you want to approve "
                : "Do you want to reject"
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
            @click="approveRejectCoachMethod()"
          >
            {{ StoreObj.action === "APPROVE" ? "Approve" : "Reject"
            }}<v-icon size="17" class="pl-2" color="white">{{
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
import { approveOrRejectCoach } from "@/graphql/mutations.js";
import { generateClient } from "aws-amplify/api";
const client = generateClient();
import Snackbar from "@/components/Extras/MySnackbar.vue";
export default {
  props: {
    ApproveRejectCoachDialog: Boolean,
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
      return this.ApproveRejectCoachDialog;
    },
  },

  methods: {
    async approveRejectCoachMethod() {
      try {
        this.btnLoader = true;
        const result = await client.graphql({
          query: approveOrRejectCoach,
          variables: {
            input: {
              user_id: this.StoreObj.user_id,
              action: this.StoreObj.action,
            },
          },
        });
        const response = JSON.parse(result.data.approveOrRejectCoach);
        if (response.status === 200) {
          this.SnackBarComponent = {
            SnackbarVModel: true,
            Message: response.status_message,
            color: "text-green",
          };
          setTimeout(() => {
            this.btnLoader = false;
            this.ApproveRejectCoachDialogEmit(2);
          }, 3000);
        }
      } catch (error) {
        console.log("Error", error);
        this.SnackBarComponent = {
          SnackbarVModel: true,
          Message: error.errors[0].message,
          color: "text-red",
        };
        this.btnLoader = false;
      }
    },

    ApproveRejectCoachDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
