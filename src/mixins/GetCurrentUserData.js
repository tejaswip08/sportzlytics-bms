// api/user.js
import { getCurrentUserDetails } from "@/graphql/queries.js";
import { generateClient } from "aws-amplify/api";
const client = generateClient();

export async function getCurrentUserMethod() {
  try {
    const result = await client.graphql({ query: getCurrentUserDetails });
    return JSON.parse(result.data.getCurrentUserDetails).data.items;
  } catch (error) {
    return "/";
    //
  }
}
