<template>
  <div>
    <div v-if="showLoader === true">
      <v-overlay>
        <Loader />
      </v-overlay>
    </div>
    <v-card elevation="0">
      <v-toolbar density="comfortable" color="white">
        <v-toolbar-title>
          <div class="headingFont">App Users</div>
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
        <v-select
          v-model="sortAppUsers"
          :items="sortAppUsersItems"
          item-title="text"
          item-key="value"
          density="compact"
          variant="outlined"
          rounded
          label="Sort By"
          class="textFieldWidth mt-5 ml-2 mr-2 muktaFont"
          color="primary"
        />
      </v-toolbar>
      <v-card-text>
        <v-data-table
          :search="search"
          :loading="tableLoading"
          density="compact"
          :headers="headers"
          :items="listAppUsers"
          fixed-header
          :height="tableHeight"
          class="customTable tableItemFont"
        >
          <template v-slot:[`item.user_name`]="{ item }">
            <div>
              {{ item.user_name || "-" }}
            </div>
          </template>
          <template v-slot:[`item.user_email_id`]="{ item }">
            <div>
              {{ item.user_email_id || "-" }}
            </div>
          </template>

          <template v-slot:[`item.user_created_on`]="{ item }">
            <div>
              {{ formatedDateTime(item.user_created_on) }}
            </div>
          </template>
          <template v-slot:[`item.os_version`]="{ item }">
            <div v-if="item.os_version">
              <v-icon
                size="small"
                :color="item.operating_system === 'ANDROID' ? 'green' : 'black'"
              >
                {{
                  item.operating_system === "ANDROID"
                    ? "mdi-android"
                    : "mdi-apple"
                }}
              </v-icon>
              <span style="position: relative; top: 2px; left: 5px">
                {{ item.os_version }}
              </span>
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.app_version`]="{ item }">
            <div>
              {{ item.app_version || "-" }}
            </div>
          </template>
          <template v-slot:[`item.user_status`]="{ item }">
            <div>
              <v-chip
                :color="item.user_status === 'ACTIVE' ? 'green' : 'red'"
                class="white--text"
                >{{
                  item.user_status === "ACTIVE" ? "Active" : "Inactive"
                }}</v-chip
              >
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import Loader from "@/components/Extras/PageLoader.vue";

import { GetAllAppCoachData } from "@/mixins/GetAppCoachData.js";
export default {
  mixins: [GetAllAppCoachData],
  components: { Loader },
  data() {
    return {
      tableHeight: 0,
      perPage: 10,
      page: 1,
      loadedPages: [],
      PageCount: 1,
      headers: [
        {
          title: "Name",
          key: "user_name",
          sortable: false,
        },
        { title: "Phone Number", key: "user_phone_number", sortable: false },
        { title: "Email", key: "user_email_id", sortable: false },
        { title: "Created On", key: "user_created_on", sortable: false },
        { title: "OS Version", key: "os_version", sortable: false },
        { title: "App Version", key: "app_version", sortable: false },
        { title: "Status", value: "user_status", sortable: false },
        // { text: "Actions", value: "activate_deactivate", sortable: false },
      ],
      ViewCoachProfileDialog: false,
      ViewCoachFilesDialog: false,
      ActivateDeactivateCoachDialog: false,
      listAppUsers: [],
      FilteredCoaches: [],
      sortAppUsers: "ACTIVE",
      sortAppUsersItems: [
        { text: "Active", value: "ACTIVE" },
        { text: "Inactive", value: "INACTIVE" },
        { text: "Pending Approval", value: "PENDING_APPROVAL" },
      ],
      initialNextToken: null,
      ApproveRejectCoachDialog: false,
      CoachSettingsDialog: false,
      OnboardCoachDialog: false,
      StoreObj: {},
      search: "",
      tableLoading: true,
      showLoader: true,
    };
  },

  watch: {
    sortAppUsers(val) {
      if (val) {
        this.listAppUsers = [];
        this.tableLoading = true;
        this.ApiCallMethod(this.sortAppUsers, this.initialNextToken, "USER");
      }
    },
  },

  mounted() {
    this.tableHeight = window.innerHeight - 200;
    setTimeout(async () => {
      await this.ApiCallMethod(
        this.sortAppUsers,
        this.initialNextToken,
        "USER"
      );
    }, 1500);
  },

  methods: {
    formatedDateTime(item) {
      const dateTime = new Date(item).toLocaleString();
      return dateTime;
    },
    async ApiCallMethod(sortBy, nextToken, user_type) {
      this.listAppUsers = await this.GetAllAppCoachDataMethod(
        sortBy,
        nextToken,
        user_type
      );
      this.tableLoading = false;
      this.showLoader = false;
    },

    async activeDeactiveMethod(item, command) {
      this.ActivateDeactivateCoachDialog = true;
      this.StoreObj = item;
      this.StoreObj.command = command;
    },

    formatedDateTime(item) {
      const dateTime = new Date(item).toLocaleString();
      return dateTime;
    },

    formatedDateTime(item) {
      const dateTime = new Date(item).toLocaleString();
      return dateTime;
    },
  },
};
</script>
