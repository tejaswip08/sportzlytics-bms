<template>
  <div class="text-center pa-4">
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog v-model="dialogOperation" max-width="500" persistent>
      <v-card elevation="0">
        <v-toolbar density="compact" color="primary" class="muktaFont">
          <v-toolbar-title> Delete Video </v-toolbar-title>
          <v-spacer />
          <v-btn
            icon
            flat
            desnity="compact"
            class="closeBtn"
            @click="DeleteVideoDialogEmit(1)"
            ><v-icon color="white" size="small">mdi-close-circle</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pa-5 muktaFont">
          <span
            >Are you sure want to delete
            <strong>{{ StoreObj.video_title }}</strong> video?</span
          >
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            density="compact"
            :loading="btnLoader"
            rounded
            class="text-capitalize btnColorPrimary"
            @click="deleteVideoMethod()"
            >Delete
            <v-icon color="white" size="17" class="pl-1">mdi-delete </v-icon>
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

import { editHowToUseVideos } from "@/graphql/mutations.js";

export default {
  props: {
    DeleteVideoDialog: Boolean,
    StoreObj: Object,
  },
  components: { Snackbar },
  data() {
    return {
      btnLoader: false,
      SnackBarComponent: {},
    };
  },

  computed: {
    dialogOperation: {
      get() {
        return this.DeleteVideoDialog;
      },
    },
  },

  methods: {
    async deleteVideoMethod() {
      try {
        this.btnLoader = true;
        const result = await client.graphql({
          query: editHowToUseVideos,
          variables: {
            input: {
              video_id: this.StoreObj.video_id,
              action: "DELETE",
            },
          },
        });
        const response = JSON.parse(result.data.editHowToUseVideos);
        if (response.status === 200) {
          this.SnackBarComponent = {
            SnackbarVModel: true,
            color: "text-green",
            Message: response.status_message,
          };
          this.DeleteVideoDialogEmit(2);
        }
      } catch (error) {
        console.log("Error", error);
      }
      this.btnLoader = false;
    },

    DeleteVideoDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
