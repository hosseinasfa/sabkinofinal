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
      hasSubset: false,
      subsetUrl: '/periodMentorPayment/:id',
      title: "پرداخت دوره های مشاور",
      filter: "",
      mode: "list",
      url: `periodMentorPayment`,
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
          name: "name",
          align: "left",
          label: "نام دوره",
          field: (row) => row.periodMentorId.name,
          sortable: true,
        },
        {
          name: "topic",
          align: "left",
          label: "موضوع دوره",
          field: (row) => row.periodMentorId.topic,
          sortable: true,
        },
        {
          name: "grade",
          align: "left",
          label: "مقطع",
          field: (row) => row.periodMentorId.grade,
          sortable: true,
        },
        {
          name: "sessionCount",
          align: "left",
          label: "تعداد جلسات",
          field: (row) => row.periodMentorId.sessionCount,
          sortable: true,
        },
        {
          name: "duration",
          align: "left",
          label: "مدت زمان",
          field: (row) => row.periodMentorId.duration,
          sortable: true,
        },
        {
          name: "description",
          align: "left",
          label: "توضیحات",
          field: (row) => row.periodMentorId.description,
          sortable: true,
        },
        {
          name: "rate",
          align: "left",
          label: "امتیاز",
          field: (row) => row.periodMentorId.rate,
          sortable: true,
        },
        {
          name: "price",
          align: "left",
          label: "مبلغ",
          field: "price",
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
          label: "مدت زمان",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "duration",
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
          canUpdate: true,
          isSecret: false,
          field: "lastName",
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "مبلغ",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "price",
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "مقطع",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "grade",
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "امتیاز",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "rate",
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "تعداد جلسات",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "sessionCount",
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "عنوان دوره",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "topic",
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "توضیحات",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "description",
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
          .get("periodMentorPayment", {headers: config})
          .then((response) => {
            response.data.data.items.forEach((row, index) => {
              row.index = index + 1;
            });

            this.table.data = response.data.data.items;
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
