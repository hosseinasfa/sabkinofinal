<template>
  <div class="q-pa-md row items-start q-gutter-md">

    <q-card class="my-card" flat bordered>
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>کانال {{this.table.data[0].channelId.channelName}}</q-item-label>
          <q-item-label caption>
            مشاور
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-separator />

      <q-card-section horizontal>
                  <q-card-section class="col-4">
    <q-list  class="" >
      <q-item-label header>لیست اعضای کانال</q-item-label>

      <q-item clickable v-ripple v-for="(channel, index) in this.table.userList" :key="index">
        <q-item-section avatar>
          <q-avatar>
            <img :src="channel.avatar">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">{{channel.firstName}} {{channel.lastName}}</q-item-label>
          <q-item-label caption lines="2">
            <span class="text-weight-bold">{{channel.class === "user" ? "دانش آموز" : ""}}</span>
          
          </q-item-label>
        </q-item-section>

       
      </q-item>

      <q-separator inset="item" />

      <!-- <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/avatar4.jpg">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">علی نبی</q-item-label>
          <q-item-label caption lines="2">
            <span class="text-weight-bold">دانش آموز</span>
           
          </q-item-label>
        </q-item-section>

       
      </q-item> -->
    </q-list>
        </q-card-section>
  <q-separator vertical />
        <q-card-section>
             <!-- <div class="q-pa-md">
    <q-infinite-scroll @load="onLoad" :offset="250">
      <div v-for="(item, index) in itemss" :key="index" class="caption">
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.</p>
      </div>
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>
     </div> -->
          <div class="q-pa-md row justify-center">
    <div style="width: 100%;" v-for="(item, index) in this.table.data" :key="index">
      <q-chat-message
      :name="item.channelName"
        :avatar="item.channelId.channelAvatar"
        :text="[item.text]"
        size="6"
        stamp="4 minutes ago"
        text-color="white"
        bg-color="primary"
      />
      
    </div>
  </div>
        </q-card-section>

      

      </q-card-section>
    </q-card>


  </div>
</template>

<script>
import persianDate from "persian-date";
import Vue from "vue";
import IEcharts from "vue-echarts-v3/src/full.js";
import echarts from "echarts";
import { exportFile } from "quasar";
import Table from "../components/Table";
// import { ref } from 'vue'
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
    // const itemss = ref([ {}, {}, {}, {}, {}, {}, {} ])
    return { 
        // itemss,
    //     onLoad (index, done) {
    //     setTimeout(() => {
    //       itemss.value.push({}, {}, {}, {}, {}, {}, {})
    //       done()
    //     }, 2000)
    //   },
        table: null, 
        lorem : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' };
  },
  mounted() {
    this.table = {
      loading: false,
      canInsert: false  ,
      readonly: true,
      hasSubset: true,
      canDeActive : true,
      subsetUrl: "/channel/:id",
      title: "لیست کانال ها",
      filter: "",
      mode: "list",
      url: `model/channel`,
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
          label: "نام کانال",
          field: "channelName",
          sortable: true,
        },
        {
          name: "date",
          align: "left",
          label: "تاریخ ایجاد کانال",
          field: (row) => row.createdAt,
          format: (val) =>
            `${new persianDate(Date.parse(val)).format("YYYY-MM-DD")}`,
          sortable: true,
        },
         {
          name: "isActive",
          align: "left",
          label: "وضعیت کانال",
          field: "isActive",
          format: (val) => (val ? "فعال" : "غیر فعال"),
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
      userList : [],
      data: [],
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
    getList() {
      var tok = localStorage.getItem("token")
      let config = {'x-api-key': tok};
      this.$axios
        .get("model/channelContent",{headers: config})
        .then((response) => {
          var res = response.data.data.items;
          var Fres = res.filter(e => e.channelId._id === this.$route.params.itemId);
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
        this.$axios
        .get("model/person-Person",{headers: config})
        .then((response) => {
            var res = response.data.data.items;
            var res2 = res.filter(e => e.isChannel === true && e.channelId);
            var Fres = res2.filter(e => e.isChannel === true && e.channelId._id === this.$route.params.itemId);
            console.log("aa0",Fres)
          Fres.forEach((row, index) => {
            row.index = index + 1;
          });
          this.table.userList = Fres;
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
.my-card{
   width: 100%;
   /* max-width: 350px */
}

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
