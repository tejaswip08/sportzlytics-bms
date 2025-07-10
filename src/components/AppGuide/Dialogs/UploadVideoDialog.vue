<template>
  <div class="text-center pa-4">
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog v-model="dialogOperation" max-width="500" persistent>
      <v-card elevation="0">
        <v-toolbar density="compact" color="primary" class="muktaFont">
          <v-toolbar-title> Upload Video </v-toolbar-title>
          <v-spacer />
          <v-btn icon flat class="closeBtn" @click="UploadVideoDialogEmit(1)"
            ><v-icon color="white" size="small">mdi-close-circle</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pa-5 muktaFont">
          <v-form ref="videoForm">
            <v-text-field
              v-model="videoTitle"
              density="compact"
              rounded
              variant="outlined"
              color="primary muktaFont"
              label="Enter video title*"
              :rules="[(v) => !!v || 'Required']"
            >
            </v-text-field>

            <v-select
              v-model="targetUser"
              :items="['USER', 'COACH', 'BOTH']"
              density="compact"
              rounded
              variant="outlined"
              color="primary muktaFont"
              label="Select target users*"
              :rules="[(v) => !!v || 'Required']"
            >
            </v-select>
          </v-form>
          <v-file-input
            v-model="file"
            label="Click to upload video files"
            density="compact"
            rounded
            variant="outlined"
            color="primary muktaFont"
            :rules="[(v) => !!v || 'Required']"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            density="compact"
            :loading="btnLoader"
            rounded
            class="text-capitalize btnColorPrimary"
            @click="uploadVideoMethod()"
          >
            Upload<v-icon color="white" size="17" class="pl-1"
              >mdi-upload</v-icon
            >
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { generateClient } from "aws-amplify/api";
const client = generateClient();
import Snackbar from "@/components/Extras/MySnackbar.vue";

import { addHowToUseVideos } from "@/graphql/mutations.js";
import { fileUpload } from "@/mixins/FileUpload.js";
export default {
  mixins: [fileUpload],
  props: {
    UploadVideoDialog: Boolean,
  },
  components: { Snackbar },
  data() {
    return {
      btnLoader: false,
      videoTitle: "",
      targetUser: "",
      file: {},
      SnackBarComponent: {},
    };
  },

  computed: {
    dialogOperation: {
      get() {
        return this.UploadVideoDialog;
      },
    },
  },

  methods: {
    async uploadVideoMethod() {
      const isValid = await this.$refs.videoForm.validate();
      if (isValid.valid && this.file.name) {
        this.btnLoader = true;
        const now = new Date();
        const timestamp = now.toISOString().replace(/[:.-]/g, "");
        const fileName = this.file.name.replace(/\s+/g, "_");
        const filePath = `APP_USAGE_TUTORIAL/${timestamp}_${fileName}`;
        const uploadedKey = await this.CommonUploadFileMethod(
          filePath,
          this.file,
          "video/mp4"
        );

        try {
          const result = await client.graphql({
            query: addHowToUseVideos,
            variables: {
              input: {
                video_title: this.videoTitle,
                youtube_link: uploadedKey.key,
                target_users: this.targetUser,
              },
            },
          });
          const response = JSON.parse(result.data.addHowToUseVideos);
          if (response.status === 200) {
            this.SnackBarComponent = {
              SnackbarVModel: true,
              color: "text-green",
              Message: response.status_message,
            };
            this.UploadVideoDialogEmit(2);
          }
        } catch (error) {
          console.log("Error", error);
        }
        this.btnLoader = false;
      } else {
        this.SnackBarComponent = {
          SnackbarVModel: true,
          color: "text-red",
          Message: "Kindly upload with video title and videos!",
        };
      }
    },

    UploadVideoDialogEmit(Toggle) {
      this.file = {};
      this.videoTitle = "";
      this.targetUser = "";
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
