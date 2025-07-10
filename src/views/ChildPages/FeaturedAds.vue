<template>
  <div>
    <v-card elevation="0">
      <v-toolbar density="comfortable" color="white">
        <v-toolbar-title>
          <div class="headingFont">Featured Ads</div>
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
          @click="createAdMethod()"
          >Create Ad<v-icon size="small" class="pl-2">mdi-plus</v-icon></v-btn
        >
      </v-toolbar>
      <v-card-text>
        <v-data-table
          :loading="tableLoading"
          :search="search"
          density="compact"
          :headers="featuredAdHeader"
          :items="featuredAdList"
          fixed-header
          :height="tableHeight"
          class="customTable tableItemFont"
        >
          <template v-slot:[`item.image_url`]="{ item }">
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
          </template>
          <template v-slot:[`item.action`]="{ item }">
            <div class="d-flex">
              <div class="mr-2">
                <v-btn
                  density="compact"
                  icon
                  flat
                  @click="editAdMethod(item, 'EDIT')"
                  ><v-icon size="17" color="green">mdi-pencil</v-icon></v-btn
                >
              </div>
              <div>
                <v-btn
                  density="compact"
                  icon
                  flat
                  @click="editAdMethod(item, 'DELETE')"
                  ><v-icon size="17" color="red">mdi-delete</v-icon></v-btn
                >
              </div>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <CreateEditAd
      v-if="createAdDialog"
      :CreateAdDialog="createAdDialog"
      :StoreObj="storeObj"
      @clicked="CreateAdDialogEmit"
    />
  </div>
</template>

<script>
import CreateEditAd from "@/components/FeaturedAds/Dialogs/CreateEditAd.vue";

import { listSponsoredVideos } from "@/graphql/queries.js";
import { getFileFromStorage } from "@/mixins/GetFileFromStorage.js";

import { generateClient } from "aws-amplify/api";
const client = generateClient();

export default {
  mixins: [getFileFromStorage],
  components: {
    CreateEditAd,
  },
  data: () => ({
    createAdDialog: false,
    featuredAdList: [],
    tableHeight: 0,
    perPage: 10,
    page: 1,
    PageCount: 1,
    featuredAdHeader: [
      { title: "Media Title", key: "media_title" },
      { title: "Image", key: "image_url" },
      { title: "Website Link", key: "website_link" },
      { title: "Target Users", key: "target_users" },
      { title: "Action", key: "action" },
    ],
    tableLoading: true,
    storeObj: {},
    search: "",
  }),

  async mounted() {
    this.tableHeight = window.innerHeight - 200;
    this.callApiMethod();
    // await this.linkToStorageFile("AD_IMAGES/20250428T052818614Z_pic6.jpg");
  },

  methods: {
    async callApiMethod() {
      try {
        const result = await client.graphql({ query: listSponsoredVideos });
        const response = JSON.parse(result.data.listSponsoredVideos).data;
        const updatedList = await Promise.all(
          response.map(async (item) => {
            try {
              const imageUrl = await this.linkToStorageFile(item.s3_key);

              return { ...item, image_url: imageUrl };
            } catch (err) {
              console.error("Failed to load image from S3:", err);
              return { ...item, image_url: null };
            }
          })
        );
        this.featuredAdList = updatedList;
        console.error("featuredAdList", this.featuredAdList);
        this.tableLoading = false;
      } catch (error) {
        console.error("API error:", error);
        this.tableLoading = false;
      }
    },

    createAdMethod() {
      this.storeObj.action = "CREATE";
      this.createAdDialog = true;
    },

    editAdMethod(item, action) {
      this.storeObj = item;
      this.storeObj.action = action;
      this.createAdDialog = true;
    },

    async CreateAdDialogEmit(Toggle) {
      this.createAdDialog = false;
      if (Toggle === 2) {
        await this.callApiMethod();
      }
    },
  },
};
</script>
