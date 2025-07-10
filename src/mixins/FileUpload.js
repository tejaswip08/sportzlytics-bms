import { uploadData, getUrl } from "aws-amplify/storage";

export const fileUpload = {
  methods: {
    async CommonUploadFileMethod(file_key, file) {
      try {
        const result = await uploadData({
          path: file_key,
          data: file,
          options: {
            contentType: file.type,
            contentDisposition: "inline",
          },
        }).result;
        return {
          status: "SUCCESS",
          key: result.path,
        };
      } catch (error) {}
    },
  },
};
