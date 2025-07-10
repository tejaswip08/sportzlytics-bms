import { uploadData, getUrl } from "aws-amplify/storage";
// import { Storage } from "aws-amplify";

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
            // onProgress: ({ transferredBytes, totalBytes }) => {
            //   // if (totalBytes) {
            //   //   console.log(
            //   //     `Upload progress ${Math.round(
            //   //       (transferredBytes / totalBytes) * 100
            //   //     )} %`
            //   //   );
            //   // }
            // },
          },
        }).result;
        // console.log("Result", result);
        return {
          status: "SUCCESS",
          key: result.path,
        };
      } catch (error) {
        // console.log("Error :NANTHU ", error);
        // console.log("Detailed Error:", JSON.stringify(error, null, 2));
        // if (error.response) {
        //   console.log("Error Response Data:", error.response.data);
        //   console.log("Error Response Status:", error.response.status);
        //   console.log("Error Response Headers:", error.response.headers);
        // }
        // if (error.request) {
        //   console.log("Error Request:", error.request);
        // }
      }
    },
  },
};
