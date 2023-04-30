<template>
  <q-page class="q-pt-xs">
    <div class="q-ma-md">
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
    return {
      table:null,
      table2:null,
    };
  },
  mounted() {
    this.table = {
      canDeActive : false,
      loading: true,
      canInsert: false,
      readonly: false,
      hasSubset: true,
      subsetUrl:'/itemReport/postShop/:id',
      title: `لیست گزارشات فروشگاه `,
      filter: "",
      mode: "list",
      url: `model/report`,
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
          label: "نام گزارش دهنده",
          field: (row) => row.reportUserId.firstName || row.reportUserId.managerName,
          sortable: true,
        },
        {
          name: "lastName",
          align: "left",
          label: "نام خانوادگی گزارش دهنده",
          field: (row) => row.reportUserId.lastName ?? 'نامشخص',
          sortable: true,
        },
        {
          name: "lastName",
          align: "left",
          label: "نوع کاربری گزارش دهنده",
          field: (row) => row.reportUserId.class === "user" ? "دانش آموز" : row.reportUserId.class === "mentor" ? "مشاور" : row.reportUserId.class === "teacher" ? "معلم" : row.reportUserId.class === "family" ? "خانواده" : row.reportUserId.class === "schoolBoss" ? "مدیر مدرسه" : row.reportUserId.class === "educationalInstitutions" ? "مدیر آموزشگاه" : "",
          sortable: true,
        },

        {
          name: "firstName",
          align: "left",
          label: "محصول گزارش شده",
          field: (row) => row.productId.title,
          sortable: true,
        },
        
        {
          name: "firstName",
          align: "left",
          label: "فایل نمونه",
          field: (row) => row.productId.samplePdf,
          sortable: true,
        },

        {
          name: "firstName",
          align: "left",
          label: "فایل اصلی",
          field: (row) => row.productId.originPdf,
          sortable: true,
        },
       
        {
          name: "nationalCode",
          align: "left",
          label: "عنوان گزارش ",
          field: (row) => row.reportTitle === "Aggressive" ? "خشونت آمیز" : row.reportTitle === "Fraud" ? "کلاه برداری" : row.reportTitle === "Copyright" ? "نقض کپی رایت" : row.reportTitle === "Spam" ? "هرزنامه" : row.reportTitle === "Other" ? "سایر" : row.reportTitle === "Swear" ? "مستهجن" : null ,
          sortable: true,
        },
         {
          name: "Handling",
          align: "left",
          label: "وضعیت رسیدگی؟",
          field: "Handling",
          format: (val) => (val ? "رسیدگی شده" : "رسیدگی نشده "),
          sortable: true,
        },
        {
          name: "actions",
          label: "مشاهده محصول",
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
          type: "q-select",
          label: "وضعیت رسیدگی ",
          model: "",
          field: "Handling",
          disable: false,
          canUpdate: true,
          key: "",
          displayKey: "",
          isSecret: false,
          options: [
            {
              label: "رسیدگی شده",
              value: true,
            },
            {
              label: "رسیدگی نشده",
              value: false,
            },

          ],
        },
      ],
    };
    this.table2 = {
      canDeActive : false,
      loading: true,
      canInsert: false,
      readonly: false,
      hasSubset: true,
      subsetUrl:'/itemReport/postShop/:id',
      title: `لیست گزارشات فروشگاه `,
      filter: "",
      mode: "list",
      url: `model/report`,
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
          label: "نام گزارش دهنده",
          field: (row) => row.reportUserId.firstName || row.reportUserId.managerName,
          sortable: true,
        },
        {
          name: "lastName",
          align: "left",
          label: "نام خانوادگی گزارش دهنده",
          field: (row) => row.reportUserId.lastName ?? 'نامشخص',
          sortable: true,
        },
        {
          name: "lastName",
          align: "left",
          label: "نوع کاربری گزارش دهنده",
          field: (row) => row.reportUserId.class === "user" ? "دانش آموز" : row.reportUserId.class === "mentor" ? "مشاور" : row.reportUserId.class === "teacher" ? "معلم" : row.reportUserId.class === "family" ? "خانواده" : row.reportUserId.class === "schoolBoss" ? "مدیر مدرسه" : row.reportUserId.class === "educationalInstitutions" ? "مدیر آموزشگاه" : "",
          sortable: true,
        },

        {
          name: "firstName",
          align: "left",
          label: "محصول گزارش شده",
          field: (row) => row.productId.title,
          sortable: true,
        },
        
        {
          name: "firstName",
          align: "left",
          label: "فایل نمونه",
          field: (row) => row.productId.samplePdf,
          sortable: true,
        },

        {
          name: "firstName",
          align: "left",
          label: "فایل اصلی",
          field: (row) => row.productId.originPdf,
          sortable: true,
        },
       
        {
          name: "nationalCode",
          align: "left",
          label: "عنوان گزارش ",
          field: (row) => row.reportTitle === "Aggressive" ? "خشونت آمیز" : row.reportTitle === "Fraud" ? "کلاه برداری" : row.reportTitle === "Copyright" ? "نقض کپی رایت" : row.reportTitle === "Spam" ? "هرزنامه" : row.reportTitle === "Other" ? "سایر" : row.reportTitle === "Swear" ? "مستهجن" : null ,
          sortable: true,
        },
         {
          name: "Handling",
          align: "left",
          label: "وضعیت رسیدگی؟",
          field: "Handling",
          format: (val) => (val ? "رسیدگی شده" : "رسیدگی نشده "),
          sortable: true,
        },
        {
          name: "actions",
          label: "مشاهده محصول",
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
          type: "q-select",
          label: "وضعیت رسیدگی ",
          model: "",
          field: "Handling",
          disable: false,
          canUpdate: true,
          key: "",
          displayKey: "",
          isSecret: false,
          options: [
            {
              label: "رسیدگی شده",
              value: true,
            },
            {
              label: "رسیدگی نشده",
              value: false,
            },

          ],
        },
      ],
    };

    this.getList();
    this.getList2();
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
        .get("model/report",{headers: config})
        .then((response) => {
            var res = response.data.data.items;
            var Fres = res.filter(e => e.type === "shop" && e.Handling === true);
            
          Fres.forEach((row, index) => {
            row.index = index + 1;
          });
          this.table.data = Fres;
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

    getList2() {
      var tok = localStorage.getItem("token")
      let config = {'x-api-key': tok};
      this.$axios
        .get("model/report",{headers: config})
        .then((response) => {
            var res = response.data.data.items;
            var Fres = res.filter(e => e.type === "shop" && e.Handling === false);
           
          Fres.forEach((row, index) => {
            row.index = index + 1;
          });
          this.table2.data = Fres;
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
