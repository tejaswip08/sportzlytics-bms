<template>
  <div>
    <v-card elevation="0" class="muktaFont">
      <v-toolbar density="comfortable" color="white">
        <v-toolbar-title>
          <div class="headingFont">
            Coach (<span style="color: #0981c5"> {{ StoreObj.user_name }} </span
            >) Info
          </div>
        </v-toolbar-title>
        <v-spacer />
        <v-btn
          rounded
          density="comfortable"
          class="text-capitalize btnColorPrimary ml-2"
          @click="coachInfoCardEmit(1)"
          >Back<v-icon size="small" class="pl-2">mdi-arrow-left</v-icon></v-btn
        >
      </v-toolbar>
      <v-card elevation="3" class="pa-6 ml-6 mr-6 mt-3">
        <div
          class="mb-5"
          style="
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          "
        >
          <div v-if="enableLoader">
            <v-progress-circular
              color="primary"
              indeterminate
            ></v-progress-circular>
          </div>
          <div v-else>
            <v-img :src="profileImgURL" :width="140" />
          </div>
        </div>
        <div>
          <v-row align="center">
            <v-col cols="12" lg="6" md="6" sm="12" xs="12">
              <div>
                <span>
                  <strong class="purple-color pr-2">Coach Name: </strong>
                  {{ StoreObj.user_name }}
                </span>
              </div>
              <div>
                <span>
                  <strong class="purple-color pr-2">Coach Email ID: </strong>
                  {{ StoreObj.user_email_id }}
                </span>
              </div>
              <div>
                <span>
                  <strong class="purple-color pr-2"
                    >Coach Phone Number:
                  </strong>
                  {{ StoreObj.user_phone_number }}
                </span>
              </div>
              <div>
                <span>
                  <strong class="purple-color pr-2">Age: </strong>
                  {{ StoreObj.age }}
                </span>
              </div>
              <div>
                <span>
                  <strong class="purple-color pr-2">Experience: </strong>
                  {{ StoreObj.experience }}
                </span>
              </div>
              <div>
                <span>
                  <strong class="purple-color pr-2">Coach Description: </strong>
                  <!-- {{ restrictCharacter }} -->
                  <div>
                    {{ StoreObj.profile_description }}
                  </div>
                </span>
              </div>
            </v-col>

            <v-col cols="12" lg="6" md="6" sm="12" xs="12">
              <div>
                <div>
                  <span>
                    <strong class="purple-color pr-2">Languages Known: </strong>
                    {{ formatedLangages(StoreObj.languages) }}
                  </span>
                </div>
                <div>
                  <span>
                    <strong class="purple-color pr-2">Sport Expertise: </strong>
                    {{ StoreObj.sport_expertize }}
                  </span>
                </div>
                <div>
                  <span>
                    <strong class="purple-color pr-2">Coach City: </strong>
                    {{ StoreObj.user_city }}
                  </span>
                </div>
                <div>
                  <span>
                    <strong class="purple-color pr-2">Coach State: </strong>
                    {{ StoreObj.user_state }}
                  </span>
                </div>
                <div>
                  <span>
                    <strong class="purple-color pr-2">Coach Country: </strong>
                    {{ StoreObj.user_country || "-" }}
                  </span>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-card>
      <div>
        <v-expansion-panels elevation="3" class="pa-6 ma-0">
          <v-expansion-panel>
            <v-expansion-panel-title class="font20px purple-color">
              <div>Certificates</div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-data-table
                density="compact"
                :headers="certificateProfileHeader"
                :items="certificatesList"
                fixed-header
                hide-default-footer
              >
                <template v-slot:[`item.sl_no`]="{ item, index }">
                  <div>
                    {{ index + 1 }}
                  </div>
                </template>
                <template v-slot:[`item.file_name`]="{ item }">
                  <div>
                    {{ formattedCertFileNameMethod(item.file_name) }}
                  </div>
                </template>
                <template v-slot:[`item.approved_status`]="{ item }">
                  <div v-if="formattedApprovedStatus(item.file_path)">
                    Approved
                    <v-btn icon flat density="compact">
                      <v-icon color="green" size="small"
                        >mdi-check-circle</v-icon
                      >
                    </v-btn>
                  </div>
                  <div v-else>
                    Not Approved
                    <v-btn icon flat density="compact">
                      <v-icon color="red" size="small">mdi-close-circle</v-icon>
                    </v-btn>
                  </div>
                </template>
                <template v-slot:[`item.file_path`]="{ item, index }">
                  <div>
                    <v-menu>
                      <template v-slot:activator="{ props }">
                        <v-btn density="compact" icon flat v-bind="props">
                          <v-icon size="small" color="primary"
                            >mdi-dots-vertical</v-icon
                          >
                        </v-btn>
                      </template>
                      <v-list class="muktaFont tableFontSize" density="compact">
                        <v-list-item @click="viewCertAttachments(item)">
                          <v-list-item-title
                            >View File<v-icon
                              size="15"
                              color="primary"
                              class="pl-7 pr-2"
                              >mdi-eye</v-icon
                            ></v-list-item-title
                          >
                        </v-list-item>
                        <v-list-item
                          v-if="
                            formattedApprovedStatus(item.file_path)
                              ? false
                              : true
                          "
                          @click="
                            approveRejectCertificateMethod(
                              item,
                              index,
                              'APPROVE'
                            )
                          "
                        >
                          <v-list-item-title
                            >Approve<v-icon
                              size="15"
                              color="green"
                              class="pl-7 pr-2"
                              >mdi-check-circle</v-icon
                            ></v-list-item-title
                          >
                        </v-list-item>
                        <!-- <v-list-item
                          v-if="
                            formattedApprovedStatus(item.file_path)
                              ? false
                              : true
                          "
                          @click="
                            approveRejectCertificateMethod(
                              item,
                              index,
                              'REJECT'
                            )
                          "
                        >
                          <v-list-item-title
                            >Reject<v-icon
                              size="15"
                              color="red"
                              class="pl-7 pr-2"
                              >mdi-close-circle</v-icon
                            ></v-list-item-title
                          >
                        </v-list-item> -->
                      </v-list>
                    </v-menu>
                  </div>
                </template>
              </v-data-table>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-expansion-panels
          elevation="3"
          class="pa-6 ma-0"
          style="position: relative; bottom: 25px"
        >
          <v-expansion-panel>
            <v-expansion-panel-title class="font20px purple-color">
              <div>Profile Attachments</div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-data-table
                density="compact"
                :headers="profileHeader"
                :items="profileAttachementsList"
                fixed-header
                hide-default-footer
              >
                <template v-slot:[`item.sl_no`]="{ item, index }">
                  <div>
                    {{ index + 1 }}
                  </div>
                </template>
                <template v-slot:[`item.file_name`]="{ item }">
                  <div>
                    {{ item.file_name }}
                  </div>
                </template>
                <template v-slot:[`item.file_path`]="{ item }">
                  <div>
                    <v-btn
                      icon
                      flat
                      density="compact"
                      @click="viewAttachemntsMethod(item.file_path)"
                    >
                      <v-icon size="17" color="primary">mdi-eye</v-icon>
                    </v-btn>
                  </div>
                </template>
              </v-data-table>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </v-card>
    <ApproveRejectCertificate
      v-if="approvetRejectCertificateDialog"
      :ApprovetRejectCertificateDialog="approvetRejectCertificateDialog"
      :StoreObj="storeObj2"
      @clicked="approvetRejectCertificateDialogEmit"
    />
    <ViewCoachCertificates
      v-if="viewCoachCertificatesDialog"
      :ViewCoachCertificatesDialog="viewCoachCertificatesDialog"
      :AttachementURL="attachementURL"
      @clicked="ViewCoachCertificatesDialogEmit"
    />
  </div>
</template>

<script>
import { getFileFromStorage } from "@/mixins/GetFileFromStorage.js";

import ApproveRejectCertificate from "@/components/Coach/Dialogs/ApproveRejectCertificate.vue";
import ViewCoachCertificates from "@/components/Coach/Dialogs/ViewCoachCertificates.vue";
export default {
  mixins: [getFileFromStorage],
  components: { ApproveRejectCertificate, ViewCoachCertificates },
  data: () => ({
    certificatesList: [],
    profileAttachementsList: [],
    certificateProfileHeader: [
      {
        title: "Sl.No",
        key: "sl_no",
        sortable: false,
      },
      {
        title: "File Name",
        key: "file_name",
        sortable: false,
      },
      {
        title: "Approved Status",
        key: "approved_status",
        sortable: false,
      },
      {
        title: "Action",
        key: "file_path",
        sortable: false,
      },
    ],
    profileHeader: [
      {
        title: "Sl.No",
        key: "sl_no",
        sortable: false,
      },
      {
        title: "File Name",
        key: "file_name",
        sortable: false,
      },
      {
        title: "View Attachments",
        key: "file_path",
        sortable: false,
      },
    ],
    profileImgURL: "",
    approvetRejectCertificateDialog: false,
    storeObj2: {},
    viewCoachCertificatesDialog: false,
    attachementURL: "",
    enableLoader: true,
  }),
  props: {
    CoachInfoCard: Boolean,
    StoreObj: Object,
  },

  watch: {
    CoachInfoCard(val) {
      if (val) {
        console.log("COACH_INFO", this.StoreObj);
      }
    },
  },

  computed: {
    restrictCharacter() {
      if (this.StoreObj.profile_description.length > 200) {
        return `${this.StoreObj.profile_description.slice(0, 200)}...more`;
      } else {
        return this.StoreObj.profile_description;
      }
    },
  },

  async mounted() {
    setTimeout(async () => {
      this.profileImgURL = await this.linkToStorageFile(
        this.StoreObj.user_image_url
      );
    }, 2000);
    if (Array.isArray(this.StoreObj.certificates)) {
      this.StoreObj.certificates.forEach((item) => {
        if (item) {
          const fileName = item.split("/");
          const obj = {
            file_name: fileName[fileName.length - 1],
            approved_status: item.is_certified,
            file_path: item,
          };
          this.certificatesList.push(obj);
        }
      });
    }
    if (Array.isArray(this.StoreObj.profile_video)) {
      this.StoreObj.profile_video.forEach((item) => {
        if (item) {
          const fileName = item.split("/");
          const obj = {
            file_name: fileName[fileName.length - 1],
            file_path: item,
          };
          this.profileAttachementsList.push(obj);
        }
      });
    }
  },

  methods: {
    async viewAttachemntsMethod(url) {
      const finalURL = await this.linkToStorageFile(url);
      const imageFormates = [".jpg", ".jpeg", ".png", ".webp", ".mp4"];
      const validImageFormate = imageFormates.some((item) =>
        url.includes(item)
      );
      if (validImageFormate) {
        this.attachementURL = finalURL;
        this.viewCoachCertificatesDialog = true;
      } else {
        window.open(finalURL, "__blank");
      }
    },

    async viewCertAttachments(item) {
      let parsed;
      let url;
      try {
        parsed = JSON.parse(item.file_path);
        url = parsed.certificate_key;
      } catch {
        parsed = JSON.parse(`"${item.file_path}"`);
        url = parsed;
      } finally {
        await this.viewAttachemntsMethod(url);
      }
    },

    formattedCertFileNameMethod(fileName) {
      return fileName.split(",")[0].replace(/"/g, "");
    },

    formattedApprovedStatus(filePath) {
      const parsedPath = JSON.parse(filePath);
      return parsedPath.is_certified;
    },

    formatedLangages(languagesArray) {
      let languages = "";
      languagesArray.forEach((item) => {
        if (item) {
          languages += `${item}, `;
        }
      });
      return languages.slice(0, -2);
    },

    approveRejectCertificateMethod(item, index, action) {
      this.storeObj2.to_approve = item;
      this.storeObj2.to_approve_index = index;
      this.storeObj2.coach_info = this.StoreObj;
      this.storeObj2.action = action;
      this.approvetRejectCertificateDialog = true;
    },

    coachInfoCardEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },

    approvetRejectCertificateDialogEmit(Toggle) {
      this.approvetRejectCertificateDialog = false;
      if (Toggle === 2) {
        this.coachInfoCardEmit(2);
      }
    },

    ViewCoachCertificatesDialogEmit(Toggle) {
      this.viewCoachCertificatesDialog = false;
    },
  },
};
</script>
