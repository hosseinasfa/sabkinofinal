<template>
  <q-page class="q-pt-xs">
    <div class="q-ma-md">
      <Table v-bind="table" />
      <Table v-bind="tablee" />
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
      tablee:null,
    };
  },
  mounted() {
    this.getList();
     this.getListt();
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
    this.table = {
      loading: true,
      canInsert: false,
      readonly: false,
      hasSubset: false,
      canDeActive : false,
      subsetUrl:'/users/:id',
      title: "پشتیبان تایید شده",
      filter: "",
      mode: "list",
      url: `model/person-Support`,
      columns: [
        {
          name: "index",
          label: "#",
          field: "index",
          align: "left",
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
          name: "mode",
          align: "left",
          label: "وضعیت پشتیبان",
          field: (row) => row.mode === "accept" ? "تایید شده" : "",
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
          type: "q-select",
          label: "وضعیت پشتیبان",
          model: "",
          field: "mode",
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
              label: "در انتظار تایید",
              value: "pending",
            },
            {
              label: "رد شده",
              value: "reject",
            },
          ],
        },
        
      ],
    };

      var tok = localStorage.getItem("token")
      let config = {'x-api-key': tok};
      this.$axios
        .get("model/person-Support",{headers: config})
        .then((response) => {
            var res = response.data.data.items;
            var Fres = res.filter(e => e.mode === "accept");
            var Fress = Fres.filter(es => es.supportMentorId === this.$route.params.itemId );

          Fress.forEach((row, index) => {
            row.index = index + 1;
          });
          this.table.data = Fress;
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
    getListt() {
    this.tablee = {
      loading: true,
      canInsert: false,
      readonly: false,
      hasSubset: false,
      canDeActive : false,
      subsetUrl:'/users/:id',
      title: "لیست پشتیبانان در انتظار تایید و رد شده",
      filter: "",
      mode: "list",
      url: `model/person-Support`,
      columns: [
        
        {
          name: "index",
          label: "#",
          field: "index",
          align: "left",
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
          name: "mode",
          align: "left",
          label: "وضعیت پشتیبان",
          field: (row) => row.mode === "pending" ? "در انتظار تایید" : row.mode === "reject" ? "رد شده" : "",
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
          type: "q-select",
          label: "وضعیت پشتیبان",
          model: "",
          field: "mode",
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
              label: "در انتظار تایید",
              value: "pending",
            },
            {
              label: "رد شده",
              value: "reject",
            },
          ],
        },
      ],
    };

      var tok = localStorage.getItem("token")
      let config = {'x-api-key': tok};
      this.$axios
        .get("model/person-Support",{headers: config})
        .then((response) => {
            var res = response.data.data.items;
            var Fres = res.filter(e => e.mode === "pending" || e.mode === "reject" );
            var Fress = Fres.filter(es => es.supportMentorId === this.$route.params.itemId );

          Fress.forEach((row, index) => {
            row.index = index + 1;
          });
          this.tablee.data = Fress;
          this.tablee.loading = false;
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
