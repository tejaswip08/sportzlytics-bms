<template>
  <div>
    <v-card elevation="0">
      <v-toolbar density="comfortable" color="white">
        <v-toolbar-title>
          <div class="headingFont">Coaching Videos</div>
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
          v-model="sortBySportName"
          :items="sortBySportItems"
          density="compact"
          variant="outlined"
          rounded
          label="Sort By"
          class="textFieldWidth mt-5 ml-2 mr-2 muktaFont"
          color="primary"
        >
          <template #append-inner>
            <v-icon
              @click="removeSportSortFilterMethod()"
              size="15"
              color="black"
              class="mt-1"
              v-if="sortBySportName !== ''"
              >mdi-close-circle</v-icon
            >
          </template>
        </v-select>
        <v-btn
          rounded
          density="comfortable"
          class="text-capitalize btnColorPrimary ml-2"
          @click="addEditVideosMethod('ADD')"
          >Add Videos <v-icon size="small" class="pl-2">mdi-plus</v-icon></v-btn
        >
      </v-toolbar>
      <v-card-text>
        <v-data-table
          :loading="tableLoading"
          :search="search"
          density="compact"
          :headers="headers"
          :items="listAllCabinetVideo"
          fixed-header
          :height="tableHeight"
          class="customTable tableItemFont"
        >
          <template v-slot:[`item.sport_name`]="{ item }">
            <div class="text-capitalize">
              {{ item.sport_name }}
            </div>
          </template>
          <template v-slot:[`item.youtube_link`]="{ item }">
            <div>
              <v-btn
                density="compact"
                icon
                flat
                @click="openYoutubeModal(item.youtube_link)"
                ><v-icon color="red" size="17">mdi-youtube</v-icon></v-btn
              >
            </div>
          </template>
          <template v-slot:[`item.action`]="{ item }">
            <div style="display: flex; flex-direction: row; flex-wrap: wrap">
              <div class="mr-2">
                <v-btn
                  density="compact"
                  icon
                  flat
                  @click="addEditVideosMethod('EDIT', item)"
                  ><v-icon color="blue" size="17">mdi-pencil</v-icon></v-btn
                >
              </div>
              <div class="mr-2">
                <v-btn
                  density="compact"
                  icon
                  flat
                  @click="DeleteVideoMethod(item)"
                  ><v-icon color="red" size="17">mdi-delete</v-icon></v-btn
                >
              </div>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <AddEditVideoInput
      v-if="AddEditVideoInputDialog"
      :AddEditVideoInputDialog="AddEditVideoInputDialog"
      :StoreObj="StoreObj"
      @clicked="AddEditVideoInputDialogEmit"
    />
    <DeleteVideo
      v-if="DeleteVideoDialog"
      :DeleteVideoDialog="DeleteVideoDialog"
      :StoreObj="StoreObj"
      @clicked="DeleteVideoDialogEmit"
    />
  </div>
</template>

<script>
import AddEditVideoInput from "@/components/Cabinet/Dialogs/AddEditVideo.vue";
import DeleteVideo from "@/components/Cabinet/Dialogs/DeleteVideo.vue";
// import Loader from "@/components/Extras/PageLoader.vue";

import { GetAllCabinetVideos } from "@/mixins/GetAllCabinetVideoList.js";

export default {
  mixins: [GetAllCabinetVideos],
  components: { AddEditVideoInput, DeleteVideo },
  data() {
    return {
      tableHeight: 0,
      perPage: 10,
      page: 1,
      PageCount: 1,
      headers: [
        {
          title: "Priority Score",
          key: "priority_score",
          width: "25",
          sortable: false,
        },
        {
          title: "Video Title",
          key: "video_title",
          sortable: false,
        },
        {
          title: "Sports Name",
          key: "sport_name",
          sortable: false,
        },
        {
          title: "Youtube Video",
          key: "youtube_link",
          sortable: false,
        },
        {
          title: "Actions",
          key: "action",
          sortable: false,
        },
      ],
      CreateEditSportDialog: false,
      listAllCabinetVideo: [],
      search: "",
      AddEditVideoInputDialog: false,
      DeleteVideoDialog: false,
      tableLoading: true,
      showLoader: true,
      youtubeDialog: false,
      youtubeLink: "",
      StoreObj: {},
      sortBySportName: "",
      sortBySportItems: [],
      storeCabinetVideosData: [],
    };
  },

  watch: {
    sortBySportName(val) {
      if (val) {
        this.listAllCabinetVideo = [...this.storeCabinetVideosData];
        this.listAllCabinetVideo = this.listAllCabinetVideo.filter((item) => {
          if (item.sport_name === val.toLowerCase()) {
            return item;
          }
        });
      }
    },
  },

  mounted() {
    this.tableHeight = window.innerHeight - 200;
    setTimeout(async () => {
      this.listAllCabinetVideo = await this.GetAllCabinetVideosMethod();
      this.storeCabinetVideosData = [...this.listAllCabinetVideo];

      this.sortBySportNameMethod();
      this.tableLoading = false;
      this.showLoader = false;
    }, 1500);
  },

  methods: {
    formatedSportName(sportName) {
      if (sportName) {
        return sportName;
      }
    },

    sortBySportNameMethod() {
      this.listAllCabinetVideo.filter((item) => {
        const currentSport =
          item.sport_name.slice(0, 1).toUpperCase() + item.sport_name.slice(1);
        if (!this.sortBySportItems.includes(currentSport)) {
          this.sortBySportItems.push(currentSport);
        }
      });
      // this.sortBySportItems = this.listAllCabinetVideo.map(
      //   (item) =>
      //     item.sport_name.slice(0, 1).toUpperCase() + item.sport_name.slice(1)
      // );
    },

    openYoutubeModal(youtubeLink) {
      window.open(youtubeLink, "__blank");
      // this.youtubeLink = this.getYoutubeEmbedLink(youtubeLink);
      // if (this.youtubeLink) {
      //   this.youtubeDialog = true;
      // }
    },

    async removeSportSortFilterMethod() {
      this.sortBySportName = "";
      this.tableLoading = true;
      this.listAllCabinetVideo = await this.GetAllCabinetVideosMethod();
      this.tableLoading = false;
    },

    getYoutubeEmbedLink(youtubeLink) {
      if (!youtubeLink) {
        return null;
      }
      const url = new URL(youtubeLink);
      const videoId = url.searchParams.get("v");
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      } else {
        const pathname = url.pathname.split("/")[1];
        if (pathname) {
          return `https://www.youtube.com/embed/${pathname}`;
        }
      }
      return null;
    },

    addEditVideosMethod(ACTION, item) {
      this.AddEditVideoInputDialog = true;
      this.StoreObj.action = ACTION;
      if (ACTION === "EDIT") {
        this.StoreObj = item;
        this.StoreObj.action = ACTION;
      }
    },

    DeleteVideoMethod(item) {
      this.DeleteVideoDialog = true;
      this.StoreObj = item;
    },

    async AddEditVideoInputDialogEmit(Toggle) {
      this.AddEditVideoInputDialog = false;
      if (Toggle === 2) {
        this.listAllCabinetVideo = await this.GetAllCabinetVideosMethod();
        this.sortBySportNameMethod();
      }
    },

    async DeleteVideoDialogEmit(Toggle) {
      this.DeleteVideoDialog = false;
      if (Toggle === 2) {
        this.listAllCabinetVideo = await this.GetAllCabinetVideosMethod();
        this.sortBySportNameMethod();
      }
    },
  },
};
</script>
