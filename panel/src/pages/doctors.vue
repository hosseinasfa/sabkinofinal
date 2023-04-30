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
      canInsert: false,
      readonly: false,
      hasSubset: false,
      subsetUrl: "",
      title: "لیست متخصصین",
      filter: "",
      mode: "list",
      url: `panel/doctors`,
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
          field: "firstName",
          sortable: true,
        },
        {
          name: "lastName",
          required: true,
          label: "نام خانوادگی",
          align: "left",
          field: "lastName",
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
          name: "birthDate",
          align: "left",
          label: "تاریخ تولد",
          field: (row) => row.birthDate,
          format: (val) =>
            `${new persianDate(Date.parse(val)).format("YYYY-MM-DD")}`,
          sortable: true,
        },
        {
          name: "userFirstNameAndLastName",
          align: "left",
          label: "نام کلینیک",
          field: (row) => `${row.clinicId.firstName} ${row.clinicId.lastName}`,
          sortable: true,
        },
        {
          name: "userPhone",
          align: "left",
          label: "شماره کلینیک",
          field: (row) => row.clinicId.phone,
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
          label: "شماره تماس",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "phone",
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
          field: "lastName",
          isSecret: false,
          canUpdate: true,
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "تخصص",
          model: "",
          field: "skill",
          isSecret: false,
          canUpdate: true,
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "شماره نظام پزشکی",
          model: "",
          field: "medicalSystem",
          isSecret: false,
          canUpdate: true,
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "ایمیل",
          model: "",
          field: "email",
          isSecret: false,
          canUpdate: true,
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "بیوگرافی",
          model: "",
          field: "bio",
          isSecret: false,
          canUpdate: true,
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
      this.$axios
        .get("panel/doctors")
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
