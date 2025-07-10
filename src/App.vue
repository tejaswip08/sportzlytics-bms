<template>
  <v-app class="v-app">
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
.v-app {
  font-family: "Mukta", sans-serif;
}
.menuFont {
  font-size: 15px !important;
  font-weight: 600 !important;
}

.headingFont {
  font-size: 25px !important;
  font-weight: 700 !important;
}

.muktaFont {
  font-family: "Mukta", sans-serif !important;
}

.poppinsFont {
  font-family: "Poppins", sans-serif !important;
}
.textFieldWidth {
  max-width: 200px !important;
}

.btnColorPrimary {
  background-color: #0981c5 !important;
  color: white !important;
}

.customTable th {
  font-size: 13px !important;
  font-weight: bold !important;
}

.tableItemFont {
  font-size: 13px !important;
}

.v-data-table tbody tr:hover {
  background-color: #d8eaf4 !important;
  transition: 0.5s ease;
}

.loginFont {
  font-size: 23px !important;
  font-weight: 700;
}

.font20px {
  font-size: 20px !important;
  font-weight: 700;
}

.purple-color {
  color: #0981c5 !important;
}
</style>
