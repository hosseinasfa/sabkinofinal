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

      subsetUrl: '/school/:id',
      subsetUrlWallet : '/walletLog/:id',
      title: "لیست مدارس",
      filter: "",
      mode: "list",
      url: `model/school`,
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
          label: "نام مدرسه",
          field: "title",
          sortable: true,
        },
        {
          name: "type",
          align: "left",
          label: "نوع مدرسه",
          field: "type",
          format: (val) => (val ==='Governmental' ? 'دولتی' : val === 'GovernmentSample' ? "نمونه دولتی" : val === 'hOmanayi' ? "امنائی" : val === "Witness" ? "شاهد" : val === "NonProfit" ? 'غیرانتفاعی' : '' ),
          sortable: true,
        },

        {
          name: "gender",
          align: "left",
          label: "جنسیت",
          field: "gender",
          format: (val) => (val ==='boy' ? 'پسرانه' : val === 'girl' ? "دخترانه" : 'مشخص نشده'),
          sortable: true,
        },
        {
          name: "establishedYear",
          align: "left",
          label: "سال تاسیس",
          field:'establishedYear',
          sortable: true,
        },

        {
          name: "establishmentNumber",
          align: "left",
          label: "شناسه مدرسه",
          field:'establishmentNumber',
          sortable: true,
        },

        {
          name: "site",
          align: "left",
          label: "وبسایت",
          field:'site',
        format: (val) => (val ? val : 'مشخص نشده'),
          sortable: true,
        },
        {
          name: "address",
          align: "left",
          label: "آدرس",
          field: "address",
          sortable: true,
        },

        

        {
          name: "phone",
          align: "left",
          label: "تلفن",
          field: "phone",
          sortable: true,
        },

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
        // {
        //   name: "establishedYear",
        //   align: "left",
        //   label: "تاریخ تاسیس",
        //   field: (row) => row.establishedYear,
        //   format: (val) =>
        //     `${new persianDate(Date.parse(val)).format("YYYY-MM-DD")}`,
        //   sortable: true,
        // },
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
          name: "isActive",
          align: "left",
          label: "وضعیت",
          field: "isActive",
          format: (val) => (val ? "فعال" : "غیر فعال"),
          sortable: true,
        },
        // {
        //   name: "wallet",
        //   label: "تاریخپه شارژها",
        //   field: "wallet",
        //   align: "left",
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
          isObject: true,
          type: "q-select",
          label: "صاحب مدرسه",
          model: "",
          field: "bossId",
          disable: false,
          canUpdate: true,
          key: "_id",
          displayKey: "phone",
          isSecret: false,
          options: [],
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
          label: "عکس پروفایل",
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
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "تعداد دانش آموزان",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "studentCount",
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "متراژ تقریبی حیاط",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "area",
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "تعداد کلاس ها",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "classCount",
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "تعداد طبقات ",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "floorCount",
        },
        {
          isFile: false,
          isObject: false,
          type: "q-select",
          label: "آیا کتابخانه دارد؟",
          model: "",
          field: "library",
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
          label: "آیا آزمایشگاه دارد؟",
          model: "",
          field: "laboratory",
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
          label: "آیا کلاس هوشمند دارد؟",
          model: "",
          field: "smartClass",
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
          label: "آیا سرویس بهداشتی دارد؟",
          model: "",
          field: "wc",
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
          label: "آیا نمازخانه دارد؟",
          model: "",
          field: "prayerRoom",
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
          label: "آیا سالن کنفرانس دارد؟",
          model: "",
          field: "conferenceRoom",
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
          label: "آیا ساالن کامپیوتر دارد؟",
          model: "",
          field: "computerSalon",
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
          label: "آیا ورزشگاه دارد؟",
          model: "",
          field: "stadium",
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
          label: "آیا بوفه دارد؟",
          model: "",
          field: "buffet",
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
          label: "آیا سالن غذا خوری دارد؟",
          model: "",
          field: "dinningSalon",
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
          label: "آیا مشاور تحصیلی دارد؟",
          model: "",
          field: "academicAdviser",
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
          label: "آیا مشاور روانشناس دارد؟",
          model: "",
          field: "psychologicalConsultant",
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
          label: "تعداد کتابخانه",
          model: "",
          field: "libraryCount",
          isSecret: false,
          canUpdate: true,
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "تعداد آزمایشگاه",
          model: "",
          field: "laboratoryCount",
          isSecret: false,
          canUpdate: true,
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "تعداد کلاس هوشمند",
          model: "",
          field: "smartClassCount",
          isSecret: false,
          canUpdate: true,
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "تعداد سرویس بهداشتی",
          model: "",
          field: "wcCount",
          isSecret: false,
          canUpdate: true,
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "تعداد نمازخانه",
          model: "",
          field: "prayerRoomCount",
          isSecret: false,
          canUpdate: true,
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "تعداد سالن کنفرانس",
          model: "",
          field: "conferenceRoomCount",
          isSecret: false,
          canUpdate: true,
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "تعداد ساالن کامپیوتر",
          model: "",
          field: "computerSalonCount",
          isSecret: false,
          canUpdate: true,
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "تعداد ورزشگاه",
          model: "",
          field: "stadiumCount",
          isSecret: false,
          canUpdate: true,
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "تعداد بوفه",
          model: "",
          field: "buffetCount",
          isSecret: false,
          canUpdate: true,
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "تعداد سالن غذا خوری",
          model: "",
          field: "dinningSalonCount",
          isSecret: false,
          canUpdate: true,
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "تعداد مشاور تحصیلی",
          model: "",
          field: "academicAdviserCount",
          isSecret: false,
          canUpdate: true,
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "تعداد مشاور روانشناس",
          model: "",
          field: "psychologicalConsultantCount",
          isSecret: false,
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
        .get("school",{headers: config})
        .then((response) => {
            // console.log("amin",response)
             const itemID = this.$route.params.itemId;
          const academyItem =   response.data.data.items
          const fil = academyItem.filter((es => es.bossId !== null))
          const fltAcademy = fil.filter((e) => e.bossId._id === itemID );
         fltAcademy.forEach((row, index) => {
            row.index = index + 1;
          });
          this.table.data =fltAcademy;
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
