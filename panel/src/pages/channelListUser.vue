<template>
  <q-page class="q-pt-xs">
    <div class="q-ma-md">
      <Table v-bind="table" :key="$route.params.itemId" />
      <Table v-bind="tablee" :key="$route.params.itemId" />
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
      tablee : null,
    };
  },
  watch: {
    "$route.params.itemId": function (id) {
      this.getList();
    },
    "$route.params.itemId": function (id) {
      this.getListt();
    },
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
      this.$forceUpdate();
      this.table = {
      loading: true,
      canInsert: false,
      readonly: false,
      hasSubset: false,
      subsetUrl:'/users/:id',
      title: "لیست اعضای کانال",
      filter: "",
      mode: "list",
      url: `channel/isChannel`,
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
          name: "provinceName",
          align: "left",
          label: "استان",
          field: (row) => row.provinceId?.title,
          sortable: true,
        },
        {
          name: "cityName",
          align: "left",
          label: "شهر",
          field: (row) => row.cityId?.title,
          sortable: true,
        },
        {
          name: "walletBalance",
          align: "left",
          label: "میزان اعتبار کاربر(تومان)",
          field:'walletBalance',
          sortable: true,
        },
        {
          name: "isExit",
          align: "left",
          label: "وضعیت خروج برنامه",
          field:'isExit',
          sortable: true,
        },
        {
          name: "isWalletActive",
          align: "left",
          label: "وضعیت کیف پول",
          field: "isWalletActive",
          format: (val) => (val ? "فعال" : "مسدود"),
          sortable: true,
        },
        {
          name: "schoolName",
          align: "left",
          label: "نام مدرسه",
          field: (row) => (row.school)?row.school.title:'مدرسه من نیست',
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
          name: "isChannel",
          align: "left",
          label: "وضعیت کانال",
          field: "isChannel",
          format: (val) => (val ? "فعال" : "غیر فعال"),
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
          type: "q-select",
          label: "وضعیت کانال؟",
          model: "",
          field: "isChannel",
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

      var tok = localStorage.getItem("token")
      let config = {'x-api-key': tok};
      this.$axios
        .get("model/person-User",{headers: config})
        .then((response) => {
            var res = response.data.data.items;
            var res2 = res.filter(e => e.channelId);
            var Fres = res2.filter(e => e.channelId._id === this.$route.params.itemId);
            
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
    getListt() {
      this.$forceUpdate();
      this.tablee = {
      loading: true,
      canInsert: false,
      readonly: false,
      hasSubset: false,
      subsetUrl:'/users/:id',
      title: "لیست دانش آموزان",
      filter: "",
      mode: "list",
      url: `channel/isChannel`,
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
          name: "provinceName",
          align: "left",
          label: "استان",
          field: (row) => row.provinceId?.title,
          sortable: true,
        },
        {
          name: "cityName",
          align: "left",
          label: "شهر",
          field: (row) => row.cityId?.title,
          sortable: true,
        },
        {
          name: "walletBalance",
          align: "left",
          label: "میزان اعتبار کاربر(تومان)",
          field:'walletBalance',
          sortable: true,
        },
        {
          name: "isExit",
          align: "left",
          label: "وضعیت خروج برنامه",
          field:'isExit',
          sortable: true,
        },
        {
          name: "isWalletActive",
          align: "left",
          label: "وضعیت کیف پول",
          field: "isWalletActive",
          format: (val) => (val ? "فعال" : "مسدود"),
          sortable: true,
        },
        {
          name: "schoolName",
          align: "left",
          label: "نام مدرسه",
          field: (row) => (row.school)?row.school.title:'مدرسه من نیست',
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
          name: "isChannel",
          align: "left",
          label: "وضعیت کانال",
          field: "isChannel",
          format: (val) => (val ? "فعال" : "غیر فعال"),
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
          type: "q-select",
          label: "انتخاب کانال",
          model: "",
          field: "channelId",
          disable: false,
          canUpdate: true,
          key: "",
          displayKey: "",
          isSecret: false,
          options: [
            {
              label: "کانال همین مشاور",
              value: this.$route.params.itemId,
            },
            
          ],
        },
        {
          isFile: false,
          isObject: false,
          type: "q-select",
          label: "وضعیت کانال؟",
          model: "",
          field: "isChannel",
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
      var tok = localStorage.getItem("token")
      let config = {'x-api-key': tok};
      this.$axios
        .get("model/person-User",{headers: config})
        .then((response) => {
            var res = response.data.data.items;
              var Fres = res.filter(e => !e.channelMentorId );
            
          Fres.forEach((row, index) => {
            row.index = index + 1;
          });
          this.tablee.data = Fres;
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
