import { retrieveDashboardData } from "@/graphql/queries.js";
import { generateClient } from "aws-amplify/api";
const client = generateClient();

export const DashboardInfo = {
  data: () => ({
    dashboardInfo: {},
  }),
  methods: {
    async DashboardInfoMethod() {
      try {
        const result = await client.graphql({
          query: retrieveDashboardData,
        });
        console.log(
          "DASHBOARD_CONTENT",
          JSON.parse(result.data.retrieveDashboardData).data
        );
        this.dashboardInfo = JSON.parse(
          result.data.retrieveDashboardData
        ).data[0];
      } catch (error) {
        console.log("Error", error);
      }
    },
  },
};
