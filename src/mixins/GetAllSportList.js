import { listAllSportsCategory } from "@/graphql/queries.js";
import { generateClient } from "aws-amplify/api";
const client = generateClient();

export const GetAllSport = {
  data() {
    return {
      sportNames: [],
    };
  },
  methods: {
    async GetAllSportName(STATUS) {
      try {
        const result = await client.graphql({
          query: listAllSportsCategory,
          variables: { sport_status: STATUS },
        });
        const sportData = JSON.parse(result.data.listAllSportsCategory).data;
        this.sportNames = sportData.map((item) => item.sport_name);
        return sportData;
      } catch (error) {
        console.log("Error", error);
      }
    },
  },
};
