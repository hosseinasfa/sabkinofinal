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
    return {
      table:null,
    };
  },
  mounted() {
    this.table = {
      loading: true,
      canInsert: false,
      readonly: false,
      hasSubset: false,
      hasSubsetPeriod: true,
      hasSubsetSetProgram: true,
      hasSubsetProduct: true,
      hasSubsetOnlineCall: true,
      hasSubsetPostQuestion : true,
      hasSubsetOnlineCall : true,
      hasSubsetWallet : true,
      hasSubsetWalletPayment : true,
      
      subsetUrl:'/users/:id',
      subsetUrlProduct: '/productPayment/:id',
      title: "لیست دانش آموزان",
      filter: "",
      mode: "list",
      url: `model/person-Person`,
      subsetUrlPeriod: '/periodPaymentUser/:id',
      subsetUrlSetProgram: '/setProgrammUser/:id',
      subsetUrlPostQuestion : '/PostQuestion/:id',
      subsetUrlOnlineCall : '/callLogSub/:id',
      subsetUrlWallet : '/walletLog/:id',
      subsetUrlWalletPayment : '/walletPaymentLog/:id',

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
          label: "کد ملی",
          field: "personalCode",
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
          name: "isChatActive",
          align: "left",
          label: "وضعیت دسترسی چت",
          field: "isChatActive",
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
          name: "channelMentorId",
          align: "left",
          label: "نام کانال",
          field: (row) => row.channelMentorId ? row.channelMentorId.channelName : "بدون کانال",
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
          name: "period",
          label: "دوره آنلاین",
          field: "period",
          align: "left",
        },
        {
          name: "setProgram",
          label: "برنامه دادن",
          field: "setProgram",
          align: "left",
        },
        {
          name: "proDuct",
          label: "فروشگاه",
          field: "proDuct",
          align: "left",
        },
        {
          name: "onlineCall",
          label: "تماس آنلاین",
          field: "onlineCall",
          align: "left",
        },
        {
          name: "postQuestion",
          label: "پرسمان",
          field: "postQuestion",
          align: "left",
        },
        {
          name: "wallet",
          label: "تاریخپه شارژها",
          field: "wallet",
          align: "left",
        },
        {
          name: "walletPayment",
          label: "تاریخپه کیف پول",
          field: "walletPayment",
          align: "left",
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
          label: "شماره والدین",
          model: "",
          disable: true,
          field: "familyPhone",
          canUpdate: false,
          isSecret: false,
          maxlength: 11,
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
          isObject: false,
          type: "q-select",
          label: "وضعیت دسترسی چت",
          model: "",
          field: "isChatActive",
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
          isObject: false,
          type: "q-select",
          label: "وضعیت خروج برنامه",
          model: "",
          field: "isExit",
          isSecret: false,
          canUpdate: true,
          options: [
            {
              label: "اخراج نشده",
              value: false,
            },
            {
              label: "اخراج شده",
              value: true,
            },
          ],
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
          type: "q-input",
          label: "کد ملی",
          model: "",
          disable: false,
          field: "personalCode",
          canUpdate: true,
          isSecret: false,
          maxlength: 11,
        },
        

        {
          isFile: false,
          isObject: false,
          type: "q-select",
          label: "   آیا تغییر کاربر انجام شود؟ قبل از آن حتما فیلد کدملی را خالی کنید",
          model: "",
          field: "changeClass",
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

        // {
        //     isFile: false,
        //     isObject: false,
        //     type: "q-select",
        //     label: "نوع  کاربری",
        //     model: "",
        //     field: "class",
        //     disable: false,
        //     canUpdate: true,
        //     key: "",
        //     displayKey: "",
        //     isSecret: false,
        //     options: [
        //       {
        //         label: "معلم",
        //         value: "teacher",
        //       },
        //       {
        //         label: "مشاور",
        //         value: "mentor",
        //       },
        //       {
        //         label: "دانش آموز",
        //         value: "user",
        //       },
        //       {
        //         label: "خانواده",
        //         value: "family",
        //       },
        //       {
        //         label: "مدرسه",
        //         value: "schoolBoss",
        //       },
        //     ],
        //   },
       
        
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
          label: "آیا تایید شده است؟",
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
        // {
        //   isFile: false,
        //   isObject: false,
        //   type: "q-select",
        //   label: "نام کانال",
        //   model: "",
        //   field: "channelMentorId",
        //   disable: false,
        //   canUpdate: true,
        //   key: "",
        //   displayKey: "",
        //   isSecret: false,
        //   options: [
        //     {
        //       label: "بهنام",
        //       value: "6210b97075ea0506353f27dd",
        //     },
        //     {
        //       label: "مهدی",
        //       value: "621406a5d6d23e6e861e6120",
        //     },
        //   ],
        // },
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
        .get("model/person-User",{headers: config})
        .then((response) => {
          const fsp =  response.data.data.items.reverse();         
          fsp.forEach((row, index) => {
            row.index = index + 1;
          });
          this.table.data = fsp;
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
