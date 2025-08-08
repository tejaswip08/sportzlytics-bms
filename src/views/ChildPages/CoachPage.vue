<template>
  <div>
    <v-card elevation="0" v-if="currentView === 'MAIN_VIEW'">
      <v-toolbar density="comfortable" color="white">
        <v-toolbar-title>
          <div class="headingFont">Coaches</div>
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
          v-model="sortCoach"
          :items="sortCoachItems"
          item-title="text"
          item-key="value"
          density="compact"
          variant="outlined"
          rounded
          label="Sort By"
          class="textFieldWidth mt-5 ml-2 mr-2 muktaFont"
          color="primary"
        />
        <v-btn
          rounded
          density="comfortable"
          class="text-capitalize btnColorPrimary ml-2"
          @click="onboardCoachMethod()"
          >Onboard Coach<v-icon size="small" class="pl-2"
            >mdi-plus</v-icon
          ></v-btn
        >
        <v-btn
          rounded
          density="comfortable"
          class="text-capitalize btnColorPrimary ml-2"
          @click="coachSettingsMethod()"
          >Settings<v-icon size="small" class="pl-2">mdi-cog</v-icon></v-btn
        >
      </v-toolbar>
      <v-card-text>
        <v-data-table
          :loading="tableLoading"
          :search="search"
          density="compact"
          :headers="headers"
          :items="listAllCoaches"
          fixed-header
          :height="tableHeight"
          @click:row="handleRowClick"
        >
          <template v-slot:[`item.sport_expertize`]="{ item }">
            <div class="text-capitalize">
              {{ item.sport_expertize }}
            </div>
          </template>
          <template v-slot:[`item.languages`]="{ item }">
            {{ item.languages.join(", ") }}
          </template>
          <template v-slot:[`item.user_created_on`]="{ item }">
            <div>
              {{ formatedDateTime(item.user_created_on) }}
            </div>
          </template>
          <template v-slot:[`item.no_of_analysis_done`]="{ item }">
            <div>
              {{ item.no_of_analysis_done || "-" }}
            </div>
          </template>
          <template v-slot:[`item.user_status`]="{ item }">
            <div>{{ formatedUserStatus(item.user_status) }}</div>
          </template>
          <template v-slot:[`item.user_info`]="{ item }">
            <div style="display: flex">
              <div>
                <v-btn icon @click="ViewCoachProfileMethod(item)"
                  ><v-icon size="20" color="blue"
                    >mdi-account-circle</v-icon
                  ></v-btn
                >
              </div>
              <div>
                <v-btn icon @click="viewCoachFilesMethod(item)"
                  ><v-icon color="purple" size="20"
                    >mdi-file-multiple</v-icon
                  ></v-btn
                >
              </div>
            </div>
          </template>
          <template v-slot:[`item.user_phone_number`]="{ item }">
            <div>
              {{ item.user_phone_number || "-" }}
            </div>
          </template>
          <template v-slot:[`item.status`]="{ item }">
            <div>
              <v-chip
                :color="
                  item.user_status === 'ACTIVE'
                    ? 'green'
                    : item.user_status === 'INACTIVE' ||
                      item.user_status === 'REJECTED'
                    ? 'red'
                    : 'blue'
                "
                class="white--text"
                >{{
                  item.user_status === "ACTIVE"
                    ? "Active"
                    : item.user_status === "INACTIVE"
                    ? "Inactive"
                    : item.user_status === "REJECTED"
                    ? "Rejected"
                    : "Pending"
                }}</v-chip
              >
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
                  v-if="item.user_status === 'PENDING_APPROVAL'"
                  @click="checkItem(item, 'APPROVE')"
                >
                  <v-list-item-title
                    >Approve<v-icon size="15" color="green" class="pl-7 pr-2"
                      >mdi-check-circle</v-icon
                    ></v-list-item-title
                  >
                </v-list-item>
                <v-list-item
                  v-if="item.user_status === 'PENDING_APPROVAL'"
                  @click.stop="checkItem(item, 'REJECT')"
                >
                  <v-list-item-title
                    >Reject<v-icon size="15" color="red" class="pl-7 pr-2"
                      >mdi-close-circle</v-icon
                    ></v-list-item-title
                  >
                </v-list-item>
                <v-list-item
                  v-if="item.user_status === 'INACTIVE'"
                  @click="activeDeactiveMethod(item, 'reactivateCoach')"
                >
                  <v-list-item-title
                    >Activate<v-icon size="15" color="green" class="pl-7 pr-2"
                      >mdi-check-circle</v-icon
                    ></v-list-item-title
                  >
                </v-list-item>
                <v-list-item
                  @click="activeDeactiveMethod(item, 'deactivateCoach')"
                >
                  <v-list-item-title v-if="item.user_status === 'ACTIVE'"
                    >Deactivate<v-icon size="15" color="red" class="pl-7 pr-2"
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
    <v-card elevation="0" v-else>
      <CoachInfo :StoreObj="StoreObj" @clicked="coachInfoCardEmit" />
    </v-card>
    <ApproveRejectCoach
      v-if="ApproveRejectCoachDialog"
      :ApproveRejectCoachDialog="ApproveRejectCoachDialog"
      :StoreObj="StoreObj"
      @clicked="ApproveRejectCoachDialogEmit"
    />
    <ActivateDeactivateCoach
      v-if="ActivateDeactivateCoachDialog"
      :ActivateDeactivateCoachDialog="ActivateDeactivateCoachDialog"
      :StoreObj="StoreObj"
      @clicked="ActivateDeactivateCoachDialogEmit"
    />
    <CoachSettings
      v-if="CoachSettingsDialog"
      :CoachSettingsDialog="CoachSettingsDialog"
      @clicked="CoachSettingsDialogEmit"
    />
    <OnboardCoach
      v-if="onboardCoachDialog"
      :OnboardCoachDialog="onboardCoachDialog"
      @clicked="OnboardCoachDialogEmit"
    />
  </div>
</template>

<script>
import { GetAllAppCoachData } from "@/mixins/GetAppCoachData.js";

import CoachSettings from "@/components/Coach/Dialogs/CoachSettings.vue";
import ApproveRejectCoach from "@/components/Coach/Dialogs/ApproveRejectCoach.vue";
import ActivateDeactivateCoach from "@/components/Coach/Dialogs/ActivateDeactivateCoach.vue";
import OnboardCoach from "@/components/Coach/Dialogs/OnBoardNewCoach.vue";

import CoachInfo from "@/components/Coach/Cards/CoachInfo.vue";
export default {
  mixins: [GetAllAppCoachData],
  components: {
    ApproveRejectCoach,
    ActivateDeactivateCoach,
    CoachSettings,
    CoachInfo,
    OnboardCoach,
  },
  data() {
    return {
      tableHeight: 0,
      perPage: 10,
      page: 1,
      loadedPages: [],
      PageCount: 1,
      currentView: "MAIN_VIEW",
      headers: [
        {
          title: "Name",
          key: "user_name",
          sortable: false,
        },
        { title: "State", key: "user_state", sortable: false },
        { title: "Languages Known", key: "languages", sortable: false },
        // {
        //   text: "Description",
        //   value: "profile_description",
        //   sortable: false,
        //   width: 300,
        // },
        {
          title: "Sports Expertise",
          key: "sport_expertize",
          sortable: false,
        },
        { title: "Phone Number", key: "user_phone_number", sortable: false },
        { title: "Email", value: "user_email_id", sortable: false },
        { title: "Created On", key: "user_created_on", sortable: false },
        // {
        //   text: "Profile/Certificates",
        //   value: "user_info",
        //   sortable: false,
        // },
        {
          title: "No of Analysis Done",
          key: "no_of_analysis_done",
          sortable: false,
        },
        { title: "Status", key: "status", sortable: false },
        { title: "Actions", key: "action", sortable: false },
      ],
      ViewCoachProfileDialog: false,
      ViewCoachFilesDialog: false,
      ActivateDeactivateCoachDialog: false,
      listAllCoaches: [],
      FilteredCoaches: [],
      sortCoach: "ACTIVE",
      sortCoachItems: [
        { text: "Active", value: "ACTIVE" },
        { text: "Inactive", value: "INACTIVE" },
        { text: "Pending Approval", value: "PENDING_APPROVAL" },
        { text: "Rejected", value: "REJECTED" },
      ],
      initialNextToken: null,
      ApproveRejectCoachDialog: false,
      CoachSettingsDialog: false,

      StoreObj: {},
      search: "",
      tableLoading: true,
      showLoader: true,
      coachInfoCard: false,
      onboardCoachDialog: false,
    };
  },

  watch: {
    sortCoach(val) {
      if (val) {
        this.listAllCoaches = [];
        this.tableLoading = true;
        this.ApiCallMethod(this.sortCoach, this.initialNextToken, "COACH");
        if (val === "REJECTED") {
          this.headers = [
            {
              title: "Name",
              key: "user_name",
              sortable: false,
            },
            { title: "State", key: "user_state", sortable: false },
            { title: "Languages Known", key: "languages", sortable: false },
            // {
            //   text: "Description",
            //   value: "profile_description",
            //   sortable: false,
            //   width: 300,
            // },
            {
              title: "Sports Expertise",
              key: "sport_expertize",
              sortable: false,
            },
            {
              title: "Phone Number",
              key: "user_phone_number",
              sortable: false,
            },
            { title: "Email", value: "user_email_id", sortable: false },
            { title: "Created On", key: "user_created_on", sortable: false },
            // {
            //   text: "Profile/Certificates",
            //   value: "user_info",
            //   sortable: false,
            // },
            {
              title: "No of Analysis Done",
              key: "no_of_analysis_done",
              sortable: false,
            },
            { title: "Status", key: "status", sortable: false },
          ];
        } else {
          this.headers = [
            {
              title: "Name",
              key: "user_name",
              sortable: false,
            },
            { title: "State", key: "user_state", sortable: false },
            { title: "Languages Known", key: "languages", sortable: false },
            // {
            //   text: "Description",
            //   value: "profile_description",
            //   sortable: false,
            //   width: 300,
            // },
            {
              title: "Sports Expertise",
              key: "sport_expertize",
              sortable: false,
            },
            {
              title: "Phone Number",
              key: "user_phone_number",
              sortable: false,
            },
            { title: "Email", value: "user_email_id", sortable: false },
            { title: "Created On", key: "user_created_on", sortable: false },
            // {
            //   text: "Profile/Certificates",
            //   value: "user_info",
            //   sortable: false,
            // },
            {
              title: "No of Analysis Done",
              key: "no_of_analysis_done",
              sortable: false,
            },
            { title: "Status", key: "status", sortable: false },
            { title: "Actions", key: "action", sortable: false },
          ];
        }
      }
    },

    async page(val) {
      if (val % 2 === 0 && !this.loadedPages.includes(val)) {
        this.loadedPages.push(val);
        const currentPage = val;
        let copiedCoachList = [...this.listAllCoaches];
        await this.ApiCallMethod(this.sortCoach, this.nextToken, "COACH");
        this.page = currentPage;
        this.listAllCoaches.push(...copiedCoachList);
      }
    },
  },

  mounted() {
    this.tableHeight = window.innerHeight - 200;
    setTimeout(async () => {
      await this.ApiCallMethod(this.sortCoach, this.initialNextToken, "COACH");
    }, 1500);
  },

  methods: {
    async ApiCallMethod(sortBy, nextToken) {
      this.listAllCoaches = await this.GetAllAppCoachDataMethod(
        sortBy,
        nextToken,
        "COACH"
      );
      this.tableLoading = false;
      this.showLoader = false;
    },

    handleRowClick(event, row_data) {
      console.log("COACH_INFO", row_data.item);
      this.StoreObj = row_data.item;
      this.currentView = "CARD_VIEW";
      // this.coachInfoCard = true;
    },

    onboardCoachMethod() {
      this.onboardCoachDialog = true;
    },

    CoachInfoMethod(item) {
      this.$router.push({
        name: "Coach Infos",
        params: {
          coachName: item.user_name.includes(" ")
            ? item.user_name.split(" ").join("-").toLowerCase()
            : item.user_name.toLowerCase(),
          coachInfo: item,
        },
      });
    },

    async activeDeactiveMethod(item, command) {
      this.ActivateDeactivateCoachDialog = true;
      this.StoreObj = item;
      this.StoreObj.command = command;
    },

    coachSettingsMethod() {
      this.CoachSettingsDialog = true;
    },

    formatedDescription(item) {
      if (item) {
        const newItem = item.slice(0, 49);
        if (item.length > 50) {
          return `${newItem}..`;
        } else {
          return newItem;
        }
      }
    },

    formatedDateTime(item) {
      const dateTime = new Date(item).toLocaleString();
      return dateTime;
    },

    formatedDateTime(item) {
      const dateTime = new Date(item).toLocaleString();
      return dateTime;
    },
    ViewCoachProfileMethod(item) {
      this.ViewCoachProfileDialog = true;
      this.StoreObj = item;
    },

    viewCoachFilesMethod(item) {
      this.ViewCoachFilesDialog = true;
      this.StoreObj = item;
    },

    checkItem(item, action) {
      this.ApproveRejectCoachDialog = true;
      this.StoreObj = item;
      this.StoreObj.action = action;
    },

    formatedUserStatus(item) {
      if (item === "ACTIVE") {
        return "Approved";
      } else {
        return "Pending";
      }
    },

    ViewCoachProfileDialogEmit(Toggle) {
      this.ViewCoachProfileDialog = false;
    },

    ViewCoachFilesDialogEmit(Toggle) {
      this.ViewCoachFilesDialog = false;
    },

    async ApproveRejectCoachDialogEmit(Toggle) {
      this.ApproveRejectCoachDialog = false;
      if (Toggle === 2) {
        this.ApiCallMethod(this.sortCoach, this.initialNextToken, "COACH");
        // this.sortCoachNamesMethod();
      }
    },

    CoachSettingsDialogEmit(Toggle) {
      this.CoachSettingsDialog = false;
    },

    async ActivateDeactivateCoachDialogEmit(Toggle) {
      this.ActivateDeactivateCoachDialog = false;
      if (Toggle === 2) {
        this.ApiCallMethod(this.sortCoach, this.initialNextToken, "COACH");
        // this.sortCoachNamesMethod();
      }
    },

    async coachInfoCardEmit(Toggle) {
      this.currentView = "MAIN_VIEW";
      if (Toggle === 2) {
        setTimeout(async () => {
          await this.ApiCallMethod(
            this.sortCoach,
            this.initialNextToken,
            "COACH"
          );
        }, 1500);
      }
    },

    async OnboardCoachDialogEmit(Toggle) {
      this.onboardCoachDialog = false;
      if (Toggle == 2) {
        await this.ApiCallMethod(
          this.sortCoach,
          this.initialNextToken,
          "COACH"
        );
      }
    },
  },
};
</script>
