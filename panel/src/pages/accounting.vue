<template>
  <q-page class="q-pt-xs">
    <div class="q-ma-md">
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
import moment from 'moment'
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
    };
  },
  mounted() {
    var x = moment.months();
    console.log(x)
    this.table = {
      canDeActive : false,
      loading: false,
      canInsert: true,
      readonly: true,
      hasSubset: true,
      subsetUrl:'/accounting/:id',
      title: "حسابداری",
      filter: "",
      mode: "list",
      url: `model/withdrawalDetail`,
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
          label: "نام ماه",
          field: (row) => row.Month,
          sortable: true,
        },
        {
          name: "lastName",
          align: "left",
          label: "سال",
          field: (row) => row.Year,
          sortable: true,
        },

        {
          name: "actions",
          label: "عملیات",
          field: "actions",
          align: "left",
        },
      ],
      data: [
        {_id : "farvardin"  , Month : "فروردین", Year : "1401" },
        {_id : "ordibehesht"  , Month : "اردیبهشت",Year : "1401"},
        {_id : "khordad"  , Month : "خرداد",Year : "1401"},
        {_id : "tir"  , Month : "تیر",Year : "1401"},
        {_id : "mordad"  , Month : "مرداد",Year : "1401"},
        {_id : "shahrivar"  , Month : "شهریور",Year : "1401"},
        {_id : "mehr"  , Month : "مهر",Year : "1401"},
        {_id : "aban"  , Month : "آبان",Year : "1401"},
        {_id : "azar"  , Month : "آذر",Year : "1401"},
        {_id : "dey"  , Month : "دی",Year : "1401"},
        {_id : "bahman"  , Month : "بهمن",Year : "1401"},
        {_id : "esfand"  , Month : "اسفند",Year : "1401"},
      ],
      itemId: "",
      form: [
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "نام",
          model: "",
          field: "firstName",
          isSecret: false,
          canUpdate: true,
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
          label: "کد ملی",
          model: "",
          field: "nationalCode",
          isSecret: false,
          canUpdate: true,
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "نام پدر",
          model: "",
          field: "fatherName",
          isSecret: false,
          canUpdate: true,
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "شماره موبایل",
          model: "",
          field: "phone",
          isSecret: false,
          canUpdate: true,
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "استان",
          model: "",
          field: "province",
          isSecret: false,
          canUpdate: true,
        },

        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "شهر",
          model: "",
          field: "citie",
          isSecret: false,
          canUpdate: true,
        },
        
        {
          isFile: false,
          isObject: false,
          type: "q-select",
          label: "وضعیت",
          model: "",
          field: "isActive",
          disable: false,
          canUpdate: true,
          key: "",
          displayKey: "",
          isSecret: false,
          options: [
            {
              label: "فعال",
              value: true,
            },
            {
              label: "غیرفعال",
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
      // var tok = localStorage.getItem("token")
      // let config = {'x-api-key': tok};
      // this.$axios
      //   .get("model/withdrawalDetail",{headers: config})
      //   .then((response) => {
      //     response.data.data.items.forEach((row, index) => {
      //       row.index = index + 1;
      //     });
      //     this.table.data = response.data.data.items;
      //     this.table.loading = false;
      //     var y = response.data.data.items.date
      //     console.log(y)
      //     var m = response.data.data.items.map((e)=> e.date)
      //      var z = new persianDate(Date.parse(m)).format("YYYY-MM-DD");
      //      console.log(m)
      //   })
      //   .catch(() => {
      //     this.$q.notify({
      //       color: "negative",
      //       position: "top",
      //       message: "Loading failed",
      //       icon: "report_problem",
      //     });
      //   });
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
