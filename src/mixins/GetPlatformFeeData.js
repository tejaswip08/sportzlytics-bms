import { listBmsSettings } from "@/graphql/queries.js";
import { generateClient } from "aws-amplify/api";
const client = generateClient();

export const getPlatformFeeData = {
  data: () => ({
    dashboardInfo: {},
  }),
  methods: {
    async getPlatformFeeDataMethod() {
      try {
        const result = await client.graphql({
          query: listBmsSettings,
        });
        const response = JSON.parse(result.data.listBmsSettings).data[0];
        return response;
      } catch (error) {
        console.log("Error", error);
      }
    },
  },
};
