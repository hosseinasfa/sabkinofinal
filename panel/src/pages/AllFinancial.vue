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
      canDeActive : false,
      canInsert: false,
      readonly: true,
      hasSubset: true,
      subsetUrl:'/users/:id/financials',
      title: "حسابداری کل",
      filter: "",
      mode: "list",
      url: `withdrawaldetail`,
      columns: [
        {
          name: "index",
          label: "#",
          field: "index",
          align: "left",
          sortable: true,
        },
        {
          name: "allPrice",
          align: "left",
          label: "مبلغ کل شارژها",
          field: (row) => `${row.allPrice} تومان`,
          sortable: true,
        },
        {
          name: "totalSales",
          align: "left",
          label: "مبلغ کل خرج شده",
          field: (row) => `${row.totalSales} تومان`,
          sortable: true,
        },
        {
          name: "totalSalesUser",
          align: "left",
          label: "سهم کل خدمات دهنده",
          field: (row) => `${row.totalSalesUser} تومان`,
          sortable: true,
        },
        {
          name: "totalincome",
          align: "left",
          label: "سهم کل سبکی نو",
          field: (row) => `${row.totalincome} تومان`,
          sortable: true,
        },
        {
          name: "totalambassador",
          align: "left",
          label: "مبالغ کل دعوت ها",
          field: (row) => `${row.totalambassador} تومان`,
          sortable: true,
        },
        {
          name: "Amounttobewithdrawn",
          align: "left",
          label: "مبلغ قابل برداشت سبکی نو",
          field: (row) => `${row.Amounttobewithdrawn} تومان`,
          sortable: true,
        },
        {
          name: "Amountwithdrawn",
          align: "left",
          label: "مبالغ برداشت شده",
          field: (row) => `${row.totalAdminWithdraw} تومان`,
          sortable: true,
        },
       
      ],
      data: [],
      itemId: "",
      form: [
        
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
    var masterData = [];
      var tok = localStorage.getItem("token")
      let config = {'x-api-key': tok};
      this.$axios
        .get(`model/person-Person`,{headers: config})
        .then((response) => {
            var res = response.data.data.items;
            var Fres = res.filter(e => e.walletBalance);
            var Fres2 = Fres.map(eg => eg.walletBalance)
            const sumWithIitial = Fres2.reduce(
                (previousValue, currentValue) => previousValue + currentValue
            )

            this.$axios
        .get(`model/financial`,{headers: config})
        .then((response) => {
          console.log('asd',response)
            var res = response.data.data.items;
            var Fres = res.filter(e => e.amount > 0);
            var Fres2 = Fres.map(eg => eg.totalPrice);
            var Fres3 =  Fres.map(eg => eg.finalPrice);
            var Fres4 =  res.filter(eg => eg.type === "ambassador");
            var Fres5 =  Fres4.map(eg => eg.finalPrice);

            console.log(Fres2)
            
            

            var totalSales = Fres2.reduce(
                (previousValue2, currentValue2) => previousValue2 + currentValue2
            );
         

            var totalSalesUser = Fres3.reduce(
                (previousValue, currentValue) => previousValue + currentValue
            );
          
            var totalambassador = Fres5.reduce(
                (previousValue, currentValue) => previousValue + currentValue
            );

         

            var AdminWithdraw = response.data.data.items.filter((e)=> e.adminWithdraw);
            if(AdminWithdraw.length > 0){
              var adminWithdrawAll =  AdminWithdraw.map(eg => eg.adminWithdraw);
              var totalAdminWithdraw = adminWithdrawAll.reduce(
                (previousValue2, currentValue2) => previousValue2 + currentValue2
            );
            }else{
              var totalAdminWithdraw = 0
            }
            
            

            var totalincome = totalSales - totalSalesUser;
           
            var  Amounttobewithdraw = totalincome - totalambassador;
            
            var Amounttobewithdrawn = Amounttobewithdraw -  totalAdminWithdraw;

             masterData.push({ "allPrice" : sumWithIitial , "totalSales" : totalSales , "totalSalesUser" : totalSalesUser , "totalincome" : totalincome , "totalambassador" : totalambassador , "Amounttobewithdrawn" : Amounttobewithdrawn, "totalAdminWithdraw" : totalAdminWithdraw});
        //     var mm = [];
        //     mm.push({ "allPrice" : sumWithIitial})

        //   console.log(mm)
            
        //   mm.forEach((row, index) => {
        //     row.index = index + 1;
        //   });
          
        //   this.table.data = mm;
        // //   this.table.data2 = sumWithIitial;

          masterData.forEach((row, index) => {
            row.index = index + 1;
          });
          
          this.table.data = masterData;

          this.table.loading = false;
        })
        
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
