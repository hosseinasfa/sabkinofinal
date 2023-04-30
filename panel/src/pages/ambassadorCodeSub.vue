<template>
  <q-page class="q-pt-xs">
    <div class="q-ma-md">
      <Table v-bind="table" :key="$route.params.itemId" />
        <div class="q-pa-md q-gutter-sm btnD">
          <q-btn color="secondary" label="تسویه حساب"   @click="SubmitNotify"/>
        </div>
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
      table: null,
      tablee : null
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
        canShow : false,
        loading: true,
        canInsert: false,
        readonly: false,
        hasSubset: true,
        subsetUrl: "model/ambassadorCode/:id",
        title: "لیست دعوت شدگان تسویه نشده",
        filter: "",
        mode: "list",
        url: `model/ambassadorCode/${this.$route.params.itemId}`,
        columns: [

        {
          name: "userCount",
          align: "left",
          label: "دانش آموز",
          field: (row) => row.userCount,
          sortable: true,
        },
        {
          name: "familyCount",
          align: "left",
          label: "خانواده",
          field: (row) => row.familyCount,
          sortable: true,
        },
        {
          name: "mentorCount",
          align: "left",
          label: "معلم",
          field: (row) => row.mentorCount,
          sortable: true,
        },
        {
          name: "teacherCount",
          align: "left",
          label: "مشاور",
          field: (row) => row.teacherCount,
          sortable: true,
        },
        {
          name: "schoolBossCount",
          align: "left",
          label: "مدرسه",
          field: (row) => row.schoolBossCount,
          sortable: true,
        },

        {
          name: "EducationalInstitutions",
          align: "left",
          label: "آموزشگاه",
          field: (row) => row.EducationalInstitutions,
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
            label: "فایل",
            src: "",
            filename: "",
            model: "",
            isExternal: true,
            isSecret: false,
            field: "avatar",
            canUpdate: true,
          },
        ],
      };
      var tok = localStorage.getItem("token")
      let config = {'x-api-key': tok};
      this.$axios
        .get(`model/ambassadorCode/${this.$route.params.itemId}`,{headers: config})
        .then((response) => {
          
          var newDate = []
          newDate.push(response.data.data.item)
          this.table.data = newDate;
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
        subsetUrl: "/ambassador/:id",
        title: "تاریخچه تسویه حساب ها",
        filter: "",
        mode: "list",
        url: `ambassador/${this.$route.params.itemId}`,
        columns: [

        {
          name: "userCount",
          align: "left",
          label: "دانش آموز",
          field: (row) => row.userCount,
          sortable: true,
        },
        {
          name: "familyCount",
          align: "left",
          label: "خانواده",
          field: (row) => row.familyCount,
          sortable: true,
        },
        {
          name: "mentorCount",
          align: "left",
          label: "معلم",
          field: (row) => row.mentorCount,
          sortable: true,
        },
        {
          name: "teacherCount",
          align: "left",
          label: "مشاور",
          field: (row) => row.teacherCount,
          sortable: true,
        },
        {
          name: "schoolBossCount",
          align: "left",
          label: "مدرسه",
          field: (row) => row.schoolBossCount,
          sortable: true,
        },

        {
          name: "EducationalInstitutions",
          align: "left",
          label: "آموزشگاه",
          field: (row) => row.EducationalInstitutions,
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
          
        ],
      };
      var tok = localStorage.getItem("token")
      let config = {'x-api-key': tok};
      this.$axios
        .get(`ambassador/${this.$route.params.itemId}`,{headers: config})
        .then((response) => {
          console.log(response)
           response.data.data.items.forEach((row, index) => {
              row.index = index + 1;
            });
            this.tablee.data = response.data.data.items;
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

    SubmitNotify() {
      var tok = localStorage.getItem("token")
      let config = {'x-api-key': tok};
      this.$axios
          .post("model/ambassador", {
            AmbassadorCodeId : this.$route.params.itemId,
            userCount : this.table.data[0].userCount,
            familyCount : this.table.data[0].familyCount,
            mentorCount : this.table.data[0].mentorCount,
            teacherCount : this.table.data[0].teacherCount,
            schoolBossCount : this.table.data[0].schoolBossCount,
            EducationalInstitutions : this.table.data[0].EducationalInstitutions,
          },{headers: config}).then((response) => {
            
            if(response) {
              
          this.$axios
          .put(`model/ambassadorCode/${this.$route.params.itemId}`, {
            userCount : 0,
            familyCount : 0,
            mentorCount : 0,
            teacherCount : 0,
            schoolBossCount : 0,
            EducationalInstitutions : 0,
          },{headers: config}).then((response) => {
            
            if(response) {
            //   this.$router.push({
            //   path: "/"
            // });
            this.$q.notify({
              message: "برداشت با موفیت انجام شد",
              color: "positive",
            });
              console.log(response)
            }else{
              
              this.$q.notify({
                message: "برداشت با خطا مواجه شد",
                color: "negative",
                 position: "top",
                 icon: "report_problem",
              });
            }
          })
          .catch(() => {
            console.log('test :::::::::::::::::');
            this.$q.notify({
              color: "negative",
              position: "top",
              message: "Loading failed",
              icon: "report_problem",
            });
          });

            // this.$q.notify({
            //   message: "برداشت با موفیت انجام شد",
            //   color: "positive",
            // });
            //   console.log(response)
            }else{
              
              this.$q.notify({
                message: "برداشت با خطا مواجه شد",
                color: "negative",
                 position: "top",
                 icon: "report_problem",
              });
            }
          })
          .catch(() => {
            console.log('test :::::::::::::::::');
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

.btnD{
  text-align: center;
}
</style>


