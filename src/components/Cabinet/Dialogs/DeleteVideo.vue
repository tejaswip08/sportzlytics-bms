<template>
  <div class="text-center pa-4">
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog v-model="dialogOperation" max-width="500" persistent>
      <v-card elevation="0">
        <v-toolbar density="compact" color="primary" class="muktaFont">
          <v-toolbar-title> Delete Video </v-toolbar-title>
          <v-spacer />
          <v-btn
            variant="icon"
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
            @click="DeleteVideoMethod()"
            >Delete
            <v-icon color="white" size="17" class="pl-1">mdi-delete </v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { editVdeos } from "@/graphql/mutations.js";
import { generateClient } from "aws-amplify/api";
const client = generateClient();
import Snackbar from "@/components/Extras/MySnackbar.vue";
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
    async DeleteVideoMethod() {
      try {
        this.btnLoader = true;
        const result = await client.graphql({
          query: editVdeos,
          variables: {
            input: {
              video_id: this.StoreObj.video_id,
              action: "DELETE",
            },
          },
        });

        let response = JSON.parse(result.data.editVdeos);
        if (response.status === 200) {
          this.SnackBarComponent = {
            SnackbarVModel: true,
            color: "text-red",
            Message: response.status_message,
          };
          this.btnLoader = false;
          this.DeleteVideoDialogEmit(2);
        }
        // console.log("ADDING_VIDEO_RESULT", result);
      } catch (error) {
        console.log("Error", error);
      }
    },

    DeleteVideoDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
