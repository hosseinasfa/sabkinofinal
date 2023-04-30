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
      canInsert: true,
      readonly: false,
      hasSubset: false,
      hasSubsetWallet : true,


      subsetUrl: "",
      subsetUrlWallet : '/walletLog/:id',
      title: "آموزشگاه",
      filter: "",
      mode: "list",
      url: `model/person-EducationalInstitutions`,
      columns: [
        {
          name: "index",
          label: "#",
          field: "index",
          align: "left",
          sortable: true,
        },
        {
          name: "companyName",
          align: "left",
          label: "نام آموزشگاه",
          field: "title",
          sortable: true,
        },
        {
          name: "establishmentNumber",
          align: "left",
          label: "شماره ملی ثبت",
          field: "establishmentNumber",
          sortable: true,
        },
        {
          name: "establishedYear",
          align: "left",
          label: "سال تاسیس",
          field: "establishedYear",
          sortable: true,
        },
         {
          name: "address",
          align: "left",
          label: "آدرس آموزشگاه",
          field: "address",
          sortable: true,
        },
        {
          name: "phone",
          align: "left",
          label: "تلفن ثابت آموزشگاه",
          field: "phone",
          sortable: true,
        },

        {
          name: "type",
          align: "left",
          label: "نوع فعالیت؟",
          field: "type",
          format: (val) => (val ? "مجازی" : "حضوری "),
          sortable: true,
        },
        
        // {
        //   name: "walletBalance",
        //   align: "left",
        //   label: "میزان اعتبار کاربر",
        //   field:'walletBalance',
        //   sortable: true,
        // },
        
        // {
        //   name: "isWalletActive",
        //   align: "left",
        //   label: "وضعیت کیف پول",
        //   field: "isWalletActive",
        //   format: (val) => (val ? "فعال" : "مسدود"),
        //   sortable: true,
        // },
        // {
        //   name: "sex",
        //   align: "left",
        //   label: "جنسیت",
        //   field: (row) => row.sex,
        //   format: (val) => {
        //     if (val == true) {
        //       return "مرد";
        //     } else {
        //       return "زن";
        //     }
        //   },
        //   sortable: true,
        // },
        {
          name: "provinceName",
          align: "left",
          label: "استان",
          field: (row) => row.provinceId.title,
          sortable: true,
        },
        {
          name: "cityName",
          align: "left",
          label: "شهر",
          field: (row) => row.cityId.title,
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
          name: "isConfirmed",
          align: "left",
          label: "تایید شده است؟",
          field: "isConfirmed",
          format: (val) => (val ? "بله" : "خیر "),
          sortable: true,
        },
        
        // {
        //   name: "wallet",
        //   label: "تاریخپه شارژها",
        //   field: "wallet",
        //   align: "left",
        // },
        
        // {
        //   name: "title",
        //   align: "left",
        //   label: "عنوان",
        //   field: "title",
        //   sortable: true,
        // },
        // {
        //   name: "boss",
        //   align: "left",
        //   label: "مدیر",
        //   field: "boss",
        //   sortable: true,
        // },
        
        // {
        //   name: "isWalletActive",
        //   align: "left",
        //   label: "وضعیت کیف پول",
        //   field: "isWalletActive",
        //   format: (val) => (val ? "فعال" : "مسدود"),
        //   sortable: true,
        // },
        // {
        //   name: "sex",
        //   align: "left",
        //   label: "جنسیت",
        //   field: (row) => row.sex,
        //   format: (val) => {
        //     if (val == true) {
        //       return "مرد";
        //     } else {
        //       return "زن";
        //     }
        //   },
        //   sortable: true,
        // },
        // {
        //   name: "provinceName",
        //   align: "left",
        //   label: "استان",
        //   field: (row) => row.provinceId.title,
        //   sortable: true,
        // },
        // {
        //   name: "cityName",
        //   align: "left",
        //   label: "شهر",
        //   field: (row) => row.cityId.title,
        //   sortable: true,
        // },
        // {
        //   name: "establishedYear",
        //   align: "left",
        //   label: "تاریخ تاییس",
        //   field: (row) => row.establishedYear,
        //   format: (val) =>
        //     `${new persianDate(Date.parse(val)).format("YYYY-MM-DD")}`,
        //   sortable: true,
        // },
        // {
        //   name: "date",
        //   align: "left",
        //   label: "تاریخ",
        //   field: (row) => row.createdAt,
        //   format: (val) =>
        //     `${new persianDate(Date.parse(val)).format("YYYY-MM-DD")}`,
        //   sortable: true,
        // },
        // {
        //   name: "time",
        //   align: "left",
        //   label: "ساعت",
        //   field: (row) => row.createdAt,
        //   format: (val) =>
        //     `${new persianDate(Date.parse(val)).format("H:mm:ss")}`,
        //   sortable: true,
        // },
        // {
        //   name: "isActive",
        //   align: "left",
        //   label: "وضعیت",
        //   field: "isActive",
        //   format: (val) => (val ? "فعال" : "غیر فعال"),
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
          field: "caption",
          isSecret: false,
          canUpdate: true,
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "مدیر",
          model: "",
          field: "boss",
          isSecret: false,
          canUpdate: true,
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
        {
          isFile: false,
          isObject: false,
          type: "q-select",
          label: "جنسیت",
          model: "",
          field: "sex",
          disable: false,
          canUpdate: true,
          key: "",
          displayKey: "",
          isSecret: false,
          options: [
            {
              label: "مرد",
              value: true,
            },
            {
              label: "زن",
              value: false,
            },
          ],
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "امیتاز",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "rate",
        },
        {
          isFile: false,
          isObject: false,
          type: "date",
          label: "تاریخ تاییس",
          model: "",
          field: "establishedYear",
          isSecret: false,
          canUpdate: true,
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
          label: "عکس لوگو",
          src: "",
          filename: "",
          model: "",
          isSecret: false,
          field: "logo",
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
      var tok = localStorage.getItem("token")
      let config = {'x-api-key': tok};
      this.$axios
        .get("academy",{headers: config})
        .then((response) => {
        
          const itemID = this.$route.params.itemId;
          const academyItem =  response.data.data.items;
          const fltAcademy = academyItem.filter((e) => e.bossId._id === itemID );
            console.log(fltAcademy)
         fltAcademy.forEach((row, index) => {
            row.index = index + 1;
          });
          this.table.data = fltAcademy;
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
