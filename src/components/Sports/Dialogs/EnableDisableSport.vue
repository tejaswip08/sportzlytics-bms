<template>
  <div class="text-center pa-4">
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog v-model="dialogOperation" :width="500" persistent>
      <v-card elevation="0">
        <v-toolbar density="compact" color="primary" class="muktaFont">
          <v-toolbar-title>
            {{
              StoreObj.sport_status === "ACTIVE"
                ? "Disable Sport"
                : "Enable Sport"
            }}
          </v-toolbar-title>
          <v-spacer />
          <v-btn
            icon
            flat
            class="closeBtn"
            @click="EnableDisableSportDialogEmit(1)"
            ><v-icon color="white" size="small">mdi-close-circle</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pa-5 muktaFont">
          <div class="mt-3 mb-2">
            Do you want to
            {{ StoreObj.sport_status === "ACTIVE" ? "disable" : "enable" }}
            <strong>{{ StoreObj.sport_name }}</strong
            >?
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :loading="btnLoader"
            density="compact"
            rounded
            class="text-capitalize btnColorPrimary"
            @click="
              enableDisableSportMethod(
                StoreObj.sport_status === 'ACTIVE' ? 'DISABLE' : 'ENABLE'
              )
            "
          >
            {{ StoreObj.sport_status === "ACTIVE" ? "Disable" : "Enable"
            }}<v-icon size="17" class="pl-1">{{
              StoreObj.sport_status === "ACTIVE"
                ? "mdi-alert-circle"
                : "mdi-check-circle"
            }}</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { create_edit_sport_mutations } from "@/mixins/CreateEditSportMutations.js";

import Snackbar from "@/components/Extras/MySnackbar.vue";

export default {
  mixins: [create_edit_sport_mutations],
  props: {
    EnableDisableSportDialog: Boolean,
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
        return this.EnableDisableSportDialog;
      },
    },
  },

  methods: {
    async enableDisableSportMethod(ACTION) {
      this.btnLoader = true;
      const response = await this.createEditSportMethod(
        ACTION,
        this.StoreObj.sport_name
      );
      if (response.status === 200) {
        this.btnLoader = false;
        this.SnackBarComponent = {
          SnackbarVModel: true,
          color: "green--text",
          Message: response.status_message,
        };
        this.btnLoader = false;
        this.EnableDisableSportDialogEmit(2);
      } else {
        this.btnLoader = false;
      }
    },

    EnableDisableSportDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>

<style scoped>
.borderStyle {
  border-style: dashed;
}
</style>
