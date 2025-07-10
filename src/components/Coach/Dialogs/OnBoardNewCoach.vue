<template>
  <div class="text-center pa-4">
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog v-model="dialogOperation" max-width="1000" persistent>
      <v-card elevation="0">
        <v-toolbar density="compact" color="primary" class="muktaFont">
          <v-toolbar-title> Onboard Coach </v-toolbar-title>
          <v-spacer />
          <v-btn icon flat class="closeBtn" @click="OnboardCoachDialogEmit(1)"
            ><v-icon color="white" size="small">mdi-close-circle</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pa-5 muktaFont">
          <div class="text-red mb-2">
            <strong> Enter the details to onboard a coach </strong>
          </div>

          <div>
            <v-img
              :src="
                coachPfpFileObj?.name
                  ? pfpBlobUrl
                  : require('@/assets/user-icon.png')
              "
              :width="100"
              cover
              class="mx-auto"
            />
            <v-btn
              v-if="pfpBlobUrl == ''"
              icon
              flat
              color="primary"
              density="compact"
              style="position: absolute; top: 165px; right: 440px"
              @click="triggerPfpFileInputMethod()"
            >
              <v-icon size="small" color="white">mdi-plus</v-icon>
            </v-btn>
            <div v-else class="d-flex justify-center mb-2">
              <v-btn
                icon
                flat
                @click="(pfpBlobUrl = ''), (coachPfpFileObj = {})"
              >
                <v-icon size="small" color="red">mdi-delete</v-icon>
              </v-btn>
            </div>
            <v-file-input
              v-show="false"
              v-model="coachPfpFileObj"
              ref="profilePic"
              @change="convertPfpToBlob(coachPfpFileObj)"
            ></v-file-input>
          </div>
          <v-form ref="form" class="mt-4">
            <v-row align="center">
              <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                <v-text-field
                  v-model="coachName"
                  label="Name*"
                  density="compact"
                  rounded
                  variant="outlined"
                  color="primary muktaFont"
                  :rules="[(v) => !!v || 'Required']"
                >
                </v-text-field>
                <v-text-field
                  v-model="coachPhNo"
                  label="Phone Number"
                  density="compact"
                  rounded
                  variant="outlined"
                  color="primary muktaFont"
                  :rules="[
                    (v) => !!v || 'Required',
                    (v) =>
                      /^\+91\d{10}$/.test(v) ||
                      'Enter number in format +910123456789 with no spaces',
                  ]"
                />
                <v-text-field
                  v-model="coachEmail"
                  label="Email*"
                  density="compact"
                  rounded
                  variant="outlined"
                  color="primary muktaFont"
                  :rules="[(v) => !!v || 'Required']"
                >
                </v-text-field>
                <v-select
                  v-model="coachSportsExpertise"
                  :items="activeSportsName"
                  label="Sports Expertise*"
                  density="compact"
                  rounded
                  variant="outlined"
                  color="primary muktaFont"
                  :rules="[(v) => !!v || 'Required']"
                >
                </v-select>
                <v-text-field
                  v-model="coachCountry"
                  label="Country*"
                  density="compact"
                  rounded
                  variant="outlined"
                  color="primary muktaFont"
                  :rules="[(v) => !!v || 'Required']"
                >
                </v-text-field>
                <v-text-field
                  v-model="coachState"
                  label="State*"
                  density="compact"
                  rounded
                  variant="outlined"
                  color="primary muktaFont"
                  :rules="[(v) => !!v || 'Required']"
                >
                </v-text-field>
                <v-text-field
                  v-model="coachCity"
                  label="City*"
                  density="compact"
                  rounded
                  variant="outlined"
                  color="primary muktaFont"
                  :rules="[(v) => !!v || 'Required']"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                <v-textarea
                  v-model="coachPfDesc"
                  label="Profile Description*"
                  density="compact"
                  variant="outlined"
                  color="primary muktaFont"
                  :rules="[(v) => !!v || 'Required']"
                >
                </v-textarea>
                <v-text-field
                  v-model="coachAge"
                  label="Age*"
                  density="compact"
                  rounded
                  variant="outlined"
                  color="primary muktaFont"
                  :rules="[(v) => !!v || 'Required']"
                >
                </v-text-field>
                <v-text-field
                  v-model="coachExp"
                  label="Experience*"
                  density="compact"
                  rounded
                  variant="outlined"
                  color="primary muktaFont"
                  :rules="[(v) => !!v || 'Required']"
                >
                </v-text-field>
                <v-text-field
                  v-model="coachLanguagesInput"
                  label="Languages Known* (Eg: English, Hindi)"
                  density="compact"
                  rounded
                  variant="outlined"
                  color="primary muktaFont"
                  :rules="[
                    (v) => !!v || 'Required',
                    (v) =>
                      /^[a-zA-Z]+(?:\s?[a-zA-Z]+)?(,\s*[a-zA-Z]+(?:\s?[a-zA-Z]+)?)*$/.test(
                        v
                      ) ||
                      'Enter valid comma-separated languages only (e.g. English, Hindi)',
                  ]"
                />
                <v-text-field
                  v-model="coachCharges"
                  label="Charges*"
                  density="compact"
                  rounded
                  variant="outlined"
                  color="primary muktaFont"
                  :rules="[(v) => !!v || 'Required']"
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-form>
          <div>
            <v-select
              v-model="attachmentType"
              :items="attachmentTypeItems"
              label="Select attachment type to upload"
              density="compact"
              rounded
              variant="outlined"
              color="primary muktaFont"
            ></v-select>
            <div
              style="border: 1px solid grey; border-style: dashed"
              v-if="attachmentType"
            >
              <v-card
                elevation="0"
                @click="uploadAttachmntsMethod()"
                class="pa-5"
              >
                <v-img
                  src="@/assets/image-upload2.png"
                  :width="80"
                  class="mx-auto"
                />
                <div class="text-center">
                  Click here to upload attachments...
                </div>
              </v-card>
              <v-file-input
                v-model="attachemntFileInputArray"
                multiple
                v-show="false"
                ref="attachemntFileInput"
              ></v-file-input>
              <v-data-table
                v-if="selectedAttachmentItems.length > 0"
                density="compact"
                :headers="selectedAttachmentsHeader"
                :items="selectedAttachmentItems"
                class="customTable tableItemFont"
                hide-default-footer
              >
                <template v-slot:[`item.sl_no`]="{ item, index }">
                  <div>
                    {{ index + 1 }}
                  </div>
                </template>
                <template v-slot:[`item.delete`]="{ item, index }">
                  <div>
                    <v-btn
                      icon
                      flat
                      @click="
                        deleteAttachmentMethod(
                          index,
                          item.file_name,
                          item.attachment_type
                        )
                      "
                    >
                      <v-icon size="small" color="red">mdi-delete</v-icon>
                    </v-btn>
                  </div>
                </template>
              </v-data-table>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <div style="display: grid">
            <!-- <div v-if="btnLoader">Uploading:</div> -->
            <div>
              <v-btn
                density="compact"
                :loading="btnLoader"
                rounded
                class="text-capitalize btnColorPrimary"
                @click="onboardCoachMethod()"
              >
                Onboard
              </v-btn>
            </div>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { onBoardCoach } from "@/graphql/mutations.js";
import { generateClient } from "aws-amplify/api";
const client = generateClient();

import { GetAllSport } from "@/mixins/GetAllSportList.js";
import { fileUpload } from "@/mixins/FileUpload.js";

import Snackbar from "@/components/Extras/MySnackbar.vue";
export default {
  mixins: [fileUpload, GetAllSport],
  props: {
    OnboardCoachDialog: Boolean,
  },
  components: { Snackbar },
  data() {
    return {
      coachPhNo: "",
      coachName: "",
      coachCharges: "",
      coachLanguages: [],
      coachLanguagesInput: "",
      coachExp: "",
      coachAge: "",
      coachPfDesc: "",
      coachCity: "",
      coachState: "",
      coachCountry: "",
      coachSportsExpertise: "",
      coachEmail: "",
      pfpBlobUrl: "",
      attachmentType: "",
      attachmentTypeItems: ["Cover Image", "Profile Video", "Certificates"],
      selectedAttachmentItems: [],
      selectedAttachmentsHeader: [
        { title: "Sl No", key: "sl_no" },
        { title: "File Name", key: "file_name" },
        { title: "File Type", key: "file_type" },
        { title: "Attachment Type", key: "attachment_type" },
        { title: "Delete", key: "delete" },
      ],
      coachPfpFileObj: {},
      attachemntFileInputArray: [],
      coverImgAttObj: {},
      certificateAttArray: [],
      profileVideoAttArray: [],
      SnackBarComponent: {},
      activeSportsName: [],
      btnLoader: false,
    };
  },

  computed: {
    dialogOperation: {
      get() {
        return this.OnboardCoachDialog;
      },
    },
  },

  watch: {
    OnboardCoachDialog: {
      immediate: true,
      async handler(val) {
        if (val) {
          const sportsData = await this.GetAllSportName("ACTIVE");
          sportsData.forEach((item) => {
            if (item?.sport_name) {
              const singleSport =
                item.sport_name.slice(0, 1).toUpperCase() +
                item.sport_name.slice(1);
              this.activeSportsName.push(singleSport);
            }
          });
        }
      },
    },

    coachLanguagesInput(val) {
      this.coachLanguages = val
        ? val
            .split(",")
            .map((lang) => lang.trim())
            .filter(Boolean)
        : [];
    },
    attachemntFileInputArray(val) {
      if (val && val.length > 0) {
        // console.log("SELECTED_ATTACHMENT", val);
        if (this.attachmentType === "Cover Image") {
          this.coverImgAttObj = val[0];
          const obj = {
            file_name: this.coverImgAttObj.name,
            file_type: this.coverImgAttObj.type,
            attachment_type: this.attachmentType,
          };
          this.selectedAttachmentItems.push(obj);

          //   console.log("COVER_IMAG_OBJ", this.coverImgAttObj);
        } else if (this.attachmentType === "Profile Video") {
          this.profileVideoAttArray.push(...val);
          val.forEach((file) => {
            const obj = {
              file_name: file.name,
              file_type: file.type,
              attachment_type: this.attachmentType,
            };
            this.selectedAttachmentItems.push(obj);
          });
          //   console.log("PR_VID_ATT", this.profileVideoAttArray);
        } else {
          this.certificateAttArray.push(...val);
          val.forEach((file) => {
            const obj = {
              file_name: file.name,
              file_type: file.type,
              attachment_type: this.attachmentType,
            };
            this.selectedAttachmentItems.push(obj);
          });
          //   console.log("CER_ATT", this.certificateAttArray);
        }
      }
    },

    // attachemntFileInputArray(val) {
    //   if (!val || val.length === 0) return;
    //   const attachmentType = this.attachmentType;
    //   const processFile = (file) => ({
    //     file_name: file.name,
    //     file_type: file.type,
    //     attachment_type: attachmentType,
    //   });
    //   if (attachmentType === "Cover Image") {
    //     this.coverImgAttObj = val[0];
    //     this.selectedAttachmentItems.push(processFile(val[0]));
    //   } else if (attachmentType === "Profile Video") {
    //     this.profileVideoAttArray = val;
    //     this.selectedAttachmentItems.push(...val.map(processFile));
    //   } else {
    //     this.certificateAttArray = val;
    //     this.selectedAttachmentItems.push(...val.map(processFile));
    //   }

    //   this.$nextTick(() => {
    //     this.attachemntFileInputArray = [];
    //   });
    // },
  },

  methods: {
    triggerPfpFileInputMethod() {
      this.$refs.profilePic.$el.querySelector('input[type="file"]').click();
    },

    uploadAttachmntsMethod() {
      this.$refs.attachemntFileInput.$el
        .querySelector('input[type="file"]')
        .click();
    },

    convertPfpToBlob(file) {
      this.pfpBlobUrl = URL.createObjectURL(file);
      //   console.log("TEMP_BLOB", this.pfpBlobUrl);
    },

    deleteAttachmentMethod(index, fileName, attachmentType) {
      this.selectedAttachmentItems.splice(index, 1);
      if (attachmentType == "Cover Image") {
        this.coverImgAttObj = {};
      } else if (attachmentType == "Profile Video") {
        this.profileVideoAttArray = this.profileVideoAttArray.filter(
          (item) => item.name !== fileName
        );
        // console.log("PR_VID_ATT", this.profileVideoAttArray);
      } else {
        this.certificateAttArray = this.certificateAttArray.filter(
          (item) => item.name !== fileName
        );
        // console.log("CER_ATT", this.certificateAttArray);
      }
    },

    callFileKeyMethod(obj, path) {
      const originalName = obj || "file";
      const extension = originalName.substring(originalName.lastIndexOf("."));
      const baseName = originalName
        .substring(0, originalName.lastIndexOf("."))
        .replace(/\s+/g, "_");
      const now = new Date();
      const dateTimeStr = now
        .toISOString()
        .replace(/T/, "_")
        .replace(/:/g, "-")
        .replace(/\..+/, "");
      return `${path}/${baseName}_${dateTimeStr}${extension}`;
    },

    async onboardCoachMethod() {
      const isValid = await this.$refs.form.validate();
      if (isValid.valid) {
        try {
          this.btnLoader = true;
          let pfpUploadedUrl = "";
          let coverImgUploadedUrl = "";
          let pfvUploadedUrlList = [];
          let certiUploadedUrlList = [];
          if (this.coachPfpFileObj?.name && this.pfpBlobUrl !== "") {
            pfpUploadedUrl = await this.CommonUploadFileMethod(
              this.callFileKeyMethod(this.coachPfpFileObj.name, "COACH_PFP"),
              this.coachPfpFileObj
            );
          }
          if (this.coverImgAttObj?.name !== "") {
            coverImgUploadedUrl = await this.CommonUploadFileMethod(
              this.callFileKeyMethod(
                this.coverImgAttObj.name,
                "COACH_COVER_PIC"
              ),
              this.coverImgAttObj
            );
          }
          if (this.profileVideoAttArray.length > 0) {
            for (let i = 0; i < this.profileVideoAttArray.length; i++) {
              const obj = await this.CommonUploadFileMethod(
                this.callFileKeyMethod(
                  this.profileVideoAttArray[i].name,
                  "COACH_PROFILE_VIDEO"
                ),
                this.profileVideoAttArray[i]
              );
              pfvUploadedUrlList.push(obj.key);
            }
          }
          if (this.certificateAttArray.length > 0) {
            for (let i = 0; i < this.certificateAttArray.length; i++) {
              const obj = await this.CommonUploadFileMethod(
                this.callFileKeyMethod(
                  this.certificateAttArray[i].name,
                  "COACH_PROFILE_VIDEO"
                ),
                this.certificateAttArray[i]
              );
              const certObj = {
                certificate_key: obj.key,
                certificate_name: this.certificateAttArray[i].name,
                is_certified: false,
              };
              certiUploadedUrlList.push(JSON.stringify(certObj));
            }
          }
          const result = await client.graphql({
            query: onBoardCoach,
            variables: {
              input: {
                user_phone_number: this.coachPhNo,
                user_name: this.coachName,
                user_email_id: this.coachEmail,
                sport_expertize: this.coachSportsExpertise,
                user_state: this.coachState,
                user_city: this.coachCity,
                profile_description: this.coachPfDesc,
                country: this.coachCountry,
                age: this.coachAge,
                experience: this.coachExp,
                languages: this.coachLanguages,
                charge: this.coachCharges,
                user_image_url: pfpUploadedUrl?.key || undefined,
                cover_image: coverImgUploadedUrl?.key || undefined,
                certificates:
                  certiUploadedUrlList.length > 0
                    ? certiUploadedUrlList
                    : undefined,
                profile_video:
                  pfvUploadedUrlList.length > 0
                    ? pfvUploadedUrlList
                    : undefined,
              },
            },
          });
          const response = JSON.parse(result.data.onBoardCoach);
          if (response.status == 200) {
            this.SnackBarComponent = {
              SnackbarVModel: true,
              Message: response.message,
              color: "text-green",
            };
            console.log("DEV");
            setTimeout(() => {
              this.OnboardCoachDialogEmit(2);
              this.btnLoader = false;
            }, 3000);
          }
          //   console.log("SETTINGS", response);
        } catch (error) {
          //   console.log("Error", error);
          this.SnackBarComponent = {
            SnackbarVModel: true,
            Message: error.errors[0].message,
            color: "text-red",
          };
        }
      } else {
        this.SnackBarComponent = {
          SnackbarVModel: true,
          Message: "Kindly fill all details..!",
          color: "text-red",
        };
      }
    },

    OnboardCoachDialogEmit(Toggle) {
      this.$refs.form.reset();
      this.pfpBlobUrl = "";
      this.coachPfpFileObj = {};
      this.attachemntFileInputArray = [];
      this.coverImgAttObj = {};
      this.certificateAttArray = [];
      this.profileVideoAttArray = [];
      this.selectedAttachmentItems = [];
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
