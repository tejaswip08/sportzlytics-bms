<template>
  <div class="text-center pa-4">
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog v-model="dialogOperation" max-width="500" persistent>
      <v-card elevation="0">
        <v-toolbar density="compact" color="primary" class="muktaFont">
          <v-toolbar-title
            >Settle Up for ({{ StoreObj.user_name }})
          </v-toolbar-title>
          <v-spacer />
          <v-btn
            icon
            flat
            class="closeBtn"
            @click="settleUpCoachPaymentDialogEmit(1)"
            ><v-icon color="white" size="small">mdi-close-circle</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pa-5 muktaFont">
          <div
            style="display: flex; justify-content: space-between"
            class="mt-2 mb-3"
          >
            <div>
              <strong>Wallet Balance </strong>
            </div>
            <div>₹{{ StoreObj.wallet_balance }}</div>
          </div>
          <v-divider />
          <div
            style="display: flex; justify-content: space-between"
            class="mt-2 mb-3"
          >
            <div>
              <strong>Coach Platform Fee (%) </strong>
            </div>
            <div>{{ platformFeeObj?.coach_platform_charge ?? 0 }}</div>
          </div>
          <v-divider />
          <div
            style="display: flex; justify-content: space-between"
            class="mt-2 mb-3"
          >
            <div>
              <strong>Total Payable </strong>
            </div>
            <div>
              ₹{{
                StoreObj.wallet_balance -
                ((platformFeeObj?.coach_platform_charge ?? 0) / 100) *
                  StoreObj.wallet_balance
              }}
            </div>
          </div>
          <v-divider />
          <!-- <div>
              <strong>Wallet Balance: </strong>₹{{ StoreObj.wallet_balance }}
            </div>
            <div>
              <strong>Coach Platform Fee (%): </strong
              >{{ platformFeeObj?.coach_platform_charge ?? 0 }}
            </div>
            <div>
              <strong>Total Payable: </strong>₹{{
                StoreObj.wallet_balance -
                  platformFeeObj?.coach_platform_charge / 100 ??
                0 * StoreObj.wallet_balance
              }}
            </div> -->
        </v-card-text>
        <v-card-actions>
          <v-btn
            density="compact"
            :loading="btnLoader"
            rounded
            class="text-capitalize btnColorPrimary"
            @click="settleUpCoachPaymentMethod()"
          >
            Settle up
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { settleCoachPayment } from "@/graphql/mutations.js";
import { generateClient } from "aws-amplify/api";
const client = generateClient();

import { getPlatformFeeData } from "@/mixins/GetPlatformFeeData.js";

import Snackbar from "@/components/Extras/MySnackbar.vue";

export default {
  mixins: [getPlatformFeeData],
  props: {
    SettleUpCoachPaymentDialog: Boolean,
    StoreObj: Object,
  },
  components: { Snackbar },
  data() {
    return {
      platformFeeObj: {},
      SnackBarComponent: {},
      btnLoader: false,
    };
  },

  computed: {
    dialogOperation: {
      get() {
        return this.SettleUpCoachPaymentDialog;
      },
    },
  },

  watch: {
    SettleUpCoachPaymentDialog: {
      immediate: true,
      async handler(val) {
        if (val) {
          this.platformFeeObj = await this.getPlatformFeeDataMethod();
        }
      },
    },
  },

  methods: {
    async settleUpCoachPaymentMethod() {
      try {
        this.btnLoader = true;
        const result = await client.graphql({
          query: settleCoachPayment,
          variables: {
            input: {
              coach_id: this.StoreObj.user_id,
            },
          },
        });
        console.log("SETTINGS", result);
        const response = JSON.parse(result.data.settleCoachPayment);
        if (response.status == 200) {
          this.SnackBarComponent = {
            SnackbarVModel: true,
            Message: response.status_message,
            color: "text-green",
          };
          setTimeout(() => {
            this.settleUpCoachPaymentDialogEmit(2);
            this.btnLoader = false;
          }, 3000);
        }
      } catch (error) {
        // console.log("Error", error);
      }
    },

    settleUpCoachPaymentDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
