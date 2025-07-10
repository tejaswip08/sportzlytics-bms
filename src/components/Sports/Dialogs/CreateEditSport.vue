<template>
  <div class="text-center pa-4">
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog v-model="dialogOperation" :width="500" persistent>
      <v-card elevation="0">
        <v-toolbar density="compact" color="primary" class="muktaFont">
          <v-toolbar-title>
            {{ StoreObj.action === "EDIT" ? "Edit Sport" : "Create Sport" }}
          </v-toolbar-title>
          <v-spacer />
          <v-btn
            icon
            flat
            class="closeBtn"
            @click="CreateEditSportDialogEmit(1)"
            ><v-icon color="white" size="small">mdi-close-circle</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pa-5 muktaFont">
          <v-form ref="sportForm">
            <div class="mt-3 mb-2 tableItemFont">
              <strong>{{
                StoreObj.action === "EDIT" ? "Sport Name" : "Enter Sport Name"
              }}</strong>
            </div>
            <v-text-field
              :readonly="StoreObj.action === 'EDIT'"
              v-model="sportName"
              density="compact"
              rounded
              variant="outlined"
              color="primary muktaFont"
              :rules="[(v) => !!v || 'Required']"
            />
          </v-form>
          <v-file-input
            ref="fileInput"
            v-show="false"
            v-model="imgFile"
            @change="get_files_input(imgFile)"
            dense
            rounded
            outlined
          />
          <div class="borderStyle">
            <v-card elevation="0" :height="140">
              <div v-show="tempImgURL === ''" class="mt-6">
                <v-img
                  :width="50"
                  src="@/assets/uploadImage-icon.png"
                  class="mx-auto"
                />
                <div class="d-flex justify-center">
                  <v-btn
                    color="primary"
                    dense
                    class="text-capitalize"
                    @click="enableFileInputMethod()"
                    >{{
                      StoreObj.action === "EDIT"
                        ? "Re-upload Image"
                        : "Upload Image"
                    }}</v-btn
                  >
                </div>
              </div>
              <div v-show="tempImgURL !== ''">
                <v-img
                  :src="tempImgURL"
                  :width="90"
                  :height="90"
                  class="mx-auto mt-2"
                />
                <div class="d-flex justify-center mt-2">
                  <v-btn
                    rounded
                    density="comfortable"
                    class="text-capitalize btnColorPrimary ml-2"
                    @click="removeImgFileMethod()"
                    >Remove & Update</v-btn
                  >
                </div>
              </div>
            </v-card>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :loading="btnLoader"
            density="compact"
            rounded
            class="text-capitalize btnColorPrimary"
            @click="CreateEditSportMethod()"
          >
            {{ StoreObj.action === "EDIT" ? "Save" : "Create "
            }}<v-icon size="17" color="white" class="pl-1">{{
              StoreObj.action === "EDIT" ? "mdi-bookmark" : " mdi-plus"
            }}</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="openCroppingDialog" :width="500" persistent>
      <v-card class="pt-5">
        <v-card-text>
          <div>
            <img
              ref="image"
              :src="tempImgURL"
              :width="300"
              :height="300"
              class="mx-auto"
            />
          </div>
          <div class="d-flex justify-end mt-5">
            <div class="mr-2">
              <v-btn
                variant="text"
                density="compact"
                rounded
                class="text-capitalize"
                style="color: #0981c5"
                @click="CancelCropMethod()"
                >Cancel</v-btn
              >
            </div>
            <div class="ml-2">
              <v-btn
                density="compact"
                rounded
                class="text-capitalize btnColorPrimary"
                @click="cropImage"
                >Crop<v-icon color="white" size="17" class="pl-1"
                  >mdi-crop</v-icon
                ></v-btn
              >
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { fileUpload } from "@/mixins/FileUpload.js";
import { create_edit_sport_mutations } from "@/mixins/CreateEditSportMutations.js";

import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";

import Snackbar from "@/components/Extras/MySnackbar.vue";
export default {
  mixins: [create_edit_sport_mutations, fileUpload],
  props: {
    CreateEditSportDialog: Boolean,
    StoreObj: Object,
  },
  components: { Snackbar },
  data() {
    return {
      sportName: "",
      imgFile: {},
      croppedFile: {},
      SnackBarComponent: {},
      apiResponse: undefined,
      btnLoader: false,
      tempImgURL: "",
      openCroppingDialog: false,
      count: 0,
    };
  },

  computed: {
    dialogOperation: {
      get() {
        return this.CreateEditSportDialog;
      },
    },
  },

  watch: {
    CreateEditSportDialog: {
      immediate: true,
      handler(val) {
        if (val && this.StoreObj?.action === "EDIT") {
          console.log("EDIT");
          this.sportName =
            this.StoreObj.sport_name.charAt(0).toUpperCase() +
            this.StoreObj.sport_name.slice(1);
          this.callApiToDispImg();
          this.count = 1;

          if (!this.imgFile) {
            this.imgFile = {};
          }
          this.imgFile.name = "NOT_NULL";
        }
      },
    },
  },

  methods: {
    get_files_input(imgFile) {
      if (imgFile) {
        this.openCroppingDialog = true;
        this.tempImgURL = URL.createObjectURL(imgFile);
        this.$nextTick(() => {
          this.initializeCropper();
        });
      }
    },

    callApiToDispImg() {
      this.tempImgURL = this.StoreObj.image_url;
      console.log("URL", this.tempURL);
      this.cropBtnHide = true;
    },

    initializeCropper() {
      if (this.cropper) {
        this.cropper.destroy();
      }
      const image = this.$refs.image;
      this.cropper = new Cropper(image, {
        aspectRatio: 1,
        autoCropArea: 1,
        viewMode: 1,
        background: false,
        modal: false,
        guides: false,
        highlight: false,
        responsive: true,
      });
    },

    cropImage() {
      const originalFileName = this.imgFile.name;
      const fileExtension = originalFileName.split(".").pop();
      const canvas = this.cropper.getCroppedCanvas({
        imageSmoothingQuality: "high",
      });
      canvas.toBlob(
        (blob) => {
          const fileSizeInKB = (blob.size / 1024).toFixed(2);
          console.log("Cropped image file size: " + fileSizeInKB + " KB");
          const newFileName =
            originalFileName.split(".")[0] + "." + fileExtension;
          this.croppedFile = new File([blob], newFileName, {
            type: `image/${fileExtension}`,
          });
          this.tempImgURL = URL.createObjectURL(blob);
          console.log("CROPPED_FILE_OBJECT", this.croppedFile);
        },
        `image/${fileExtension}`,
        1.0
      );
      this.openCroppingDialog = false;
    },

    enableFileInputMethod() {
      this.$refs.fileInput.value = null;
      this.$refs.fileInput.$el.querySelector("input").click();
    },

    removeImgFileMethod() {
      this.imgFile = {};
      (this.croppedFile = {}), (this.tempImgURL = "");
      this.count = 0;
    },

    CancelCropMethod() {
      this.openCroppingDialog = false;
      this.imgFile = {};
      (this.croppedFile = {}), (this.tempImgURL = "");
    },
    //

    async CreateEditSportMethod() {
      const isValid = await this.$refs.sportForm.validate();
      if (isValid.valid && "name" in this.croppedFile) {
        if (this.count === 0) {
          this.btnLoader = true;
          const now = new Date();
          const timestamp = now.toISOString().replace(/[:.-]/g, "");
          const fileName = this.croppedFile.name.replace(/\s+/g, "_");
          const filePath = `SPORTS_IMAGES/${timestamp}_${fileName}`;
          this.btnLoader = true;
          const uploadedKey = await this.CommonUploadFileMethod(
            filePath,
            this.croppedFile
          );

          const response = await this.createEditSportMethod(
            this.StoreObj.action,
            this.sportName,
            uploadedKey.key
          );
          if (response.status === 200) {
            this.btnLoader = false;
            this.SnackBarComponent = {
              SnackbarVModel: true,
              color: "text-green",
              Message: response.status_message,
            };

            this.CreateEditSportDialogEmit(2);

            this.btnLoader = false;
          }
          // }
        } else {
          this.btnLoader = true;
          const response = await this.createEditSportMethod(
            this.StoreObj.action,
            this.sportName,
            this.StoreObj.sport_icon
          );
          if (response.status === 200) {
            this.btnLoader = false;
            this.SnackBarComponent = {
              SnackbarVModel: true,
              color: "text-green",
              Message: response.status_message,
            };

            this.CreateEditSportDialogEmit(2);

            this.btnLoader = false;
          }
        }
      } else {
        this.SnackBarComponent = {
          SnackbarVModel: true,
          color: "text-red",
          Message: "Please upload new image",
        };
      }
    },
    CreateEditSportDialogEmit(Toggle) {
      try {
        this.$emit("clicked", Toggle, this.sportName.toLowerCase());
        this.$refs.sportForm.reset();
        this.imgFile = {};
        this.tempImgURL = "";
      } catch (error) {
        console.log("Error", error);
        this.$emit("clicked", Toggle);
      }
    },
  },
};
</script>

<style scoped>
.borderStyle {
  border-style: dashed;
}
</style>
