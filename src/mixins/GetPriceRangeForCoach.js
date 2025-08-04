import { listPriceRangeForCoach } from "@/graphql/queries.js";
import { generateClient } from "aws-amplify/api";
const client = generateClient();

export const getPriceRangeForCoach = {
  data: () => ({
    dashboardInfo: {},
  }),
  methods: {
    async getPriceRangeForCoachMethod() {
      try {
        const result = await client.graphql({
          query: listPriceRangeForCoach,
        });
        this.priceRangeObj = JSON.parse(
          result.data.listPriceRangeForCoach
        ).data[0];
      } catch (error) {
        console.log("Error", error);
      }
    },
  },
};
