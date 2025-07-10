// const axios = require("axios");

import { generateClient } from "aws-amplify/api";
const client = generateClient();
import { listCabinetVideos } from "@/graphql/queries.js";

export const GetAllCabinetVideos = {
  methods: {
    async GetAllCabinetVideosMethod() {
      try {
        const result = await client.graphql({
          query: listCabinetVideos,
        });
        const response = JSON.parse(result.data.listCabinetVideos).data;
        return response;
      } catch (error) {}
    },
  },
};
