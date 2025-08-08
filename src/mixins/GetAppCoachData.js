import { listAppUsers } from "@/graphql/queries.js";
import { generateClient } from "aws-amplify/api";
const client = generateClient();

export const GetAllAppCoachData = {
  methods: {
    async GetAllAppCoachDataMethod(sortBy, nextToken, user_type) {
      try {
        const result = await client.graphql({
          query: listAppUsers,
          variables: {
            input: {
              user_status: sortBy,
              next_token: nextToken || undefined,
              user_type: user_type,
            },
          },
        });
        const response = JSON.parse(result.data.listAppUsers);
        // if (response !== undefined) {
        console.log("APP_USE", response.data.items);
        return response.data.items;
        // }
      } catch (error) {
        console.log("Error", error);
      }
    },
  },
};
