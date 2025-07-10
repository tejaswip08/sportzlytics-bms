<template>
  <div class="text-center pa-4">
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog v-model="dialogOperation" max-width="500" persistent>
      <v-card elevation="0">
        <v-toolbar density="compact" color="primary" class="muktaFont">
          <v-toolbar-title>
            {{
              StoreObj.action === "ADD"
                ? "Add Video Inputs"
                : "Edit Video Inputs"
            }}
          </v-toolbar-title>
          <v-spacer />
          <v-btn
            variant="icon"
            class="closeBtn"
            @click="AddEditVideoInputDialogEmit(1)"
            ><v-icon color="white" size="small">mdi-close-circle</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pa-5 muktaFont">
          <v-form ref="videoForm">
            <div class="mt-3 mb-2 tableItemFont">
              <strong>Enter video title</strong>
            </div>
            <v-text-field
              v-model="videoTitle"
              density="compact"
              rounded
              variant="outlined"
              color="primary muktaFont"
              label="Eg: Leg Spin"
              :rules="[(v) => !!v || 'Required']"
            >
            </v-text-field>
            <div class="mt-3 mb-2 tableItemFont">
              <strong>Enter youtube link</strong>
            </div>
            <v-text-field
              v-model="youtubeLink"
              density="compact"
              rounded
              variant="outlined"
              color="primary muktaFont"
              label="Eg: https://www.youtube.com"
              :rules="[(v) => !!v || 'Required']"
            >
            </v-text-field>
            <div class="mt-3 mb-2 tableItemFont">
              <strong>Select the sport name</strong>
            </div>
            <v-select
              v-model="sportName"
              :items="sportItems"
              density="compact"
              rounded
              variant="outlined"
              color="primary muktaFont"
              :rules="[(v) => !!v || 'Required']"
            />
            <div
              class="mt-3 mb-2"
              style="
                display: flex;
                flex-direction: row;
                justify-content: space-between;
              "
            >
              <div class="tableItemFont">
                <strong>Select video priority</strong>
              </div>
              <div class="tableItemFont">
                <strong>9 - Highest Priority ... 1 - Lowest Priority</strong>
              </div>
            </div>
            <v-select
              v-model="videoPriority"
              :items="videoPriorityList"
              density="compact"
              rounded
              variant="outlined"
              color="primary muktaFont"
              :rules="[(v) => !!v || 'Required']"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            density="compact"
            :loading="btnLoader"
            rounded
            class="text-capitalize btnColorPrimary"
            @click="AddVideoInputMethod(StoreObj.action)"
          >
            {{ StoreObj.action === "ADD" ? "Create" : "Save"
            }}<v-icon color="white" size="17" class="pl-1">{{
              StoreObj.action === "ADD" ? "mdi-plus" : "mdi-bookmark"
            }}</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { addVideos } from "@/graphql/mutations.js";
import { editVdeos } from "@/graphql/mutations.js";
import { generateClient } from "aws-amplify/api";
const client = generateClient();
import { GetAllSport } from "@/mixins/GetAllSportList.js";
import Snackbar from "@/components/Extras/MySnackbar.vue";
export default {
  mixins: [GetAllSport],
  props: {
    AddEditVideoInputDialog: Boolean,
    StoreObj: Object,
  },
  components: { Snackbar },
  data() {
    return {
      videoTitle: "",
      youtubeLink: "",
      sportName: "",
      sportItems: [],
      videoPriority: undefined,
      videoPriorityList: [9, 8, 7, 6, 5, 4, 3, 2, 1],
      SnackBarComponent: {},
      btnLoader: false,
    };
  },

  computed: {
    dialogOperation: {
      get() {
        return this.AddEditVideoInputDialog;
      },
    },
  },

  watch: {
    AddEditVideoInputDialog: {
      immediate: true,
      async handler(val) {
        if (val) {
          await this.GetAllSportName("ACTIVE");
          this.sportItems = this.sportNames
            .sort()
            .map((item) => item.charAt(0).toUpperCase() + item.slice(1));
          if (this.StoreObj.action === "EDIT") {
            this.videoTitle = this.StoreObj.video_title;
            this.youtubeLink = this.StoreObj.youtube_link;
            this.sportName = this.StoreObj.sport_name
              ? this.StoreObj.sport_name.charAt(0).toUpperCase() +
                this.StoreObj.sport_name.slice(1).toLowerCase()
              : "";
            this.videoPriority = this.StoreObj.priority_score;
          }
        }
      },
    },
    // async AddEditVideoInputDialog(val) {
    //   if (val) {
    //     await this.GetAllSportName("ACTIVE");
    //     this.sportItems = this.sportNames
    //       .sort()
    //       .map((item) => item.charAt(0).toUpperCase() + item.slice(1));
    //     if (this.StoreObj.action === "EDIT") {
    //       this.videoTitle = this.StoreObj.video_title;
    //       this.youtubeLink = this.StoreObj.youtube_link;
    //       this.sportName = this.StoreObj.sport_name
    //         ? this.StoreObj.sport_name.charAt(0).toUpperCase() +
    //           this.StoreObj.sport_name.slice(1).toLowerCase()
    //         : "";
    //       this.videoPriority = this.StoreObj.priority_score;
    //     }
    //   }
    // },
  },

  methods: {
    async AddVideoInputMethod(ACTION) {
      if (this.$refs.videoForm.validate()) {
        if (ACTION === "ADD") {
          try {
            this.btnLoader = true;
            const result = await client.graphql({
              query: addVideos,
              variables: {
                input: {
                  video_title: this.videoTitle,
                  youtube_link: this.youtubeLink,
                  sport_name: this.sportName.toLowerCase(),
                  priority_score: this.videoPriority,
                },
              },
            });
            let response = JSON.parse(result.data.addVideos);
            if (response.status === 200) {
              this.SnackBarComponent = {
                SnackbarVModel: true,
                color: "text-green",
                Message: response.status_message,
              };
              this.btnLoader = false;
              this.AddEditVideoInputDialogEmit(2);
            }
          } catch (error) {
            console.log("Error", error);
          }
        } else {
          try {
            this.btnLoader = true;
            const result = await client.graphql({
              query: editVdeos,
              variables: {
                input: {
                  video_id: this.StoreObj.video_id,
                  priority_score: this.videoPriority,
                  video_title: this.videoTitle,
                  youtube_link: this.youtubeLink,
                  sport_name: this.sportName.toLowerCase(),
                  action: "UPDATE",
                },
              },
            });

            let response = JSON.parse(result.data.editVdeos);
            if (response.status === 200) {
              this.SnackBarComponent = {
                SnackbarVModel: true,
                color: "text-green",
                Message: response.status_message,
              };
              this.btnLoader = false;
              this.AddEditVideoInputDialogEmit(2);
            }
            // console.log("ADDING_VIDEO_RESULT", result);
          } catch (error) {
            console.log("Error", error);
          }
        }
      } else {
        this.SnackBarComponent = {
          SnackbarVModel: true,
          color: "text-red",
          Message: "Kindly fill the form!!",
        };
      }
    },

    AddEditVideoInputDialogEmit(Toggle) {
      this.$refs.videoForm.reset();
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
