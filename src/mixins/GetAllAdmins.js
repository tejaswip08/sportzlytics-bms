import { listAdmins } from "@/graphql/queries.js";
import { generateClient } from "aws-amplify/api";
const client = generateClient();

export const GetAllAdmins = {
  methods: {
    async GetAdminsMethod() {
      try {
        const result = await client.graphql({ query: listAdmins });
        return JSON.parse(result.data.listAdmins).data;
      } catch (error) {
        console.log("Error", error);
      }
    },
  },
};
