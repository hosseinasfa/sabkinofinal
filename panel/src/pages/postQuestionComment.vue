<template>
  <q-page class="q-pt-xs">
    <div class="q-ma-md">
      <Table v-bind="table"/>
    </div>
  </q-page>
</template>

<script>
import persianDate from "persian-date";
import Vue from "vue";
import IEcharts from "vue-echarts-v3/src/full.js";
import echarts from "echarts";
import {exportFile} from "quasar";
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
    return {table: null};
  },
  mounted() {
    this.table = {
      loading: true,
      canInsert: false,
      readonly: true,
      hasSubset: true,
    subsetUrl: "itemComment/:id",
      title: "لیست پاسخ ها",
      filter: "",
      mode: "list",
      url: `itemComment`,
      data: [],
      
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
    label: "نام پاسخ دهنده",
    field: (row) => row.personId.firstName,
    sortable: true,
  },
  {
    name: "lastName",
    align: "left",
    label: "نام خانوادگی پاسخ دهنده",
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
    name: "class",
    align: "left",
    label: "نوع کاربری",
    field: (row) => row.personId.class === "mentor" ? "مشاور" : row.personId.class === "user" ? "دانش آموز" : row.personId.class === "teacher" ? "معلم" : row.personId.class === "family" ? "خانواده" : row.personId.class === "schoolBoss" ? "مدرسه" : row.personId.class === "educationalInstitutions" ? "آموزشگاه" : "",
    sortable: true,
  },
  {
    name: "caption",
    align: "left",
    label: "متن پاسخ",
    field: (row) => row.caption ,
    sortable: true,
  },
//   {
//     name: "personLastName",
//     align: "left",
//     label: "عکس پرسمان",
//     field: (row) => row.avatar[0].filename,
//     sortable: true,
//   },
  
//   {
//     name: "sort",
//     align: "left",
//     label: "امتیاز",
//     field: (row) => row.sort,
//     sortable: true,
//   },
//   {
//     name: "date",
//     align: "left",
//     label: "تاریخ",
//     field: (row) => row.createdAt,
//     format: (val) =>
//       `${new persianDate(Date.parse(val)).format("YYYY-MM-DD")}`,
//     sortable: true,
//   },
//   {
//     name: "time",
//     align: "left",
//     label: "ساعت",
//     field: (row) => row.createdAt,
//     format: (val) =>
//       `${new persianDate(Date.parse(val)).format("H:mm:ss")}`,
//     sortable: true,
//   },
//   {
//     name: "actions",
//     label: "مشاهده پاسخ",
//     field: "actions",
//     align: "left",
//   },
],
      itemId: "",
      form: [
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "نام کاربر",
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
          canUpdate: true,
          isSecret: false,
          field: "lastName",
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "میزان رضایت از تماس",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "customer_satisfaction",
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "میزان مهارت و دانش مشاور",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "mentor_skill",
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "میزان رعایت اصول اخلاقی",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "ethics_fundamental",
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "میزان نتیجه بخش بودن مشاور",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "mentor_result",
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "میزان مهیا بودن شرایط مشاور",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "availability_conditions",
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "وضعیت",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "status",
          options: [
            {
              label: "موفق",
              value: 'success',
            },
            {
              label: "عدم حضور",
              value: 'absence',
            },
            {
              label: "مشکلات فنی",
              value: 'technical_issues',
            },
          ]
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "انتقادات و پیشنهادات",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "critics",
        },
      ],
    };
    this.getList();
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
        .get(`model/itemComment`,{headers: config})
        .then((response) => {
            var res = response.data.data.items;
             var Fres = res.filter(e => e.refId._id === this.$route.params.itemId);
            
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
