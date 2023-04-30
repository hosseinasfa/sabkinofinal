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
            <q-tab name="users" icon="person" label="کاربران" />
            <q-tab name="pets" icon="pets" label="پت ها" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="users">
              <Table v-bind="emailsTable" />
            </q-tab-panel>
            <q-tab-panel name="pets">
              <Table v-bind="contactUsTable" />
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>
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
      splitterModel: 20,
      tab: "info",
      file: null,
      info: {},
      gallery: [],
      emailsTable: null,
      contactUsTable:null,
      provinceTable:null,
      normalServiceTable:null,
      vipServiceTable:null
    };
  },
  mounted() {

    this.vipServiceTable= {
      loading: true,
      canInsert: true,
      readonly: false,
      hasSubset: false,
      subsetUrl: "",
      title: "لیست خدمات ویژه",
      filter: "",
      mode: "list",
      url: `panel/categories/vip`,
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
      ],
    };


    this.normalServiceTable= {
      loading: true,
      canInsert: true,
      readonly: false,
      hasSubset: false,
      subsetUrl: "",
      title: "لیست خدمات عادی",
      filter: "",
      mode: "list",
      url: `panel/categories/normal`,
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
      ],
    };


    this.provinceTable= {
      loading: true,
      canInsert:false,
      readonly:true,
      hasSubset:true,
      subsetUrl:'/provinces/:id',
      title: "لیست استان ها",
      filter: "",
      mode: "list",
      url: `panel/provinces`,
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
          label: "نام",
          field: "title",
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
        
      ],
    };
    this.contactUsTable= {
      loading: true,
      canInsert: false,
      readonly: true,
      hasSubset: false,
      tableMode:"",
      subsetUrl: "",
      title: "لیست ارتباط با ما",
      filter: "",
      mode: "grid",
      url: `panel/contactUs`,
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
          name: "caption",
          align: "left",
          label: "توضیحات",
          field: "caption",
          sortable: true,
        },
      ],
      data: [],
      itemId: "",
      form: [],
    };
    this.emailsTable= {
      loading: true,
      canInsert:false,
      readonly:true,
      hasSubset:false,
      subsetUrl:'',
      title: "لیست ایمیل ها",
      filter: "",
      mode: "list",
      url: `panel/info`,
      columns: [
        {
          name: "index",
          label: "#",
          field: "index",
          align: "left",
          sortable: true,
        },
        {
          name: "email",
          align: "left",
          label: "ایمیل",
          field: "email",
          sortable: true,
        },
      ],
      data: [],
      itemId: "",
      form: [],
    };
    this.getInfo();
    this.getVipCategoryList();
    this.getNormalCategoryList();
  },
  methods: {
    getVipCategoryList() {
      var tok = localStorage.getItem("token")
      let config = {'x-api-key': tok};
      this.$axios
        .get("panel/categories/vip",{headers: config})
        .then((response) => {
          response.data.data.items.forEach((row, index) => {
            row.index = index + 1;
          });
          this.vipServiceTable.data = response.data.data.items;
          this.vipServiceTable.loading = false;
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
    getNormalCategoryList() {
      var tok = localStorage.getItem("token")
      let config = {'x-api-key': tok};

      this.$axios
        .get("panel/categories/normal",{headers: config})
        .then((response) => {
          response.data.data.items.forEach((row, index) => {
            row.index = index + 1;
          });
          this.normalServiceTable.data = response.data.data.items;
          this.normalServiceTable.loading = false;
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
    getInfo() {
            var tok = localStorage.getItem("token")
      let config = {'x-api-key': tok};

      this.$axios
        .get(`panel/info`,{headers: config})
        .then((response) => {
          this.info = response.data.data.item;
          this.gallery = response.data.data.item.gallery;
          response.data.data.item.emails.forEach((row, index) => {
            row.index = index + 1;
          });
          this.emailsTable.data = response.data.data.item.emails;
          this.emailsTable.loading = false;


          response.data.data.item.contactUsList.forEach((row, index) => {
            row.index = index + 1;
          });
          this.contactUsTable.data = response.data.data.item.contactUsList;
          this.contactUsTable.loading = false;

          response.data.data.item.provinceList.forEach((row, index) => {
            row.index = index + 1;
          });
          this.provinceTable.data = response.data.data.item.provinceList;
          this.provinceTable.loading = false;

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
