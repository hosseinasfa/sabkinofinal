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
    // return {table: null};

    return {
      // Table column props are defined here....
      table: null,
    };
  },
  mounted() {
    this.table = {
      loading: true,
      canInsert: true,
      readonly: false,
      hasSubset: true,
      subsetUrl: '/vipPst/:id',
      title: "لیست پست های ویترین",
      filter: "",
      mode: "list",
      url: `vipPst`,
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
          label: "کپشن",
          field: "title",
          sortable: true,
        },

        {
          name: "title",
          align: "left",
          label: "عکس",
          field: "avatar",
          sortable: true,
        },
        {
          name: "postLike",
          align: "left",
          label: "تعداد لایک",
          field: "postLike",
          sortable: true,
        },
        {
          name: "postSaved",
          align: "left",
          label: "تعداد ذخیره پست",
          field: "postSaved",
          sortable: true,
        },
        {
          name: "follower",
          align: "left",
          label: "تعداد فالوور",
          field: (row) => row.userId.follower,
          sortable: true,
        },
        {
          name: "following",
          align: "left",
          label: "تعداد فالووینگ",
          field: (row) => row.userId.following,
          sortable: true,
        },

        {
          name: "date",
          align: "left",
          label: "تاریخ شروع",
          field: (row) => row.startDate,
          format: (val) =>
              `${new persianDate(Date.parse(val)).format("YYYY-MM-DD")}`,
          sortable: true,
        },
        {
          name: "date",
          align: "left",
          label: "تاریخ پایان",
          field: (row) => row.endDate,
          format: (val) =>
              `${new persianDate(Date.parse(val)).format("YYYY-MM-DD")}`,
          sortable: true,
        },
        {
          name: "time",
          align: "left",
          label: "ساعت شروع",
          field: (row) => row.startTime,
          // format: (val) =>
          //   `${new persianDate(Date.parse(val)).format("H:mm:ss")}`,
          sortable: true,
        },
        {
          name: "time",
          align: "left",
          label: "ساعت پایان",
          field: (row) => row.endTime,
          // format: (val) =>
          //   `${new persianDate(Date.parse(val)).format("H:mm:ss")}`,
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
          isFile: true,
          isObject: false,
          type: "file",
          label: "عکس",
          src: "",
          filename: "",
          model: "",
          isSecret: false,
          field: "avatar",
          canUpdate: true,
        },
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
          label: "تعداد لایک",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "postLike",
        },
        {
          isFile: false,
          isObject: false,
          type: "date",
          label: "تاریخ شروع",
          model: "",
          field: "startDate",
          isSecret: false,
          canUpdate: true,
        },
        {
          isFile: false,
          isObject: false,
          type: "date",
          label: "تاریخ پایان",
          model: "",
          field: "endDate",
          isSecret: false,
          canUpdate: true,
        },
        {
          isFile: false,
          isObject: false,
          type: "time",
          label: "ساعت شروع",
          model: "",
          field: "startTime",
          isSecret: false,
          canUpdate: true,
        },
        {
          isFile: false,
          isObject: false,
          type: "time",
          label: "ساعت پایان",
          model: "",
          field: "endTime",
          isSecret: false,
          canUpdate: true,
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "تعداد ذخیره پست",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "postSaved",
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
          .get("vipPst", {headers: config})
          .then((response) => {
            response.data.data.items.forEach((row, index) => {
              row.index = index + 1;
            });

            // var res = response.data.data.items;
            // var sort = res.reverse();

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
