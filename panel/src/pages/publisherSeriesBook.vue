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
    return {table:null};
  },
  mounted() {
    this.table= {
      loading: true,
      canInsert:true,
      readonly:false,
      hasSubset:false,
      subsetUrl:``,
      title: "لیست کتاب های سری",
      filter: "",
      mode: "list",
      url: `model/publisherSeriesBook`,
      query:{
        publisherId:this.$route.params.itemId,
        publisherSeriesId:this.$route.params.subId,
      },
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
          label: "نام",
          field: "title",
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
          label: "توضیحات",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "caption",
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
          label: "عکس کاور",
          src: "",
          filename: "",
          model: "",
          isSecret: false,
          field: "cover",
          canUpdate: true,
        },

        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "قطع",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "cut",
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "هشتگ ها",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "hashtag",
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "درجه سختی",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "hardRate",
        },
        {
          isFile: false,
          isObject: false,
          type: "q-select",
          label: "آیا سوالات تستی دارد؟",
          model: "",
          field: "multipleChoiceQuestions",
          disable: false,
          canUpdate: true,
          key: "",
          displayKey: "",
          isSecret: false,
          options: [
            {
              label: "بله",
              value: true,
            },
            {
              label: "خیر",
              value: false,
            },
          ],
        },
        {
          isFile: false,
          isObject: false,
          type: "q-select",
          label: "آیا سوالات تشریحی دارد؟",
          model: "",
          field: "descriptiveQuestions",
          disable: false,
          canUpdate: true,
          key: "",
          displayKey: "",
          isSecret: false,
          options: [
            {
              label: "بله",
              value: true,
            },
            {
              label: "خیر",
              value: false,
            },
          ],
        },
        {
          isFile: false,
          isObject: false,
          type: "q-select",
          label: "آیا درسنامه دارد؟",
          model: "",
          field: "textbook",
          disable: false,
          canUpdate: true,
          key: "",
          displayKey: "",
          isSecret: false,
          options: [
            {
              label: "بله",
              value: true,
            },
            {
              label: "خیر",
              value: false,
            },
          ],
        },
        {
          isFile: false,
          isObject: false,
          type: "q-select",
          label: "آیا سوالات کنکور دارد؟",
          model: "",
          field: "concoursQuestions",
          disable: false,
          canUpdate: true,
          key: "",
          displayKey: "",
          isSecret: false,
          options: [
            {
              label: "بله",
              value: true,
            },
            {
              label: "خیر",
              value: false,
            },
          ],
        },
        {
          isFile: false,
          isObject: false,
          type: "q-select",
          label: "آیا ضمیمه رایگان دارد؟",
          model: "",
          field: "freeAttachment",
          disable: false,
          canUpdate: true,
          key: "",
          displayKey: "",
          isSecret: false,
          options: [
            {
              label: "بله",
              value: true,
            },
            {
              label: "خیر",
              value: false,
            },
          ],
        },
        {
          isFile: false,
          isObject: false,
          type: "q-select",
          label: "آیا پاسخنامه تشریحی دارد؟",
          model: "",
          field: "descriptiveAnswer",
          disable: false,
          canUpdate: true,
          key: "",
          displayKey: "",
          isSecret: false,
          options: [
            {
              label: "بله",
              value: true,
            },
            {
              label: "خیر",
              value: false,
            },
          ],
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "مقطع",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "stage",
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "رشته",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "field",
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
        .get(`model/publisherSeriesBook/search/publisherSeriesId=${this.$route.params.subId}`,{headers: config})
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
