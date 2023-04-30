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
    return {
      table: null,
    };
  },
  mounted() {
    this.table = {
      loading: true,
      canInsert: true,
      readonly: false,
      hasSubset: true,
      hasSubsetProduct: true,
      hasSubsetPeriod: true,
      hasSubsetVipPst: true,
      hasSubsetOnlineCall: true,
      hasSubsetSetProgram: true,
      hasSubsetChannel: true,
      hasSubsetSupport: true,
      hasSubsetShop : true,
      hasSubsetPostQuestion : true,
      hasSubsetWallet : true,

      subsetUrl: '/users/:id',
      subsetUrlProduct: '/productPayment/:id',
      subsetUrlPeriod: '/period/:id',
      subsetUrlVipPst: '/VipPosts/:id',
      subsetUrlOnlineCall: '/OnlinCall/:id',
      subsetUrlSetProgram: '/setProgramm/:id',
      subsetUrlChannel: '/setChannelList/:id',
      subsetUrlSupport: '/setSupportList/:id',
      subsetUrlShop : '/productClass/:id',
      subsetUrlPostQuestion : '/PostQuestion/:id',
      subsetUrlWallet : '/walletLog/:id',

      title: "لیست مشاورین",
      filter: "",
      mode: "list",
      url: `model/person-Person`,
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
          name: "walletBalance",
          align: "left",
          label: "میزان اعتبار کاربر(تومان)",
          field: 'walletBalance',
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
          name: "isSetProgramAccess",
          align: "left",
          label: "دسترسی برنامه دادن",
          field: 'isSetProgramAccess',
          format: (val) => {
            if (val == true) {
              return 'دسترسی دارد';
            } else {
              return 'دسترسی ندارد';
            }
          },
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
          name: "isConfirmed",
          align: "left",
          label: "تایید شده است؟",
          field: "isConfirmed",
          format: (val) => (val ? "بله" : "خیر "),
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
          name: "isSupport",
          align: "left",
          label: "وضعیت پشتیبان",
          field: (row) => row.isSupport === null ? "ندارد" : "دارد",
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
          name: "wallet",
          label: "تاریخپه شارژها",
          field: "wallet",
          align: "left",
        },
        {
          name: "support",
          label: "پشتیبان",
          field: "support",
          align: "left",
        },
        {
          name: "channel",
          label: "کانال",
          field: "channel",
          align: "left",
        },
        {
          name: "postQuestion",
          label: "پرسمان",
          field: "postQuestion",
          align: "left",
        },
        {
          name: "setProgram",
          label: "برنامه دادن",
          field: "setProgram",
          align: "left",
        },
        {
          name: "onlineCall",
          label: "تماس آنلاین",
          field: "onlineCall",
          align: "left",
        },
        {
          name: "vipPst",
          label: "ویترین",
          field: "vipPst",
          align: "left",
        },
        {
          name: "period",
          label: "دوره آنلاین",
          field: "period",
          align: "left",
        },
        {
          name: "proDuct",
          label: "فروشگاه",
          field: "proDuct",
          align: "left",
        },
        {
          name: "ProDuct",
          label: "محصولات",
          field: "ProDuct",
          align: "left",
        },
        {
          name: "actions",
          label: "حسابداری و مالی",
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
          disable: true,
          field: "phone",
          canUpdate: false,
          isSecret: false,
          maxlength: 11,
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "رمز عبور",
          model: "",
          disable: true,
          canUpdate: false,
          isSecret: true,
          field: "password",
        },
        {
          isFile: false,
          isObject: true,
          type: "q-select",
          label: "استان",
          model: "",
          field: "provinceId",
          disable: true,
          canUpdate: false,
          key: "_id",
          displayKey: "title",
          isSecret: false,
          options: [],
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "میزان اعتبار",
          model: "",
          field: "walletBalance",
          isSecret: false,
          canUpdate: true,
        },
        {
          isFile: false,
          isObject: false,
          type: "q-select",
          label: "دسترسی برنامه دادن",
          model: "",
          field: "isSetProgramAccess",
          isSecret: false,
          options: [
            {
              label: "دسترسی دارد",
              value: true,
            },
            {
              label: "دسترسی ندارید",
              value: false,
            },
          ],
          canUpdate: true,
        },
        {
          isFile: false,
          isObject: false,
          type: "q-select",
          label: "وضعیت کیف پول",
          model: "",
          field: "isWalletActive",
          isSecret: false,
          canUpdate: true,
          options: [
            {
              label: "فعال",
              value: true,
            },
            {
              label: "مسدود",
              value: false,
            },
          ],
        },
        {
          isFile: false,
          isObject: true,
          type: "q-select",
          label: "شهر",
          model: "",
          field: "cityId",
          disable: true,
          canUpdate: false,
          key: "_id",
          displayKey: "title",
          isSecret: false,
          options: [],
        },
        {
          isFile: false,
          isObject: false,
          type: "q-select",
          label: "نوع  کاربری",
          model: "",
          field: "class",
          disable: false,
          canUpdate: true,
          key: "",
          displayKey: "",
          isSecret: false,
          options: [
            {
              label: "معلم",
              value: "teacher",
            },
            {
              label: "مشاور",
              value: "mentor",
            },
            {
              label: "دانش آموز",
              value: "user",
            },
            {
              label: "خانواده",
              value: "family",
            },
            {
              label: "مدرسه",
              value: "schoolBoss",
            },
            {
              label: "آموزشگاه",
              value: "educationalInstitutions",
            },
          ],
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
          isFile: true,
          isObject: false,
          type: "file",
          label: "عکس پروفایل",
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
          type: "q-select",
          label: "تایید شده است؟",
          model: "",
          field: "isConfirmed",
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
          .get("model/person-Mentor", {headers: config})
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
