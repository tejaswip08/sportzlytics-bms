<template>
  <div class="text-center pa-4">
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog
      v-model="dialogOperation"
      :width="StoreObj.action === 'DELETE' ? 500 : 800"
      persistent
    >
      <v-card elevation="0" class="muktaFont">
        <v-toolbar density="compact" color="primary" class="muktaFont">
          <v-toolbar-title>
            {{
              StoreObj.action === "EDIT"
                ? "Edit"
                : StoreObj.action === "DELETE"
                ? "Delete"
                : "Create"
            }}
            Ad
          </v-toolbar-title>
          <v-spacer />
          <v-btn icon flat class="closeBtn" @click="CreateAdDialogEmit(1)"
            ><v-icon color="white" size="small">mdi-close-circle</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pa-5 muktaFont" v-if="StoreObj.action === 'DELETE'">
          <span
            >Are you sure want to delete
            <strong>{{ StoreObj.media_title }}</strong> ad?</span
          >
        </v-card-text>
        <v-card-text class="pa-5" v-else>
          <v-file-input
            v-model="file"
            density="compact"
            rounded
            variant="outlined"
            color="primary muktaFont"
            label="Click to upload file"
            @change="prevImage"
            accept="image/*"
          >
          </v-file-input>
          <div v-if="tempURL" class="mt-3 mb-3">
            <img
              ref="imageToCrop"
              :src="tempURL"
              alt="Preview"
              style="max-width: 100%"
              class="mx-auto"
            />
            <div class="mt-2" v-if="!cropBtnHide">
              <v-row>
                <v-col cols="12" lg="12" class="d-flex justify-end">
                  <v-btn
                    density="compact"
                    :loading="btnLoader"
                    rounded
                    class="text-capitalize btnColorPrimary"
                    @click="cropImage()"
                    >Crop</v-btn
                  >
                </v-col>
              </v-row>
            </div>
          </div>
          <img
            v-if="croppedImage"
            :src="croppedImage"
            alt="Cropped"
            style="max-width: 100%; margin-top: 10px"
            class="mb-5 mx-auto"
          />
          <v-form ref="form">
            <v-text-field
              v-model="adTitle"
              density="compact"
              rounded
              variant="outlined"
              color="primary muktaFont"
              label="Enter Title"
              :rules="[(v) => !!v || 'Required']"
            />
            <v-text-field
              v-model="adUrl"
              density="compact"
              rounded
              variant="outlined"
              color="primary muktaFont"
              label="Enter URL (Start with https://)"
              :rules="[(v) => !!v || 'Required']"
            ></v-text-field>

            <v-select
              v-model="targetedUsers"
              :items="targetedUsersItem"
              label="Targeted Users"
              density="compact"
              rounded
              variant="outlined"
              color="primary muktaFont"
              :rules="[(v) => !!v || 'Required']"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            density="compact"
            :loading="btnLoader"
            rounded
            class="text-capitalize btnColorPrimary"
            @click="createAdMethod()"
          >
            {{
              StoreObj.action === "CREATE"
                ? "Create"
                : StoreObj.action === "DELETE"
                ? "Delete"
                : "Save"
            }}<v-icon size="17" class="pl-1">
              {{ StoreObj.action === "CREATE" ? "mdi-plus" : "mdi-bookmark" }}
            </v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { addSponsoredVideos } from "@/graphql/mutations.js";
import { editSponsoredVideos } from "@/graphql/mutations.js";
import { generateClient } from "aws-amplify/api";
const client = generateClient();
import Snackbar from "@/components/Extras/MySnackbar.vue";
import { fileUpload } from "@/mixins/FileUpload.js";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";

export default {
  mixins: [fileUpload],
  props: {
    CreateAdDialog: Boolean,
    StoreObj: Object,
  },
  components: { Snackbar },
  data() {
    return {
      btnLoader: false,
      SnackBarComponent: {},
      file: {},
      adUrl: "",
      adTitle: "",
      targetedUsers: "",
      targetedUsersItem: ["User", "Coach", "Both"],
      tempURL: null,
      cropper: null,
      croppedImage: null,
      cropBtnHide: null,
    };
  },

  computed: {
    dialogOperation: {
      get() {
        return this.CreateAdDialog;
      },
    },
  },

  watch: {
    CreateAdDialog: {
      immediate: true,
      handler(val) {
        if (val) {
          if (this.StoreObj.action === "EDIT") {
            this.adTitle = this.StoreObj.media_title;
            this.adUrl = this.StoreObj.website_link;
            this.targetedUsers =
              this.StoreObj.target_users[0] +
              this.StoreObj.target_users.slice(1).toLowerCase();
            this.callApiToDispImg();
          }
        }
      },
    },
  },

  methods: {
    prevImage() {
      this.croppedImage = null;
      this.cropBtnHide = false;
      if (!this.file) return;
      this.tempURL = URL.createObjectURL(this.file);
      this.$nextTick(() => {
        if (this.cropper) {
          this.cropper.destroy();
        }
        const image = this.$refs.imageToCrop;
        this.cropper = new Cropper(image, {
          aspectRatio: 16 / 9,
          viewMode: 1,
          autoCropArea: 1,
        });
      });
    },

    cropImage() {
      if (this.cropper) {
        const canvas = this.cropper.getCroppedCanvas();
        this.croppedImage = canvas.toDataURL("image/jpeg");
        this.cropper.getCroppedCanvas().toBlob((blob) => {
          const originalFile = this.file;
          const croppedFile = new File([blob], originalFile.name, {
            type: blob.type,
            lastModified: Date.now(),
          });
          this.file = croppedFile;
          this.tempURL = null;
        }, "image/jpeg"); // or 'image/png'
      }
    },

    beforeDestroy() {
      if (this.cropper) {
        this.cropper.destroy();
      }
    },

    callApiToDispImg() {
      this.tempURL = this.StoreObj.image_url;
      console.log("URL", this.tempURL);
      this.cropBtnHide = true;
    },

    async createAdMethod() {
      let isValid;
      this.StoreObj.action !== "DELETE"
        ? (isValid = await this.$refs.form.validate())
        : null;
      if (
        this.StoreObj.action !== "DELETE" &&
        isValid.valid &&
        this.file.name
      ) {
        this.btnLoader = true;
        let uploadedKey;
        let extractedKey;
        const mutationName =
          this.StoreObj.action === "CREATE"
            ? addSponsoredVideos
            : editSponsoredVideos;
        const mutationNameString =
          this.StoreObj.action === "CREATE"
            ? "addSponsoredVideos"
            : "editSponsoredVideos";
        if (this.file?.name) {
          const now = new Date();
          const timestamp = now.toISOString().replace(/[:.-]/g, "");
          const fileName = this.file.name.replace(/\s+/g, "_");
          const filePath = `AD_IMAGES/${timestamp}_${fileName}`;
          this.btnLoader = true;
          uploadedKey = await this.CommonUploadFileMethod(filePath, this.file);
        } else {
          extractedKey = this.tempURL.split("public/")[1].split("?")[0];
        }
        try {
          const result = await client.graphql({
            query: mutationName,
            variables: {
              input: {
                sponsor_id:
                  this.StoreObj.action === "EDIT"
                    ? this.StoreObj.sponsor_id
                    : undefined,
                media_title: this.adTitle,
                website_link: this.adUrl.includes("https://")
                  ? this.adUrl
                  : `https://${this.adUrl}`,
                s3_key: this.file?.name
                  ? `${uploadedKey.key}`
                  : this.StoreObj.s3_key,
                target_users: this.targetedUsers.toUpperCase(),
                action: this.StoreObj.action === "EDIT" ? "UPDATE" : undefined,
              },
            },
          });
          const response = JSON.parse(result.data[mutationNameString]);
          if (response.status === 200) {
            this.CreateAdDialogEmit(2);
            this.btnLoader = false;
            this.SnackBarComponent = {
              SnackbarVModel: true,
              color: "text-green",
              Message: response.status_message,
            };
          }
        } catch (error) {
          this.btnLoader = false;
          console.log("ERROR", error);
        }
      } else {
        try {
          this.btnLoader = true;
          const result = await client.graphql({
            query: editSponsoredVideos,
            variables: {
              input: {
                sponsor_id: this.StoreObj.sponsor_id,
                action: "DELETE",
              },
            },
          });
          const response = JSON.parse(result.data.editSponsoredVideos);
          console.log("DELETE_RESP", response);
          if (response.status === 200) {
            this.btnLoader = false;
            this.SnackBarComponent = {
              SnackbarVModel: true,
              color: "text-green",
              Message: response.status_message,
            };
            this.CreateAdDialogEmit(2);
          }
        } catch (error) {
          this.btnLoader = false;
          console.log("ERROR", error);
        }
      }
    },
    CreateAdDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
      if (this.StoreObj.action !== "DELETE") {
        this.$refs.form.reset();
      }
      this.file = {};
      this.tempURL = null;
      this.cropper = null;
      this.croppedImage = null;
      this.cropBtnHide = null;
    },
  },
};
</script>
