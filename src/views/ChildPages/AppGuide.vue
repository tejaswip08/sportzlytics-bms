<template>
  <div>
    <v-card elevation="0">
      <v-toolbar density="comfortable" color="white">
        <v-toolbar-title>
          <div class="headingFont">Guide For App</div>
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
          @click="uploadVideoMethod()"
          >Upload Video<v-icon size="small" class="pl-2"
            >mdi-upload</v-icon
          ></v-btn
        >
      </v-toolbar>
      <v-card-text>
        <v-data-table
          :loading="tableLoading"
          :search="search"
          density="compact"
          :headers="headers"
          :items="listAppVideoList"
          fixed-header
          :height="tableHeight"
          class="customTable tableItemFont"
        >
          <template v-slot:[`item.sl_no`]="{ item, index }">
            <div>
              {{ index + 1 }}
            </div>
          </template>
          <template v-slot:[`item.storage_url`]="{ item }">
            <v-btn
              density="compact"
              rounded
              outlined
              color="primary"
              class="text-capitalize"
              @click="watchVideoMethod(item.storage_url)"
              >Click to watch video</v-btn
            >
          </template>
          <template v-slot:[`item.action`]="{ item }">
            <div class="d-flex">
              <div>
                <v-btn
                  icon
                  flat
                  density="compact"
                  @click="(StoreObj = item), (deleteVideoDialog = true)"
                >
                  <v-icon size="17" color="red">mdi-delete</v-icon>
                </v-btn>
              </div>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <UploadVideo
      v-if="uploadVideoDialog"
      :UploadVideoDialog="uploadVideoDialog"
      @clicked="UploadVideoDialogEmit"
    />
    <DeleteVideo
      v-if="deleteVideoDialog"
      :DeleteVideoDialog="deleteVideoDialog"
      :StoreObj="StoreObj"
      @clicked="DeleteVideoDialogEmit"
    />
  </div>
</template>

<script>
import UploadVideo from "@/components/AppGuide/Dialogs/UploadVideoDialog.vue";
import DeleteVideo from "@/components/AppGuide/Dialogs/DeleteVideo.vue";
// import DeleteVideo from "@/components/AppGuide/Dialogs/DeleteVideo.vue";

import { generateClient } from "aws-amplify/api";
const client = generateClient();

import { getFileFromStorage } from "@/mixins/GetFileFromStorage.js";
import { listHowToUseVideos } from "@/graphql/queries.js";

export default {
  mixins: [getFileFromStorage],
  components: { UploadVideo, DeleteVideo },
  data: () => ({
    tableLoading: true,
    tableHeight: 0,
    headers: null,
    perPage: 10,
    page: 1,
    PageCount: 1,
    listAppVideoList: [],
    headers: [
      { title: "Sl No", key: "sl_no" },
      { title: "Video Title", key: "video_title" },
      { title: "Video Link", key: "storage_url" },
      { title: "Target Users", key: "target_users" },
      { title: "Action", key: "action" },
    ],
    StoreObj: {},
    uploadVideoDialog: false,
    deleteVideoDialog: false,
    search: "",
  }),

  mounted() {
    this.tableHeight = window.innerHeight - 200;
    this.callApiMethod();
  },

  methods: {
    async callApiMethod() {
      try {
        const result = await client.graphql({ query: listHowToUseVideos });
        const response = JSON.parse(result.data.listHowToUseVideos).data;

        const updatedList = await Promise.all(
          response.map(async (item) => {
            try {
              const storageUrl = await this.linkToStorageFile(
                item.youtube_link
              );
              return { ...item, storage_url: storageUrl };
            } catch (err) {
              console.error("Failed to load file from storage:", err);
              return { ...item, storage_url: null };
            }
          })
        );

        this.listAppVideoList = updatedList;
        this.tableLoading = false;
      } catch (error) {
        console.error("API error:", error);
        this.tableLoading = false;
      }
    },

    watchVideoMethod(item) {
      window.open(item, "__blank");
    },

    uploadVideoMethod() {
      this.uploadVideoDialog = true;
    },

    UploadVideoDialogEmit(Toggle) {
      this.uploadVideoDialog = false;
      if (Toggle === 2) {
        this.callApiMethod();
      }
    },

    DeleteVideoDialogEmit(Toggle) {
      this.deleteVideoDialog = false;
      if (Toggle === 2) {
        this.callApiMethod();
      }
    },
  },
};
</script>
