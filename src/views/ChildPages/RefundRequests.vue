<template>
  <div>
    <v-card elevation="0">
      <v-toolbar density="comfortable" color="white" class="mt-3 mb-3">
        <v-toolbar-title>
          <div style="display: flex; flex-direction: row; align-items: center">
            <div class="mr-3">
              <div class="headingFont">Requests</div>
            </div>
            |
            <div class="ml-3">
              <v-btn
                density="comfortable"
                class="text-capitalize mr-2"
                :class="selectedBtn == 'WITHDRAW' ? 'btnColorPrimary' : null"
                variant="outlined"
                @click="selectedBtn = 'WITHDRAW'"
              >
                Withdrawals
              </v-btn>
              <v-btn
                density="comfortable"
                class="text-capitalize ml-2"
                :class="selectedBtn == 'REFUND' ? 'btnColorPrimary' : null"
                variant="outlined"
                @click="selectedBtn = 'REFUND'"
              >
                Refunds
              </v-btn>
            </div>
          </div>

          <!-- <div class="mb-5 mt-1">

          </div> -->
        </v-toolbar-title>
        <v-spacer />
        <v-text-field
          v-model="search"
          density="compact"
          variant="outlined"
          rounded
          label="Search"
          class="textFieldWidth mt-5 mr-2 customTable tableItemFont"
          color="primary"
        >
          <template #append-inner>
            <v-icon size="small">mdi-magnify</v-icon>
          </template>
        </v-text-field>
      </v-toolbar>
      <v-card-text>
        <v-data-table
          :loading="tableLoading"
          :search="search"
          density="compact"
          :headers="headers"
          :items="selectedBtn == 'WITHDRAW' ? withdrawData : refundData"
          fixed-header
          :height="tableHeight"
          class="customTable tableItemFont"
        >
          <template v-slot:[`item.sl_no`]="{ item, index }">
            <div>
              {{ index + 1 }}
            </div>
          </template>
          <template v-slot:[`item.requested_on`]="{ item }">
            <div>
              {{ new Date(item.requested_on).toLocaleDateString("en-GB") }}
            </div>
          </template>
          <template v-slot:[`item.action`]="{ item }">
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn density="compact" icon flat v-bind="props">
                  <v-icon size="small" color="primary"
                    >mdi-dots-vertical</v-icon
                  >
                </v-btn>
              </template>
              <v-list class="muktaFont tableFontSize">
                <v-list-item
                  @click="approveRejectRefReqMethod(item, 'APPROVE')"
                  v-if="item.request_type == 'REFUND_REQUEST'"
                >
                  <v-list-item-title
                    >Approve<v-icon size="15" color="green" class="pl-7 pr-2"
                      >mdi-check-circle</v-icon
                    ></v-list-item-title
                  >
                </v-list-item>
                <v-list-item
                  @click.stop="approveRejectRefReqMethod(item, 'REJECT')"
                  v-if="item.request_type == 'REFUND_REQUEST'"
                >
                  <v-list-item-title
                    >Reject<v-icon size="15" color="red" class="pl-7 pr-2"
                      >mdi-close-circle</v-icon
                    ></v-list-item-title
                  >
                </v-list-item>
                <v-list-item
                  @click.stop="approveRejectRefReqMethod(item, 'RESOLVE')"
                  v-if="item.request_type == 'WITHDRAW'"
                >
                  <v-list-item-title
                    >Resolve<v-icon size="15" color="green" class="pl-7 pr-2"
                      >mdi-check-circle</v-icon
                    ></v-list-item-title
                  >
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <ApproveRejectRefReq
      :ApproveRejectDialog="approveRejectDialog"
      :StoreObj="StoreObj"
      @clicked="ApproveRejectDialogEmit"
    />
  </div>
</template>

<script>
import { generateClient } from "aws-amplify/api";
const client = generateClient();
import { listRequests } from "@/graphql/queries.js";
import ApproveRejectRefReq from "@/components/RefundRequest/ApproveRejectDialog.vue";

export default {
  name: "RefundRequestPage",
  components: {
    ApproveRejectRefReq,
  },
  data() {
    return {
      search: "",
      selectedStatus: "",
      tableHeight: 0,
      listRefundRequestData: [],
      selectedBtn: "WITHDRAW",
      StoreObj: {},
      withdrawData: [],
      refundData: [],
      headers: [
        { title: "Sl No", key: "sl_no" },
        { title: "Coach Name", key: "coach_name" },
        { title: "User Name", key: "user_name" },
        { title: "User Phone Number", key: "user_phone_number" },
        { title: "Request State", key: "request_status" },
        { title: "Reason For Request", key: "reason_for_request" },
        { title: "Payment ID", key: "payment_id" },
        { title: "Requested On", key: "requested_on" },
        { title: "Action", key: "action" },
      ],
      statusItems: [
        { text: "Approved", value: "APPROVED" },
        { text: "Rejected", value: "REJECTED" },
      ],
      approveRejectDialog: false,
      tableLoading: true,
    };
  },
  watch: {
    selectedBtn(val) {
      this.withdrawData = [];
      this.refundData = [];
      if (val === "WITHDRAW") {
        this.withdrawData = this.listRefundRequestData.filter(
          (item) => item.request_type === "WITHDRAW"
        );
      } else {
        this.refundData = this.listRefundRequestData.filter(
          (item) => item.request_type === "REFUND_REQUEST"
        );
      }
    },
  },
  async mounted() {
    this.tableHeight = window.innerHeight - 220;
    await this.callApiMethod();
  },
  methods: {
    async callApiMethod() {
      try {
        this.listRefundRequestData = [];
        const result = await client.graphql({
          query: listRequests,
        });
        const response = JSON.parse(result.data.listRequests).data;
        console.log("REQUEST", response);
        this.listRefundRequestData = response;
        this.withdrawData = this.listRefundRequestData.filter(
          (item) => item.request_type === "WITHDRAW"
        );
        this.tableLoading = false;
      } catch (error) {
        this.tableLoading = false;
        console.log("Error", error);
      }
    },
    approveRejectRefReqMethod(item, action) {
      this.StoreObj = { ...item, action };
      this.approveRejectDialog = true;
    },
    async ApproveRejectDialogEmit(Toggle) {
      this.approveRejectDialog = false;
      if (Toggle === 2) {
        await this.callApiMethod();
        this.selectedBtn = "WITHDRAW";
      }
    },
  },
};
</script>
