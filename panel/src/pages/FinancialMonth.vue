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
      readonly: false,
      hasSubset: false,
      
      subsetUrl:'/users/:id/financials',
      title: "حسابداری به تفکیک ماه ",
      filter: "",
      mode: "list",
      url: `model/financial`,
      columns: [
        {
          name: "index",
          label: "#",
          field: "index",
          align: "left",
          sortable: true,
        },
       
        {
          name: "lastName",
          align: "left",
          label: "سال",
          field: (row) => row.year,
          sortable: true,
        },
        {
          name: "firstName",
          align: "left",
          label: "نام ماه",
          field: (row) => row.monthName,
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
          name: "totalAdminWithdraw",
          align: "left",
          label: "مبالغ برداشت شده",
          field: (row) => `${row.totalAdminWithdraw} تومان`,
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
      itemId: "",
      form: [
         {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "مبلغ قابل برداشت",
          model: "",
          field: "Amounttobewithdrawn",
          isSecret: false,
          canUpdate: true,
          disable : true
        },
          {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "مبلغ برداشت",
          model: "",
          field: "adminWithdraw",
          isSecret: false,
          canUpdate: true,
          
        },
        {
          isFile: false,
          isObject: false,
          type: "q-select",
          label: "ماه تسویه",
          model: "",
          field: "adminWithdrawMonth",
          isSecret: false,
          canUpdate: true,
          options: [
            {
              label: "فروردین",
              value: "farvardin",
            },
            {
              label: "اردیبهشت",
              value: "ordibehesht",
            },
            {
              label: "خرداد",
              value: "khordad",
            },
            {
              label: "تیر",
              value: "tir",
            },
            {
              label: "مرداد",
              value: "mordad",
            },
            {
              label: "شهریور",
              value: "shahrivar",
            },
            {
              label: "مهر",
              value: "mehr",
            },
            {
              label: "آبان",
              value: "aban",
            },
            {
              label: "آذر",
              value: "azar",
            },
            {
              label: "دی",
              value: "dey",
            },
            {
              label: "بهمن",
              value: "bahman",
            },
            {
              label: "اسفند",
              value: "esfand",
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
            
            
            var farvardin = response.data.data.items.filter((e)=> new persianDate(Date.parse(e.createdAt)).format("MMMM") === "فروردین");
            var ordibehesht = response.data.data.items.filter((e)=> new persianDate(Date.parse(e.createdAt)).format("MMMM") === "اردیبهشت");
            var khordad = response.data.data.items.filter((e)=> new persianDate(Date.parse(e.createdAt)).format("MMMM") === "خرداد");
            var tir = response.data.data.items.filter((e)=> new persianDate(Date.parse(e.createdAt)).format("MMMM") === "تیر");
            var mordad = response.data.data.items.filter((e)=> new persianDate(Date.parse(e.createdAt)).format("MMMM") === "مرداد");
            var shahrivar = response.data.data.items.filter((e)=> new persianDate(Date.parse(e.createdAt)).format("MMMM") === "شهریور");
            var mehr = response.data.data.items.filter((e)=> new persianDate(Date.parse(e.createdAt)).format("MMMM") === "مهر");
            var aban = response.data.data.items.filter((e)=> new persianDate(Date.parse(e.createdAt)).format("MMMM") === "آبان");
            var azar = response.data.data.items.filter((e)=> new persianDate(Date.parse(e.createdAt)).format("MMMM") === "آذر");
            var dey = response.data.data.items.filter((e)=> new persianDate(Date.parse(e.createdAt)).format("MMMM") === "دی");
            var bahman = response.data.data.items.filter((e)=> new persianDate(Date.parse(e.createdAt)).format("MMMM") === "بهمن");
            var esfand = response.data.data.items.filter((e)=> new persianDate(Date.parse(e.createdAt)).format("MMMM") === "اسفند");
            // ---------------------- فروردین ------------------------------
            var Fresfarvardin = farvardin.filter(e => e.amount > 0);
            var Fres2farvardin = Fresfarvardin.map(eg => eg.totalPrice);
            var Fres3farvardin =  Fresfarvardin.map(eg => eg.finalPrice);
            var Fres4farvardin =  farvardin.filter(eg => eg.type === "ambassador");
            var Fres5farvardin =  Fres4farvardin.map(eg => eg.finalPrice);
            
            var adminWithdrawwfarvardin = response.data.data.items.filter((e)=> e.adminWithdraw && e.adminWithdrawMonth === "farvardin");
            var adminWithdrawAllfarvardin =  adminWithdrawwfarvardin.map(eg => eg.adminWithdraw);
            var totalAdminWithdrawfarvardin = adminWithdrawAllfarvardin.reduce(
                (previousValue2, currentValue2) => previousValue2 + currentValue2
            );

            var totalSalesfarvardin = Fres2farvardin.reduce(
                (previousValue2, currentValue2) => previousValue2 + currentValue2
            );
            var totalSalesUserfarvardin = Fres3farvardin.reduce(
                (previousValue, currentValue) => previousValue + currentValue
            );
            if(Fres5farvardin.length > 0){
            var totalambassador = Fres5farvardin.reduce(
                (previousValue, currentValue) => previousValue + currentValue
            );
            }else{
                totalambassador = 0
            }
            var totalincomefarvardin = totalSalesfarvardin - totalSalesUserfarvardin; 
            var Amounttobewithdrawnfarvardin =  totalincomefarvardin - totalambassador
            var AmounttobewithdrawnfarvardinLast =  Amounttobewithdrawnfarvardin - totalAdminWithdrawfarvardin
            
         // ---------------------- اردیبهشت ------------------------------
            var Fresordibehesht = ordibehesht.filter(e => e.amount > 0);
            var Fres2ordibehesht = Fresordibehesht.map(eg => eg.totalPrice);
            var Fres3ordibehesht =  Fresordibehesht.map(eg => eg.finalPrice);
            var Fres4ordibehesht =  ordibehesht.filter(eg => eg.type === "ambassador");
            var Fres5ordibehesht =  Fres4ordibehesht.map(eg => eg.finalPrice);
            
            var adminWithdrawwordibehesht = response.data.data.items.filter((e)=> e.adminWithdraw && e.adminWithdrawMonth === "ordibehesht");
            var adminWithdrawAllordibehesht =  adminWithdrawwordibehesht.map(eg => eg.adminWithdraw);
            var totalAdminWithdrawordibehesht = adminWithdrawAllordibehesht.reduce(
                (previousValue2, currentValue2) => previousValue2 + currentValue2
            );

            var totalSalesordibehesht = Fres2ordibehesht.reduce(
                (previousValue2, currentValue2) => previousValue2 + currentValue2
            );
            var totalSalesUserordibehesht = Fres3ordibehesht.reduce(
                (previousValue, currentValue) => previousValue + currentValue
            );
            if(Fres5ordibehesht.length > 0){
            var totalambassador = Fres5ordibehesht.reduce(
                (previousValue, currentValue) => previousValue + currentValue
            );
            }else{
                totalambassador = 0
            }
            var totalincomeordibehesht = totalSalesordibehesht - totalSalesUserordibehesht; 
            var Amounttobewithdrawnordibehesht =  totalincomeordibehesht - totalambassador
            var AmounttobewithdrawnordibeheshtLast =  Amounttobewithdrawnordibehesht - totalAdminWithdrawordibehesht

         // ---------------------- خرداد ------------------------------
        if(khordad.length > 0){
            var Freskhordad = khordad.filter(e => e.amount > 0);
            var Fres2khordad = Freskhordad.map(eg => eg.totalPrice);
            var Fres3khordad =  Freskhordad.map(eg => eg.finalPrice);
            var Fres4khordad =  khordad.filter(eg => eg.type === "ambassador");
            var Fres5khordad =  Fres4khordad.map(eg => eg.finalPrice);

            var adminWithdrawwkhordad = response.data.data.items.filter((e)=> e.adminWithdraw && e.adminWithdrawMonth === "khordad");
            var adminWithdrawAllkhordad =  adminWithdrawwkhordad.map(eg => eg.adminWithdraw);
            var totalAdminWithdrawkhordad = adminWithdrawAllkhordad.reduce(
                (previousValue2, currentValue2) => previousValue2 + currentValue2
            );

            var totalSaleskhordad = Fres2khordad.reduce(
                (previousValue2, currentValue2) => previousValue2 + currentValue2
            );
            var totalSalesUserkhordad = Fres3khordad.reduce(
                (previousValue, currentValue) => previousValue + currentValue
            );
            if(Fres5khordad.length > 0){
            var totalambassador = Fres5khordad.reduce(
                (previousValue, currentValue) => previousValue + currentValue
            );
            }else{
                totalambassador = 0
            }
            var totalincomekhordad = totalSaleskhordad - totalSalesUserkhordad; 
            var Amounttobewithdrawnkhordad =  totalincomekhordad - totalambassador;
            var AmounttobewithdrawnkhordadLast =  Amounttobewithdrawnkhordad - totalAdminWithdrawkhordad;
            }else{
                totalSaleskhordad = 0;
                totalSalesUserkhordad = 0;
                totalincomekhordad = 0;
                Amounttobewithdrawnkhordad = 0 ;
                AmounttobewithdrawnkhordadLast = 0;
                totalAdminWithdrawkhordad = 0
            }
         // ---------------------- تیر ------------------------------
          if(tir.length > 0){
            var Frestir = tir.filter(e => e.amount > 0);
            var Fres2tir = Frestir.map(eg => eg.totalPrice);
            var Fres3tir =  Frestir.map(eg => eg.finalPrice);
            var Fres4tir =  tir.filter(eg => eg.type === "ambassador");
            var Fres5tir =  Fres4tir.map(eg => eg.finalPrice);

           var adminWithdrawwtir = response.data.data.items.filter((e)=> e.adminWithdraw && e.adminWithdrawMonth === "tir");
            var adminWithdrawAlltir =  adminWithdrawwtir.map(eg => eg.adminWithdraw);
            var totalAdminWithdrawtir = adminWithdrawAlltir.reduce(
                (previousValue2, currentValue2) => previousValue2 + currentValue2
            );

            var totalSalestir = Fres2tir.reduce(
                (previousValue2, currentValue2) => previousValue2 + currentValue2
            );
            var totalSalesUsertir = Fres3tir.reduce(
                (previousValue, currentValue) => previousValue + currentValue
            );
            if(Fres5tir.length > 0){
            var totalambassador = Fres5tir.reduce(
                (previousValue, currentValue) => previousValue + currentValue
            );
            }else{
                totalambassador = 0
            }
            var totalincometir = totalSalestir - totalSalesUsertir; 
            var Amounttobewithdrawntir =  totalincometir - totalambassador;
            var AmounttobewithdrawntirLast =  Amounttobewithdrawntir - totalAdminWithdrawtir;
          }else{
                totalSalestir = 0;
                totalSalesUsertir = 0;
                totalincometir = 0;
                Amounttobewithdrawntir = 0 ;
                AmounttobewithdrawntirLast = 0;
                totalAdminWithdrawtir = 0
            }
         // ---------------------- مرداد ------------------------------
          if(mordad.length > 0){
            var Fresmordad = mordad.filter(e => e.amount > 0);
            var Fres2mordad = Fresmordad.map(eg => eg.totalPrice);
            var Fres3mordad =  Fresmordad.map(eg => eg.finalPrice);
            var Fres4mordad =  mordad.filter(eg => eg.type === "ambassador");
            var Fres5mordad =  Fres4mordad.map(eg => eg.finalPrice);

            var adminWithdrawwmordad = response.data.data.items.filter((e)=> e.adminWithdraw && e.adminWithdrawMonth === "mordad");
            var adminWithdrawAllmordad =  adminWithdrawwmordad.map(eg => eg.adminWithdraw);
            var totalAdminWithdrawmordad = adminWithdrawAllmordad.reduce(
                (previousValue2, currentValue2) => previousValue2 + currentValue2
            );

            var totalSalesmordad = Fres2mordad.reduce(
                (previousValue2, currentValue2) => previousValue2 + currentValue2
            );
            var totalSalesUsermordad = Fres3mordad.reduce(
                (previousValue, currentValue) => previousValue + currentValue
            );
            if(Fres5mordad.length > 0){
            var totalambassador = Fres5mordad.reduce(
                (previousValue, currentValue) => previousValue + currentValue
            );
            }else{
                totalambassador = 0
            }
            var totalincomemordad = totalSalesmordad - totalSalesUsermordad; 
            var Amounttobewithdrawnmordad =  totalincomemordad - totalambassador;
            var AmounttobewithdrawnmordadLast =  Amounttobewithdrawnmordad - totalAdminWithdrawmordad;
          }else{
                totalSalesmordad = 0;
                totalSalesUsermordad = 0;
                totalincomemordad = 0;
                Amounttobewithdrawnmordad = 0 ;
                AmounttobewithdrawnmordadLast = 0 ;
                totalAdminWithdrawmordad = 0
            }
         // ---------------------- شهریور ------------------------------
         if(shahrivar.length > 0){
            var Fresshahrivar = shahrivar.filter(e => e.amount > 0);
            var Fres2shahrivar = Fresshahrivar.map(eg => eg.totalPrice);
            var Fres3shahrivar =  Fresshahrivar.map(eg => eg.finalPrice);
            var Fres4shahrivar =  shahrivar.filter(eg => eg.type === "ambassador");
            var Fres5shahrivar =  Fres4shahrivar.map(eg => eg.finalPrice);

            var adminWithdrawwshahrivar = response.data.data.items.filter((e)=> e.adminWithdraw && e.adminWithdrawMonth === "shahrivar");
            var adminWithdrawAllshahrivar =  adminWithdrawwshahrivar.map(eg => eg.adminWithdraw);
            var totalAdminWithdrawshahrivar = adminWithdrawAllshahrivar.reduce(
                (previousValue2, currentValue2) => previousValue2 + currentValue2
            );

            var totalSalesshahrivar = Fres2shahrivar.reduce(
                (previousValue2, currentValue2) => previousValue2 + currentValue2
            );
            var totalSalesUsershahrivar = Fres3shahrivar.reduce(
                (previousValue, currentValue) => previousValue + currentValue
            );
            if(Fres5shahrivar.length > 0){
            var totalambassador = Fres5shahrivar.reduce(
                (previousValue, currentValue) => previousValue + currentValue
            );
            }else{
                totalambassador = 0
            }
            var totalincomeshahrivar = totalSalesshahrivar - totalSalesUsershahrivar; 
            var Amounttobewithdrawnshahrivar =  totalincomeshahrivar - totalambassador;
            var AmounttobewithdrawnshahrivarLast =  Amounttobewithdrawnshahrivar - totalAdminWithdrawshahrivar;
         }else{
                totalSalesshahrivar = 0;
                totalSalesUsershahrivar = 0;
                totalincomeshahrivar = 0;
                AmounttobewithdrawnshahrivarLast = 0 ;
                totalAdminWithdrawshahrivar = 0
            }
         // ---------------------- مهر ------------------------------
            if(mehr.length > 0){
            var Fresmehr = mehr.filter(e => e.amount > 0);
            var Fres2mehr = Fresmehr.map(eg => eg.totalPrice);
            var Fres3mehr =  Fresmehr.map(eg => eg.finalPrice);
            var Fres4mehr =  mehr.filter(eg => eg.type === "ambassador");
            var Fres5mehr =  Fres4mehr.map(eg => eg.finalPrice);

            var adminWithdrawwmehr = response.data.data.items.filter((e)=> e.adminWithdraw && e.adminWithdrawMonth === "mehr");
            var adminWithdrawAllmehr =  adminWithdrawwmehr.map(eg => eg.adminWithdraw);
            var totalAdminWithdrawmehr = adminWithdrawAllmehr.reduce(
                (previousValue2, currentValue2) => previousValue2 + currentValue2
            );

            var totalSalesmehr = Fres2mehr.reduce(
                (previousValue2, currentValue2) => previousValue2 + currentValue2
            );
            var totalSalesUsermehr = Fres3mehr.reduce(
                (previousValue, currentValue) => previousValue + currentValue
            );
            if(Fres5mehr.length > 0){
            var totalambassador = Fres5mehr.reduce(
                (previousValue, currentValue) => previousValue + currentValue
            );
            }else{
                totalambassador = 0
            }
            var totalincomemehr = totalSalesmehr - totalSalesUsermehr; 
            var Amounttobewithdrawnmehr =  totalincomemehr - totalambassador
            var AmounttobewithdrawnmehrLast =  Amounttobewithdrawnmehr - totalAdminWithdrawmehr;
            }else{
                totalSalesmehr = 0;
                totalSalesUsermehr = 0;
                totalincomemehr = 0;
                AmounttobewithdrawnmehrLast = 0 ;
                totalAdminWithdrawmehr = 0
                
            }
         // ---------------------- آبان ------------------------------
         if(aban.length > 0){
            var Fresaban = aban.filter(e => e.amount > 0);
            var Fres2aban = Fresaban.map(eg => eg.totalPrice);
            var Fres3aban =  Fresaban.map(eg => eg.finalPrice);
            var Fres4aban =  aban.filter(eg => eg.type === "ambassador");
            var Fres5aban =  Fres4aban.map(eg => eg.finalPrice);

            var adminWithdrawwaban = response.data.data.items.filter((e)=> e.adminWithdraw && e.adminWithdrawMonth === "aban");
            var adminWithdrawAllaban =  adminWithdrawwaban.map(eg => eg.adminWithdraw);
            var totalAdminWithdrawaban = adminWithdrawAllaban.reduce(
                (previousValue2, currentValue2) => previousValue2 + currentValue2
            );

            var totalSalesaban = Fres2aban.reduce(
                (previousValue2, currentValue2) => previousValue2 + currentValue2
            );
            var totalSalesUseraban = Fres3aban.reduce(
                (previousValue, currentValue) => previousValue + currentValue
            );
            if(Fres5aban.length > 0){
            var totalambassador = Fres5aban.reduce(
                (previousValue, currentValue) => previousValue + currentValue
            );
            }else{
                totalambassador = 0
            }
            var totalincomeaban = totalSalesaban - totalSalesUseraban; 
            var Amounttobewithdrawnaban =  totalincomeaban - totalambassador;
            var AmounttobewithdrawnabanLast =  Amounttobewithdrawnaban - totalAdminWithdrawaban;
         }else{
                totalSalesaban = 0;
                totalSalesUseraban = 0;
                totalincomeaban = 0;
                AmounttobewithdrawnabanLast = 0 ;
                totalAdminWithdrawaban = 0
            }
         // ---------------------- آذر ------------------------------
         if(azar.length > 0){
            var Fresazar = azar.filter(e => e.amount > 0);
            var Fres2azar = Fresazar.map(eg => eg.totalPrice);
            var Fres3azar =  Fresazar.map(eg => eg.finalPrice);
            var Fres4azar =  azar.filter(eg => eg.type === "ambassador");
            var Fres5azar =  Fres4azar.map(eg => eg.finalPrice);

            var adminWithdrawwazar = response.data.data.items.filter((e)=> e.adminWithdraw && e.adminWithdrawMonth === "azar");
            var adminWithdrawAllazar =  adminWithdrawwazar.map(eg => eg.adminWithdraw);
            var totalAdminWithdrawazar = adminWithdrawAllazar.reduce(
                (previousValue2, currentValue2) => previousValue2 + currentValue2
            );

            var totalSalesazar = Fres2azar.reduce(
                (previousValue2, currentValue2) => previousValue2 + currentValue2
            );
            var totalSalesUserazar = Fres3azar.reduce(
                (previousValue, currentValue) => previousValue + currentValue
            );
            if(Fres5azar.length > 0){
            var totalambassador = Fres5azar.reduce(
                (previousValue, currentValue) => previousValue + currentValue
            );
            }else{
                totalambassador = 0
            }
            var totalincomeazar = totalSalesazar - totalSalesUserazar; 
            var Amounttobewithdrawnazar =  totalincomeazar - totalambassador;
            var AmounttobewithdrawnazarLast =  Amounttobewithdrawnazar - totalAdminWithdrawazar;
         }else{
                totalSalesazar = 0;
                totalSalesUserazar = 0;
                totalincomeazar = 0;
                AmounttobewithdrawnazarLast = 0 ;
                totalAdminWithdrawazar = 0
            }
         // ---------------------- دی ------------------------------
         if(dey.length > 0){
            var Fresdey = dey.filter(e => e.amount > 0);
            var Fres2dey = Fresdey.map(eg => eg.totalPrice);
            var Fres3dey =  Fresdey.map(eg => eg.finalPrice);
            var Fres4dey =  dey.filter(eg => eg.type === "ambassador");
            var Fres5dey =  Fres4dey.map(eg => eg.finalPrice);

            var adminWithdrawwdey = response.data.data.items.filter((e)=> e.adminWithdraw && e.adminWithdrawMonth === "dey");
            var adminWithdrawAlldey =  adminWithdrawwdey.map(eg => eg.adminWithdraw);
            var totalAdminWithdrawdey = adminWithdrawAlldey.reduce(
                (previousValue2, currentValue2) => previousValue2 + currentValue2
            );
            
            var totalSalesdey = Fres2dey.reduce(
                (previousValue2, currentValue2) => previousValue2 + currentValue2
            );
            var totalSalesUserdey = Fres3dey.reduce(
                (previousValue, currentValue) => previousValue + currentValue
            );
            if(Fres5dey.length > 0){
            var totalambassador = Fres5dey.reduce(
                (previousValue, currentValue) => previousValue + currentValue
            );
            }else{
                totalambassador = 0
            }
            var totalincomedey = totalSalesdey - totalSalesUserdey; 
            var Amounttobewithdrawndey =  totalincomedey - totalambassador;
            var AmounttobewithdrawndeyLast =  Amounttobewithdrawndey - totalAdminWithdrawdey;
         }else{
                totalSalesdey = 0;
                totalSalesUserdey = 0;
                totalincomedey = 0;
                AmounttobewithdrawndeyLast = 0 ;
                totalAdminWithdrawdey = 0
            }
         // ---------------------- بهمن ------------------------------
         if(bahman.length > 0){
            var Fresbahman = bahman.filter(e => e.amount > 0);
            var Fres2bahman = Fresbahman.map(eg => eg.totalPrice);
            var Fres3bahman =  Fresbahman.map(eg => eg.finalPrice);
            var Fres4bahman =  bahman.filter(eg => eg.type === "ambassador");
            var Fres5bahman =  Fres4bahman.map(eg => eg.finalPrice);

            var adminWithdrawwbahman = response.data.data.items.filter((e)=> e.adminWithdraw && e.adminWithdrawMonth === "bahman");
            var adminWithdrawAllbahman =  adminWithdrawwbahman.map(eg => eg.adminWithdraw);
            var totalAdminWithdrawbahman = adminWithdrawAllbahman.reduce(
                (previousValue2, currentValue2) => previousValue2 + currentValue2
            );

            var totalSalesbahman = Fres2bahman.reduce(
                (previousValue2, currentValue2) => previousValue2 + currentValue2
            );
            var totalSalesUserbahman = Fres3bahman.reduce(
                (previousValue, currentValue) => previousValue + currentValue
            );
            if(Fres5bahman.length > 0){
            var totalambassador = Fres5bahman.reduce(
                (previousValue, currentValue) => previousValue + currentValue
            );
            }else{
                totalambassador = 0
            }
            var totalincomebahman = totalSalesbahman - totalSalesUserbahman; 
            var Amounttobewithdrawnbahman =  totalincomebahman - totalambassador;
            var AmounttobewithdrawnbahmanLast =  Amounttobewithdrawnbahman - totalAdminWithdrawbahman;
         }else{
                totalSalesbahman = 0;
                totalSalesUserbahman = 0;
                totalincomebahman = 0;
                AmounttobewithdrawnbahmanLast = 0 ;
                totalAdminWithdrawbahman = 0
            }
         // ---------------------- اسفند ------------------------------
         if(esfand.length > 0){
            var Fresesfand = esfand.filter(e => e.amount > 0);
            var Fres2esfand = Fresesfand.map(eg => eg.totalPrice);
            var Fres3esfand =  Fresesfand.map(eg => eg.finalPrice);
            var Fres4esfand =  esfand.filter(eg => eg.type === "ambassador");
            var Fres5esfand =  Fres4esfand.map(eg => eg.finalPrice);

            var adminWithdrawwesfand = response.data.data.items.filter((e)=> e.adminWithdraw && e.adminWithdrawMonth === "esfand");
            var adminWithdrawAllesfand =  adminWithdrawwesfand.map(eg => eg.adminWithdraw);
            var totalAdminWithdrawesfand = adminWithdrawAllesfand.reduce(
                (previousValue2, currentValue2) => previousValue2 + currentValue2
            );

            var totalSalesesfand = Fres2esfand.reduce(
                (previousValue2, currentValue2) => previousValue2 + currentValue2
            );
            var totalSalesUseresfand = Fres3esfand.reduce(
                (previousValue, currentValue) => previousValue + currentValue
            );
            if(Fres5esfand.length > 0){
            var totalambassador = Fres5esfand.reduce(
                (previousValue, currentValue) => previousValue + currentValue
            );
            }else{
                totalambassador = 0
            }
            var totalincomeesfand = totalSalesesfand - totalSalesUseresfand; 
            var Amounttobewithdrawnesfand =  totalincomeesfand - totalambassador
            var AmounttobewithdrawnesfandLast =  Amounttobewithdrawnesfand - totalAdminWithdrawesfand;
         }else{
                totalSalesesfand = 0;
                totalSalesUseresfand = 0;
                totalincomeesfand = 0;
                AmounttobewithdrawnesfandLast = 0 ;
                totalAdminWithdrawesfand = 0
            }



             masterData.push(
                 {"_id" : "asdsadsa", "year" : 1401, "monthName" : "فروردین", "allPrice" : sumWithIitial , "totalSales" : totalSalesfarvardin , "totalSalesUser" : totalSalesUserfarvardin , "totalincome" : totalincomefarvardin , "totalambassador" : totalambassador , "Amounttobewithdrawn" : AmounttobewithdrawnfarvardinLast , "totalAdminWithdraw" : totalAdminWithdrawfarvardin},
                 {"year" : 1401, "monthName" : "اردیبهشت", "allPrice" : sumWithIitial , "totalSales" : totalSalesordibehesht , "totalSalesUser" : totalSalesUserordibehesht , "totalincome" : totalincomeordibehesht , "totalambassador" : totalambassador , "Amounttobewithdrawn" : AmounttobewithdrawnordibeheshtLast, "totalAdminWithdraw" : totalAdminWithdrawordibehesht},
                 {"year" : 1401, "monthName" : "خرداد", "allPrice" : sumWithIitial , "totalSales" : totalSaleskhordad , "totalSalesUser" : totalSalesUserkhordad , "totalincome" : totalincomekhordad , "totalambassador" : totalambassador , "Amounttobewithdrawn" : AmounttobewithdrawnkhordadLast, "totalAdminWithdraw" : totalAdminWithdrawkhordad},
                 {"year" : 1401, "monthName" : "تیر", "allPrice" : sumWithIitial , "totalSales" : totalSalestir , "totalSalesUser" : totalSalesUsertir , "totalincome" : totalincometir , "totalambassador" : totalambassador , "Amounttobewithdrawn" : AmounttobewithdrawntirLast, "totalAdminWithdraw" : totalAdminWithdrawtir},
                 {"year" : 1401, "monthName" : "مرداد", "allPrice" : sumWithIitial , "totalSales" : totalSalesmordad , "totalSalesUser" : totalSalesUsermordad , "totalincome" : totalincomemordad , "totalambassador" : totalambassador , "Amounttobewithdrawn" : AmounttobewithdrawnmordadLast, "totalAdminWithdraw" : totalAdminWithdrawmordad},
                 {"year" : 1401, "monthName" : "شهریور", "allPrice" : sumWithIitial , "totalSales" : totalSalesshahrivar , "totalSalesUser" : totalSalesUsershahrivar , "totalincome" : totalincomeshahrivar , "totalambassador" : totalambassador , "Amounttobewithdrawn" : AmounttobewithdrawnshahrivarLast, "totalAdminWithdraw" : totalAdminWithdrawshahrivar},
                 {"year" : 1401, "monthName" : "مهر", "allPrice" : sumWithIitial , "totalSales" : totalSalesmehr , "totalSalesUser" : totalSalesUsermehr , "totalincome" : totalincomemehr , "totalambassador" : totalambassador , "Amounttobewithdrawn" : AmounttobewithdrawnmehrLast, "totalAdminWithdraw" : totalAdminWithdrawmehr},
                 {"year" : 1401, "monthName" : "آبان", "allPrice" : sumWithIitial , "totalSales" : totalSalesaban , "totalSalesUser" : totalSalesUseraban , "totalincome" : totalincomeaban , "totalambassador" : totalambassador , "Amounttobewithdrawn" : AmounttobewithdrawnabanLast, "totalAdminWithdraw" : totalAdminWithdrawaban},
                 {"year" : 1401, "monthName" : "آذر", "allPrice" : sumWithIitial , "totalSales" : totalSalesazar , "totalSalesUser" : totalSalesUserazar , "totalincome" : totalincomeazar , "totalambassador" : totalambassador , "Amounttobewithdrawn" : AmounttobewithdrawnazarLast, "totalAdminWithdraw" : totalAdminWithdrawazar},
                 {"year" : 1401, "monthName" : "دی", "allPrice" : sumWithIitial , "totalSales" : totalSalesdey , "totalSalesUser" : totalSalesUserdey , "totalincome" : totalincomedey , "totalambassador" : totalambassador , "Amounttobewithdrawn" : AmounttobewithdrawndeyLast, "totalAdminWithdraw" : totalAdminWithdrawdey},
                 {"year" : 1401, "monthName" : "بهمن", "allPrice" : sumWithIitial , "totalSales" : totalSalesbahman , "totalSalesUser" : totalSalesUserbahman , "totalincome" : totalincomebahman , "totalambassador" : totalambassador , "Amounttobewithdrawn" : AmounttobewithdrawnbahmanLast, "totalAdminWithdraw" : totalAdminWithdrawbahman},
                 {"year" : 1401, "monthName" : "اسفند", "allPrice" : sumWithIitial , "totalSales" : totalSalesesfand , "totalSalesUser" : totalSalesUseresfand , "totalincome" : totalincomeesfand , "totalambassador" : totalambassador , "Amounttobewithdrawn" : AmounttobewithdrawnesfandLast, "totalAdminWithdraw" : totalAdminWithdrawesfand},

                 );
        

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
