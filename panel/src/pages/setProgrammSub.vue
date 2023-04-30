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
      subsetUrl: 'setProgrammAll/:id',
      title: "پرداخت برنامه های مشاوران",
      filter: "",
      mode: "list",
      url: `setProgramPayment`,
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
          name: "mentorName",
          align: "left",
          label: "نام و نام خانوادگی مشاور",
          field: (row) => row.mentorId.firstName + ' ' + row.mentorId.lastName,
          sortable: true,
        },
        {
          name: "createdAt",
          align: "left",
          label: "تاریخ و زمان",
          field: (row) => row.createdAt,
          format: (val) =>
              `${new persianDate(Date.parse(val)).format("HH:mm YYYY-MM-DD")}`,
          sortable: true,
        },
        {
          name: "name",
          align: "left",
          label: "نام بسته",
          field: (row) => row.mentorPackageId.name,
          sortable: true,
        },
        {
          name: "price",
          align: "left",
          label: "مبلغ",
          field: (row)=>row.mentorPackageId.price,
          sortable: true,
        },
        {
          name: "duration",
          align: "left",
          label: "مدت زمان",
          field: (row)=>row.mentorPackageId.duration,
          sortable: true,
        },
        {
          name: "channel",
          align: "left",
          label: "کانال",
          field: (row)=>row.mentorPackageId.channel,
          format: (val) => (val ? "دارد" : "ندارد"),
          sortable: true,
        },
        {
          name: "setProgram",
          align: "left",
          label: "برنامه دادن",
          field: (row)=>row.mentorPackageId.setProgram,
          sortable: true,
          format: (val) => (val ? "دارد" : "ندارد"),
        },
        {
          name: "getReport",
          align: "left",
          label: "گزارش کار گرفتن",
          field: (row)=>row.mentorPackageId.getReport,
          format: (val) => (val ? "دارد" : "ندارد"),
          sortable: true,
        },
        {
          name: "callCount",
          align: "left",
          label: "تعداد تماس",
          field: (row)=>row.mentorPackageId.callId.callCount,
          sortable: true,
        },
        {
          name: "actions",
          label: "مشاهده برنامه",
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
          label: "نام و نام خانوادگی",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "mentorName",
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
          label: "تاریخ و ساعت",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "createdAt",
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "نام بسته",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "name",
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
          label: "تعداد تماس",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "callCount",
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "کانال",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "channel",
          options: [
            {
              label: "دارد",
              value: true,
            },
            {
              label: "ندارد",
              value: false,
            },
          ],
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "دیده",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "setProgram",
          options: [
            {
              label: "دارد",
              value: true,
            },
            {
              label: "ندارد",
              value: false,
            },
          ],
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "گزارش کار گرفتن",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "getReport",
          options: [
            {
              label: "دارد",
              value: true,
            },
            {
              label: "ندارد",
              value: false,
            },
          ],
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
          .get("setProgramPayment", {headers: config})
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
