import { getUrl } from "aws-amplify/storage";
export const getFileFromStorage = {
  methods: {
    async linkToStorageFile(file_url) {
      try {
        const result = await getUrl({
          path: file_url,
        });
        console.log("signed URL: ", result);
        return result.url.href;
      } catch (error) {
        //
      } finally {
        this.enableLoader = false;
      }
    },
  },
};
