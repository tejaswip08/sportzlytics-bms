<template>
  <div>
    <v-card elevation="0">
      <v-toolbar density="comfortable" color="white">
        <v-toolbar-title>
          <div class="headingFont">Sports</div>
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
          v-model="sortSports"
          :items="sortSportItems"
          density="compact"
          variant="outlined"
          rounded
          label="Sort Sports"
          class="textFieldWidth mt-5 ml-2 mr-2 muktaFont"
          color="primary"
        >
        </v-select>
        <v-btn
          rounded
          density="comfortable"
          class="text-capitalize btnColorPrimary ml-2"
          @click="createEditSportMethod('CREATE')"
          >Create Sport
          <v-icon size="small" class="pl-2">mdi-plus</v-icon></v-btn
        >
      </v-toolbar>
      <v-card-text>
        <v-data-table
          :loading="tableLoading"
          :search="search"
          density="compact"
          :headers="headers"
          :items="listAllSports"
          fixed-header
          :height="tableHeight"
          class="customTable tableItemFont"
        >
          <template v-slot:[`item.sport_icon`]="{ item }">
            <div>
              <!-- {{ item.image_url }} -->
              <!-- <v-avatar rounded size="50"> -->
              <v-img
                v-if="item.image_url"
                :src="item.image_url"
                loading="lazy"
                width="80"
                height="80"
                contain
                class="rounded"
              />
              <div v-else>No image</div>
              <!-- </v-avatar> -->
            </div>
          </template>
          <template v-slot:[`item.created_on`]="{ item }">
            <div>
              {{ new Date(item.created_on).toLocaleDateString("en-GB") }}
            </div>
          </template>
          <template v-slot:[`item.sport_name`]="{ item }">
            <div class="text-capitalize">
              {{ formatedSportName(item.sport_name) }}
            </div>
          </template>
          <template v-slot:[`item.sport_status`]="{ item }">
            <div>
              <v-chip
                :color="item.sport_status === 'ACTIVE' ? 'green' : 'red'"
                class="white--text"
                >{{
                  item.sport_status === "ACTIVE" ? "Active" : "Inactive"
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
                <v-list-item @click="checkItem(item, 'EDIT')">
                  <v-list-item-title
                    >Edit<v-icon size="17" color="blue" class="pl-7 pr-2"
                      >mdi-pencil</v-icon
                    ></v-list-item-title
                  >
                </v-list-item>
                <!-- <v-list-item @click="checkItem(item, 'SHIFT_COACH')">
                  <v-list-item-title
                    >Shift Coach<v-icon
                      size="17"
                      color="orange"
                      class="pl-7 pr-2"
                      >mdi-share</v-icon
                    ></v-list-item-title
                  >
                </v-list-item> -->
                <v-list-item @click="enableDisableMethod(item)">
                  <v-list-item-title
                    >{{ item.sport_status === "ACTIVE" ? "Disable" : "Enable"
                    }}<v-icon
                      size="15"
                      :color="item.sport_status === 'ACTIVE' ? 'red' : 'green'"
                      class="pl-7 pr-2"
                      >{{
                        item.sport_status === "ACTIVE"
                          ? "mdi-close-circle"
                          : "mdi-check-circle"
                      }}</v-icon
                    ></v-list-item-title
                  >
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <CreateEditSport
      v-if="CreateEditSportDialog"
      :CreateEditSportDialog="CreateEditSportDialog"
      :StoreObj="StoreObj"
      @clicked="CreateEditSportDialogEmit"
    />
    <EnableDisableSport
      v-if="EnableDisableSportDialog"
      :EnableDisableSportDialog="EnableDisableSportDialog"
      :StoreObj="StoreObj"
      @clicked="EnableDisableSportDialogEmit"
    />
  </div>
</template>

<script>
import CreateEditSport from "@/components/Sports/Dialogs/CreateEditSport.vue";

import { getFileFromStorage } from "@/mixins/GetFileFromStorage.js";
import EnableDisableSport from "@/components/Sports/Dialogs/EnableDisableSport.vue";
// import ShiftCoach from "@/components/Sports/Dialogs/ShiftCoach.vue";
// import ViewSportIcon from "@/components/Sports/Dialogs/ViewSportIcon.vue";
// import Loader from "@/components/Extras/PageLoader.vue";

import { GetAllSport } from "@/mixins/GetAllSportList.js";
export default {
  mixins: [GetAllSport, getFileFromStorage],
  components: {
    CreateEditSport,
    EnableDisableSport,
    // ShiftCoach,
    // ViewSportIcon,
    // Loader,
  },
  data() {
    return {
      tableHeight: 0,
      perPage: 10,
      page: 1,
      PageCount: 1,
      sortSports: "Active",
      sortSportItems: ["Active", "Inactive"],
      headers: [
        {
          title: "Name",
          key: "sport_name",
          sortable: false,
        },
        {
          title: "Icon",
          key: "sport_icon",
          sortable: false,
        },
        {
          title: "Created On",
          key: "created_on",
          sortable: false,
        },
        {
          title: "Status",
          key: "sport_status",
          sortable: false,
        },
        {
          title: "Action",
          key: "action",
          sortable: false,
        },
      ],
      CreateEditSportDialog: false,
      EnableDisableSportDialog: false,
      ShiftCoachDialog: false,
      ViewSportIconDialog: false,
      listAllSports: [],
      FilteredSports: [],
      search: "",
      tableLoading: true,
      showLoader: true,
      StoreObj: {},
    };
  },

  watch: {
    search(val) {
      if (val && val !== "" && val !== null) {
        this.CallsearchMethod(val);
      }
    },

    async sortSports(val) {
      if (val === "Inactive") {
        this.listAllSports = await this.GetAllSportName("INACTIVE");
        await this.setImageUrlsForSportsList();
      } else {
        this.listAllSports = await this.GetAllSportName("ACTIVE");
        await this.setImageUrlsForSportsList();
      }
    },
  },

  async mounted() {
    this.tableHeight = window.innerHeight - 200;
    setTimeout(async () => {
      await this.callApiMethod();
      this.tableLoading = false;
      this.showLoader = false;
    }, 1500);
  },

  methods: {
    async callApiMethod() {
      try {
        this.listAllSports = [];
        this.listAllSports = await this.GetAllSportName("ACTIVE");
        const updatedSportsList = await Promise.all(
          this.listAllSports.map(async (sport) => {
            try {
              const iconUrl = await this.linkToStorageFile(sport.sport_icon);
              return { ...sport, image_url: iconUrl };
            } catch (err) {
              console.error("Failed to load icon from S3:", err);
              return { ...sport, image_url: null };
            }
          })
        );
        this.listAllSports = updatedSportsList;
        console.error("Updated sports list with icons:", this.listAllSports);
      } catch (error) {
        console.error("API error:", error);
      }
    },

    async setImageUrlsForSportsList() {
      const updatedSportsList = await Promise.all(
        this.listAllSports.map(async (sport) => {
          try {
            const iconUrl = await this.linkToStorageFile(sport.sport_icon);
            return { ...sport, image_url: iconUrl };
          } catch (err) {
            console.error("Failed to load icon from S3:", err);
            return { ...sport, image_url: null };
          }
        })
      );
      this.listAllSports = updatedSportsList;
    },

    createEditSportMethod() {
      this.CreateEditSportDialog = true;
      this.StoreObj["action"] = "CREATE";
    },

    CallsearchMethod(val) {
      this.FilteredSports = this.listAllSports.filter((item) => {
        const lowerVal = val.toLowerCase();
        if (item.sport_name.toLowerCase().includes(lowerVal) === true) {
          return item;
        }
      });
    },

    enableDisableMethod(item) {
      this.StoreObj = item;
      this.EnableDisableSportDialog = true;
    },

    checkItem(item, ACTION) {
      this.StoreObj = item;
      this.StoreObj["action"] = ACTION;
      if (ACTION === "SHIFT_COACH") {
        this.ShiftCoachDialog = true;
        this.StoreObj.sport_name_list = this.sportNames;
      } else {
        this.CreateEditSportDialog = true;
      }
      // console.log(this.StoreObj);
    },

    formatedDateTime(item) {
      const dateTime = new Date(item).toLocaleString();
      return dateTime;
    },

    formatedSportName(sportName) {
      if (sportName) {
        return sportName;
      }
    },

    async CreateEditSportDialogEmit(Toggle) {
      this.CreateEditSportDialog = false;
      if (Toggle === 2) {
        this.listAllSports = await this.GetAllSportName(
          this.sortSports.toUpperCase()
        );
        await this.setImageUrlsForSportsList();
        this.CallsearchMethod(this.search);
      }
    },

    async EnableDisableSportDialogEmit(Toggle) {
      this.EnableDisableSportDialog = false;
      if (Toggle === 2) {
        this.listAllSports = await this.GetAllSportName(
          this.sortSports.toUpperCase()
        );
        await this.setImageUrlsForSportsList();
      }
    },

    async ShiftCoachDialogEmit(Toggle) {
      this.ShiftCoachDialog = false;
      if (Toggle === 2) {
        this.listAllSports = await this.GetAllSportName(
          this.sortSports.toUpperCase()
        );
        await this.setImageUrlsForSportsList();
      }
    },

    ViewSportIconDialogEmit(Toggle) {
      this.ViewSportIconDialog = false;
    },
  },
};
</script>
