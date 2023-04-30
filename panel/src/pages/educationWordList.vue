<template>
  <q-page class="q-pt-xs">
    <q-card>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="words" label="لیست کلمات" />
        <q-tab name="subs" label="زیرمجموعه ها" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="words">
          <Table v-bind="wordListTable" />
        </q-tab-panel>

        <q-tab-panel name="subs">
          <Table v-bind="subTable" />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
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
  watch: {
    "$route.params.educationId": function (id) {
      this.getList();
    },
  },
  data() {
    return {
      tab: "words",
      subTable: null,
      wordListTable: null,
      componentKey: 0,
    };
  },

  mounted() {
    this.getList();
  },
  methods: {
    forceRerender() {
      this.componentKey += 1 + Math.random() * Date.now();
    },
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
      this.subTable = null;
      this.wordListTable = null;
      this.forceRerender();
      this.subTable = {
        loading: true,
        canInsert: true,
        readonly: false,
        hasSubset: true,
        subsetUrl: "/education/:id",
        title: "لیست آموزش",
        filter: "",
        mode: "list",
        url: `education/${this.$route.params.educationId}/subs`,
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
            label: "عنوان",
            field: (row) => row.title,
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
            label: "لینک دانلود",
            src: "",
            isExternal: true,
            filename: "",
            model: "",
            isSecret: false,
            field: "downloadLink",
            canUpdate: true,
          },
          {
            isFile: false,
            isObject: false,
            type: "q-select",
            label: "نوع",
            model: "",
            field: "class",
            disable: false,
            canUpdate: true,
            key: "",
            displayKey: "",
            isSecret: false,
            options: [
              {
                label: "کلمات",
                value: "words",
              },
              {
                label: "دیکته",
                value: "dictation",
              },
              {
                label: "آموزش واژگان",
                value: "VocabularyTraining",
              },
            ],
          },
          {
            isFile: false,
            isObject: true,
            type: "q-select",
            label: "مقطع تحصیلی",
            model: "",
            field: "educationalStageId",
            disable: true,
            canUpdate: false,
            key: "_id",
            displayKey: "title",
            isSecret: false,
            options: [],
          },
          {
            isFile: false,
            isObject: true,
            type: "q-select",
            label: "رشته تحصیلی",
            model: "",
            field: "educationalFieldId",
            disable: true,
            canUpdate: false,
            key: "_id",
            displayKey: "title",
            isSecret: false,
            options: [],
          },
        ],
      };

      this.wordListTable = {
        loading: true,
        canInsert: true,
        readonly: false,
        hasSubset: false,
        subsetUrl: "",
        title: "لیست کلمات",
        filter: "",
        mode: "list",
        url: `education/${this.$route.params.educationId}/wordList`,
        columns: [
          {
            name: "index",
            label: "#",
            field: "index",
            align: "left",
            sortable: true,
          },
          {
            name: "originWord",
            align: "left",
            label: "کلمه",
            field: (row) => row.originWord,
            sortable: true,
          },
          {
            name: "meaningWord",
            align: "left",
            label: "معنی",
            field: (row) => row.meaningWord,
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
            label: "کلمه",
            model: "",
            canUpdate: true,
            isSecret: false,
            field: "originWord",
          },
          {
            isFile: false,
            isObject: false,
            type: "q-input",
            label: "معنی",
            model: "",
            canUpdate: true,
            isSecret: false,
            field: "meaningWord",
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
            label: "لینک دانلود",
            src: "",
            isExternal: true,
            filename: "",
            model: "",
            isSecret: false,
            field: "filename",
            canUpdate: true,
          },
        ],
      };
      var tok = localStorage.getItem("token")
      let config = {'x-api-key': tok};
      this.$axios
        .get(`model/education/${this.$route.params.educationId}`,{headers: config})
        .then((response) => {
          response.data.data.item.wordList.forEach((row, index) => {
            row.index = index + 1;
          });
          this.wordListTable.data = response.data.data.item.wordList;
          this.wordListTable.loading = false;
        })
        .catch(() => {
          this.$q.notify({
            color: "negative",
            position: "top",
            message: "Loading failed",
            icon: "report_problem",
          });
        });

      this.$axios
        .get(`education/${this.$route.params.educationId}/subs`)
        .then((response) => {
          response.data.data.items.forEach((row, index) => {
            row.index = index + 1;
          });
          this.subTable.data = response.data.data.items;
          this.subTable.loading = false;
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
