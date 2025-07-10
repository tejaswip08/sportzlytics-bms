<template>
  <div class="text-center pa-4">
    <v-dialog v-model="dialogOperation" max-width="800" persistent>
      <v-card elevation="0">
        <v-toolbar density="compact" color="primary" class="muktaFont">
          <v-toolbar-title> Attachments </v-toolbar-title>
          <v-spacer />
          <v-btn
            icon
            flat
            class="closeBtn"
            @click="ViewCoachCertificatesDialogEmit(1)"
            ><v-icon color="white" size="small">mdi-close-circle</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pa-5 muktaFont">
          <div
            v-if="AttachementURL.includes('.mp4')"
            class="d-flex justify-center"
          >
            <video width="640" height="360" controls>
              <source :src="AttachementURL" type="video/mp4" />
            </video>
          </div>
          <div v-else>
            <v-img :src="AttachementURL" :width="800" :height="400" />
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    ViewCoachCertificatesDialog: Boolean,
    AttachementURL: String,
  },

  computed: {
    dialogOperation: {
      get() {
        return this.ViewCoachCertificatesDialog;
      },
    },
  },

  methods: {
    ViewCoachCertificatesDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
