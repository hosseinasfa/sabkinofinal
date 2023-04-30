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
      hasSubset: true,
      subsetUrl:'/users/:id',
      title: "جزئیات تسویه حساب ها",
      filter: "",
      mode: "list",
      url: `financial`,
      columns: [
        {
          name: "index",
          label: "#",
          field: "index",
          align: "left",
          sortable: true,
        },
        {
          name: "type",
          align: "left",
          label: "نوع",
          field: (row) => row.type === "shop" ? "فروشگاه" : row.type === "onlineCourse" ? "دوره آنلاین" : row.type === "consulting" ? "مشاوره" : row.type === "ambassador" ? "کد سفیر" : "تماس آنلاین" ,
          sortable: true,
        },
        {
          name: "title",
          align: "left",
          label: "نام",
          field: (row) => row.productId ? row.productId.title : row.periodMentorId ? row.periodMentorId.name :  row.consultingId ? row.consultingId.name : "",
          sortable: true,
        },
        {
          name: "count",
          align: "left",
          label: "تعداد",
          field: (row) => row.count,
          sortable: true,
        },
        
        // {
        //   name: "amount",
        //   align: "left",
        //   label: "قیمت پایه",
        //   field: (row) => `${row.totalPrice} تومان`,
        //   sortable: true,
        // },
        
       {
          name: "amount",
          align: "left",
          label: "قیمت نهایی",
          field: (row) => `${row.finalPrice} تومان`,
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
        .get(`financial/eachItem/${this.$route.params.itemId}`,{headers: config})
        .then((response) => {
          response.data.data.item.forEach((row, index) => {
            row.index = index + 1;
          });
          this.table.data = response.data.data.item;
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
