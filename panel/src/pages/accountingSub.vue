<template>

  <q-page class="q-pt-xs">
      
    <div class="q-ma-md">
   <div class="q-pa-md q-gutter-sm dflex justify-between">
     <div> 
    <snap class="fnS">جمع کل مبالغ تسویه شده :</snap>
    <q-btn color="primary" :label = this.table.finalP  />
    </div>
        <!-- <vue-excel-xlsx
        :data="dataa"
        :columns="columns"
        :file-name="'Checkout'"
        :file-type="'xlsx'"
        :sheet-name="'sheetname'"
        class="excel"
        >
        <q-btn color="secondary" push  label="گرفتن خروجی Exel" />
    </vue-excel-xlsx> -->
  </div>
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
import moment from 'moment'
// import VueExcelXlsx from "vue-excel-xlsx";

Vue.component("IEcharts", IEcharts);
// Vue.use(VueExcelXlsx);
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
      columns : [
                    {
                        label: "نام",
                        field: "ownerId.firstName",
                    },
                    {
                        label: "نام خانوادگی",
                        field: "ownerId.lastName",
                        
                    },
                    {
                        label: "شماره شبا",
                        field: "ownerId.sheba",
                    },
                    {
                        label: "نام بانک",
                        field: "ownerId.bankName",
                    },
                    {
                        label: "کدملی",
                        field: "ownerId.personalCode",
                    },
                    {
                        label: "مبلغ(تومان)",
                        field: "amount",
                    },
                ],
                dataa : [],
    };
  },
  mounted() {
   
    this.table = {
      canDeActive : false,
      loading: false,
      canInsert: false,
      readonly: false,
      hasSubset: false,
      subsetUrl:'/accounting/farvardin/:id',
      title: this.$route.params.itemId === "farvardin" ? "لیست تسویه حساب فروردین ماه" :  this.$route.params.itemId === "ordibehesht"  ? "لیست تسویه حساب اردیبهشت ماه" : this.$route.params.itemId === "khordad"  ? "لیست تسویه حساب خرداد ماه" : this.$route.params.itemId === "tir"  ? "لیست تسویه حساب تیر ماه" : this.$route.params.itemId === "mordad"  ? "لیست تسویه حساب مرداد ماه" : this.$route.params.itemId === "shahrivar"  ? "لیست تسویه حساب شهریور ماه" : this.$route.params.itemId === "mehr"  ? "لیست تسویه حساب مهر ماه" : this.$route.params.itemId === "aban"  ? "لیست تسویه حساب آبان ماه" : this.$route.params.itemId === "azar"  ? "لیست تسویه حساب آذر ماه" : this.$route.params.itemId === "dey"  ? "لیست تسویه حساب دی ماه" : this.$route.params.itemId === "bahman"  ? "لیست تسویه حساب بهمن ماه" : this.$route.params.itemId === "esfand"  ? "لیست تسویه حساب اسفند ماه" : "" ,
      filter: "",
      mode: "list",
      url: `model/withdrawalDetail`,
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
          label: "نام ",
          field: (row) => row.ownerId.firstName,
          sortable: true,
        },
        {
          name: "lastName",
          align: "left",
          label: "نام خانوادگی",
          field: (row) => row.ownerId.lastName,
          sortable: true,
        },
        {
          name: "sheba",
          align: "left",
          label: "شماره شبا",
          field: (row) => row.ownerId.sheba,
          sortable: true,
        },
        {
          name: "bankName",
          align: "left",
          label: "نوع بانک",
          field: (row) => row.ownerId.bankName,
          sortable: true,
        },
        {
          name: "personalCode",
          align: "left",
          label: "کد ملی",
          field: (row) => row.ownerId.personalCode,
          sortable: true,
        },
        {
          name: "amount",
          align: "left",
          label: "مبلغ",
          field: (row) => `${row.amount} تومان`,
          sortable: true,
        },
        {
          name: "status",
          align: "left",
          label: "وضعیت تسویه",
          field: (row) => row.status === "pending" ? "در انتظار تسویه" : row.status === "accept" ? "تسویه شده" : row.status === "reject" ? "تسویه رد شده" : "",
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
      finalP : [],
      itemId: "",
      form: [
        
        {
          isFile: false,
          isObject: false,
          type: "q-select",
          label: "وضعیت تسویه",
          model: "",
          field: "status",
          disable: false,
          canUpdate: true,
          key: "",
          displayKey: "",
          isSecret: false,
          options: [
            {
              label: "تسویه شده",
              value: "accept",
            },
            {
              label: "در انتظار تسویه",
              value: "pending",
            },
            {
              label: "تسویه رد شده",
              value: "reject",
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
        .get("model/withdrawalDetail",{headers: config})
        .then((response) => {
        //   response.data.data.items.forEach((row, index) => {
        //     row.index = index + 1;
        //   });
      
        var idd = this.$route.params.itemId
            if(idd === "farvardin") {
                var farvardin = response.data.data.items.filter((e)=> new persianDate(Date.parse(e.date)).format("MMMM") === "فروردین")
                            farvardin.forEach((row, index) => {
                                    row.index = index + 1;
                                });
                  var mm = farvardin.map(es => parseInt(es.amount));
                  var sumM = mm.reduce((partialSum, a) => partialSum + a, 0);
                // var z = response.data.data.item.setPackageId
                    // if( farvardin !== undefined){
                    //     var sumM = mm.reduce((partialSum, a) => partialSum + a, 0);
                    // }else{
                    //     var sumM = 0;
                    // }    
                                       
            }
            
           
            
          
         
              // dataa = farvardin
              
             this.table.data = farvardin;  
             this.dataa = farvardin
            //  console.log("amin",this.dataa)
             this.table.finalP = `${sumM} تومان `
                
             
        //   this.table.loading = false;
        //     if(this.$route.params.itemId === 1){
        //     var farvardin = response.data.data.items.filter((e)=> new persianDate(Date.parse(e.date)).format("MMMM") === "فروردین")

        //     }
        //    var z = new persianDate(Date.parse(y)).format("MMMM");
        // console.log(m)
        // console.log(z)
           
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
.dflex{
    display: flex;
    align-items: center;
}
.fnS{
    font-weight: bold;
    margin-right: 10px;
}
.excel{
  border: none;
}
</style>
