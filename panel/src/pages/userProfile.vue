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
            <q-tab name="userInfo" icon="info" label="اطلاعات پروفایل شخص" />
            <q-tab name="petInfo" icon="info" label="اطلاعات پروفایل پت" />
            <q-tab name="reserve" icon="group" label="نوبت ها" />
            <q-tab name="orders" icon="sticky_note_2" label="سفارش ها" />
            <q-tab
              name="wallet"
              icon="account_balance_wallet"
              label="کیف پول"
            />
            <q-tab name="delivery" icon="directions_car" label="درخواست های سرویس" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="userInfo">
              <q-card flat bordered>
                <q-card-section class="q-pa-sm">
                  <q-list class="row">
                    <q-item class="col-12 flex flex-center">
                      <q-item-section side>
                        <q-avatar size="120px">
                          <q-img :src="profileInfo.avatar" native-context-menu>
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
                          {{ profileInfo.firstName }} {{ profileInfo.lastName }}
                        </div>
                      </q-item-section>
                    </q-item>
                    <q-item class="col-12 flex flex-center">
                      <q-item-section side>
                        <q-chip>
                          <q-avatar
                            icon="attach_money"
                            color="green"
                            text-color="white"
                          />
                          {{ profileInfo.wallet }} تومان
                        </q-chip>
                      </q-item-section>
                    </q-item>
                    <q-item class="col-6">
                      <q-item-section>
                        <q-input
                          dense
                          readonly
                          v-model="profileInfo.firstName"
                          label="نام"
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
                          v-model="profileInfo.lastName"
                          label="نام خانوادگی"
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
                          v-model="profileInfo.phone"
                          label="شماره تماس"
                        >
                          <template v-slot:prepend>
                            <q-icon name="phone" />
                          </template>
                        </q-input>
                      </q-item-section>
                    </q-item>
                    <q-item class="col-6">
                      <q-item-section>
                        <q-input
                          autogrow
                          dense
                          readonly
                          v-model="profileInfo.address"
                          label="آدرس"
                        >
                          <template v-slot:prepend>
                            <q-icon name="location_on" />
                          </template>
                        </q-input>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
                <q-card-actions align="right">
                  <q-btn
                    @click="setUserInfo"
                    color="primary"
                    class="text-capitalize"
                    >ویرایش اطلاعات</q-btn
                  >
                </q-card-actions>
              </q-card>
            </q-tab-panel>
            <q-tab-panel name="petInfo">
              <q-card flat bordered>
                <q-card-section class="q-pa-sm">
                  <q-list class="row">
                    <q-item class="col-12 flex flex-center">
                      <q-item-section side>
                        <q-avatar size="120px">
                          <q-img :src="petInfo.avatar" native-context-menu>
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
                          {{ petInfo.originName }} | {{ petInfo.calledName }}
                        </div>
                      </q-item-section>
                    </q-item>
                    <q-item class="col-6">
                      <q-item-section>
                        <q-input
                          dense
                          readonly
                          v-model="petInfo.race"
                          label="نژاد"
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
                          autogrow
                          dense
                          readonly
                          v-model="petInfo.color"
                          label="رنگ"
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
                    @click="setUserInfo"
                    color="primary"
                    class="text-capitalize"
                    >ویرایش اطلاعات</q-btn
                  >
                </q-card-actions>
              </q-card>
            </q-tab-panel>
            <q-tab-panel name="doctors">
              <Table v-bind="doctorsTable" />
            </q-tab-panel>

            <q-tab-panel name="services">
              <Table v-bind="servicesTable" />
            </q-tab-panel>

            <q-tab-panel name="times">
              <q-card flat bordered>
                <q-tabs
                  v-model="timesTab"
                  dense
                  class="text-grey"
                  active-color="primary"
                  indicator-color="primary"
                  align="justify"
                  narrow-indicator
                  outside-arrows
                  mobile-arrows
                >
                  <q-tab name="day_0" label="شنبه" />
                  <q-tab name="day_1" label="یکشنبه" />
                  <q-tab name="day_2" label="دوشنبه" />
                  <q-tab name="day_3" label="سه شنبه" />
                  <q-tab name="day_4" label="چهارشنبه" />
                  <q-tab name="day_5" label="پنجشنبه" />
                  <q-tab name="day_6" label="جمعه" />
                  <q-tab name="day_7" label="شناور" />
                  <q-tab name="closedDays" label="تعطیل" />
                </q-tabs>

                <q-separator />

                <q-tab-panels v-model="timesTab" animated>
                  <q-tab-panel name="day_0">
                    <Table v-bind="daysTable[0]" />
                  </q-tab-panel>

                  <q-tab-panel name="day_1">
                    <Table v-bind="daysTable[1]" />
                  </q-tab-panel>

                  <q-tab-panel name="day_2">
                    <Table v-bind="daysTable[2]" />
                  </q-tab-panel>

                  <q-tab-panel name="day_3">
                    <Table v-bind="daysTable[3]" />
                  </q-tab-panel>

                  <q-tab-panel name="day_4">
                    <Table v-bind="daysTable[4]" />
                  </q-tab-panel>

                  <q-tab-panel name="day_5">
                    <Table v-bind="daysTable[5]" />
                  </q-tab-panel>

                  <q-tab-panel name="day_6">
                    <Table v-bind="daysTable[6]" />
                  </q-tab-panel>
                  <q-tab-panel name="day_7">
                    <Table v-bind="daysTable[7]" />
                  </q-tab-panel>
                  <q-tab-panel name="closedDays">
                    <Table v-bind="closedTable" />
                  </q-tab-panel>
                </q-tab-panels>
              </q-card>
            </q-tab-panel>
            <q-tab-panel name="reserve">
              <Table v-bind="reserveTable" />
            </q-tab-panel>
            <q-tab-panel name="products">
              <Table v-bind="productTable" />
            </q-tab-panel>
            <q-tab-panel name="orders">
              <Table v-bind="basketTable" />
            </q-tab-panel>
            <q-tab-panel name="wallet">
              <Table v-bind="walletTable" />
            </q-tab-panel>
            <q-tab-panel name="delivery">
              <Table v-bind="deliveryTable" />
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>
    <q-file
      @input="uploadFile"
      ref="myFile"
      style="display: none"
      v-model="file"
      type="file"
      label="Standard"
    ></q-file>
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
  name: "UserProfile",
  data() {
    return {
      petInfo:{},
      splitterModel: 20,
      tab: "userInfo",
      timesTab: "day_0",
      file: null,
      doctorsTable: null,
      servicesTable: null,
      walletTable: null,
      productTable: null,
      basketTable: null,
      reserveTable: null,
      deliveryTable: null,
      reportTable: null,
      daysTable: [],
      closedTable: null,
      profileInfo: {},
    };
  },
  watch: {
    "$route.query.update": function (id) {
      this.getUserInfo();
    },
  },
  mounted() {
    this.closedTable = {
      loading: true,
      canInsert: true,
      readonly: true,
      hasSubset: false,
      subsetUrl: "",
      title: "",
      filter: "",
      mode: "list",
      url: `panel/${this.$route.params.type}/${this.$route.params.id}/times/close`,
      columns: [
        {
          name: "index",
          label: "#",
          field: "index",
          align: "left",
          sortable: true,
        },
        {
          name: "date",
          align: "left",
          label: "تاریخ تعطیل",
          field: "date",
          format: (val) =>
            `${new persianDate(Date.parse(val)).format("YYYY-MM-DD")}`,
          sortable: true,
        },
        {
          name: "date",
          align: "left",
          label: "تاریخ",
          field: (row) => row.createdAt,
          format: (val) =>
            `${new persianDate(Date.parse(val)).format("YYYY-MM-DD")}`,
          sortable: true,
        },
        {
          name: "time",
          align: "left",
          label: "ساعت",
          field: (row) => row.createdAt,
          format: (val) =>
            `${new persianDate(Date.parse(val)).format("H:mm:ss")}`,
          sortable: true,
        },
        {
          name: "isActive",
          align: "left",
          label: "وضعیت",
          field: "isActive",
          format: (val) => (val ? "فعال" : "غیر فعال"),
          sortable: true,
        },
        {
          name: "actions",
          label: "عملیات",
          field: "actions",
          align: "left",
        },
      ],
      data: [],
      itemId: "",
      form: [
        {
          isFile: false,
          isObject: false,
          type: "date",
          label: "تاریخ تعطیل",
          model: "",
          field: "date",
          isSecret: false,
          canUpdate: true,
        },
      ],
    };
    this.reportTable = {
      loading: true,
      canInsert: true,
      readonly: true,
      hasSubset: false,
      subsetUrl: "",
      title: "لیست تخلفات",
      filter: "",
      mode: "list",
      url: `panel/${this.$route.params.type}/${this.$route.params.id}/report`,
      columns: [
        {
          name: "index",
          label: "#",
          field: "index",
          align: "left",
          sortable: true,
        },
        {
          name: "title",
          align: "left",
          label: "عنوان",
          field: "title",
          sortable: true,
        },
        {
          name: "caption",
          align: "left",
          label: "توضیحات",
          field: "caption",
          sortable: true,
        },
        {
          name: "date",
          align: "left",
          label: "تاریخ",
          field: (row) => row.createdAt,
          format: (val) =>
            `${new persianDate(Date.parse(val)).format("YYYY-MM-DD")}`,
          sortable: true,
        },
        {
          name: "time",
          align: "left",
          label: "ساعت",
          field: (row) => row.createdAt,
          format: (val) =>
            `${new persianDate(Date.parse(val)).format("H:mm:ss")}`,
          sortable: true,
        },
      ],
      data: [],
      itemId: "",
      form: [
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "عنوان",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "title",
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "توضیحات",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "caption",
        },
      ],
    };
    this.reserveTable = {
      loading: true,
      canInsert: false,
      readonly: false,
      hasSubset: false,
      subsetUrl: "",
      title: "لیست رزرو ها",
      filter: "",
      mode: "list",
      url: `panel/reserves`,
      columns: [
        {
          name: "index",
          label: "#",
          field: "index",
          align: "left",
          sortable: true,
        },
        {
          name: "isEmergency",
          align: "left",
          label: "اورژانسی",
          field: "isEmergency",
          format: (val) => (val ? "بله" : "خیر"),
          sortable: true,
        },
        {
          name: "startTime",
          align: "left",
          label: "ساعت شروع",
          field: "startTime",
          sortable: true,
        },
        {
          name: "endTime",
          align: "left",
          label: "ساعت پایان",
          field: "endTime",
          sortable: true,
        },
        {
          name: "title",
          align: "left",
          label: "عنوان",
          field: (row) => row.serviceClinicId.title,
          sortable: true,
        },
        {
          name: "doctorFirstName",
          align: "left",
          label: "نام",
          field: (row) => row.doctorId.firstName,
          sortable: true,
        },
        {
          name: "doctorLastName",
          align: "left",
          label: "نام خانوادگی",
          field: (row) => row.doctorId.lastName,
          sortable: true,
        },
        {
          name: "personFirstName",
          align: "left",
          label: "نام مراجعه کننده",
          field: (row) => row.userId.firstName,
          sortable: true,
        },
        {
          name: "personLastName",
          align: "left",
          label: "نام خانوادگی مراجعه کننده",
          field: (row) => row.userId.lastName,
          sortable: true,
        },
        {
          name: "personPhone",
          align: "left",
          label: "شماره تماس مراجعه کننده",
          field: (row) => row.userId.phone,
          sortable: true,
        },
        {
          name: "date",
          align: "left",
          label: "تاریخ",
          field: (row) => row.createdAt,
          format: (val) =>
            `${new persianDate(Date.parse(val)).format("YYYY-MM-DD")}`,
          sortable: true,
        },
        {
          name: "time",
          align: "left",
          label: "ساعت",
          field: (row) => row.createdAt,
          format: (val) =>
            `${new persianDate(Date.parse(val)).format("H:mm:ss")}`,
          sortable: true,
        },
      ],
      data: [],
      itemId: "",
      form: [],
    };
    this.deliveryTable = {
      loading: true,
      canInsert: false,
      readonly: false,
      hasSubset: false,
      subsetUrl: "",
      title: "لیست سرویس ها",
      filter: "",
      mode: "list",
      url: `panel/reserves`,
      columns: [
        {
          name: "index",
          label: "#",
          field: "index",
          align: "left",
          sortable: true,
        },
        {
          name: "title",
          align: "left",
          label: "نوع سرویس",
          field: 'deliveryType',
          format: (val) =>{
            if(val=='go'){
              return 'رفت'
            }else if(val=='back'){
              return 'برگشت'
            }else{
              return 'رفت و برگشت'
            }
          },
          sortable: true,
        },
        {
          name: "title",
          align: "left",
          label: "عنوان",
          field: (row) => row.serviceClinicId.title,
          sortable: true,
        },
        {
          name: "doctorFirstName",
          align: "left",
          label: "نام",
          field: (row) => row.doctorId.firstName,
          sortable: true,
        },
        {
          name: "doctorLastName",
          align: "left",
          label: "نام خانوادگی",
          field: (row) => row.doctorId.lastName,
          sortable: true,
        },
        {
          name: "date",
          align: "left",
          label: "تاریخ",
          field: (row) => row.createdAt,
          format: (val) =>
            `${new persianDate(Date.parse(val)).format("YYYY-MM-DD")}`,
          sortable: true,
        },
        {
          name: "time",
          align: "left",
          label: "ساعت",
          field: (row) => row.createdAt,
          format: (val) =>
            `${new persianDate(Date.parse(val)).format("H:mm:ss")}`,
          sortable: true,
        },
      ],
      data: [],
      itemId: "",
      form: [],
    };
    this.basketTable = {
      loading: true,
      canInsert: false,
      readonly: true,
      hasSubset: false,
      subsetUrl: "",
      title: "لیست سفارشات",
      filter: "",
      mode: "list",
      url: `panel/basket`,
      columns: [
        {
          name: "index",
          label: "#",
          field: "index",
          align: "left",
          sortable: true,
        },
        {
          name: "title",
          align: "left",
          label: "عنوان",
          field: (row) => row.productId.title,
          sortable: true,
        },
        {
          name: "price",
          align: "left",
          label: "قیمت",
          field: (row) => row.productId.price,
          sortable: true,
        },
        {
          name: "offer",
          align: "left",
          label: "تخفیف",
          field: (row) => row.productId.offer,
          sortable: true,
        },
        {
          name: "date",
          align: "left",
          label: "تاریخ",
          field: (row) => row.createdAt,
          format: (val) =>
            `${new persianDate(Date.parse(val)).format("YYYY-MM-DD")}`,
          sortable: true,
        },
        {
          name: "time",
          align: "left",
          label: "ساعت",
          field: (row) => row.createdAt,
          format: (val) =>
            `${new persianDate(Date.parse(val)).format("H:mm:ss")}`,
          sortable: true,
        },
      ],
      data: [],
      itemId: "",
      form: [],
    };
    this.productTable = {
      loading: true,
      canInsert: true,
      readonly: false,
      hasSubset: true,
      subsetUrl: "/products/:id",
      title: "لیست محصولات",
      filter: "",
      mode: "list",
      url: `panel/${this.$route.params.type}/${this.$route.params.id}/products`,
      columns: [
        {
          name: "index",
          label: "#",
          field: "index",
          align: "left",
          sortable: true,
        },
        {
          name: "title",
          align: "left",
          label: "عنوان",
          field: "title",
          sortable: true,
        },
        {
          name: "quantity",
          align: "left",
          label: "موجودی",
          field: "quantity",
          sortable: true,
        },
        {
          name: "petCategoryId",
          align: "left",
          label: "دسته حیوانات",
          field: (row) => row.petCategoryId.title,
          sortable: true,
        },
        {
          name: "categoryId",
          align: "left",
          label: "دسته بندی",
          field: (row) => row.categoryId.title,
          sortable: true,
        },
        {
          name: "date",
          align: "left",
          label: "تاریخ",
          field: (row) => row.createdAt,
          format: (val) =>
            `${new persianDate(Date.parse(val)).format("YYYY-MM-DD")}`,
          sortable: true,
        },
        {
          name: "time",
          align: "left",
          label: "ساعت",
          field: (row) => row.createdAt,
          format: (val) =>
            `${new persianDate(Date.parse(val)).format("H:mm:ss")}`,
          sortable: true,
        },
        {
          name: "isActive",
          align: "left",
          label: "وضعیت",
          field: "isActive",
          format: (val) => (val ? "فعال" : "غیر فعال"),
          sortable: true,
        },
        {
          name: "actions",
          label: "عملیات",
          field: "actions",
          align: "left",
        },
      ],
      data: [],
      itemId: "",
      form: [
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "عنوان",
          model: "",
          field: "title",
          isSecret: false,
          canUpdate: true,
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "توضیحات",
          model: "",
          field: "caption",
          isSecret: false,
          canUpdate: true,
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "موجودی",
          model: "",
          field: "quantity",
          isSecret: false,
          canUpdate: true,
        },

        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "قیمت",
          model: "",
          field: "price",
          isSecret: false,
          canUpdate: true,
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "تخفیف",
          model: "",
          field: "offer",
          isSecret: false,
          canUpdate: true,
        },
        {
          isFile: false,
          isObject: true,
          type: "q-select",
          label: "دسته بندی حیوانات",
          model: "",
          field: "petCategoryId",
          disable: true,
          canUpdate: false,
          key: "_id",
          displayKey: "title",
          isSecret: false,
          options: [],
        },
        {
          isFile: false,
          isObject: true,
          type: "q-select",
          label: "دسته بندی",
          model: "",
          field: "categoryId",
          disable: true,
          canUpdate: false,
          key: "_id",
          displayKey: "title",
          isSecret: false,
          options: [],
        },
        {
          isFile: true,
          isObject: false,
          type: "file",
          label: "فایل",
          src: "",
          isExternal: true,
          filename: "",
          model: "",
          isSecret: false,
          field: "avatar",
          canUpdate: true,
        },
      ],
    };
    this.walletTable = {
      loading: true,
      canInsert: true,
      readonly: true,
      canActive: false,
      hasSubset: false,
      subsetUrl: "",
      title: "لیست تراکنش های کیف پول",
      filter: "",
      mode: "list",
      url: `panel/users/${this.$route.params.userId}/wallet`,
      columns: [
        {
          name: "index",
          label: "#",
          field: "index",
          align: "left",
          sortable: true,
        },
        {
          name: "amount",
          align: "left",
          label: "مقدار",
          field: "amount",
          sortable: true,
        },
        {
          name: "isIncrease",
          align: "left",
          label: "نوع",
          field: "isIncrease",
          format: (val) => {
            if (val) {
              return "افزایشی";
            } else {
              return "کاهشی";
            }
          },
          sortable: true,
        },
        {
          name: "date",
          align: "left",
          label: "تاریخ",
          field: (row) => row.createdAt,
          format: (val) =>
            `${new persianDate(Date.parse(val)).format("YYYY-MM-DD")}`,
          sortable: true,
        },
        {
          name: "time",
          align: "left",
          label: "ساعت",
          field: (row) => row.createdAt,
          format: (val) =>
            `${new persianDate(Date.parse(val)).format("H:mm:ss")}`,
          sortable: true,
        },
      ],
      data: [],
      itemId: "",
      form: [
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "مقدار",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "amount",
        },
        {
          isFile: false,
          isObject: false,
          type: "q-select",
          label: "نوع",
          model: "",
          field: "isIncrease",
          disable: false,
          canUpdate: true,
          key: "",
          displayKey: "",
          isSecret: false,
          options: [
            {
              label: "افزایشی",
              value: true,
            },
            {
              label: "کاهشی",
              value: false,
            },
          ],
        },
      ],
    };

    [0, 1, 2, 3, 4, 5, 6, 7].forEach((x, i) => {
      if (i == 7) {
        this.daysTable.push({
          loading: true,
          canInsert: true,
          readonly: false,
          hasSubset: false,
          subsetUrl: "",
          title: "",
          filter: "",
          mode: "list",
          url: `panel/${this.$route.params.type}/${this.$route.params.id}/times/fix/${i}`,
          columns: [
            {
              name: "index",
              label: "#",
              field: "index",
              align: "left",
              sortable: true,
            },
            {
              name: "serviceClinicTitle",
              label: "عنوان خدمت",
              field: (row) => `${row.serviceClinicId.title}`,
              align: "left",
              sortable: true,
            },
            {
              name: "doctorFirstName",
              label: "نام",
              field: (row) => `${row.doctorId.firstName}`,
              align: "left",
              sortable: true,
            },
            {
              name: "doctorLastName",
              label: "نام خانوادگی",
              field: (row) => `${row.doctorId.lastName}`,
              align: "left",
              sortable: true,
            },
            {
              name: "doctorPhone",
              label: "شماره تماس",
              field: (row) => row.doctorId.phone,
              align: "left",
              sortable: true,
            },
            {
              name: "startTime",
              label: "شروع ساعت",
              field: "startTime",
              align: "left",
              sortable: true,
            },
            {
              name: "endTime",
              label: "پایان ساعت",
              field: "endTime",
              align: "left",
              sortable: true,
            },
            {
              name: "capacity",
              label: "ظرفیت",
              field: "capacity",
              align: "left",
              sortable: true,
            },
            {
              name: "date",
              align: "left",
              label: "تاریخ",
              field: (row) => row.createdAt,
              format: (val) =>
                `${new persianDate(Date.parse(val)).format("YYYY-MM-DD")}`,
              sortable: true,
            },
            {
              name: "time",
              align: "left",
              label: "ساعت",
              field: (row) => row.createdAt,
              format: (val) =>
                `${new persianDate(Date.parse(val)).format("H:mm:ss")}`,
              sortable: true,
            },
            {
              name: "isActive",
              align: "left",
              label: "وضعیت",
              field: "isActive",
              format: (val) => (val ? "فعال" : "غیر فعال"),
              sortable: true,
            },
            {
              name: "actions",
              label: "عملیات",
              field: "actions",
              align: "left",
            },
          ],
          data: [],
          itemId: "",
          form: [
            {
              isFile: false,
              isObject: false,
              type: "q-input",
              label: "ظرفیت",
              model: "",
              canUpdate: true,
              isSecret: false,
              field: "capacity",
            },
            {
              isFile: false,
              isObject: false,
              type: "q-select",
              label: "آیا آروژانسی است؟",
              model: "",
              field: "isEmergency",
              disable: false,
              canUpdate: true,
              key: "",
              displayKey: "",
              isSecret: false,
              options: [
                {
                  label: "بله",
                  value: true,
                },
                {
                  label: "خیر",
                  value: false,
                },
              ],
            },
            {
              isFile: false,
              isObject: true,
              type: "q-select",
              label: "متخصص مرتبط",
              model: "",
              field: "doctorId",
              disable: false,
              canUpdate: true,
              key: "_id",
              displayKey: "lastName",
              isSecret: false,
              options: [],
            },
            {
              isFile: false,
              isObject: true,
              type: "q-select",
              label: "خدمت قابل ارائه",
              model: "",
              field: "serviceClinicId",
              disable: false,
              canUpdate: true,
              key: "_id",
              displayKey: "title",
              isSecret: false,
              options: [],
            },
            {
              isFile: false,
              isObject: false,
              type: "time",
              label: "شروع ساعت",
              model: "",
              canUpdate: true,
              isSecret: false,
              field: "startTime",
            },
            {
              isFile: false,
              isObject: false,
              type: "time",
              label: "پایان ساعت",
              model: "",
              canUpdate: true,
              isSecret: false,
              field: "endTime",
            },
            {
              isFile: false,
              isObject: false,
              type: "date",
              label: "تاریخ",
              model: "",
              field: "floatingDate",
              isSecret: false,
              canUpdate: true,
            },
          ],
        });
      } else {
        this.daysTable.push({
          loading: true,
          canInsert: true,
          readonly: false,
          hasSubset: false,
          subsetUrl: "",
          title: "",
          filter: "",
          mode: "list",
          url: `panel/${this.$route.params.type}/${this.$route.params.id}/times/fix/${i}`,
          columns: [
            {
              name: "index",
              label: "#",
              field: "index",
              align: "left",
              sortable: true,
            },
            {
              name: "serviceClinicTitle",
              label: "عنوان خدمت",
              field: (row) => `${row.serviceClinicId.title}`,
              align: "left",
              sortable: true,
            },
            {
              name: "doctorFirstName",
              label: "نام",
              field: (row) => `${row.doctorId.firstName}`,
              align: "left",
              sortable: true,
            },
            {
              name: "doctorLastName",
              label: "نام خانوادگی",
              field: (row) => `${row.doctorId.lastName}`,
              align: "left",
              sortable: true,
            },
            {
              name: "doctorPhone",
              label: "شماره تماس",
              field: (row) => row.doctorId.phone,
              align: "left",
              sortable: true,
            },
            {
              name: "startTime",
              label: "شروع ساعت",
              field: "startTime",
              align: "left",
              sortable: true,
            },
            {
              name: "endTime",
              label: "پایان ساعت",
              field: "endTime",
              align: "left",
              sortable: true,
            },
            {
              name: "capacity",
              label: "ظرفیت",
              field: "capacity",
              align: "left",
              sortable: true,
            },
            {
              name: "date",
              align: "left",
              label: "تاریخ",
              field: (row) => row.createdAt,
              format: (val) =>
                `${new persianDate(Date.parse(val)).format("YYYY-MM-DD")}`,
              sortable: true,
            },
            {
              name: "time",
              align: "left",
              label: "ساعت",
              field: (row) => row.createdAt,
              format: (val) =>
                `${new persianDate(Date.parse(val)).format("H:mm:ss")}`,
              sortable: true,
            },
            {
              name: "isActive",
              align: "left",
              label: "وضعیت",
              field: "isActive",
              format: (val) => (val ? "فعال" : "غیر فعال"),
              sortable: true,
            },
            {
              name: "actions",
              label: "عملیات",
              field: "actions",
              align: "left",
            },
          ],
          data: [],
          itemId: "",
          form: [
            {
              isFile: false,
              isObject: false,
              type: "q-input",
              label: "ظرفیت",
              model: "",
              canUpdate: true,
              isSecret: false,
              field: "capacity",
            },
            {
              isFile: false,
              isObject: false,
              type: "q-select",
              label: "آیا آروژانسی است؟",
              model: "",
              field: "isEmergency",
              disable: false,
              canUpdate: true,
              key: "",
              displayKey: "",
              isSecret: false,
              options: [
                {
                  label: "بله",
                  value: true,
                },
                {
                  label: "خیر",
                  value: false,
                },
              ],
            },
            {
              isFile: false,
              isObject: true,
              type: "q-select",
              label: "متخصص مرتبط",
              model: "",
              field: "doctorId",
              disable: false,
              canUpdate: true,
              key: "_id",
              displayKey: "lastName",
              isSecret: false,
              options: [],
            },
            {
              isFile: false,
              isObject: true,
              type: "q-select",
              label: "خدمت قابل ارائه",
              model: "",
              field: "serviceClinicId",
              disable: false,
              canUpdate: true,
              key: "_id",
              displayKey: "title",
              isSecret: false,
              options: [],
            },
            {
              isFile: false,
              isObject: false,
              type: "time",
              label: "شروع ساعت",
              model: "",
              canUpdate: true,
              isSecret: false,
              field: "startTime",
            },
            {
              isFile: false,
              isObject: false,
              type: "time",
              label: "پایان ساعت",
              model: "",
              canUpdate: true,
              isSecret: false,
              field: "endTime",
            },
          ],
        });
      }
    });
    this.servicesTable = {
      loading: true,
      canInsert: true,
      readonly: false,
      hasSubset: false,
      subsetUrl: "",
      title: "لیست خدمات کلینیک",
      filter: "",
      mode: "list",
      url: `panel/serviceClinics`,
      columns: [
        {
          name: "index",
          label: "#",
          field: "index",
          align: "left",
          sortable: true,
        },
        {
          name: "serviceId",
          align: "left",
          label: "دسته بندی خدمات",
          field: (row) => row.serviceId.title,
          sortable: true,
        },
        {
          name: "subServiceId",
          align: "left",
          label: "دسته خدمات",
          field: (row) => row.subServiceId.title,
          sortable: true,
        },
        {
          name: "title",
          align: "left",
          label: "عنوان",
          field: "title",
          sortable: true,
        },
        {
          name: "price",
          align: "left",
          label: "قیمت",
          field: "price",
          sortable: true,
        },
        {
          name: "offer",
          align: "left",
          label: "تخفیف",
          field: "offer",
          sortable: true,
        },
        {
          name: "emergencyPrice",
          align: "left",
          label: "قیمت اورژانسی",
          field: "emergencyPrice",
          sortable: true,
        },
        {
          name: "date",
          align: "left",
          label: "تاریخ",
          field: (row) => row.createdAt,
          format: (val) =>
            `${new persianDate(Date.parse(val)).format("YYYY-MM-DD")}`,
          sortable: true,
        },
        {
          name: "time",
          align: "left",
          label: "ساعت",
          field: (row) => row.createdAt,
          format: (val) =>
            `${new persianDate(Date.parse(val)).format("H:mm:ss")}`,
          sortable: true,
        },
        {
          name: "isActive",
          align: "left",
          label: "وضعیت",
          field: "isActive",
          format: (val) => (val ? "فعال" : "غیر فعال"),
          sortable: true,
        },
        {
          name: "actions",
          label: "عملیات",
          field: "actions",
          align: "left",
        },
      ],
      data: [],
      itemId: "",
      form: [
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "عنوان",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "title",
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "قیمت",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "price",
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "تخفیف",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "offer",
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "قیمت اورژانسی",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "emergencyPrice",
        },
        {
          isFile: false,
          isObject: false,
          type: "date",
          label: "شروع تاریخ تخفیف",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "offerStartDate",
        },
        {
          isFile: false,
          isObject: false,
          type: "date",
          label: "پایان تاریخ تخفیف",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "offerEndDate",
        },
        {
          isFile: false,
          isObject: true,
          type: "q-select",
          label: "دسته بندی خدمات",
          model: "",
          field: "serviceId",
          disable: true,
          canUpdate: false,
          key: "id",
          displayKey: "title",
          isSecret: false,
          options: [],
        },
        {
          isFile: false,
          isObject: true,
          type: "q-select",
          label: "دسته خدمات",
          model: "",
          field: "subServiceId",
          disable: true,
          canUpdate: false,
          key: "_id",
          displayKey: "title",
          isSecret: false,
          options: [],
        },
      ],
    };
    this.doctorsTable = {
      loading: true,
      canInsert: true,
      readonly: false,
      hasSubset: false,
      subsetUrl: "",
      title: "لیست متخصصین",
      filter: "",
      mode: "list",
      url: `panel/doctors`,
      columns: [
        {
          name: "index",
          label: "#",
          field: "index",
          align: "left",
          sortable: true,
        },
        {
          name: "firstName",
          align: "left",
          label: "نام",
          field: "firstName",
          sortable: true,
        },
        {
          name: "lastName",
          required: true,
          label: "نام خانوادگی",
          align: "left",
          field: "lastName",
          sortable: true,
        },
        {
          name: "phone",
          align: "left",
          label: "شماره تماس",
          field: "phone",
          sortable: true,
        },
        {
          name: "birthDate",
          align: "left",
          label: "تاریخ تولد",
          field: (row) => row.birthDate,
          format: (val) =>
            `${new persianDate(Date.parse(val)).format("YYYY-MM-DD")}`,
          sortable: true,
        },
        {
          name: "date",
          align: "left",
          label: "تاریخ",
          field: (row) => row.createdAt,
          format: (val) =>
            `${new persianDate(Date.parse(val)).format("YYYY-MM-DD")}`,
          sortable: true,
        },
        {
          name: "time",
          align: "left",
          label: "ساعت",
          field: (row) => row.createdAt,
          format: (val) =>
            `${new persianDate(Date.parse(val)).format("H:mm:ss")}`,
          sortable: true,
        },
        {
          name: "isActive",
          align: "left",
          label: "وضعیت",
          field: "isActive",
          format: (val) => (val ? "فعال" : "غیر فعال"),
          sortable: true,
        },
        {
          name: "actions",
          label: "عملیات",
          field: "actions",
          align: "left",
        },
      ],
      data: [],
      itemId: "",
      form: [
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "شماره تماس",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "phone",
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "نام",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "firstName",
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "نام خانوادگی",
          model: "",
          field: "lastName",
          isSecret: false,
          canUpdate: true,
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "تخصص",
          model: "",
          field: "skill",
          isSecret: false,
          canUpdate: true,
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "شماره نظام پزشکی",
          model: "",
          field: "medicalSystem",
          isSecret: false,
          canUpdate: true,
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "ایمیل",
          model: "",
          field: "email",
          isSecret: false,
          canUpdate: true,
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "بیوگرافی",
          model: "",
          field: "bio",
          isSecret: false,
          canUpdate: true,
        },
        {
          isFile: false,
          isObject: false,
          type: "date",
          label: "تاریخ تولد",
          model: "",
          field: "birthDate",
          isSecret: false,
          canUpdate: true,
        },
        {
          isFile: true,
          isObject: false,
          type: "file",
          label: "عکس پروفایل",
          src: "",
          filename: "",
          model: "",
          isSecret: false,
          field: "avatar",
          canUpdate: true,
        },
        {
          isFile: true,
          isObject: false,
          type: "file",
          label: "فایل روزمه",
          src: "",
          isExternal: true,
          filename: "",
          model: "",
          isSecret: false,
          field: "resume",
          canUpdate: true,
        },
      ],
    };
    this.getUserInfo();
    this.getBasket();
    this.getReserve();
  },
  methods: {
    getFile() {
      this.$refs.myFile.$el.click();
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
          this.profileInfo.avatar = response.data.data.file.url;
          this.updateAvatar(response.data.data.file.filename);
        });
    },
    getReserve() {
      this.$axios
        .get(`panel/reserves`)
        .then((response) => {
          response.data.data.items.forEach((row, index) => {
            row.index = index + 1;
          });
          this.reserveTable.data = response.data.data.items;
          this.reserveTable.loading = false;



          response.data.data.items.forEach((row, index) => {
            row.index = index + 1;
          });
          this.deliveryTable.data = response.data.data.items.filter((x)=>x.deliveryType!='none');
          this.deliveryTable.loading = false;


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
    getBasket() {
      this.$axios
        .get(`panel/basket`)
        .then((response) => {
          response.data.data.items.forEach((row, index) => {
            row.index = index + 1;
          });
          this.basketTable.data = response.data.data.items;
          this.basketTable.loading = false;
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
    getUserInfo() {
      this.$axios
        .get(`panel/users/${this.$route.params.userId}`)
        .then((response) => {
          this.profileInfo = response.data.data.item;
          this.petInfo = response.data.data.petInfo;

          response.data.data.walletList.forEach((row, index) => {
            row.index = index + 1;
          });
          this.walletTable.data = response.data.data.walletList;
          this.walletTable.loading = false;
        })
        .catch((err) => {
          this.$q.notify({
            color: "negative",
            position: "top",
            message: "Loading failed",
            icon: "report_problem",
          });
        });
    },
    setUserInfo() {
      this.$axios
        .put(`panel/${this.$route.params.type}/${this.$route.params.id}`, {
          firstName: this.profileInfo.firstName,
          lastName: this.profileInfo.lastName,
          address: this.profileInfo.address,
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
        .put(`panel/${this.$route.params.type}/${this.$route.params.id}`, {
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
  },
};
</script>
