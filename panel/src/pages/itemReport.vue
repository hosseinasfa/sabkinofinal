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
    return { table: null };
  },
  mounted() {
    this.table = {
      loading: false,
      canInsert: false  ,
      readonly: true,
      hasSubset: true,
      canDeActive : false,
      subsetUrl: "/itemReport/:id",
      title: "گزارشات",
      filter: "",
      mode: "list",
      url: `model/itemReport`,
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
          field: "title",
          sortable: true,
        },
        // {
        //   name: "caption",
        //   align: "left",
        //   label: "توضیحات",
        //   field: "caption",
        //   sortable: true,
        // },
        // {
        //   name: "refModelName",
        //   align: "left",
        //   label: "ارجاع",
        //   field: "refModelName",
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
        {
          name: "actions",
          label: "عملیات",
          field: "actions",
          align: "left",
        },
      ],
      data: [
        { _id: "vipPost", index: 1 , title:"ویترین"},
        { _id: "onlineCourse",index: 2 ,title:"دوره آنلاین"},
        { _id: "shop",index: 3 ,title:"فروشگاه"},
        { _id: "onlineCall",index: 4 ,title:"تماس آنلاین"},
        { _id: "chat",index: 5 ,title:"چت دایرکت"},
        { _id: "channel",index: 6 ,title:"کانال خصوصی مشاوران"},
        { _id: "PostQuestion",index: 7 ,title:"سوالات پرسمان"},
        { _id: "PostComment",index: 8 ,title:"پاسخ های پرسمان"},
        { _id: "Setprogram",index: 9 ,title:"برنامه دادن"},
      ],
      itemId: "",
      form: [],
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
    // getList() {
    //   var tok = localStorage.getItem("token")
    //   let config = {'x-api-key': tok};
    //   this.$axios
    //     .get("model/itemReport",{headers: config})
    //     .then((response) => {
    //       response.data.data.items.forEach((row, index) => {
    //         row.index = index + 1;
    //       });
    //       this.table.data = response.data.data.items;
    //       this.table.loading = false;
    //     })
    //     .catch(() => {
    //       this.$q.notify({
    //         color: "negative",
    //         position: "top",
    //         message: "Loading failed",
    //         icon: "report_problem",
    //       });
    //     });
    // },
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
