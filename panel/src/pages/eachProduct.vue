<template>
  <q-page class="q-pa-sm">
    <div class="row q-col-gutter-sm">
      <div class="col-12">
        <q-card>
          <q-tabs
            v-model="tab"
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
            outside-arrows
            mobile-arrows
          >
            <q-tab name="info" icon="info" label="اطلاعات" />
            <q-tab name="gallery" icon="photo_library" label="گالری" />
            <q-tab name="options" icon="list" label="مشخصات" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="options">
              <q-card flat bordered>
                <q-card-section class="q-pa-sm">
                  <q-list class="row">
                    <q-item
                      v-for="(each, index) in productInfo.options"
                      :key="index"
                      class="col-6"
                    >
                      <q-item-section>
                        <q-input
                          dense
                          v-model="each.value[0]"
                          :label="each.title"
                        />
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
                <q-card-actions align="right">
                  <q-btn
                    :loading="optionLoading"
                    @click="updateOption"
                    color="primary"
                    class="text-capitalize"
                  >
                    ویرایش اطلاعات
                    <template v-slot:loading>
                      <q-spinner-gears />
                    </template>
                  </q-btn>
                </q-card-actions>
              </q-card>
            </q-tab-panel>
            <q-tab-panel name="gallery">
              <q-card flat bordered>
                <q-card-section class="q-pa-sm">
                  <q-list class="row">
                    <q-item class="col-12">
                      <q-btn
                        color="primary"
                        @click="getFile2"
                        icon="control_point"
                        label="افزودن"
                      />
                    </q-item>
                    <q-item
                      v-for="(each, index) in productInfo.photos"
                      :key="index"
                      class="col-12 col-sm-2"
                      style="max-height: 250px"
                    >
                      <q-item-section>
                        <q-img :src="each.filename" :ratio="1">
                          <q-icon
                            class="absolute all-pointer-events"
                            size="32px"
                            name="delete"
                            color="red"
                            @click="openDeleteDialog(each._id)"
                            style="top: 8px; left: 8px"
                          >
                            <q-tooltip> پاک کردن </q-tooltip>
                          </q-icon>
                        </q-img>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </q-tab-panel>
            <q-tab-panel name="info">
              <q-card flat bordered>
                <q-card-section class="q-pa-sm">
                  <q-list class="row">
                    <q-item class="col-12 flex flex-center">
                      <q-item-section side>
                        <q-avatar size="120px">
                          <q-img :src="productInfo.avatar" native-context-menu>
                            <div
                              class="absolute-full text-subtitle2 flex flex-center"
                            >
                              <q-btn
                                @click="getFile"
                                flat
                                round
                                color="white"
                                icon="edit"
                              />
                            </div>
                          </q-img>
                        </q-avatar>
                      </q-item-section>
                    </q-item>
                    <q-item class="col-12 flex flex-center">
                      <q-item-section side>
                        <div class="text-subtitle2">
                          {{ productInfo.title }}
                        </div>
                      </q-item-section>
                    </q-item>
                    <q-item class="col-12">
                      <q-item-section>
                        <q-input
                          dense
                          v-model="productInfo.caption"
                          type="textarea"
                          label="توضیحات"
                        >
                          <template v-slot:prepend>
                            <q-icon name="info" />
                          </template>
                        </q-input>
                      </q-item-section>
                    </q-item>
                    <q-item class="col-6">
                      <q-item-section>
                        <q-input
                          dense
                          v-model="productInfo.title"
                          label="عنوان"
                        >
                          <template v-slot:prepend>
                            <q-icon name="info" />
                          </template>
                        </q-input>
                      </q-item-section>
                    </q-item>
                    <q-item class="col-6">
                      <q-item-section>
                        <q-input
                          dense
                          readonly
                          v-model="productInfo.price"
                          label="قیمت"
                        >
                          <template v-slot:prepend>
                            <q-icon name="paid" />
                          </template>
                        </q-input>
                      </q-item-section>
                    </q-item>
                    <q-item class="col-6">
                      <q-item-section>
                        <q-input
                          autogrow
                          dense
                          v-model="productInfo.offer"
                          label="تخفیف"
                        >
                          <template v-slot:prepend>
                            <q-icon name="local_offer" />
                          </template>
                        </q-input>
                      </q-item-section>
                    </q-item>
                    <q-item class="col-6">
                      <q-item-section>
                        <q-input
                          autogrow
                          dense
                          v-model="productInfo.quantity"
                          label="موجودی"
                        >
                          <template v-slot:prepend>
                            <q-icon name="info" />
                          </template>
                        </q-input>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
                <q-card-actions align="right">
                  <q-btn
                    @click="setProductInfo"
                    color="primary"
                    class="text-capitalize"
                    >ویرایش اطلاعات</q-btn
                  >
                </q-card-actions>
              </q-card>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>
    <q-dialog v-model="deleteGalleryDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="close" color="red" text-color="white" />
          <span class="q-ml-sm">آیا پاک شود؟</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="انصراف" color="red" v-close-popup />
          <q-btn flat label="تایید" color="primary" @click="deleteGallery" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-file
      @input="uploadFile"
      ref="myFile"
      style="display: none"
      v-model="file"
      type="file"
      label="Standard"
    />
    <q-file
      @input="uploadGallery"
      ref="galleryFileRef"
      style="display: none"
      v-model="fileGallery"
      type="file"
      label="Standard"
    />
  </q-page>
</template>

<script>
import persianDate from "persian-date";
import Vue from "vue";
import IEcharts from "vue-echarts-v3/src/full.js";
import Table from "../components/Table";
Vue.component("IEcharts", IEcharts);
export default {
  components: {
    Table,
  },
  name: "EachProduct",
  data() {
    return {
      splitterModel: 20,
      tab: "info",
      file: null,
      fileGallery: null,
      productInfo: {},
      galleryId: "",
      deleteGalleryDialog: false,
      optionLoading: false,
    };
  },
  mounted() {
    this.getProductInfo();
  },
  methods: {
    deleteGallery() {
      this.$axios
        .delete(
          `panel/products/${this.$route.params.id}/gallery/${this.galleryId}`
        )
        .then((response) => {
          this.productInfo = response.data.data.item;
          this.deleteGalleryDialog = false;
        });
    },
    openDeleteDialog(galleryId) {
      this.deleteGalleryDialog = true;
      this.galleryId = galleryId;
    },
    getProductInfo() {
      this.$axios
        .get(`panel/products/${this.$route.params.id}`)
        .then((response) => {
          var options = [];
          response.data.data.categoryOptionList.forEach((element) => {
            if (
              response.data.data.item.options.find(
                (x) => x.optionId == element._id
              )
            ) {
              options.push({
                value: [
                  response.data.data.item.options.find(
                    (x) => x.optionId == element._id
                  ).value[0],
                ],
                optionId: element._id,
                title: element.title,
              });
            } else {
              options.push({
                value: [""],
                optionId: element._id,
                title: element.title,
              });
            }
          });
          this.productInfo = response.data.data.item;
          this.productInfo.options = options;
          console.log(this.productInfo.options);
        })
        .catch(() => {
          this.$q.notify({
            color: "negative",
            position: "top",
            message: "Loading failed",
            icon: "report_problem",
          });
        });
    },
    getFile() {
      this.$refs.myFile.$el.click();
    },
    getFile2() {
      this.$refs.galleryFileRef.$el.click();
    },
    uploadFile() {
      var formData = new FormData();
      formData.set("file", this.file);
      this.$axios
        .post("upload/file", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          this.productInfo.avatar = response.data.data.file.url;
          this.updateAvatar(response.data.data.file.filename);
        });
    },
    uploadGallery() {
      var formData = new FormData();
      formData.set("file", this.fileGallery);
      this.$axios
        .post("upload/file", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          this.updateGallery(response.data.data.file.filename);
        });
    },
    setProductInfo() {
      this.$axios
        .put(`panel/products/${this.$route.params.id}`, {
          title: this.productInfo.title,
          caption: this.productInfo.caption,
          price: this.productInfo.price,
          offer: this.productInfo.offer,
          quantity: this.productInfo.quantity,
        })
        .then((response) => {
          this.$q.notify({
            color: "green",
            position: "bottom",
            message: "با موفقیت ثبت شد",
          });
        })
        .catch(() => {
          this.$q.notify({
            color: "negative",
            position: "top",
            message: "Loading failed",
            icon: "report_problem",
          });
        });
    },
    updateAvatar(avatar) {
      this.$axios
        .put(`panel/products/${this.$route.params.id}`, {
          avatar,
        })
        .then((response) => {
          this.$q.notify({
            color: "green",
            position: "bottom",
            message: "با موفقیت ثبت شد",
          });
        })
        .catch(() => {
          this.$q.notify({
            color: "negative",
            position: "top",
            message: "Loading failed",
            icon: "report_problem",
          });
        });
    },
    updateGallery(avatar) {
      this.$axios
        .post(`panel/products/${this.$route.params.id}/gallery`, {
          avatar,
        })
        .then((response) => {
          this.productInfo = response.data.data.item;
          this.$q.notify({
            color: "green",
            position: "bottom",
            message: "با موفقیت ثبت شد",
          });
        })
        .catch(() => {
          this.$q.notify({
            color: "negative",
            position: "top",
            message: "Loading failed",
            icon: "report_problem",
          });
        });
    },
    updateOption() {
      this.$axios
        .put(`panel/products/${this.$route.params.id}`, {
          options: this.productInfo.options,
        })
        .then((response) => {
          this.$q.notify({
            color: "green",
            position: "bottom",
            message: "با موفقیت ثبت شد",
          });
        })
        .catch(() => {
          this.$q.notify({
            color: "negative",
            position: "top",
            message: "Loading failed",
            icon: "report_problem",
          });
        });
    },
  },
};
</script>
