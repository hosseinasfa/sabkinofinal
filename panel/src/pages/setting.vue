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
    return {table: null,
     
                };
  },
  mounted() {
    this.table = {
      loading: true,
      canInsert: false,
      readonly: false,
      hasSubset: true,
      subsetUrl: '/setting/:id',
      title: "تنظیمات",
      filter: "",
      mode: "list",
      url: `setting`,
      columns: [
        {
          name: "index",
          label: "#",
          field: "index",
          align: "left",
          sortable: true,
        },
        {
          name: "siteTitle",
          align: "left",
          label: "عنوان سایت",
          field: "siteTitle",
          sortable: true,
        },
        {
          name: "siteKeyword",
          align: "left",
          label: "کلمات کلیدی",
          field: "siteKeyword",
          sortable: true,
        },
        {
          name: "siteDescription",
          align: "left",
          label: "توضیحات سایت",
          field: "siteDescription",
          sortable: true,
        },
        {
          name: "ruleAcademicAdvice",
          align: "left",
          label: "قرارداد مشاوره تحصیلی",
          field: "ruleAcademicAdvice",
          sortable: true,
        },
        // {
        //   name: "termsConditions",
        //   align: "left",
        //   label: "قواینن و مقررات",
        //   field: "termsConditions",
        //   sortable: true,
        // },
        // {
        //   name: "aboutApp",
        //   align: "left",
        //   label: "درباره اپ",
        //   field: "aboutApp",
        //   sortable: true,
        // },
        // {
        //   name: "privacyApp",
        //   align: "left",
        //   label: "حریم خصوصی",
        //   field: "privacyApp",
        //   sortable: true,
        // },
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
          label: "عنوان سایت",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "siteTitle",
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "کلمات کلیدی",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "siteKeyword",
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "توضیحات",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "siteDescription",
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "قرارداد مشاوره تحصیلی",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "ruleAcademicAdvice",
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "قوانین و مقررات",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "termsConditions",
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "درباره اپ",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "aboutApp",
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "حریم خصوصی",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "privacyApp",
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "متن بروزرسانی",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "updateText",
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
          .get("setting",{headers: config})
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
