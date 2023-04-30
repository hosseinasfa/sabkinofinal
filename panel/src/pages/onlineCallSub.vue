<template>
  <q-page className="q-pt-xs">
    <div className="q-ma-md">
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
      hasSubset: false,
      subsetUrl: '/feedbackCallUser/:id',
      title: "بازخورد دانش آموز",
      filter: "",
      mode: "list",
      url: `feedbackCallUser`,
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
          label: "نام کاربر",
          field: (row) => row.userId.firstName,
          sortable: true,
        },
        {
          name: "lastName",
          align: "left",
          label: "نام خانوادگی",
          field: (row) => row.userId.lastName,
          sortable: true,
        },
        {
          name: "status",
          align: "left",
          label: "وضعیت",
          field: "status",
          sortable: true,
          format: (val) => {
            if (val == 'success') {
              return "موقق";
            } else if (val == 'absence') {
              return "عدم حضور";
            } else if (val == 'technical_issues') {
              return "مشکلات فنی";
            }
          },
        },
        {
          name: "customer_satisfaction",
          align: "left",
          label: "میزان رضایت از تماس",
          field: "customer_satisfaction",
          sortable: true,
        },
        {
          name: "mentor_skill",
          align: "left",
          label: "میزان مهارت و دانش مشاور",
          field: "mentor_skill",
          sortable: true,
        },
        {
          name: "ethics_fundamental",
          align: "left",
          label: "میزان رعایت اصول اخلاقی",
          field: "ethics_fundamental",
          sortable: true,
        },
        {
          name: "mentor_result",
          align: "left",
          label: "میزان نتیجه بخش بودن مشاور",
          field: "mentor_result",
          sortable: true,
        },
        {
          name: "availability_conditions",
          align: "left",
          label: "میزان مهیا بودن شرایط مشاور",
          field: "availability_conditions",
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
          name: "critics",
          align: "left",
          label: "انتقادات و پیشنهادات",
          field: "critics",
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
          .get("feedbackCallUser", {headers: config})
          .then((response) => {
            var res = response.data.data.items;
            var Fres = res.filter(e => e.mentorId._id === this.$route.params.itemId);
            
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
