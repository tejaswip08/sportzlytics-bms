<template>
  <div class="muktaFont">
    <v-container fluid class="pa-0">
      <v-row class="ma-2">
        <v-col cols="12" lg="12" md="12" sm="12" xs="12">
          <div class="headingFont">Dashboard</div>
        </v-col>
      </v-row>

      <div
        style="
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: center;
        "
      >
        <div class="ma-4">
          <v-card
            :width="250"
            :height="200"
            class="pa-4 d-flex flex-column justify-center align-center"
            elevation="5"
          >
            <span class="dashboardHeading"
              >Coaches
              <v-icon size="25" class="pl-1">mdi-hat-fedora</v-icon></span
            >
            <p class="text-center">
              <span class="dashoboardCount">{{ coachCount || 0 }}</span>
            </p>
            <div class="flex-class">
              <div class="mr-3">
                <p>
                  Active Coaches:
                  <span style="color: #0981c5">{{
                    dashboardInfo.active_coaches
                  }}</span>
                </p>
              </div>
              <!-- <div class="ml-3">
                <p>
                  Incomplete Profile Coaches:
                  <span style="color: #0981c5">
                    {{ dashboardInfo.incomplete_profile_coaches }}</span
                  >
                </p>
              </div> -->
              <div class="mr-3">
                <p>
                  Pending Coaches:
                  <span style="color: #0981c5">
                    {{ dashboardInfo.pending_coaches }}</span
                  >
                </p>
              </div>
              <!-- <div class="ml-3">
                  <p>
                    Total Coaches:
                    <span style="color: #0981c5">
                      {{ dashboardInfo.total_coaches }}</span
                    >
                  </p>
                </div> -->
            </div>
          </v-card>
        </div>
        <!-- <div class="ma-4">
          <v-card
            :width="300"
            :height="200"
            class="pa-4 d-flex flex-column justify-center align-center"
            elevation="5"
          >
            <span class="dashboardHeading"
              >Sports <v-icon size="25" class="pl-1">mdi-soccer</v-icon></span
            >
            <p class="text-center">
              <span class="dashoboardCount">{{ sportsCount }}</span>
            </p>
            <div class="flex-class">
              <div class="mr-3">
                <p>
                  Active Sports:
                  <span style="color: #0981c5">{{
                    dashboardInfo.active_sports
                  }}</span>
                </p>
              </div>
              <div class="ml-3">
                <p>
                  Disabled Sports:
                  <span style="color: #0981c5">{{
                    dashboardInfo.disabled_sports
                  }}</span>
                </p>
              </div>
              <div></div>
            </div>
          </v-card>
        </div> -->
        <!-- <div class="ma-4">
          <v-card
            :width="300"
            :height="200"
            class="pa-4 d-flex flex-column justify-center align-center"
            elevation="5"
          >
            <span class="dashboardHeading"
              >Admins
              <v-icon size="25" class="pl-1">mdi-account-multiple</v-icon></span
            >
            <p class="text-center">
              <span class="dashoboardCount">{{ adminsCount }}</span>
            </p></v-card
          >
        </div> -->
        <div class="ma-4">
          <v-card
            :width="300"
            :height="200"
            class="pa-4 d-flex flex-column justify-center align-center"
            elevation="5"
          >
            <span class="dashboardHeading"
              >Analysis Requests
              <v-icon size="25" class="pl-1">mdi-poll</v-icon></span
            >
            <p class="text-center">
              <span class="dashoboardCount">{{ analysyisCount }}</span>
            </p></v-card
          >
        </div>
        <div class="ma-4">
          <v-card
            :width="300"
            :height="200"
            class="pa-4 d-flex flex-column justify-center align-center"
            elevation="5"
          >
            <span class="dashboardHeading"
              >Reports
              <v-icon size="25" class="pl-1">mdi-file-delimited</v-icon></span
            >
            <p class="text-center">
              <span class="dashoboardCount">{{ reportsCount }}</span>
            </p></v-card
          >
        </div>
        <div class="ma-4">
          <v-card
            :width="300"
            :height="200"
            class="pa-4 d-flex flex-column justify-center align-center"
            elevation="5"
          >
            <span class="dashboardHeading"
              >Users
              <v-icon size="25" class="pl-1">mdi-account-multiple</v-icon></span
            >
            <p class="text-center">
              <span class="dashoboardCount">{{ usersCount }}</span>
            </p></v-card
          >
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
import { DashboardInfo } from "@/mixins/GetDashboardInfo.js";

export default {
  mixins: [DashboardInfo],
  data: () => ({
    coachCount: 0,
    sportsCount: 0,
    adminsCount: 0,
    usersCount: 0,
    reportsCount: 0,
    analysyisCount: 0,
  }),

  async mounted() {
    await this.DashboardInfoMethod();
    // this.coachCount = this.dashboardInfo.total_sports;
    let intervalId = setInterval(() => {
      if (
        this.coachCount !== this.dashboardInfo.total_coaches ||
        // this.sportsCount !== this.dashboardInfo.total_sports ||
        // this.adminsCount !== this.dashboardInfo.total_admins ||
        this.usersCount !== this.dashboardInfo.total_users ||
        this.reportsCount !== this.dashboardInfo.total_reports ||
        this.analysyisCount !== this.dashboardInfo.total_analysis_requests
      ) {
        if (this.coachCount !== this.dashboardInfo.total_coaches) {
          this.coachCount += 1;
        }
        // if (this.sportsCount !== this.dashboardInfo.total_sports) {
        //   this.sportsCount += 1;
        // }
        // if (this.adminsCount !== this.dashboardInfo.total_admins) {
        //   this.adminsCount += 1;
        // }
        if (this.usersCount !== this.dashboardInfo.total_users) {
          this.usersCount += 1;
        }
        if (this.reportsCount !== this.dashboardInfo.total_reports) {
          this.reportsCount += 1;
        }
        if (
          this.analysyisCount !== this.dashboardInfo.total_analysis_requests
        ) {
          this.analysyisCount += 1;
        }
      } else {
        clearInterval(intervalId);
      }
    }, 20);
  },
};
</script>

<style>
.flex-class {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.dashboardHeading {
  font-size: 20px;
  color: grey !important;
}

.dashoboardCount {
  font-size: 40px;
}

/* .cardCustomClass {
    max-width: 400px;
    max-height: 200px;
    width: 100%;
    height: 100%;
  } */
</style>
