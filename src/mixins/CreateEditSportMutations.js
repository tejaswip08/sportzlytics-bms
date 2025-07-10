import { createSportsCategory } from "@/graphql/mutations.js";
import { editSportsCategory } from "@/graphql/mutations.js";
import { generateClient } from "aws-amplify/api";
const client = generateClient();

export const create_edit_sport_mutations = {
  methods: {
    async createEditSportMethod(ACTION, SPORT_NAME, IMAGE_KEY) {
      const mutation_name =
        ACTION === "EDIT"
          ? editSportsCategory
          : ACTION === "DISABLE"
          ? editSportsCategory
          : ACTION === "ENABLE"
          ? editSportsCategory
          : createSportsCategory;
      const mutation_name_string =
        ACTION === "EDIT"
          ? "editSportsCategory"
          : ACTION === "DISABLE"
          ? "editSportsCategory"
          : ACTION === "ENABLE"
          ? "editSportsCategory"
          : "createSportsCategory";
      try {
        const result = await client.graphql({
          query: mutation_name,
          variables: {
            input: {
              sport_name: SPORT_NAME,
              sport_icon:
                ACTION === "EDIT"
                  ? IMAGE_KEY
                  : ACTION === "CREATE"
                  ? IMAGE_KEY
                  : undefined,
              action:
                ACTION === "EDIT"
                  ? "EDIT"
                  : ACTION === "ENABLE"
                  ? "ENABLE"
                  : ACTION === "DISABLE"
                  ? "DISABLE"
                  : undefined,
            },
          },
        });
        const response = JSON.parse(result.data[mutation_name_string]);
        return response;
      } catch (error) {
        console.log("Error", error);
      }
    },
  },
};
