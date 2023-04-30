<template>
  <q-layout view="lHh LpR lFf">
    <q-header
        reveal
        :class="$q.dark.isActive ? 'header_dark' : 'header_normal'"
    >
      <q-toolbar>
        <q-btn
            @click="left = !left"
            flat
            round
            dense
            icon="menu"
            class="q-mr-sm"
        />
        <!--          <q-avatar>-->
        <!--            <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg">-->
        <!--          </q-avatar>-->

        <q-toolbar-title>پنل مدیریت سبکی نو</q-toolbar-title>
        <q-btn
            class="q-mr-xs"
            flat
            round
            @click="$q.dark.toggle()"
            :icon="$q.dark.isActive ? 'nights_stay' : 'wb_sunny'"
        />
        <q-btn
            flat
            round
            dense
            icon="fas fa-sign-out-alt"
            @click="logoutNotify"
            to="/"
        />
      </q-toolbar>
    </q-header>
    <q-drawer
        class="left-navigation text-white"
        show-if-above
        v-model="left"
        style="
        background-image: url(https://demos.creative-tim.com/vue-material-dashboard/img/sidebar-2.32103624.jpg) !important;
      "
        side="left"
        elevated
    >
      <div
          class="full-height"
          :class="$q.dark.isActive ? 'drawer_dark' : 'drawer_normal'"
      >
        <div style="height: calc(100% - 117px); padding: 10px">
          <q-toolbar>
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/boy-avatar.png"/>
            </q-avatar>

            <q-toolbar-title>پنل مدیریت سبکینو</q-toolbar-title>
          </q-toolbar>
          <hr/>
          <q-scroll-area style="height: 100%">
            <q-list dense>
              


             <q-expansion-item
                  group="somegroup"
                  icon="explore"
                  label="کاربران"
                  default-closed
                  header-class=""
                 v-if="ListUser === 'admin' || ListUser === 'support' || ListUser === 'productManager'"
              >
                <q-card>
                  <q-card-section>
                    <EssentialLink
                        v-for="link in sidebar"
                        :key="link.title"
                        v-bind="link"
                    />
                  </q-card-section>
                </q-card>
              </q-expansion-item>

              <q-expansion-item
                  group="somegroup"
                  icon="explore"
                  label="کامنت ها "
                  default-closed
                  header-class=""
                 v-if="ListUser === 'admin' || ListUser === 'support' || ListUser === 'productManager'"
              >
                <q-card>
                  <q-card-section>
                    <EssentialLink
                        v-for="link in sidebar11"
                        :key="link.title"
                        v-bind="link"
                    />
                  </q-card-section>
                </q-card>
              </q-expansion-item>

              <q-expansion-item
                  group="somegroup"
                  icon="explore"
                  label="گزارشات"
                  default-closed
                  header-class=""
                 v-if="ListUser === 'admin' || ListUser === 'support' || ListUser === 'productManager'"
              >
                <q-card>
                  <q-card-section>
                    <EssentialLink
                        v-for="link in sidebar24"
                        :key="link.title"
                        v-bind="link"
                    />
                  </q-card-section>
                </q-card>
              </q-expansion-item>
              
              <q-expansion-item
                  group="somegroup"
                  icon="explore"
                  label="تماس آنلاین"
                  default-closed
                  header-class=""
                  v-if="ListUser === 'admin' || ListUser === 'support' || ListUser === 'productManager'"
              >
                <q-card>
                  <q-card-section>
                    <EssentialLink
                        v-for="linkk in sidebaar"
                        :key="linkk.title"
                        v-bind="linkk"
                    />
                  </q-card-section>
                </q-card>
              </q-expansion-item>

           
              <q-expansion-item
                  group="somegroup"
                  icon="explore"
                  label="دوره آنلاین"
                  default-closed
                  header-class=""
                  v-if="ListUser === 'admin' || ListUser === 'support' || ListUser === 'productManager'"
              >
                <q-card>
                  <q-card-section>
                    <EssentialLink
                        v-for="linkk in sidebar1"
                        :key="linkk.title"
                        v-bind="linkk"
                    />
                  </q-card-section>
                </q-card>
              </q-expansion-item>

              <q-expansion-item
                  group="somegroup"
                  icon="explore"
                  label="ویترین"
                  default-closed
                  header-class=""
                  v-if="ListUser === 'admin' || ListUser === 'support' || ListUser === 'productManager'"
              >
                <q-card>
                  <q-card-section>
                    <EssentialLink
                        v-for="linkk in sidebar2"
                        :key="linkk.title"
                        v-bind="linkk"
                    />
                  </q-card-section>
                </q-card>
              </q-expansion-item>
              <q-expansion-item
                  group="somegroup"
                  icon="explore"
                  label="رشته و پایه تحصیلی"
                  default-closed
                  header-class=""
                  v-if="ListUser === 'admin' || ListUser === 'productManager'"
              >
                <q-card>
                  <q-card-section>
                    <EssentialLink
                        v-for="linkk in sidebar4"
                        :key="linkk.title"
                        v-bind="linkk"
                    />
                  </q-card-section>
                </q-card>
              </q-expansion-item>

              <q-expansion-item
                  group="somegroup"
                  icon="explore"
                  label="معرفی رشته"
                  default-closed
                  header-class=""
                  v-if="ListUser === 'admin' || ListUser === 'productManager' || ListUser === 'scientificGeneral'"
              >
                <q-card>
                  <q-card-section>
                    <EssentialLink
                        v-for="linkk in sidebar13"
                        :key="linkk.title"
                        v-bind="linkk"
                    />
                  </q-card-section>
                </q-card>
              </q-expansion-item>
              <q-expansion-item
                  group="somegroup"
                  icon="explore"
                  label="آزمون ها"
                  default-closed
                  header-class=""
                  v-if="ListUser === 'admin' || ListUser === 'scientificGeneral' || ListUser === 'productManager'"
              >
                <q-card>
                  <q-card-section>
                    <EssentialLink
                        v-for="linkk in sidebar5"
                        :key="linkk.title"
                        v-bind="linkk"
                    />
                  </q-card-section>
                </q-card>
              </q-expansion-item>
              <q-expansion-item
                  group="somegroup"
                  icon="explore"
                  label="تست ها"
                  default-closed
                  header-class=""
                  v-if="ListUser === 'admin' || ListUser === 'scientificGeneral' || ListUser === 'productManager'"
              >
                <q-card>
                  <q-card-section>
                    <EssentialLink
                        v-for="linkk in sidebar100"
                        :key="linkk.title"
                        v-bind="linkk"
                    />
                  </q-card-section>
                </q-card>
              </q-expansion-item>
              <q-expansion-item
                  group="somegroup"
                  icon="explore"
                  label="بنر و شعار"
                  default-closed
                  header-class=""
                  v-if="ListUser === 'admin' || ListUser === 'productManager'"
              >
                <q-card>
                  <q-card-section>
                    <EssentialLink
                        v-for="linkk in sidebar6"
                        :key="linkk.title"
                        v-bind="linkk"
                    />
                  </q-card-section>
                </q-card>
              </q-expansion-item>

              <q-expansion-item
                  group="somegroup"
                  icon="explore"
                  label="برنامه دادن"
                  default-closed
                  header-class=""
                  v-if="ListUser === 'admin' || ListUser === 'support' || ListUser === 'productManager'"
              >
                <q-card>
                  <q-card-section>
                    <EssentialLink
                        v-for="linkk in sidebar7"
                        :key="linkk.title"
                        v-bind="linkk"
                    />
                  </q-card-section>
                </q-card>
              </q-expansion-item>
                 <q-expansion-item
                  group="somegroup"
                  icon="explore"
                  label="حسابداری مدیریت"
                  default-closed
                  header-class=""
                  v-if="ListUser === 'admin' || ListUser === 'accounting'"
              >
                <q-card>
                  <q-card-section>
                    <EssentialLink
                        v-for="linkk in sidebar9"
                        :key="linkk.title"
                        v-bind="linkk"
                    />
                  </q-card-section>
                </q-card>
              </q-expansion-item>

              <q-expansion-item
                  group="somegroup"
                  icon="explore"
                  label="مالی"
                  default-closed
                  header-class=""
                 v-if="ListUser === 'admin'"
              >
                <q-card>
                  <q-card-section>
                    <EssentialLink
                        v-for="link in sidebar12"
                        :key="link.title"
                        v-bind="link"
                    />
                  </q-card-section>
                </q-card>
              </q-expansion-item>

               <q-expansion-item
                  group="somegroup"
                  icon="explore"
                  label="روزشمار آزمون ها"
                  default-closed
                  header-class=""
                 v-if="ListUser === 'admin' || ListUser === 'productManager'"
              >
                <q-card>
                  <q-card-section>
                    <EssentialLink
                        v-for="link in sidebar14"
                        :key="link.title"
                        v-bind="link"
                    />
                  </q-card-section>
                </q-card>
              </q-expansion-item>

              <q-expansion-item
                  group="somegroup"
                  icon="explore"
                  label="بنرهای تبلیغات"
                  default-closed
                  header-class=""
                 v-if="ListUser === 'admin' || ListUser === 'productManager' || ListUser === 'support'"
              >
                <q-card>
                  <q-card-section>
                    <EssentialLink
                        v-for="link in sidebar15"
                        :key="link.title"
                        v-bind="link"
                    />
                  </q-card-section>
                </q-card>
              </q-expansion-item>

              <q-expansion-item
                  group="somegroup"
                  icon="explore"
                  label="راهنمای اپلیکیشن"
                  default-closed
                  header-class=""
                 v-if="ListUser === 'admin' || ListUser === 'productManager'"
              >
                <q-card>
                  <q-card-section>
                    <EssentialLink
                        v-for="link in sidebar16"
                        :key="link.title"
                        v-bind="link"
                    />
                  </q-card-section>
                </q-card>
              </q-expansion-item>

              <q-expansion-item
                  group="somegroup"
                  icon="explore"
                  label="کانال مشاورین"
                  default-closed
                  header-class=""
                 v-if="ListUser === 'admin' || ListUser === 'productManager' || ListUser === 'support'"
              >
                <q-card>
                  <q-card-section>
                    <EssentialLink
                        v-for="link in sidebar17"
                        :key="link.title"
                        v-bind="link"
                    />
                  </q-card-section>
                </q-card>
              </q-expansion-item>

              <q-expansion-item
                  group="somegroup"
                  icon="explore"
                  label="لیست کاربران (چت)"
                  default-closed
                  header-class=""
                 v-if="ListUser === 'admin' || ListUser === 'productManager' || ListUser === 'support'"
              >
                <q-card>
                  <q-card-section>
                    <EssentialLink
                        v-for="link in sidebarChat"
                        :key="link.title"
                        v-bind="link"
                    />
                  </q-card-section>
                </q-card>
              </q-expansion-item>

              <q-expansion-item
                  group="somegroup"
                  icon="explore"
                  label="ویدئوهای آموزشی"
                  default-closed
                  header-class=""
                 v-if="ListUser === 'admin' || ListUser === 'productManager'"
              >
                <q-card>
                  <q-card-section>
                    <EssentialLink
                        v-for="link in sidebar18"
                        :key="link.title"
                        v-bind="link"
                    />
                  </q-card-section>
                </q-card>
              </q-expansion-item>

              <q-expansion-item
                  group="somegroup"
                  icon="explore"
                  label="پنل سفیران"
                  default-closed
                  header-class=""
                 v-if="ListUser === 'admin' || ListUser === 'productManager'"
              >
                <q-card>
                  <q-card-section>
                    <EssentialLink
                        v-for="link in sidebar19"
                        :key="link.title"
                        v-bind="link"
                    />
                  </q-card-section>
                </q-card>
              </q-expansion-item>

              <q-expansion-item
                  group="somegroup"
                  icon="explore"
                  label="کلمات غیرمجاز"
                  default-closed
                  header-class=""
                 v-if="ListUser === 'admin' || ListUser === 'productManager'"
              >
                <q-card>
                  <q-card-section>
                    <EssentialLink
                        v-for="link in sidebar20"
                        :key="link.title"
                        v-bind="link"
                    />
                  </q-card-section>
                </q-card>
              </q-expansion-item>

               <q-expansion-item
                  group="somegroup"
                  icon="explore"
                  label="حسابداری"
                  default-closed
                  header-class=""
                 v-if="ListUser === 'admin' || ListUser === 'accounting'"
              >
                <q-card>
                  <q-card-section>
                    <EssentialLink
                        v-for="link in sidebar21"
                        :key="link.title"
                        v-bind="link"
                    />
                  </q-card-section>
                </q-card>
              </q-expansion-item>

              <q-expansion-item
                  group="somegroup"
                  icon="explore"
                  label="استان و شهرها"
                  default-closed
                  header-class=""
                 v-if="ListUser === 'admin' || ListUser === 'productManager'"
              >
                <q-card>
                  <q-card-section>
                    <EssentialLink
                        v-for="link in sidebar22"
                        :key="link.title"
                        v-bind="link"
                    />
                  </q-card-section>
                </q-card>
              </q-expansion-item>

              <q-expansion-item
                  group="somegroup"
                  icon="explore"
                  label="معرفی کتاب"
                  default-closed
                  header-class=""
                 v-if="ListUser === 'admin' || ListUser === 'productManager' || ListUser === 'scientificGeneral'"
              >
                <q-card>
                  <q-card-section>
                    <EssentialLink
                        v-for="link in sidebar23"
                        :key="link.title"
                        v-bind="link"
                    />
                  </q-card-section>
                </q-card>
              </q-expansion-item>

              

              <q-expansion-item
                  group="somegroup"
                  icon="explore"
                  label="کوییز شبانه"
                  default-closed
                  header-class=""
                 v-if="ListUser === 'admin' || ListUser === 'productManager' || ListUser === 'scientificGeneral'"
              >
                <q-card>
                  <q-card-section>
                    <EssentialLink
                        v-for="link in sidebar35"
                        :key="link.title"
                        v-bind="link"
                    />
                  </q-card-section>
                </q-card>
              </q-expansion-item>

              <q-expansion-item
                  group="somegroup"
                  icon="explore"
                  label="فروشگاه"
                  default-closed
                  header-class=""
                 v-if="ListUser === 'admin' || ListUser === 'productManager' || ListUser === 'support'"
              >
                <q-card>
                  <q-card-section>
                    <EssentialLink
                        v-for="link in sidebar25"
                        :key="link.title"
                        v-bind="link"
                    />
                  </q-card-section>
                </q-card>
              </q-expansion-item>

               <q-expansion-item
                  group="somegroup"
                  icon="explore"
                  label="اهمیت دروس"
                  default-closed
                  header-class=""
                 v-if="ListUser === 'admin' || ListUser === 'productManager' || ListUser === 'scientificGeneral'"
              >
                <q-card>
                  <q-card-section>
                    <EssentialLink
                        v-for="link in sidebar26"
                        :key="link.title"
                        v-bind="link"
                    />
                  </q-card-section>
                </q-card>
              </q-expansion-item>

              <q-expansion-item
                  group="somegroup"
                  icon="explore"
                  label="آموزش"
                  default-closed
                  header-class=""
                 v-if="ListUser === 'admin' || ListUser === 'productManager' || ListUser === 'scientificGeneral'"
              >
                <q-card>
                  <q-card-section>
                    <EssentialLink
                        v-for="link in sidebar27"
                        :key="link.title"
                        v-bind="link"
                    />
                  </q-card-section>
                </q-card>
              </q-expansion-item>

                <q-expansion-item
                  group="somegroup"
                  icon="explore"
                  label="دسته بندی (دروس و فصول )"
                  default-closed
                  header-class=""
                 v-if="ListUser === 'admin' || ListUser === 'productManager'"
              >
                <q-card>
                  <q-card-section>
                    <EssentialLink
                        v-for="link in sidebar28"
                        :key="link.title"
                        v-bind="link"
                    />
                  </q-card-section>
                </q-card>
              </q-expansion-item>

                <q-expansion-item
                  group="somegroup"
                  icon="explore"
                  label="سوالات متداول"
                  default-closed
                  header-class=""
                 v-if="ListUser === 'admin' || ListUser === 'productManager'"
              >
                <q-card>
                  <q-card-section>
                    <EssentialLink
                        v-for="link in sidebar30"
                        :key="link.title"
                        v-bind="link"
                    />
                  </q-card-section>
                </q-card>
              </q-expansion-item>

              <q-expansion-item
                  group="somegroup"
                  icon="explore"
                  label="شماره های ثبت نام"
                  default-closed
                  header-class=""
                 v-if="ListUser === 'admin' || ListUser === 'productManager' || ListUser === 'support'"
              >
                <q-card>
                  <q-card-section>
                    <EssentialLink
                        v-for="link in sidebar29"
                        :key="link.title"
                        v-bind="link"
                    />
                  </q-card-section>
                </q-card>
              </q-expansion-item>

               <q-expansion-item
                  group="somegroup"
                  icon="explore"
                  label="گزارش خطاها"
                  default-closed
                  header-class=""
                 v-if="ListUser === 'admin' || ListUser === 'productManager'"
              >
                <q-card>
                  <q-card-section>
                    <EssentialLink
                        v-for="link in sidebar31"
                        :key="link.title"
                        v-bind="link"
                    />
                  </q-card-section>
                </q-card>
              </q-expansion-item>

              <q-expansion-item
                  group="somegroup"
                  icon="explore"
                  label="هشتگ (ویترین و دوره آنلاین )"
                  default-closed
                  header-class=""
                 v-if="ListUser === 'admin' || ListUser === 'productManager'"
              >
                <q-card>
                  <q-card-section>
                    <EssentialLink
                        v-for="link in sidebar32"
                        :key="link.title"
                        v-bind="link"
                    />
                  </q-card-section>
                </q-card>
              </q-expansion-item>

                 <q-expansion-item
                  group="somegroup"
                  icon="explore"
                  label="پست پرسمان"
                  default-closed
                  header-class=""
                  v-if="ListUser === 'admin' || ListUser === 'productManager' || ListUser === 'support'"
                  
              >
                <q-card>
                  <q-card-section>
                    <EssentialLink
                        v-for="linkk in sidebaaar"
                        :key="linkk.title"
                        v-bind="linkk"
                    />
                  </q-card-section>
                </q-card>
              </q-expansion-item>

              <q-expansion-item
                  group="somegroup"
                  icon="explore"
                  label="سرگرمی"
                  default-closed
                  header-class=""
                 v-if="ListUser === 'admin' || ListUser === 'productManager' || ListUser === 'scientificEntertainment'"
              >
                <q-card>
                  <q-card-section>
                    <EssentialLink
                        v-for="link in sidebar33"
                        :key="link.title"
                        v-bind="link"
                    />
                  </q-card-section>
                </q-card>
              </q-expansion-item>

              <q-expansion-item
                  group="somegroup"
                  icon="explore"
                  label="اخبار"
                  default-closed
                  header-class=""
                 v-if="ListUser === 'admin' || ListUser === 'productManager' || ListUser === 'scienceNnews'"
              >
                <q-card>
                  <q-card-section>
                    <EssentialLink
                        v-for="link in sidebar34"
                        :key="link.title"
                        v-bind="link"
                    />
                  </q-card-section>
                </q-card>
              </q-expansion-item>

              <q-expansion-item
                  group="somegroup"
                  icon="explore"
                  label="متفرقه"
                  default-closed
                  header-class=""
                  v-if="ListUser === 'admin' || ListUser === 'productManager' "
              >
                <q-card>
                  <q-card-section>
                    <EssentialLink
                        v-for="linkk in sidebar8"
                        :key="linkk.title"
                        v-bind="linkk"
                    />
                  </q-card-section>
                </q-card>
              </q-expansion-item>


               <q-expansion-item
                  group="somegroup"
                  icon="desktop_access_disabled"
                  label="سطح دسترسی پنل"
                  default-closed
                  header-class=""
                  v-if="ListUser === 'admin' "
              >
                <q-card>
                  <q-card-section>
                    <EssentialLink
                        v-for="linkk in sidebar10"
                        :key="linkk.title"
                        v-bind="linkk"
                        
                    />
                  </q-card-section>
                </q-card>
              </q-expansion-item>

              <q-expansion-item
                  group="somegroup"
                  icon="explore"
                  label="تنظیمات"
                  default-closed
                  header-class=""
                 v-if="ListUser === 'admin' || ListUser === 'productManager'"
              >
                <q-card>
                  <q-card-section>
                    <EssentialLink
                        v-for="link in sidebar3"
                        :key="link.title"
                        v-bind="link"
                    />
                  </q-card-section>
                </q-card>
              </q-expansion-item>

              


              <!-- <EssentialLink
                  v-for="link in sidebar3"
                  :key="link.title"
                  v-bind="link"
                  v-if="ListUser === 'admin'"
              /> -->
            </q-list>
          </q-scroll-area>
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <q-page class="row no-wrap">
        <div class="col">
          <div class="full-height">
            <q-scroll-area class="col q-pr-sm full-height" visible>
              <router-view/>
            </q-scroll-area>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from "components/EssentialLink.vue";
import {LocalStorage} from "quasar";
import Axios from 'axios';

export default {
  components: {
    EssentialLink,
  },
  data() {
    return {
      left: false,
      sidebar: [],
      ListUser : [],
    };
  },
  mounted() {
    
    
    if (localStorage.getItem("token").length > 127) {
      
      this.sidebar = [
        {
          icon: "person",
          link: "/users",
          title: "دانش آموزان",
        },
        {
          icon: "person",
          link: "/mentors",
          title: "مشاورین",
        },
        {
          icon: "person",
          link: "/family",
          title: "خانواده",
        },
        {
          icon: "person",
          link: "/teachers",
          title: "معلمان",
        },
        {
          icon: "school",
          link: "/academy",
          title: "آموزشگاه ها",
        },
        {
          icon: "school",
          link: "/school",
          title: "مدارس",
        },
      ];
      this.sidebaar = [
        {
          icon: "location_on",
          link: "/callPayment",
          title: "پرداخت های تماس",
        },
        {
          icon: "location_on",
          link: "/feedbackCall",
          title: "نظر سنجی تماس مشاور",
        },
        {
          icon: "location_on",
          link: "/feedbackCallUser",
          title: "نظر سنجی تماس دانش آموز / خانواده ",
        },
        {
          icon: "location_on",
          link: "/onlineCallPackage",
          title: "پکیج های تماس مشاور",
        },
        
        {
          icon: "location_on",
          link: "/callLog",
          title: "گزارش تماس",
        },
      ];
      this.sidebaaar = [
        // {
        //   icon: "group",
        //   link: "/postEvent",
        //   title: "پست مشاوره",
        // },
        {
          icon: "question_answer",
          link: "/postQuestion",
          title: "پست پرسمان",
        },
        
      ];
      this.sidebar1 = [

        {
          icon: "location_on",
          link: "/periodMentor",
          title: "دوره",
        },
        {
          icon: "location_on",
          link: "/periodMentorRate",
          title: "امتیازات دوره ها",
        },
        {
          icon: "location_on",
          link: "/periodMentorPayment",
          title: "پرداخت های دوره ",
        },
        {
          icon: "location_on",
          link: "/periodMentorMedia",
          title: "ویدیوهای دوره",
        },
        {
          icon: "location_on",
          link: "/periodMentorMediaFile",
          title: "فایل های دوره",
        },
        {
          icon: "location_on",
          link: "/periodMentorMediaComment",
          title: "کامنت های جلسات",
        },
       
      ];
      this.sidebar2 = [
        {
          icon: "location_on",
          link: "/vipPst",
          title: "لیست پست های ویترین",
        },
        {
          icon: "location_on",
          link: "/vipPstComment",
          title: "لیست کامنت های ویترین",
        },
        {
          icon: "location_on",
          link: "/vipPstMedia",
          title: "رسانه های پست های ویترین",
        },
      ];

      this.sidebar3 = [
        {
          icon: "location_on",
          link: "/setting",
          title: "تنظیمات کلی",
        },
        {
          icon: "location_on",
          link: "/notificationHistory",
          title: "ارسال نوتیفیکیشن",
        },
        {
          icon: "location_on",
          link: "/reasonList",
          title: "دلایل عدم تایید مدرک",
        },
        {
          icon: "location_on",
          link: "/updateApp",
          title: "بروز رسانی",
        },
        
      ];

      this.sidebar4 = [
        {
          icon: "list",
          link: "/educationalStage",
          title: "پایه تحصیلی",
        },
        {
          icon: "list",
          link: "/educationalField",
          title: "رشته ها تحصیلی",
        },
       
      ];
      this.sidebar5 = [
        {
          icon: "help",
          link: "/entranceExam",
          title: "آزمون ها",
        },
        

      ];
      this.sidebar100 = [
        {
          icon: "help",
          link: "/entranceTest",
          title: "تست ها",
        },
      ];
      this.sidebar6 = [
        {
          icon: "location_on",
          link: "/motto",
          title: " شعار های انگیزشی",
        },
        {
          icon: "location_on",
          link: "/banner",
          title: "بنرهای انگیزشی",
        },
       
      ];


      this.sidebar7 = [
        {
          icon: "location_on",
          link: "/setProgramExitUser",
          title: "خروج کاربران از برنامه ها",
        },
        {
          icon: "location_on",
          link: "/setProgramList",
          title: "برنامه دادن",
        },
        {
          icon: "location_on",
          link: "/setProgramPayment",
          title: "پرداخت های برنامه دادن",
        },
        {
          icon: "location_on",
          link: "/mentorAvailableTime",
          title: "ساعت های آزاد مشاور",
        },
        {
          icon: "location_on",
          link: "/mentorPackageList",
          title: "لیست پکیج های مشاور",
        },
      ];
      this.sidebar9 = [
        {
          icon: "location_on",
          link: "/AllFinancial",
          title: "حسابداری کل",
        },
        {
          icon: "location_on",
          link: "/FinancialMonth",
          title: "حسابداری ماهانه",
        },
        {
          icon: "location_on",
          link: "/AllWithdrow",
          title: "تاریخچه برداشت ها",
        },
      ];


      this.sidebar8 = [
        
        
       
       
        {
          icon: "location_on",
          link: "/formula",
          title: "فرمول ها ( آلارم )",
        },

      
        

        {
          icon: "list",
          link: "/notification",
          title: "پیام ها",
        },
      ];

      this.sidebar10 = [
        {
          icon: "inventory_2",
          link: "/productManager",
          title: "محصول",
        },

        {
          icon: "support_agent",
          link: "/supportPanel",
          title: "پشتیبانی",
        },

        {
          icon: "calculate",
          link: "/accountingPanel",
          title: "حسابداری",
        },

        {
          icon: "psychology_alt",
          link: "/scientificGeneral",
          title: " علمی-عمومی",
        },

        {
          icon: "casino",
          link: "/scientificEntertainment",
          title: "علمی-سرگرمی",
        },

        {
          icon: "newspaper",
          link: "/scienceNnews",
          title: "علمی-اخبار",
        },
      ];




      this.sidebar11=[
        {
          icon: "location_on",
          link: "/academyComment",
          title: "کامنت های آموزشگاه ها",
        },
        {
          icon: "location_on",
          link: "/shopComment",
          title: "کامنت های فروشگاه",
        },
        {
          icon: "location_on",
          link: "/schoolComment",
          title: "کامنت های مدارس",
        },
        {
          icon: "location_on",
          link: "/bookComment",
          title: "کامنت های کتابها",
        },
        {
          icon: "location_on",
          link: "/importanceOfLessonsComment",
          title: "کامنت های بخش دروس",
        },
        {
          icon: "location_on",
          link: "/fieldComment",
          title: "کامنت های بخش معرفی رشته",
        },
        // {
        //   icon: "location_on",
        //   link: "/postComment",
        //   title: "کامنت های پرسمان",
        // },
        
      ];

      this.sidebar12=[
         {
          icon: "location_on",
          link: "/periodMentorPriceList",
          title: "مبالغ پایه دوره آنلاین",
        },
        {
          icon: "location_on",
          link: "/onlineCallMentor",
          title: "مبالغ پایه برنامه دادن",
        },
         {
          icon: "location_on",
          link: "/shoppingPrice",
          title: "مبالغ پایه فروشگاه",
        },
        {
          icon: "location_on",
          link: "/examPackage",
          title: "پکیج های آزمون ها",
        },
          {
          icon: "location_on",
          link: "/package",
          title: "لیست اشتراک اصلی",
        },

        {
          icon: "location_on",
          link: "/onlineCall",
          title: "مبالغ پایه تماس آنلاین",
        },

        {
          icon: "location_on",
          link: "/refPrice",
          title: "مبالغ پایه کد معرف",
        },
      ];

      this.sidebar13=[
          {
          icon: "list",
          link: "/field",
          title: "معرفی رشته ها",
        },
      ];

      this.sidebar14=[
           {
          icon: "help",
          link: "/question",
          title: "روزشمار آزمون ها",
        },
      ];

      this.sidebar15=[
        {
          icon: "open_in_new",
          link: "/ads",
          title: "بنرهای تبلیغات",
        },
      ];

      this.sidebar16=[
        {
          icon: "open_in_new",
          link: "/demoTour",
          title: "راهنمای اپلیکیشن",
        },
      ];

       this.sidebar17=[
        {
          icon: "report_problem",
          link: "/channelList",
          title: "کانال مشاورین",
        },
      ];

       this.sidebarChat=[
        {
          icon: "report_problem",
          link: "/userList",
          title: "چت کاربران",
        },
      ];

       this.sidebar18=[
        {
          icon: "location_on",
          link: "/educationalfilm",
          title: "ویدیوهای آموزشی",
        },
      ];

       this.sidebar19=[
      {
          icon: "location_on",
          link: "/ambassadorCode",
          title: "کد سفیر",
        },
      ];

       this.sidebar20=[
        {
          icon: "location_on",
          link: "/malisonLists",
          title: "کلمات غیر مجاز",
        },
      ];

      this.sidebar21=[
        {
          icon: "location_on",
          link: "/accounting",
          title: "حسابداری",
        },
      ];

      this.sidebar22=[
        {
          icon: "location_on",
          link: "/provinces",
          title: "استان ها و شهر ها",
        },
      ];

      this.sidebar23=[
        {
          icon: "local_printshop",
          link: "/publisher",
          title: "معرفی کتاب",
        },
      ];

    this.sidebar24=[
        {
          icon: "report_problem",
          link: "/itemReport",
          title: "گزارشات",
        },
      ];

      this.sidebar25=[
           {
          icon: "shopping_bag",
          link: "/product",
          title: "محصولات فروشگاه",
        },
        {
          icon: "payments",
          link: "/orders",
          title: "سفارشات فروشگاه",
        },
      ];

    this.sidebar26=[
       {
          icon: "grade",
          link: "/importanceOfLessons",
          title: "اهمیت دروس",
        },
      ];

      this.sidebar27=[
          {
          icon: "history_edu",
          link: "/education",
          title: "آموزش",
        },
      ];

      this.sidebar28=[
        {
          icon: "list",
          link: "/category",
          title: "دسته بندی",
        },
      ];

        this.sidebar29=[
        {
          icon: "location_on",
          link: "/userNumber",
          title: "شماره های ثبت نام",
        },
      ];

        this.sidebar30=[
        {
          icon: "location_on",
          link: "/frequentlyQuestionCategories",
          title: "دسته بندی سوالات متداول",
        },
      ];

        this.sidebar31=[
         {
          icon: "location_on",
          link: "/crashReporter",
          title: "گزارش خطاهای برنامه",
        },
      ];
         
          
    
        this.sidebar32=[
           {
          icon: "location_on",
          link: "/hashtag",
          title: "هشتگ (ویترین و دوره آنلاین )",
          }
      ];

       this.sidebar33=[
             {
          icon: "sports_esports",
          link: "/postEntertainment",
          title: "سرگرمی",
        },
      ];

      this.sidebar34=[
          {
          icon: "feed",
          link: "/postNews",
          title: "اخبار",
        },
      ];

      this.sidebar35=[
          {
          icon: "feed",
          link: "/quiz",
          title: "کوییز شبانه",
        },
      ];
    

       
        
     
        
        
     
    } else {
      var clinic = JSON.parse(localStorage.getItem("info"));
      this.sidebar = [
        {
          icon: "dashboard",
          link: `/profile/clinic/${clinic.class}/${clinic._id}`,
          title: "پروفایل کاربری",
        },
      ];
    }
    this.getList();
  },
  methods: {
    //
    logoutNotify() {
      this.$q.notify({
        message: "خارج شدید",
      });
      localStorage.clear();
      this.$router.push({
        path: "/login",
      });
    },
    loadSideBar() {
    },
    getList() {
      
      var tok = localStorage.getItem("token")
      let config = {'x-api-key': tok};
      this.$axios
        .post("userPanel/checkToken",{token : tok},{headers: config})
        .then((response) => {
           const filt = response.data.data.items[0].panelSupportId.class
            this.ListUser = filt
            console.log('class',filt)
            
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

<style>
.q-drawer {
  /*background-image: url(https://demos.creative-tim.com/vue-material-dashboard/img/sidebar-2.32103624.jpg) !important;*/
  background-size: cover !important;
}

.drawer_normal {
  /*background: rgb(0, 0, 0);*/
  background-color: #388e3c;
}

.drawer_dark {
  background-color: #010101f2;
}

.navigation-item {
  border-radius: 5px;
}

.tab-active {
  background-color: #afb42b;
}

body {
  background: #f1f1f1 !important;
}

.header_normal {
  background-color: #388e3c;
  /*background: linear-gradient(145deg, #000 15%, #388e3c 70%);*/
}

.header_dark {
  background: linear-gradient(145deg, rgb(61, 14, 42) 15%, rgb(14, 43, 78) 70%);
}

.q-card {
  box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 5px, rgba(0, 0, 0, 0.14) 0px 2px 2px, rgba(0, 0, 0, 0.12) 0px 3px 1px -2px;
  border-radius: 4px;
  background: #ffffff;
}

.q-expansion-item__content .q-card {
  background: #4CAF50;
}

.q-table__card {
  background-color: rgb(220, 237, 200);
  box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 5px, rgba(0, 0, 0, 0.14) 0px 2px 2px, rgba(0, 0, 0, 0.12) 0px 3px 1px -2px;
  border-radius: 4px;
}

.q-ma-sm {
  margin: 8px -10px !important;
}

i.q-expansion-item__toggle-icon.material-icons.q-icon.notranslate {
  color: #dcedc8;
}

</style>

