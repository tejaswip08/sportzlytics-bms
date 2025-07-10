<template>
  <div>
    <v-card elevation="0">
      <v-toolbar density="comfortable" color="white">
        <v-toolbar-title>
          <div class="headingFont">Refund Requests</div>
        </v-toolbar-title>
        <v-spacer />
        <v-text-field
          v-model="search"
          density="compact"
          variant="outlined"
          rounded
          label="Search"
          class="textFieldWidth mt-5 mr-2"
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
          :items="listRefundRequestData"
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
                >
                  <v-list-item-title
                    >Approve<v-icon size="15" color="green" class="pl-7 pr-2"
                      >mdi-check-circle</v-icon
                    ></v-list-item-title
                  >
                </v-list-item>
                <v-list-item
                  @click.stop="approveRejectRefReqMethod(item, 'REJECT')"
                >
                  <v-list-item-title
                    >Reject<v-icon size="15" color="red" class="pl-7 pr-2"
                      >mdi-close-circle</v-icon
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

<script setup>
import { ref, reactive, onMounted } from "vue";

import { generateClient } from "aws-amplify/api";
const client = generateClient();
import { listRefundRequests } from "@/graphql/queries.js";

import ApproveRejectRefReq from "@/components/RefundRequest/ApproveRejectDialog.vue";

const search = ref("");
const selectedStatus = ref("");
const tableHeight = ref(0);
const listRefundRequestData = ref([]);
const StoreObj = ref({});
const headers = reactive([
  { title: "Sl No", key: "sl_no" },
  { title: "Coach Name", key: "coach_name" },
  { title: "User Name", key: "user_name" },
  { title: "User Phone Number", key: "user_phone_number" },
  { title: "Request State", key: "request_status" },
  { title: "Reason For Request", key: "reason_for_request" },
  { title: "Payment ID", key: "payment_id" },
  { title: "Requested On", key: "requested_on" },
  { title: "Action", key: "action" },
]);
const statusItems = reactive([
  { text: "Approved", value: "APPROVED" },
  { text: "Rejected", value: "REJECTED" },
]);

const approveRejectDialog = ref(false);
const tableLoading = ref(true);

onMounted(() => {
  tableHeight.value = window.innerHeight - 200;
  callApiMethod();
});

const callApiMethod = async () => {
  try {
    const result = await client.graphql({
      query: listRefundRequests,
    });
    const response = JSON.parse(result.data.listRefundRequests).data;
    listRefundRequestData.value = response;
    tableLoading.value = false;
  } catch (error) {
    tableLoading.value = false;
    console.log("Error", error);
  }
};

const approveRejectRefReqMethod = (item, action) => {
  StoreObj.value = item;
  StoreObj.value.action = action;
  approveRejectDialog.value = true;
};

const ApproveRejectDialogEmit = (Toggle) => {
  approveRejectDialog.value = false;
  if (Toggle === 2) {
    callApiMethod();
  }
};
</script>
