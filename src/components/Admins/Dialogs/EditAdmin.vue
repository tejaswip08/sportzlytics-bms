<template>
  <div class="text-center pa-4">
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog v-model="dialogOperation" max-width="500" persistent>
      <v-card elevation="0">
        <v-toolbar density="compact" color="primary" class="muktaFont">
          <v-toolbar-title> Edit Admin </v-toolbar-title>
          <v-spacer />
          <v-btn icon flat class="closeBtn" @click="EditAdminDialogEmit(1)"
            ><v-icon color="white" size="small">mdi-close-circle</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pa-5 muktaFont">
          <v-form ref="userForm">
            <div class="mt-3 mb-2 tableItemFont">
              <strong>Change user status</strong>
            </div>
            <v-text-field
              v-model="userStatus"
              density="compact"
              rounded
              variant="outlined"
              color="primary muktaFont"
              :label="
                StoreObj.user_status === 'ACTIVE'
                  ? 'Type DISABLE to make user Inactive'
                  : 'Type ENABLE to make user active'
              "
              :rules="[(v) => !!v || 'Required']"
            >
            </v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            density="compact"
            :loading="btnLoader"
            rounded
            class="text-capitalize btnColorPrimary"
            @click="editAdminMethod()"
          >
            Save<v-icon color="white" size="15" class="pl-1"
              >mdi-bookmark</v-icon
            >
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { editAdminStatus } from "@/graphql/mutations.js";
import { generateClient } from "aws-amplify/api";
const client = generateClient();

import Snackbar from "@/components/Extras/MySnackbar.vue";

export default {
  props: {
    EditAdminDialog: Boolean,
    StoreObj: Object,
  },
  components: { Snackbar },
  data() {
    return {
      userStatus: "",
      SnackBarComponent: {},
      btnLoader: false,
    };
  },

  computed: {
    dialogOperation: {
      get() {
        return this.EditAdminDialog;
      },
    },
  },

  methods: {
    async editAdminMethod() {
      const isValid = await this.$refs.userForm.validate();
      if (isValid.valid) {
        try {
          this.btnLoader = true;
          const results = await client.graphql({
            query: editAdminStatus,
            variables: {
              input: {
                admin_user_id: this.StoreObj.user_id,
                action: this.userStatus,
              },
            },
          });
          let response = JSON.parse(results.data.editAdminStatus);
          if (response.status === 200) {
            this.SnackBarComponent = {
              SnackbarVModel: true,
              color: "text-green",
              Message: response.status_message,
            };
            this.btnLoader = false;
            this.EditAdminDialogEmit(2);
          }
        } catch (error) {
          this.btnLoader = false;
          this.SnackBarComponent = {
            SnackbarVModel: true,
            color: "text-red",
            Message: "Problem occured, try again!",
          };
          console.log("Error", error);
        }
      } else {
        this.SnackBarComponent = {
          SnackbarVModel: true,
          Message: "Kindly fill the form!",
          color: "text-red",
        };
      }
    },

    EditAdminDialogEmit(Toggle) {
      this.$refs.userForm.reset();
      this.$emit("clicked", Toggle);
    },
  },
};
</script>

<style scoped>
.closeBtn {
  position: absolute;
  right: 10px;
}
</style>
