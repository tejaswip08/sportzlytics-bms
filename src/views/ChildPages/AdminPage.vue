<template>
  <div>
    <v-card elevation="0">
      <v-toolbar density="comfortable" color="white">
        <v-toolbar-title>
          <div class="headingFont">Admins</div>
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
        <v-btn
          rounded
          density="comfortable"
          class="text-capitalize btnColorPrimary ml-2"
          @click="createAdminMethod('CREATE')"
          >Create Admin<v-icon size="small" class="pl-2"
            >mdi-plus</v-icon
          ></v-btn
        >
      </v-toolbar>
      <v-card-text>
        <v-data-table
          :loading="tableLoading"
          :search="search"
          density="compact"
          :headers="headers"
          :items="listAllAdmins"
          fixed-header
          :height="tableHeight"
          class="customTable tableItemFont"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn
              density="compact"
              icon
              flat
              class="text-capitalize"
              @click="editAdminMethod(item)"
              ><v-icon color="green" size="small">mdi-pencil</v-icon></v-btn
            >
          </template>
          <template v-slot:[`item.user_created_on`]="{ item }">
            <div>
              {{ formatedDateTime(item.user_created_on) }}
            </div>
          </template>
          <template v-slot:[`item.user_type`]="{ item }">
            <div v-if="item.user_type">
              {{ formatedUserType(item.user_type) }}
            </div>
            <div v-else>-</div>
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

          <!-- <template v-slot:[`item.action`]="{ item }">
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn icon flat v-bind="props">
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
          </template> -->
        </v-data-table>
      </v-card-text>
    </v-card>
    <CreateAdmin
      v-if="CreateAdminDialog"
      :CreateAdminDialog="CreateAdminDialog"
      :StoreObj="StoreObj"
      @clicked="CreateAdminDialogEmit"
    />
    <EditAdmin
      v-if="EditAdminDialog"
      :EditAdminDialog="EditAdminDialog"
      :StoreObj="StoreObj"
      @clicked="EditAdminDialogEmit"
    />
  </div>
</template>

<script>
import CreateAdmin from "@/components/Admins/Dialogs/CreateAdmin.vue";
import EditAdmin from "@/components/Admins/Dialogs/EditAdmin.vue";
// import Loader from "@/components/Extras/PageLoader.vue";

import { GetAllAdmins } from "@/mixins/GetAllAdmins.js";
export default {
  mixins: [GetAllAdmins],
  components: { CreateAdmin, EditAdmin },
  data() {
    return {
      perPage: 10,
      page: 1,
      PageCount: 1,
      tableHeight: 0,
      headers: [
        {
          title: "Name",
          key: "user_name",
          sortable: false,
        },
        { title: "Email", key: "user_email_id", sortable: false },
        { title: "Created On", key: "user_created_on", sortable: false },
        { title: "User Type", key: "user_type", sortable: false },
        { title: "Status", key: "user_status", sortable: false },
        { title: "Actions", key: "actions", sortable: false },
      ],
      CreateAdminDialog: false,
      EditAdminDialog: false,
      listAllAdmins: [],
      FilteredAdmins: [],
      StoreObj: {},
      search: "",
      tableLoading: true,
      showLoader: true,
    };
  },

  mounted() {
    this.tableHeight = window.innerHeight - 200;
    setTimeout(async () => {
      this.listAllAdmins = (await this.GetAdminsMethod()) || [];
      if (this.listAllAdmins.length) {
        this.sortAdminNamesMethod();
      }
      this.tableLoading = false;
      this.showLoader = false;
    }, 1500);
  },

  methods: {
    sortAdminNamesMethod() {
      this.listAllAdmins.sort((obj1, obj2) => {
        const admin1 = obj1?.user_name ? obj1.user_name.toLowerCase() : "";
        const admin2 = obj2?.user_name ? obj2.user_name.toLowerCase() : "";
        if (admin1 > admin2) {
          return 1;
        } else if (admin1 < admin2) {
          return -1;
        } else {
          return 0;
        }
      });
    },

    formatedDateTime(item) {
      const dateTime = new Date(item).toLocaleString();
      return dateTime;
    },
    formatedUserType(userType) {
      if (userType === "ADMIN") {
        return "Admin";
      } else {
        return "Super Admin";
      }
    },
    createAdminMethod() {
      this.CreateAdminDialog = true;
    },

    editAdminMethod(item) {
      this.EditAdminDialog = true;
      this.StoreObj = item;
    },

    async CreateAdminDialogEmit(Toggle) {
      this.CreateAdminDialog = false;
      if (Toggle === 2) {
        this.listAllAdmins = await this.GetAdminsMethod();
      }
    },

    async EditAdminDialogEmit(Toggle) {
      this.EditAdminDialog = false;
      if (Toggle === 2) {
        this.listAllAdmins = await this.GetAdminsMethod();
      }
    },
  },
};
</script>
