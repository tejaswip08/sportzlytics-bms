<template>
  <div class="text-center">
    <v-snackbar v-model="SnackBarComponent.SnackbarVModel" top timeout="3000">
      <strong>
        <p class="muktaFont" :class="SnackBarComponent.color">
          {{ SnackBarComponent.Message }}
        </p></strong
      >
    </v-snackbar>
  </div>
</template>

<script>
export default {
  props: {
    SnackBarComponent: Object,
  },
  data: () => ({
    SnackbarVModel: true,
  }),

  methods: {
    snackbarClose() {
      this.SnackBarComponent = {};
    },
  },
};
</script>
