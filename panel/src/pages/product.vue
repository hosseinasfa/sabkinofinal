<template>
  <q-page class="q-pt-xs">
    <div class="q-ma-md">
      <Table v-bind="table1" />
      <Table v-bind="table2" />
      <Table v-bind="table" />
    </div>
  </q-page>
</template>

<script>
import persianDate from "persian-date";
import Vue from "vue";
import IEcharts from "vue-echarts-v3/src/full.js";
import echarts from "echarts";
import { exportFile } from "quasar";
import Table from "../components/Table";
Vue.component("IEcharts", IEcharts);

function wrapCsvValue(val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');

  return `"${formatted}"`;
}

export default {
  components: {
    Table,
  },
  data() {
    return { table: null ,table2: null ,table1: null };
  },
  mounted() {
    this.table = {
      loading: true,
      canInsert: true,
      readonly: false,
      hasSubset: false,
      subsetUrl: "",
      title: "محصولات",
      filter: "",
      mode: "list",
      url: `model/product`,
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
          field: (row) => row.personId.firstName,
          sortable: true,
        },
        {
          name: "lastName",
          align: "left",
          label: "نام خانوادگی",
          field: (row) => row.personId.lastName,
          sortable: true,
        },
        {
          name: "phone",
          align: "left",
          label: "شماره تماس",
          field: (row) => row.personId.phone,
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
          name: "title",
          align: "left",
          label: "فایل نمونه",
          field: "samplePdf",
          sortable: true,
        },

        {
          name: "title",
          align: "left",
          label: "فایل اصلی",
          field: "originPdf",
          sortable: true,
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "تعداد فروش",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "sellCount",
        },
        {
          name: "educationalStageName",
          align: "left",
          label: "مقطع تحصیلی",
          field: (row) => row.educationalStageId.title,
          sortable: true,
        },
        {
          name: "educationalStageName",
          align: "left",
          label: "رشته تحصیلی",
          field: (row) => row.educationalFieldId.title,
          sortable: true,
        },
        {
          name: "status",
          align: "left",
          label: "وضعیت محصول",
          field: "status",
          format: (val) => {
            return [
              {
                label: "تایید شده",
                value: "accept",
              },
              {
                label: "تاییده نشده",
                value: "reject",
              },
              {
                label: "در حال بررسی",
                value: "pending",
              },
            ].find((x) => x.value == val).label;
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
          label: "نویسنده",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "author",
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
          label: "عنوان درس",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "titleLesson",
        },
        {
          isFile: false,
          isObject: true,
          type: "q-select",
          label: "مقطع تحصیلی",
          model: "",
          field: "educationalStageId",
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
          label: "مقطع تحصیلی",
          model: "",
          field: "educationalFieldId",
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
          label: "عکس شاخص",
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
          label: "فایل نمونه",
          src: "",
          isExternal: true,
          filename: "",
          model: "",
          isSecret: false,
          field: "samplePdf",
          canUpdate: true,
        },
        {
          isFile: true,
          isObject: false,
          type: "file",
          label: "فایل اصلی",
          src: "",
          isExternal: true,
          filename: "",
          model: "",
          isSecret: false,
          field: "originPdf",
          canUpdate: true,
        },
        {
          isFile: false,
          isObject: false,
          type: "q-select",
          label: "وضعیت محصول",
          model: "",
          field: "status",
          disable: false,
          canUpdate: true,
          key: "",
          displayKey: "",
          isSecret: false,
          options: [
            {
              label: "تایید شده",
              value: "accept",
            },
            {
              label: "تاییده نشده",
              value: "reject",
            },
            {
              label: "در حال بررسی",
              value: "pending",
            },
          ],
        },
      ],
    };

    this.table1 = {
      loading: true,
      canInsert: true,
      readonly: false,
      hasSubset: false,
      subsetUrl: "",
      title: "محصولات",
      filter: "",
      mode: "list",
      url: `model/product`,
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
          field: (row) => row.personId.firstName,
          sortable: true,
        },
        {
          name: "lastName",
          align: "left",
          label: "نام خانوادگی",
          field: (row) => row.personId.lastName,
          sortable: true,
        },
        {
          name: "phone",
          align: "left",
          label: "شماره تماس",
          field: (row) => row.personId.phone,
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
          name: "title",
          align: "left",
          label: "فایل نمونه",
          field: "samplePdf",
          sortable: true,
        },

        {
          name: "title",
          align: "left",
          label: "فایل اصلی",
          field: "originPdf",
          sortable: true,
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "تعداد فروش",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "sellCount",
        },
        {
          name: "educationalStageName",
          align: "left",
          label: "مقطع تحصیلی",
          field: (row) => row.educationalStageId.title,
          sortable: true,
        },
        {
          name: "educationalStageName",
          align: "left",
          label: "رشته تحصیلی",
          field: (row) => row.educationalFieldId.title,
          sortable: true,
        },
        {
          name: "status",
          align: "left",
          label: "وضعیت محصول",
          field: "status",
          format: (val) => {
            return [
              {
                label: "تایید شده",
                value: "accept",
              },
              {
                label: "تاییده نشده",
                value: "reject",
              },
              {
                label: "در حال بررسی",
                value: "pending",
              },
            ].find((x) => x.value == val).label;
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
          label: "نویسنده",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "author",
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
          label: "عنوان درس",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "titleLesson",
        },
        {
          isFile: false,
          isObject: true,
          type: "q-select",
          label: "مقطع تحصیلی",
          model: "",
          field: "educationalStageId",
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
          label: "مقطع تحصیلی",
          model: "",
          field: "educationalFieldId",
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
          label: "عکس شاخص",
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
          label: "فایل نمونه",
          src: "",
          isExternal: true,
          filename: "",
          model: "",
          isSecret: false,
          field: "samplePdf",
          canUpdate: true,
        },
        {
          isFile: true,
          isObject: false,
          type: "file",
          label: "فایل اصلی",
          src: "",
          isExternal: true,
          filename: "",
          model: "",
          isSecret: false,
          field: "originPdf",
          canUpdate: true,
        },
        {
          isFile: false,
          isObject: false,
          type: "q-select",
          label: "وضعیت محصول",
          model: "",
          field: "status",
          disable: false,
          canUpdate: true,
          key: "",
          displayKey: "",
          isSecret: false,
          options: [
            {
              label: "تایید شده",
              value: "accept",
            },
            {
              label: "تاییده نشده",
              value: "reject",
            },
            {
              label: "در حال بررسی",
              value: "pending",
            },
          ],
        },
      ],
    };

    this.table2 = {
      loading: true,
      canInsert: true,
      readonly: false,
      hasSubset: false,
      subsetUrl: "",
      title: "محصولات",
      filter: "",
      mode: "list",
      url: `model/product`,
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
          field: (row) => row.personId.firstName,
          sortable: true,
        },
        {
          name: "lastName",
          align: "left",
          label: "نام خانوادگی",
          field: (row) => row.personId.lastName,
          sortable: true,
        },
        {
          name: "phone",
          align: "left",
          label: "شماره تماس",
          field: (row) => row.personId.phone,
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
          name: "title",
          align: "left",
          label: "فایل نمونه",
          field: "samplePdf",
          sortable: true,
        },

        {
          name: "title",
          align: "left",
          label: "فایل اصلی",
          field: "originPdf",
          sortable: true,
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "تعداد فروش",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "sellCount",
        },
        {
          name: "educationalStageName",
          align: "left",
          label: "مقطع تحصیلی",
          field: (row) => row.educationalStageId.title,
          sortable: true,
        },
        {
          name: "educationalStageName",
          align: "left",
          label: "رشته تحصیلی",
          field: (row) => row.educationalFieldId.title,
          sortable: true,
        },
        {
          name: "status",
          align: "left",
          label: "وضعیت محصول",
          field: "status",
          format: (val) => {
            return [
              {
                label: "تایید شده",
                value: "accept",
              },
              {
                label: "تاییده نشده",
                value: "reject",
              },
              {
                label: "در حال بررسی",
                value: "pending",
              },
            ].find((x) => x.value == val).label;
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
          label: "نویسنده",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "author",
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
          label: "عنوان درس",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "titleLesson",
        },
        {
          isFile: false,
          isObject: true,
          type: "q-select",
          label: "مقطع تحصیلی",
          model: "",
          field: "educationalStageId",
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
          label: "مقطع تحصیلی",
          model: "",
          field: "educationalFieldId",
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
          label: "عکس شاخص",
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
          label: "فایل نمونه",
          src: "",
          isExternal: true,
          filename: "",
          model: "",
          isSecret: false,
          field: "samplePdf",
          canUpdate: true,
        },
        {
          isFile: true,
          isObject: false,
          type: "file",
          label: "فایل اصلی",
          src: "",
          isExternal: true,
          filename: "",
          model: "",
          isSecret: false,
          field: "originPdf",
          canUpdate: true,
        },
        {
          isFile: false,
          isObject: false,
          type: "q-select",
          label: "وضعیت محصول",
          model: "",
          field: "status",
          disable: false,
          canUpdate: true,
          key: "",
          displayKey: "",
          isSecret: false,
          options: [
            {
              label: "تایید شده",
              value: "accept",
            },
            {
              label: "تاییده نشده",
              value: "reject",
            },
            {
              label: "در حال بررسی",
              value: "pending",
            },
          ],
        },
      ],
    };

   


    this.getList();
    this.getList2();
    this.getList1();
  },
  methods: {
    SaveImage(type) {
      const linkSource = this.$refs[type].getDataURL();
      const downloadLink = document.createElement("a");
      document.body.appendChild(downloadLink);
      downloadLink.href = linkSource;
      downloadLink.target = "_self";
      downloadLink.download = type + ".png";
      downloadLink.click();
    },
    getList() {
      var tok = localStorage.getItem("token")
      let config = {'x-api-key': tok};
      this.$axios
        .get("model/product",{headers: config})
        .then((response) => {
          var frx =  response.data.data.items;
          var lastFlr = frx.filter(e => e.status === 'accept')
          lastFlr.forEach((row, index) => {
            row.index = index + 1;
          });
          this.table.data = lastFlr;
          this.table.loading = false;
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

    getList1() {
      var tok = localStorage.getItem("token")
      let config = {'x-api-key': tok};
      this.$axios
        .get("model/product",{headers: config})
        .then((response) => {
          var frh =  response.data.data.items;
          var lastFlh = frh.filter(e => e.status === 'pending')
          lastFlh.forEach((row, index) => {
            row.index = index + 1;
          });
          this.table1.data =lastFlh;
          this.table1.loading = false;
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

    getList2() {
      var tok = localStorage.getItem("token")
      let config = {'x-api-key': tok};
      this.$axios
        .get("model/product",{headers: config})
        .then((response) => {
          var fry =  response.data.data.items;
          var lastFly = fry.filter(e => e.status === 'reject')
         lastFly.forEach((row, index) => {
            row.index = index + 1;
          });
          this.table2.data =lastFly;
          this.table2.loading = false;
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

<style scoped>
.box_1 {
  color: #0dceec;
}

.box_2 {
  color: #fe434f;
}

.box_3 {
  color: #15ca20;
}

.box_4 {
  color: #ff9700;
}

.shadow {
  -webkit-box-shadow: 0 0 10px #bfbfbf !important;
  box-shadow: 0 0 10px #bfbfbf !important;
}

.progress-base {
  height: 8px;
  border-radius: 3px;
  background-color: #e9ecef;
}

.progress-bar-1 {
  height: 8px;
  border-radius: 3px;
  background: #17ead9;
  background: -webkit-linear-gradient(45deg, #17ead9, #6078ea) !important;
  background: linear-gradient(45deg, #17ead9, #6078ea) !important;
}

.progress-bar-2 {
  height: 8px;
  border-radius: 3px;
  background: #f54ea2;
  background: -webkit-linear-gradient(45deg, #f54ea2, #ff7676) !important;
  background: linear-gradient(45deg, #f54ea2, #ff7676) !important;
}

.progress-bar-3 {
  height: 8px;
  border-radius: 3px;
  background: #42e695;
  background: -webkit-linear-gradient(45deg, #42e695, #3bb2b8) !important;
  background: linear-gradient(45deg, #42e695, #3bb2b8) !important;
}

.progress-bar-4 {
  height: 8px;
  border-radius: 3px;
  background: #ffdf40;
  background: -webkit-linear-gradient(45deg, #ffdf40, #ff8359) !important;
  background: linear-gradient(45deg, #ffdf40, #ff8359) !important;
}

.border-top {
  border-top: 1px solid #efefef;
}

.chip_pending {
  background: #ffdf40;
  background: -webkit-linear-gradient(45deg, #ffdf40, #ff8359) !important;
  background: linear-gradient(45deg, #ffdf40, #ff8359) !important;
}

.chip_completed {
  background: #42e695;
  background: -webkit-linear-gradient(45deg, #42e695, #3bb2b8) !important;
  background: linear-gradient(45deg, #42e695, #3bb2b8) !important;
}
</style>
