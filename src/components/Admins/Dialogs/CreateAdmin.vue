<template>
  <div class="text-center pa-4">
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog v-model="dialogOperation" max-width="500" persistent>
      <v-card elevation="0">
        <v-toolbar density="compact" color="primary" class="muktaFont">
          <v-toolbar-title> Create Admin </v-toolbar-title>
          <v-spacer />
          <v-btn icon flat class="closeBtn" @click="CreateAdminDialogEmit(1)"
            ><v-icon color="white" size="small">mdi-close-circle</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pa-5 muktaFont">
          <v-form ref="userForm">
            <div class="mt-3 mb-2 tableItemFont">
              <strong>Enter user name</strong>
            </div>
            <v-text-field
              v-model="userName"
              density="compact"
              rounded
              variant="outlined"
              color="primary muktaFont"
              :rules="[(v) => !!v || 'Required']"
            >
            </v-text-field>
            <div class="mt-3 mb-2 tableItemFont">
              <strong>Enter user email</strong>
            </div>
            <v-text-field
              v-model="userEmail"
              density="compact"
              rounded
              variant="outlined"
              color="primary muktaFont"
              :rules="[(v) => /.+@.+/.test(v) || 'E-mail must be valid']"
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
            @click="createAdminMethod()"
          >
            Create<v-icon color="white" size="15" class="pl-1">mdi-plus</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { createAdmin } from "@/graphql/mutations.js";
import { generateClient } from "aws-amplify/api";
const client = generateClient();

import Snackbar from "@/components/Extras/MySnackbar.vue";

export default {
  components: { Snackbar },
  props: {
    CreateAdminDialog: Boolean,
  },
  components: { Snackbar },
  data() {
    return {
      userName: "",
      userEmail: "",
      SnackBarComponent: {},
      btnLoader: false,
    };
  },

  computed: {
    dialogOperation: {
      get() {
        return this.CreateAdminDialog;
      },
    },
  },

  methods: {
    async createAdminMethod() {
      const isValid = await this.$refs.userForm.validate();
      if (isValid.valid) {
        try {
          this.btnLoader = true;
          const result = await client.graphql({
            query: createAdmin,
            variables: {
              input: {
                user_name: this.userName,
                user_email_id: this.userEmail,
              },
            },
          });
          const response = JSON.parse(result.data.createAdmin);
          if (response.status === 200) {
            this.SnackBarComponent = {
              SnackbarVModel: true,
              Message: response.status_message,
              color: "text-green",
            };
            this.btnLoader = false;
            this.CreateAdminDialogEmit(2);
          }
        } catch (error) {
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

    CreateAdminDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
