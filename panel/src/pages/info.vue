<template>
  <q-page class="q-pa-sm">
    <div class="row q-col-gutter-sm">
      <div class="col-12">
        <q-card>
          <q-tabs
            v-model="tab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            outside-arrows
            mobile-arrows
          >
            <q-tab name="info" icon="info" label="اطلاعات" />
            <q-tab name="post" icon="text_snippet" label="پست ها" />
            <q-tab name="events" icon="event" label="رویداد" />
            <q-tab name="mail" icon="mail" label="ایمیل ها" />
            <q-tab name="messageBox" icon="inbox" label="صندوق پیام" />
            <q-tab name="offers" icon="local_offer" label="تخفیفات" />
            <q-tab name="access" icon="vpn_key" label="دسترسی ها" />
            <q-tab name="reserve" icon="group" label="رزرو ها" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="reserve">
              <Table v-bind="reserveTable" />
            </q-tab-panel>
            <q-tab-panel name="access">
              <q-card flat bordered>
                <q-tabs
                  v-model="accessTab"
                  dense
                  class="text-grey"
                  active-color="primary"
                  indicator-color="primary"
                  align="justify"
                  narrow-indicator
                  outside-arrows
                  mobile-arrows
                >
                  <q-tab name="clinicPublic" label="کلینیک های عمومی" />
                  <q-tab name="clinicPrivate" label="کلینیک های خصوصی" />
                  <q-tab name="clinicCoworker" label="کلینیک های همکار عادی" />
                </q-tabs>

                <q-separator />

                <q-tab-panels v-model="accessTab" animated>
                  <q-tab-panel name="clinicPublic">
                    <q-card flat bordered>
                      <div class="q-pa-md">
                        <div class="q-gutter-sm">
                          <div class="row">
                            <div
                              v-for="(each, index) in accessList"
                              :key="index"
                              class="col-12 col-sm-3"
                            >
                              <q-checkbox
                                v-model="info.accessClinicPublic"
                                :val="each._id"
                                :label="each.title"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <q-card-actions align="right">
                        <q-btn
                          :loading="infoLoading"
                          @click="updateInfo"
                          color="primary"
                          class="text-capitalize"
                        >
                          ویرایش اطلاعات
                          <template v-slot:loading>
                            <q-spinner-gears />
                          </template>
                        </q-btn>
                      </q-card-actions>
                    </q-card>
                  </q-tab-panel>
                  <q-tab-panel name="clinicPrivate">
                    <q-card flat bordered>
                      <div class="q-pa-md">
                        <div class="q-gutter-sm">
                          <div class="row">
                            <div
                              v-for="(each, index) in accessList"
                              :key="index"
                              class="col-12 col-sm-3"
                            >
                              <q-checkbox
                                v-model="info.accessClinicPrivate"
                                :val="each._id"
                                :label="each.title"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <q-card-actions align="right">
                        <q-btn
                          :loading="infoLoading"
                          @click="updateInfo"
                          color="primary"
                          class="text-capitalize"
                        >
                          ویرایش اطلاعات
                          <template v-slot:loading>
                            <q-spinner-gears />
                          </template>
                        </q-btn>
                      </q-card-actions>
                    </q-card>
                  </q-tab-panel>
                  <q-tab-panel name="clinicCoworker">
                    <q-card flat bordered>
                      <div class="q-pa-md">
                        <div class="q-gutter-sm">
                          <div class="row">
                            <div
                              v-for="(each, index) in accessList"
                              :key="index"
                              class="col-12 col-sm-3"
                            >
                              <q-checkbox
                                v-model="info.accessClinicCoworker"
                                :val="each._id"
                                :label="each.title"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <q-card-actions align="right">
                        <q-btn
                          :loading="infoLoading"
                          @click="updateInfo"
                          color="primary"
                          class="text-capitalize"
                        >
                          ویرایش اطلاعات
                          <template v-slot:loading>
                            <q-spinner-gears />
                          </template>
                        </q-btn>
                      </q-card-actions>
                    </q-card>
                  </q-tab-panel>
                </q-tab-panels>
              </q-card>
            </q-tab-panel>
            <q-tab-panel name="offers">
              <q-card flat bordered>
                <q-tabs
                  v-model="offersTab"
                  dense
                  class="text-grey"
                  active-color="primary"
                  indicator-color="primary"
                  align="justify"
                  narrow-indicator
                  outside-arrows
                  mobile-arrows
                >
                  <q-tab name="offersPercent" label="درصدی" />
                  <q-tab name="offersPrice" label="نقدی" />
                </q-tabs>

                <q-separator />

                <q-tab-panels v-model="offersTab" animated>
                  <q-tab-panel name="offersPercent">
                    <q-card flat bordered>
                      <q-list class="row">
                        <q-item class="col-12">
                          <q-btn
                            color="primary"
                            @click="offerPercentDialog = true"
                            icon="control_point"
                            label="افزودن"
                          />
                        </q-item>
                        <div
                          class="col-12 col-sm-6 q-pa-md"
                          v-for="(each, index) in offer.percent"
                          :key="index"
                        >
                          <q-card>
                            <q-card-section>
                              <div class="text-h6 ellipsis">
                                {{ each.title }}
                              </div>
                              <div class="text-subtitle2">
                                {{ each.percent }} درصد
                              </div>
                              <div class="text-subtitle2">
                                {{ each.code }}
                              </div>
                            </q-card-section>

                            <q-card-section class="ellipsis">
                              {{ each.caption }}
                            </q-card-section>
                          </q-card>
                        </div>
                      </q-list>
                    </q-card>
                  </q-tab-panel>
                  <q-tab-panel name="offersPrice">
                    <q-card flat bordered>
                      <q-list class="row">
                        <q-item class="col-12">
                          <q-btn
                            color="primary"
                            @click="offerPriceDialog = true"
                            icon="control_point"
                            label="افزودن"
                          />
                        </q-item>
                        <div
                          class="col-12 col-sm-6 q-pa-md"
                          v-for="(each, index) in offer.price"
                          :key="index"
                        >
                          <q-card>
                            <q-card-section>
                              <div class="text-h6 ellipsis">
                                {{ each.title }}
                              </div>
                              <div class="text-subtitle2">
                                {{ each.price }} تومان
                              </div>
                              <div class="text-subtitle2">
                                {{ each.code }}
                              </div>
                            </q-card-section>

                            <q-card-section class="ellipsis">
                              {{ each.caption }}
                            </q-card-section>
                          </q-card>
                        </div>
                      </q-list>
                    </q-card>
                  </q-tab-panel>
                </q-tab-panels>
              </q-card>
            </q-tab-panel>

            <q-tab-panel name="messageBox">
              <q-card flat bordered>
                <q-tabs
                  v-model="messageBoxTab"
                  dense
                  class="text-grey"
                  active-color="primary"
                  indicator-color="primary"
                  align="justify"
                  narrow-indicator
                  outside-arrows
                  mobile-arrows
                >
                  <q-tab name="messageBoxUser" label="کاربران" />
                  <q-tab name="messageBoxClinic" label="کلینیک" />
                </q-tabs>

                <q-separator />

                <q-tab-panels v-model="messageBoxTab" animated>
                  <q-tab-panel name="messageBoxUser">
                    <q-card flat bordered>
                      <q-list class="row">
                        <q-item class="col-12">
                          <q-btn
                            color="primary"
                            @click="messageBoxUserDialog = true"
                            icon="control_point"
                            label="افزودن"
                          />
                        </q-item>
                        <div
                          class="col-12 col-sm-6 q-pa-md"
                          v-for="(each, index) in messageBox.users"
                          :key="index"
                        >
                          <q-card>
                            <q-card-section>
                              <div class="text-h6 ellipsis">
                                {{ each.title }}
                              </div>
                            </q-card-section>

                            <q-card-section class="ellipsis">
                              {{ each.caption }}
                            </q-card-section>
                          </q-card>
                        </div>
                      </q-list>
                    </q-card>
                  </q-tab-panel>
                  <q-tab-panel name="messageBoxClinic">
                    <q-card flat bordered>
                      <q-list class="row">
                        <q-item class="col-12">
                          <q-btn
                            color="primary"
                            @click="messageBoxClinicDialog = true"
                            icon="control_point"
                            label="افزودن"
                          />
                        </q-item>
                        <div
                          class="col-12 col-sm-6 q-pa-md"
                          v-for="(each, index) in messageBox.clinics"
                          :key="index"
                        >
                          <q-card>
                            <q-card-section>
                              <div class="text-h6 ellipsis">
                                {{ each.title }}
                              </div>
                            </q-card-section>

                            <q-card-section class="ellipsis">
                              {{ each.caption }}
                            </q-card-section>
                          </q-card>
                        </div>
                      </q-list>
                    </q-card>
                  </q-tab-panel>
                </q-tab-panels>
              </q-card>
            </q-tab-panel>
            <q-tab-panel name="info">
              <q-card flat bordered>
                <q-tabs
                  v-model="infoTab"
                  dense
                  class="text-grey"
                  active-color="primary"
                  indicator-color="primary"
                  align="justify"
                  narrow-indicator
                  outside-arrows
                  mobile-arrows
                >
                  <q-tab name="companyInfo" label="اطلاعات شرکت" />
                  <q-tab name="financial" label="مالی" />
                  <q-tab name="gallery" label="گالری" />
                  <q-tab name="contactUs" label="ارتباط با ما" />
                  <q-tab name="provinceList" label="استان و شهر ها" />
                  <q-tab name="normalService" label="خدمات درمانی" />
                  <q-tab name="vipService" label="خدمات ویژه" />
                  <q-tab name="petCategory" label="دسته بندی حیوانات" />
                </q-tabs>

                <q-separator />

                <q-tab-panels v-model="infoTab" animated>
                  <q-tab-panel name="companyInfo">
                    <q-card flat bordered>
                      <q-card-section class="q-pa-sm">
                        <q-list class="row">
                          <q-item class="col-6">
                            <q-item-section>
                              <q-input
                                dense
                                v-model="info.lat"
                                label="طول جغرافیایی"
                              >
                                <template v-slot:prepend>
                                  <q-icon name="info" />
                                </template>
                              </q-input>
                            </q-item-section>
                          </q-item>
                          <q-item class="col-6">
                            <q-item-section>
                              <q-input
                                dense
                                v-model="info.lng"
                                label="عرض جغرافیایی"
                              >
                                <template v-slot:prepend>
                                  <q-icon name="info" />
                                </template>
                              </q-input>
                            </q-item-section>
                          </q-item>
                          <q-item class="col-6">
                            <q-item-section>
                              <q-input
                                dense
                                readonly
                                v-model="info.phone"
                                label="شماره تماس"
                              >
                                <template v-slot:prepend>
                                  <q-icon name="phone" />
                                </template>
                              </q-input>
                            </q-item-section>
                          </q-item>
                          <q-item class="col-6">
                            <q-item-section>
                              <q-input
                                autogrow
                                dense
                                v-model="info.address"
                                label="آدرس"
                              >
                                <template v-slot:prepend>
                                  <q-icon name="location_on" />
                                </template>
                              </q-input>
                            </q-item-section>
                          </q-item>
                          <q-item class="col-6">
                            <q-item-section>
                              <q-input
                                autogrow
                                dense
                                v-model="info.email"
                                label="ایمیل"
                              >
                                <template v-slot:prepend>
                                  <q-icon name="email" />
                                </template>
                              </q-input>
                            </q-item-section>
                          </q-item>
                          <q-item class="col-6">
                            <q-item-section>
                              <q-input
                                autogrow
                                dense
                                v-model="info.title"
                                label="عنوان"
                              >
                                <template v-slot:prepend>
                                  <q-icon name="info" />
                                </template>
                              </q-input>
                            </q-item-section>
                          </q-item>
                          <q-item class="col-6">
                            <q-item-section>
                              <q-input
                                autogrow
                                dense
                                v-model="info.instagram"
                                label="اینستاگرام"
                              >
                                <template v-slot:prepend>
                                  <q-icon name="info" />
                                </template>
                              </q-input>
                            </q-item-section>
                          </q-item>
                          <q-item class="col-6">
                            <q-item-section>
                              <q-input
                                autogrow
                                dense
                                v-model="info.whatsapp"
                                label="واتس اپ"
                              >
                                <template v-slot:prepend>
                                  <q-icon name="info" />
                                </template>
                              </q-input>
                            </q-item-section>
                          </q-item>
                          <q-item class="col-6">
                            <q-item-section>
                              <q-input
                                autogrow
                                dense
                                v-model="info.telegram"
                                label="تلگرام"
                              >
                                <template v-slot:prepend>
                                  <q-icon name="info" />
                                </template>
                              </q-input>
                            </q-item-section>
                          </q-item>
                          <q-item class="col-6">
                            <q-item-section>
                              <q-input
                                autogrow
                                dense
                                v-model="info.info"
                                label="اطلاعات اولیه"
                              >
                                <template v-slot:prepend>
                                  <q-icon name="info" />
                                </template>
                              </q-input>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-card-section>
                      <q-card-actions align="right">
                        <q-btn
                          :loading="infoLoading"
                          @click="updateInfo"
                          color="primary"
                          class="text-capitalize"
                        >
                          ویرایش اطلاعات
                          <template v-slot:loading>
                            <q-spinner-gears />
                          </template>
                        </q-btn>
                      </q-card-actions>
                    </q-card>
                  </q-tab-panel>
                  <q-tab-panel name="financial">
                    <q-card flat bordered>
                      <q-card-section class="q-pa-sm">
                        <q-list class="row">
                          <q-item class="col-3">
                            <q-item-section>
                              <q-input
                                dense
                                v-model="info.profitOfProudct"
                                label="درصد سود شرکت از فروش محصولات"
                              >
                              </q-input>
                            </q-item-section>
                          </q-item>
                          <q-item class="col-3">
                            <q-item-section>
                              <q-input
                                dense
                                v-model="info.depositGoBigRace"
                                label="  هزینه سرویس رفت نژاد بزرگ"
                              >
                              </q-input>
                            </q-item-section>
                          </q-item>
                          <q-item class="col-3">
                            <q-item-section>
                              <q-input
                                dense
                                v-model="info.depositGoSmallRace"
                                label="هزینه سرویس رفت نژاد کوچک"
                              >
                              </q-input>
                            </q-item-section>
                          </q-item>
                          <q-item class="col-3">
                            <q-item-section>
                              <q-input
                                dense
                                v-model="info.depositReturnBigRace"
                                label="هزینه سرویس برگشت نژاد بزرگ"
                              >
                              </q-input>
                            </q-item-section>
                          </q-item>
                          <q-item class="col-3">
                            <q-item-section>
                              <q-input
                                dense
                                v-model="info.depositReturnSmallRace"
                                label="هزینه سرویس برگشت نژاد کوچک"
                              >
                              </q-input>
                            </q-item-section>
                          </q-item>
                          <q-item class="col-3">
                            <q-item-section>
                              <q-input
                                dense
                                v-model="info.depositGoAndReturnBigRace"
                                label="هزینه سرویس رفت و برگشت نژاد بزرگ"
                              >
                              </q-input>
                            </q-item-section>
                          </q-item>
                          <q-item class="col-3">
                            <q-item-section>
                              <q-input
                                dense
                                v-model="info.depositGoAndReturnSmallRace"
                                label="هزینه سرویس رفت و برگشت نژاد کوچک"
                              >
                              </q-input>
                            </q-item-section>
                          </q-item>
                          <q-item class="col-3">
                            <q-item-section>
                              <q-input
                                dense
                                v-model="info.depositDeliverySmallProduct"
                                label="پیک محصول برای محصولات سبک"
                              >
                              </q-input>
                            </q-item-section>
                          </q-item>
                          <q-item class="col-3">
                            <q-item-section>
                              <q-input
                                dense
                                v-model="info.depositDeliveryNormalProduct"
                                label="پیک محصول برای محصولات نیمه سنگین"
                              >
                              </q-input>
                            </q-item-section>
                          </q-item>
                          <q-item class="col-3">
                            <q-item-section>
                              <q-input
                                dense
                                v-model="info.depositDeliveryBigProduct"
                                label="پیک محصول برای محصولات سنگین"
                              >
                              </q-input>
                            </q-item-section>
                          </q-item>
                          <q-item class="col-3">
                            <q-item-section>
                              <q-input
                                dense
                                v-model="info.costCeilingFreeDelivery"
                                label="سقف هزینه برای رایگان شدن پیک"
                              >
                              </q-input>
                            </q-item-section>
                          </q-item>
                          <q-item class="col-3">
                            <q-item-section>
                              <q-input
                                dense
                                v-model="info.penaltyForCancelingTurnByClinic"
                                label="جریمه کلینیک در صورت لغو نوبت"
                              >
                              </q-input>
                            </q-item-section>
                          </q-item>
                          <q-item class="col-3">
                            <q-item-section>
                              <q-input
                                dense
                                v-model="info.penaltyForCancelingProduct"
                                label="جریمه پت شاپ در صورت لغو سفارش"
                              >
                              </q-input>
                            </q-item-section>
                          </q-item>
                          <q-item class="col-3">
                            <q-item-section>
                              <q-input
                                dense
                                v-model="info.penaltyForCancelingTurnByUser"
                                label="جریمه کاربر در صورت لغو زیر 12 ساعت"
                              >
                              </q-input>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-card-section>
                      <q-card-actions align="right">
                        <q-btn
                          :loading="infoLoading"
                          @click="updateInfo"
                          color="primary"
                          class="text-capitalize"
                        >
                          ویرایش اطلاعات
                          <template v-slot:loading>
                            <q-spinner-gears />
                          </template>
                        </q-btn>
                      </q-card-actions>
                    </q-card>
                  </q-tab-panel>
                  <q-tab-panel name="gallery">
                    <q-card flat bordered>
                      <q-card-section class="q-pa-sm">
                        <q-list class="row">
                          <q-item class="col-12">
                            <q-btn
                              color="primary"
                              @click="galleryDialog = true"
                              icon="control_point"
                              label="افزودن"
                            />
                          </q-item>
                          <q-item
                            v-for="(each, index) in gallery"
                            :key="index"
                            class="col-12 col-sm-6"
                            style="max-height: 200px"
                          >
                            <q-item-section>
                              <q-img :src="each.avatar" :ratio="1">
                                <q-icon
                                  class="absolute all-pointer-events"
                                  size="32px"
                                  name="delete"
                                  color="red"
                                  @click="openDeleteDialog(each._id)"
                                  style="top: 8px; left: 8px"
                                >
                                  <q-tooltip> پاک کردن </q-tooltip>
                                </q-icon>
                                <div class="absolute-bottom text-center">
                                  {{ each.title }}
                                  <br />
                                  {{ each.caption }}
                                </div>
                              </q-img>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-card-section>
                    </q-card>
                  </q-tab-panel>
                  <q-tab-panel name="contactUs">
                    <Table v-bind="contactUsTable" />
                  </q-tab-panel>
                  <q-tab-panel name="provinceList">
                    <Table v-bind="provinceTable" />
                  </q-tab-panel>
                  <q-tab-panel name="normalService">
                    <Table v-bind="normalServiceTable" />
                  </q-tab-panel>
                  <q-tab-panel name="vipService">
                    <Table v-bind="vipServiceTable" />
                  </q-tab-panel>
                  <q-tab-panel name="petCategory">
                    <Table v-bind="petCategoryTable" />
                  </q-tab-panel>
                </q-tab-panels>
              </q-card>
            </q-tab-panel>
            <q-tab-panel name="mail">
              <Table v-bind="emailsTable" />
            </q-tab-panel>
            <q-tab-panel name="post">
              <q-card flat bordered>
                <q-tabs
                  v-model="postTab"
                  dense
                  class="text-grey"
                  active-color="primary"
                  indicator-color="primary"
                  align="justify"
                  narrow-indicator
                  outside-arrows
                  mobile-arrows
                >
                  <q-tab name="article" label="مقالات" />
                  <q-tab name="news" label="اخبار" />
                  <q-tab name="notice" label="اطلاع رسانی" />
                  <q-tab name="page" label="برگه ها" />
                </q-tabs>

                <q-separator />

                <q-tab-panels v-model="postTab" animated>
                  <q-tab-panel name="article">
                    <div class="row">
                      <div class="col-12">
                        <q-btn
                          color="primary"
                          @click="Object.assign(postInfo, articleInfoEmpty)"
                          icon="control_point"
                          label="افزودن"
                        />
                      </div>
                      <div
                        v-for="(each, index) in articleList"
                        :key="index"
                        class="col-12 col-sm-6 q-pa-xs"
                      >
                        <q-card flat bordered>
                          <q-card-section horizontal>
                            <q-card-section class="col-5 flex flex-center">
                              <q-img
                                class="rounded-borders"
                                :src="each.avatar"
                                :ratio="1"
                              />
                            </q-card-section>
                            <q-card-section class="q-pt-xs">
                              <div class="text-overline">
                                {{
                                  new persianDate(
                                    Date.parse(each.createdAt)
                                  ).format("YYYY-MM-DD")
                                }}
                              </div>
                              <div class="q-mt-sm ellipsis-3-lines q-mb-xs">
                                {{ each.title }}
                              </div>
                            </q-card-section>
                          </q-card-section>
                          <q-separator />
                          <q-card-actions>
                            <q-btn
                              @click="editPostDialog(each)"
                              flat
                              color="primary"
                              >ویرایش</q-btn
                            >
                            <q-btn
                              @click="
                                changeStatus(
                                  each._id,
                                  each.class,
                                  each.isActive ? 'deActive' : 'active'
                                )
                              "
                              flat
                              :color="each.isActive ? 'red' : 'green'"
                              >{{
                                each.isActive ? "غیر فعال کردن" : "فعال کردن"
                              }}</q-btn
                            >
                          </q-card-actions>
                        </q-card>
                      </div>
                    </div>
                  </q-tab-panel>
                  <q-tab-panel name="news">
                    <div class="row">
                      <div class="col-12">
                        <q-btn
                          color="primary"
                          @click="Object.assign(postInfo, newsInfoEmpty)"
                          icon="control_point"
                          label="افزودن"
                        />
                      </div>
                      <div
                        v-for="(each, index) in newsList"
                        :key="index"
                        class="col-12 col-sm-6 q-pa-xs"
                      >
                        <q-card flat bordered>
                          <q-card-section horizontal>
                            <q-card-section class="col-5 flex flex-center">
                              <q-img
                                :ratio="1"
                                class="rounded-borders"
                                :src="each.avatar"
                              />
                            </q-card-section>
                            <q-card-section class="q-pt-xs">
                              <div class="text-overline">
                                {{
                                  new persianDate(
                                    Date.parse(each.createdAt)
                                  ).format("YYYY-MM-DD")
                                }}
                              </div>
                              <div class="q-mt-sm ellipsis-3-lines q-mb-xs">
                                {{ each.title }}
                              </div>
                            </q-card-section>
                          </q-card-section>
                          <q-separator />
                          <q-card-actions>
                            <q-btn
                              @click="editPostDialog(each)"
                              flat
                              color="primary"
                              >ویرایش</q-btn
                            >
                            <q-btn
                              @click="
                                changeStatus(
                                  each._id,
                                  each.class,
                                  each.isActive ? 'deActive' : 'active'
                                )
                              "
                              flat
                              :color="each.isActive ? 'red' : 'green'"
                              >{{
                                each.isActive ? "غیر فعال کردن" : "فعال کردن"
                              }}</q-btn
                            >
                          </q-card-actions>
                        </q-card>
                      </div>
                    </div>
                  </q-tab-panel>
                  <q-tab-panel name="notice">
                    <div class="row">
                      <div class="col-12">
                        <q-btn
                          color="primary"
                          @click="Object.assign(postInfo, noticeInfoEmpty)"
                          icon="control_point"
                          label="افزودن"
                        />
                      </div>
                      <div
                        v-for="(each, index) in noticeList"
                        :key="index"
                        class="col-12 col-sm-6 q-pa-xs"
                      >
                        <q-card flat bordered>
                          <q-card-section horizontal>
                            <q-card-section class="col-5 flex flex-center">
                              <q-img
                                :ratio="1"
                                class="rounded-borders"
                                :src="each.avatar"
                              />
                            </q-card-section>
                            <q-card-section class="q-pt-xs">
                              <div class="text-overline">
                                {{
                                  new persianDate(
                                    Date.parse(each.createdAt)
                                  ).format("YYYY-MM-DD")
                                }}
                              </div>
                              <div class="q-mt-sm ellipsis-3-lines q-mb-xs">
                                {{ each.title }}
                              </div>
                            </q-card-section>
                          </q-card-section>
                          <q-separator />
                          <q-card-actions>
                            <q-btn
                              @click="editPostDialog(each)"
                              flat
                              color="primary"
                              >ویرایش</q-btn
                            >
                            <q-btn
                              @click="
                                changeStatus(
                                  each._id,
                                  each.class,
                                  each.isActive ? 'deActive' : 'active'
                                )
                              "
                              flat
                              :color="each.isActive ? 'red' : 'green'"
                              >{{
                                each.isActive ? "غیر فعال کردن" : "فعال کردن"
                              }}</q-btn
                            >
                          </q-card-actions>
                        </q-card>
                      </div>
                    </div>
                  </q-tab-panel>
                  <q-tab-panel name="page">
                    <div class="row">
                      <div class="col-12">
                        <q-btn
                          color="primary"
                          @click="Object.assign(postInfo, pageInfoEmpty)"
                          icon="control_point"
                          label="افزودن"
                        />
                      </div>
                      <div
                        v-for="(each, index) in pageList"
                        :key="index"
                        class="col-12 col-sm-6 q-pa-xs"
                      >
                        <q-card flat bordered>
                          <q-card-section horizontal>
                            <q-card-section class="col-5 flex flex-center">
                              <q-img
                                :ratio="1"
                                class="rounded-borders"
                                :src="each.avatar"
                              />
                            </q-card-section>
                            <q-card-section class="q-pt-xs">
                              <div class="text-overline">
                                {{
                                  new persianDate(
                                    Date.parse(each.createdAt)
                                  ).format("YYYY-MM-DD")
                                }}
                              </div>
                              <div class="q-mt-sm ellipsis-3-lines q-mb-xs">
                                {{ each.title }}
                              </div>
                            </q-card-section>
                          </q-card-section>
                          <q-separator />
                          <q-card-actions>
                            <q-btn
                              @click="editPostDialog(each)"
                              flat
                              color="primary"
                              >ویرایش</q-btn
                            >
                            <q-btn
                              @click="
                                changeStatus(
                                  each._id,
                                  each.class,
                                  each.isActive ? 'deActive' : 'active'
                                )
                              "
                              flat
                              :color="each.isActive ? 'red' : 'green'"
                              >{{
                                each.isActive ? "غیر فعال کردن" : "فعال کردن"
                              }}</q-btn
                            >
                          </q-card-actions>
                        </q-card>
                      </div>
                    </div>
                  </q-tab-panel>
                </q-tab-panels>
              </q-card>
            </q-tab-panel>

            <q-tab-panel name="events">
              <q-card flat bordered>
                <q-tabs
                  v-model="eventTab"
                  dense
                  class="text-grey"
                  active-color="primary"
                  indicator-color="primary"
                  align="justify"
                  narrow-indicator
                  outside-arrows
                  mobile-arrows
                >
                  <q-tab name="events" label="رویداد ها" />
                  <q-tab name="eventsSubmit" label="ثبت نامی ها" />
                </q-tabs>
                <q-separator />
                <q-tab-panels v-model="eventTab" animated>
                  <q-tab-panel name="events">
                    <Table v-bind="eventTable" />
                  </q-tab-panel>
                  <q-tab-panel name="eventsSubmit">
                    <Table v-bind="eventsSubmitTable" />
                  </q-tab-panel>
                </q-tab-panels>
              </q-card>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>
    <q-dialog
      v-model="galleryDialog"
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <q-bar>
          <q-space />
          <q-btn @click="createGallery" dense flat icon="save">
            <q-tooltip>ذخیره سازی</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>بستن</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <div class="text-h6">افزودن گالری</div>
        </q-card-section>

        <q-card-section>
          <div class="q-pa-md">
            <div class="row q-col-gutter-xs">
              <div class="col-12 col-sm-6">
                <q-file
                  @input="uploadFile($event, 'galleryInfo')"
                  filled
                  v-model="galleryInfo.avatarfile"
                  label="تصویر"
                >
                  <template v-slot:before>
                    <q-avatar>
                      <img :src="galleryInfo.avatarSrc" />
                    </q-avatar>
                  </template>
                </q-file>
              </div>
              <div class="col-12 col-sm-6">
                <q-input filled v-model="galleryInfo.title" label="عنوان" />
              </div>
              <div class="col-12 col-sm-6">
                <q-input filled v-model="galleryInfo.caption" label="توضیحات" />
              </div>
              <div class="col-12 col-sm-6">
                <q-input filled v-model="galleryInfo.link" label="لینک" />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  filled
                  v-model="galleryInfo.linkText"
                  label="متن لینک"
                />
              </div>
              <div class="col-12 col-sm-6"></div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog
      v-model="postInfo.dialog"
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <q-bar>
          <q-space />
          <q-btn @click="createOrUpdatePost()" dense flat icon="save">
            <q-tooltip>ذخیره سازی</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>بستن</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <div class="q-pa-md">
            <div class="row q-col-gutter-xs">
              <div class="col-12 col-sm-6">
                <q-file
                  @input="uploadFile($event, 'postInfo')"
                  filled
                  v-model="postInfo.avatarfile"
                  label="تصویر"
                >
                  <template v-slot:before>
                    <q-avatar>
                      <img :src="postInfo.avatarSrc" />
                    </q-avatar>
                  </template>
                </q-file>
              </div>
              <div class="col-12 col-sm-6">
                <q-input filled v-model="postInfo.title" label="عنوان" />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  filled
                  v-model="postInfo.seoCaption"
                  label="توضیح کوتاه"
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input filled v-model="postInfo.slug" label="لینک" />
              </div>

              <div class="col-12">
                <q-field filled label="تگ ها" stack-label>
                  <template v-slot:control>
                    <vue-tags-input
                      placeholder="بنویسید..."
                      v-model="postInfo.tag"
                      :tags="postInfo.tags"
                      @tags-changed="(newTags) => (postInfo.tags = newTags)"
                    />
                  </template>
                </q-field>
              </div>
              <div class="col-12">
                <q-editor
                  v-model="postInfo.content"
                  :dense="$q.screen.lt.md"
                  :toolbar="[
                    [
                      {
                        label: $q.lang.editor.align,
                        icon: $q.iconSet.editor.align,
                        fixedLabel: true,
                        list: 'only-icons',
                        options: ['left', 'center', 'right', 'justify'],
                      },
                      {
                        label: $q.lang.editor.align,
                        icon: $q.iconSet.editor.align,
                        fixedLabel: true,
                        options: ['left', 'center', 'right', 'justify'],
                      },
                    ],
                    [
                      'bold',
                      'italic',
                      'strike',
                      'underline',
                      'subscript',
                      'superscript',
                    ],
                    ['token', 'hr', 'link', 'custom_btn'],
                    ['print', 'fullscreen'],
                    [
                      {
                        label: $q.lang.editor.formatting,
                        icon: $q.iconSet.editor.formatting,
                        list: 'no-icons',
                        options: [
                          'p',
                          'h1',
                          'h2',
                          'h3',
                          'h4',
                          'h5',
                          'h6',
                          'code',
                        ],
                      },
                      {
                        label: $q.lang.editor.fontSize,
                        icon: $q.iconSet.editor.fontSize,
                        fixedLabel: true,
                        fixedIcon: true,
                        list: 'no-icons',
                        options: [
                          'size-1',
                          'size-2',
                          'size-3',
                          'size-4',
                          'size-5',
                          'size-6',
                          'size-7',
                        ],
                      },
                      {
                        label: $q.lang.editor.defaultFont,
                        icon: $q.iconSet.editor.font,
                        fixedIcon: true,
                        list: 'no-icons',
                        options: [
                          'default_font',
                          'arial',
                          'arial_black',
                          'comic_sans',
                          'courier_new',
                          'impact',
                          'lucida_grande',
                          'times_new_roman',
                          'verdana',
                        ],
                      },
                      'removeFormat',
                    ],
                    ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

                    ['undo', 'redo'],
                    ['viewsource'],
                  ]"
                  :fonts="{
                    arial: 'Arial',
                    arial_black: 'Arial Black',
                    comic_sans: 'Comic Sans MS',
                    courier_new: 'Courier New',
                    impact: 'Impact',
                    lucida_grande: 'Lucida Grande',
                    times_new_roman: 'Times New Roman',
                    verdana: 'Verdana',
                  }"
                />
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="deleteGalleryDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="close" color="red" text-color="white" />
          <span class="q-ml-sm">آیا پاک شود؟</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="انصراف" color="red" v-close-popup />
          <q-btn flat label="تایید" color="primary" @click="deleteGallery" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!--  -->
    <q-dialog
      v-model="messageBoxUserDialog"
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <q-bar>
          <q-space />
          <q-btn @click="createMessageBoxUser" dense flat icon="save">
            <q-tooltip>ذخیره سازی</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>بستن</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <div class="text-h6">ایجاد یک پیام</div>
        </q-card-section>

        <q-card-section>
          <div class="q-pa-md">
            <div class="row q-col-gutter-xs">
              <div class="col-12 col-sm-6">
                <q-input
                  filled
                  v-model="messageBoxUserInfo.title"
                  label="عنوان"
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  filled
                  v-model="messageBoxUserInfo.caption"
                  label="توضیحات"
                />
              </div>
              <div class="col-12">
                <q-select
                  filled
                  v-model="messageBoxUserInfo.users"
                  multiple
                  :options="userList"
                  use-chips
                  stack-label
                  label="کاربران (اگر خالی باشد به همه کاربران ارسال می شود)"
                />
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog
      v-model="messageBoxClinicDialog"
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <q-bar>
          <q-space />
          <q-btn @click="createMessageBoxClinic" dense flat icon="save">
            <q-tooltip>ذخیره سازی</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>بستن</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <div class="text-h6">ایجاد یک پیام</div>
        </q-card-section>

        <q-card-section>
          <div class="q-pa-md">
            <div class="row q-col-gutter-xs">
              <div class="col-12 col-sm-6">
                <q-input
                  filled
                  v-model="messageBoxClinicInfo.title"
                  label="عنوان"
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  filled
                  v-model="messageBoxClinicInfo.caption"
                  label="توضیحات"
                />
              </div>
              <div class="col-12">
                <q-select
                  filled
                  v-model="messageBoxClinicInfo.clinics"
                  multiple
                  :options="clinicList"
                  use-chips
                  stack-label
                  label="کلینیک ها (اگر خالی باشد به همه کاربران ارسال می شود)"
                />
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!--  -->
    <q-dialog
      v-model="offerPercentDialog"
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <q-bar>
          <q-space />
          <q-btn @click="createOfferPercent" dense flat icon="save">
            <q-tooltip>ذخیره سازی</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>بستن</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <div class="text-h6">ایجاد یک تخفیف درصدی</div>
        </q-card-section>

        <q-card-section>
          <div class="q-pa-md">
            <div class="row q-col-gutter-xs">
              <div class="col-12 col-sm-6">
                <q-input
                  filled
                  v-model="offerPercentInfo.title"
                  label="عنوان"
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  filled
                  v-model="offerPercentInfo.caption"
                  label="توضیحات"
                />
              </div>
              <div class="col-12 col-sm-4">
                <q-input
                  filled
                  v-model="offerPercentInfo.percent"
                  label="درصد"
                />
              </div>
              <div class="col-12 col-sm-4">
                <q-input
                  readonly
                  filled
                  v-model="offerPercentInfo.startDate"
                  mask="date"
                  :rules="['date']"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        ref="qDateProxy"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          calendar="persian"
                          today-btn
                          v-model="offerPercentInfo.startDate"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="تایید"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-sm-4">
                <q-input
                  readonly
                  filled
                  v-model="offerPercentInfo.endDate"
                  mask="date"
                  :rules="['date']"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        ref="qDateProxy"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          calendar="persian"
                          today-btn
                          v-model="offerPercentInfo.endDate"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="تایید"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-12">
                <q-select
                  filled
                  v-model="offerPercentInfo.users"
                  multiple
                  :options="userList"
                  use-chips
                  stack-label
                  label="کاربران (اگر خالی باشد به همه کاربران ارسال می شود)"
                />
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog
      v-model="offerPriceDialog"
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <q-bar>
          <q-space />
          <q-btn @click="createOfferPrice" dense flat icon="save">
            <q-tooltip>ذخیره سازی</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>بستن</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <div class="text-h6">ایجاد یک تخفیف نقدی</div>
        </q-card-section>

        <q-card-section>
          <div class="q-pa-md">
            <div class="row q-col-gutter-xs">
              <div class="col-12 col-sm-6">
                <q-input filled v-model="offerPriceInfo.title" label="عنوان" />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  filled
                  v-model="offerPriceInfo.caption"
                  label="توضیحات"
                />
              </div>
              <div class="col-12 col-sm-4">
                <q-input filled v-model="offerPriceInfo.price" label="مقدار" />
              </div>
              <div class="col-12 col-sm-4">
                <q-input
                  readonly
                  filled
                  v-model="offerPriceInfo.startDate"
                  mask="date"
                  :rules="['date']"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        ref="qDateProxy"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          calendar="persian"
                          today-btn
                          v-model="offerPriceInfo.startDate"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="تایید"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-sm-4">
                <q-input
                  readonly
                  filled
                  v-model="offerPriceInfo.endDate"
                  mask="date"
                  :rules="['date']"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        ref="qDateProxy"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          calendar="persian"
                          today-btn
                          v-model="offerPriceInfo.endDate"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="تایید"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-12">
                <q-select
                  filled
                  v-model="offerPriceInfo.users"
                  multiple
                  :options="userList"
                  use-chips
                  stack-label
                  label="کاربران (اگر خالی باشد به همه کاربران ارسال می شود)"
                />
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import persianDate from "persian-date";
import Vue from "vue";
import IEcharts from "vue-echarts-v3/src/full.js";
import Table from "../components/Table";
import VueTagsInput from "@johmun/vue-tags-input";

Vue.component("IEcharts", IEcharts);
export default {
  components: {
    Table,
    VueTagsInput,
  },
  name: "UserProfile",
  data() {
    return {
      accessList: [],
      accessTab: "clinicPublic",
      offerPercentDialog: false,
      offerPercentInfo: {
        users: [],
      },
      offerPriceDialog: false,
      offerPriceInfo: {
        users: [],
      },
      offersTab: "offersPercent",
      messageBoxClinicDialog: false,
      messageBoxClinicInfo: {},
      clinicList: [],
      messageBoxUserInfo: {},
      userList: [],
      messageBoxUserDialog: false,
      tab: "info",
      infoTab: "companyInfo",
      messageBoxTab: "messageBoxUser",
      messageBox: {
        users: [],
        clinics: [],
      },
      offer: {
        percent: [],
        price: [],
      },
      postTab: "article",
      eventTab: "events",
      persianDate,
      pageInfoEmpty: {
        dialog: true,
        _id: "",
        postType: "page",
        slug: "",
        title: "",
        tag: "",
        tags: [],
        seoCaption: "",
        avatar: "",
        avatarfile: null,
        avatarSrc: "",
        content: "",
      },
      newsInfoEmpty: {
        dialog: true,
        _id: "",
        postType: "news",
        slug: "",
        title: "",
        tag: "",
        tags: [],
        seoCaption: "",
        avatar: "",
        avatarfile: null,
        avatarSrc: "",
        content: "",
      },
      articleInfoEmpty: {
        dialog: true,
        _id: "",
        postType: "article",
        slug: "",
        title: "",
        tag: "",
        tags: [],
        seoCaption: "",
        avatar: "",
        avatarfile: null,
        avatarSrc: "",
        content: "",
      },
      noticeInfoEmpty: {
        dialog: true,
        _id: "",
        postType: "notice",
        slug: "",
        title: "",
        tag: "",
        tags: [],
        seoCaption: "",
        avatar: "",
        avatarfile: null,
        avatarSrc: "",
        content: "",
      },
      postInfo: {
        dialog: false,
        postType: "",
        slug: "",
        title: "",
        tag: "",
        tags: [],
        tagsArr: [],
        seoCaption: "",
        avatar: "",
        avatarfile: null,
        avatarSrc: "",
        content: "",
      },
      splitterModel: 20,
      file: null,
      info: {
        accessClinicPublic: [],
        accessClinicPrivate: [],
        accessClinicCoworker: [],
      },
      financial: {},
      gallery: [],
      deleteGalleryDialog: false,
      galleryInfo: {
        galleryId: "",
        avatarSrc: "",
        avatarfile: null,
        avatar: "",
        title: "",
        link: "",
        linkText: "",
        caption: "",
      },
      emailsTable: null,
      contactUsTable: null,
      provinceTable: null,
      normalServiceTable: null,
      vipServiceTable: null,
      eventTable: null,
      eventsSubmitTable: null,
      petCategoryTable: null,
      infoLoading: false,
      galleryDialog: false,
      articleList: [],
      newsList: [],
      noticeList: [],
      pageList: [],
      reserveTable:null,
    };
  },
  mounted() {
    this.reserveTable = {
      loading: true,
      canInsert: false,
      readonly: false,
      hasSubset: false,
      canActive: false,
      canDeActive: false,
      subsetUrl: "",
      title: "لیست رزرو ها",
      filter: "",
      mode: "list",
      url: `panel/reserves`,
      columns: [
        {
          name: "index",
          label: "#",
          field: "index",
          align: "left",
          sortable: true,
        },
        {
          name: "isCheckout",
          align: "left",
          label: "وضعیت",
          field: "isCheckout",
          format: (val) => (val ? "تسویه شده" : "منتظر تسویه حساب "),
          sortable: true,
        },
        {
          name: "isActive",
          align: "left",
          label: "وضعیت",
          field: "isActive",
          format: (val) => (val ? "فعال" : "لغو شده"),
          sortable: true,
        },
        {
          name: "price",
          label: "کل مبلغ",
          field: "price",
          align: "left",
          sortable: true,
        },
        {
          name: "priceProfit",
          label: "سهم شرکت",
          field: "priceProfit",
          align: "left",
          sortable: true,
        },
        {
          name: "priceClinic",
          label: "سهم کلینیک",
          field: "priceClinic",
          align: "left",
          sortable: true,
        },
        {
          name: "deliveryType",
          align: "left",
          label: "نوع پیک",
          field: "deliveryType",
          format: (val) => {
            if (val == "go") {
              return "رفت";
            } else if (val == "back") {
              return "برگشت";
            } else {
              return "رفت و برگشت";
            }
          },
          sortable: true,
        },
        {
          name: "deliveryPrice",
          label: "مبلغ پیک",
          field: "deliveryPrice",
          align: "left",
          sortable: true,
        },
        {
          name: "class",
          align: "left",
          label: "نوع خدمت",
          field: (row) => row.serviceClinicId.class,
          format: (val) => {
            if (val == "office") {
              return "حضوری";
            } else if (val == "online") {
              return "مشاوره آنلاین";
            } else {
              return "ویزیت در محل";
            }
          },
          sortable: true,
        },
        {
          name: "isEmergency",
          align: "left",
          label: "اورژانسی",
          field: "isEmergency",
          format: (val) => (val ? "بله" : "خیر"),
          sortable: true,
        },
        {
          name: "startTime",
          align: "left",
          label: "ساعت شروع",
          field: "startTime",
          sortable: true,
        },
        {
          name: "endTime",
          align: "left",
          label: "ساعت پایان",
          field: "endTime",
          sortable: true,
        },
        {
          name: "title",
          align: "left",
          label: "عنوان",
          field: (row) => row.serviceClinicId.title,
          sortable: true,
        },
        {
          name: "doctorFirstName",
          align: "left",
          label: "نام",
          field: (row) => row.doctorId.firstName,
          sortable: true,
        },
        {
          name: "doctorLastName",
          align: "left",
          label: "نام خانوادگی",
          field: (row) => row.doctorId.lastName,
          sortable: true,
        },
        {
          name: "personFirstName",
          align: "left",
          label: "نام مراجعه کننده",
          field: (row) => row.userId.firstName,
          sortable: true,
        },
        {
          name: "personLastName",
          align: "left",
          label: "نام خانوادگی مراجعه کننده",
          field: (row) => row.userId.lastName,
          sortable: true,
        },
        {
          name: "personPhone",
          align: "left",
          label: "شماره تماس مراجعه کننده",
          field: (row) => row.userId.phone,
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
          type: "q-select",
          label: "تسویه حساب شود؟",
          model: "",
          field: "isCheckout",
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
    this.eventsSubmitTable = {
      loading: true,
      canInsert: false,
      readonly: true,
      hasSubset: false,
      subsetUrl: "",
      title: "لیست ثبت نامی ها",
      filter: "",
      mode: "list",
      url: `panel/eventsSubmit`,
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
          field: (row) => row.eventId.title,
          sortable: true,
        },
        {
          name: "personName",
          align: "left",
          label: "برگزارکننده",
          field: (row) => row.eventId.personName,
          sortable: true,
        },
        {
          name: "personFirstName",
          align: "left",
          label: "نام",
          field: (row) => row.userId.firstName,
          sortable: true,
        },
        {
          name: "personLastName",
          align: "left",
          label: "نام خانوادگی",
          field: (row) => row.userId.lastName,
          sortable: true,
        },
        {
          name: "personPhone",
          align: "left",
          label: "شماره تماس",
          field: (row) => row.userId.phone,
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
      ],
      data: [],
      itemId: "",
      form: [],
    };
    this.eventTable = {
      loading: true,
      canInsert: true,
      readonly: false,
      hasSubset: false,
      subsetUrl: "",
      title: "لیست رویداد ها",
      filter: "",
      mode: "list",
      url: `panel/events`,
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
        {
          name: "personName",
          required: true,
          label: "نام برگزارکننده",
          align: "left",
          field: "personName",
          sortable: true,
        },
        {
          name: "price",
          align: "left",
          label: "قیمت",
          field: "price",
          sortable: true,
        },
        {
          name: "offer",
          align: "left",
          label: "تخفیف",
          field: "offer",
          sortable: true,
        },
        {
          name: "startDate",
          align: "left",
          label: "تاریخ شروع",
          field: (row) => row.startDate,
          format: (val) =>
            `${new persianDate(Date.parse(val)).format("YYYY-MM-DD")}`,
          sortable: true,
        },
        {
          name: "endDate",
          align: "left",
          label: "تاریخ پایان",
          field: (row) => row.endDate,
          format: (val) =>
            `${new persianDate(Date.parse(val)).format("YYYY-MM-DD")}`,
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
          canUpdate: true,
          isSecret: false,
          field: "caption",
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "نام برگزارکننده",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "personName",
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "قیمت",
          model: "",
          field: "price",
          isSecret: false,
          canUpdate: true,
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "تخفیف",
          model: "",
          field: "offer",
          isSecret: false,
          canUpdate: true,
        },
        {
          isFile: false,
          isObject: false,
          type: "date",
          label: "تاریخ شروع",
          model: "",
          field: "startDate",
          isSecret: false,
          canUpdate: true,
        },
        {
          isFile: false,
          isObject: false,
          type: "date",
          label: "تاریخ پایان",
          model: "",
          field: "endDate",
          isSecret: false,
          canUpdate: true,
        },
        {
          isFile: true,
          isObject: false,
          type: "file",
          label: "عکس",
          src: "",
          filename: "",
          model: "",
          isSecret: false,
          field: "avatar",
          canUpdate: true,
        },
      ],
    };
    this.vipServiceTable = {
      loading: true,
      canInsert: true,
      readonly: false,
      hasSubset: false,
      subsetUrl: "",
      title: "لیست خدمات ویژه",
      filter: "",
      mode: "list",
      url: `panel/categories/vip`,
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
        {
          name: "offer",
          align: "left",
          label: "تخفیف",
          field: "offer",
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
          label: "تخفیف",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "offer",
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "درصد سود پیش فرض شرکت از نوبت های معمولی",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "profitOfNormalTurn",
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "درصد سود پیش فرض شرکت از نوبت های اورژانسی",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "profitOfEmergencyTurn",
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "درصد هزینه دریافتی شرکت از نوبت های لغو شده توسط کاربران",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "depositToCompanyForCanceling",
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "درصد هزینه دریافتی کلینیک از نوبت های لغو شده توسط کاربران",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "depositToClinicForCanceling",
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
      ],
    };
    this.normalServiceTable = {
      loading: true,
      canInsert: true,
      readonly: false,
      hasSubset: false,
      subsetUrl: "",
      title: "لیست خدمات عادی",
      filter: "",
      mode: "list",
      url: `panel/categories/normal`,
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
        {
          name: "offer",
          align: "left",
          label: "تخفیف",
          field: "offer",
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
          label: "تخفیف",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "offer",
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "درصد سود پیش فرض شرکت از نوبت های معمولی",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "profitOfNormalTurn",
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "درصد سود پیش فرض شرکت از نوبت های اورژانسی",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "profitOfEmergencyTurn",
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "درصد هزینه دریافتی شرکت از نوبت های لغو شده توسط کاربران",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "depositToCompanyForCanceling",
        },
        {
          isFile: false,
          isObject: false,
          type: "q-input",
          label: "درصد هزینه دریافتی کلینیک از نوبت های لغو شده توسط کاربران",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "depositToClinicForCanceling",
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
      ],
    };
    this.petCategoryTable = {
      loading: true,
      canInsert: true,
      readonly: false,
      hasSubset: true,
      subsetUrl: "/categories/petSub/:id",
      title: "لیست دسته بندی حیوانات",
      filter: "",
      mode: "list",
      url: `panel/categories/pet`,
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
          label: "آیکون fontAwesome",
          model: "",
          canUpdate: true,
          isSecret: false,
          field: "offer",
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
      ],
    };
    this.provinceTable = {
      loading: true,
      canInsert: false,
      readonly: true,
      hasSubset: true,
      subsetUrl: "/provinces/:id",
      title: "لیست استان ها",
      filter: "",
      mode: "list",
      url: `panel/provinces`,
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
          label: "نام",
          field: "title",
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
          name: "actions",
          label: "عملیات",
          field: "actions",
          align: "left",
        },
      ],
      data: [],
      itemId: "",
      form: [],
    };
    this.contactUsTable = {
      loading: true,
      canInsert: false,
      readonly: true,
      hasSubset: false,
      tableMode: "",
      subsetUrl: "",
      title: "لیست ارتباط با ما",
      filter: "",
      mode: "grid",
      url: `panel/contactUs`,
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
        {
          name: "firstName",
          align: "left",
          label: "نام",
          field: "firstName",
          sortable: true,
        },
        {
          name: "lastName",
          required: true,
          label: "نام خانوادگی",
          align: "left",
          field: "lastName",
          sortable: true,
        },
        {
          name: "phone",
          align: "left",
          label: "شماره تماس",
          field: "phone",
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
          name: "caption",
          align: "left",
          label: "توضیحات",
          field: "caption",
          sortable: true,
        },
      ],
      data: [],
      itemId: "",
      form: [],
    };
    this.emailsTable = {
      loading: true,
      canInsert: false,
      readonly: true,
      hasSubset: false,
      subsetUrl: "",
      title: "لیست ایمیل ها",
      filter: "",
      mode: "list",
      url: `panel/info`,
      columns: [
        {
          name: "index",
          label: "#",
          field: "index",
          align: "left",
          sortable: true,
        },
        {
          name: "email",
          align: "left",
          label: "ایمیل",
          field: "email",
          sortable: true,
        },
      ],
      data: [],
      itemId: "",
      form: [],
    };
    this.getInfo();
    this.getEventTable();
    this.getEventSubmitTable();
    this.getVipCategoryList();
    this.getNormalCategoryList();
    this.getPostList();
    this.getPetCategoryList();
    this.getReserve();
  },
  methods: {
    getEventSubmitTable() {
      this.$axios
        .get("panel/eventsSubmit")
        .then((response) => {
          response.data.data.items.forEach((row, index) => {
            row.index = index + 1;
          });
          this.eventsSubmitTable.data = response.data.data.items;
          this.eventsSubmitTable.loading = false;
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
    getEventTable() {
      this.$axios
        .get("panel/events")
        .then((response) => {
          response.data.data.items.forEach((row, index) => {
            row.index = index + 1;
          });
          this.eventTable.data = response.data.data.items;
          this.eventTable.loading = false;
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
    getPetCategoryList() {
      this.$axios
        .get("panel/categories/pet")
        .then((response) => {
          response.data.data.items.forEach((row, index) => {
            row.index = index + 1;
          });
          this.petCategoryTable.data = response.data.data.items;
          this.petCategoryTable.loading = false;
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
    getVipCategoryList() {
      this.$axios
        .get("panel/categories/vip")
        .then((response) => {
          response.data.data.items.forEach((row, index) => {
            row.index = index + 1;
          });
          this.vipServiceTable.data = response.data.data.items;
          this.vipServiceTable.loading = false;
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
    getNormalCategoryList() {
      this.$axios
        .get("panel/categories/normal")
        .then((response) => {
          response.data.data.items.forEach((row, index) => {
            row.index = index + 1;
          });
          this.normalServiceTable.data = response.data.data.items;
          this.normalServiceTable.loading = false;
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
    getInfo() {
      this.$axios
        .get(`panel/info`)
        .then((response) => {
          this.info = response.data.data.item;
          this.gallery = response.data.data.item.gallery;
          this.userList = [];
          this.clinicList = [];
          this.accessList = [];
          this.accessList = response.data.data.item.access.list;
          response.data.data.item.userList.forEach((element) => {
            this.userList.push({
              label: `${element.firstName} ${element.lastName} | ${element.phone}`,
              value: element._id,
            });
          });
          response.data.data.item.clinicList.forEach((element) => {
            this.clinicList.push({
              label: `${element.firstName} ${element.lastName} | ${element.phone}`,
              value: element._id,
            });
          });

          this.messageBox = response.data.data.item.messageBox;
          this.offer = response.data.data.item.offer;

          response.data.data.item.emails.forEach((row, index) => {
            row.index = index + 1;
          });

          this.emailsTable.data = response.data.data.item.emails;
          this.emailsTable.loading = false;

          response.data.data.item.contactUsList.forEach((row, index) => {
            row.index = index + 1;
          });
          this.contactUsTable.data = response.data.data.item.contactUsList;
          this.contactUsTable.loading = false;

          response.data.data.item.provinceList.forEach((row, index) => {
            row.index = index + 1;
          });
          this.provinceTable.data = response.data.data.item.provinceList;
          this.provinceTable.loading = false;
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
    updateInfo() {
      this.infoLoading = true;
      this.$axios.put("panel/info", this.info).then((response) => {
        this.info = response.data.data.item;
        this.infoLoading = false;
      });
    },
    createGallery() {
      this.$axios
        .put("panel/info/gallery", this.galleryInfo)
        .then((response) => {
          this.galleryInfo.title = "";
          this.galleryInfo.caption = "";
          this.galleryInfo.linkText = "";
          this.galleryInfo.link = "";
          this.galleryInfo.avatar = null;
          this.galleryInfo.avatarfile = "";
          this.galleryInfo.avatarSrc = "";
          this.gallery = response.data.data.item.gallery;
          this.galleryDialog = false;
        });
    },
    createMessageBoxUser() {
      this.$axios
        .post("panel/info/messageBox/user", {
          title: this.messageBoxUserInfo.title,
          caption: this.messageBoxUserInfo.caption,
          users: this.messageBoxUserInfo.users.map((x) => x.value),
        })
        .then((response) => {
          this.messageBoxUserInfo.title = "";
          this.messageBoxUserInfo.caption = "";
          this.messageBoxUserInfo.users = [];
          this.messageBoxUserDialog = false;
          this.getInfo();
        });
    },
    getReserve() {
      this.$axios
        .get(`panel/reserves`)
        .then((response) => {
          response.data.data.items=response.data.data.items.filter((x=>x.isActive==true));
          response.data.data.items.forEach((row, index) => {
            row.index = index + 1;
          });
          this.reserveTable.data = response.data.data.items;
          this.reserveTable.loading = false;
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
    createOfferPercent() {
      this.$axios
        .post("panel/info/offer/percent", {
          title: this.offerPercentInfo.title,
          caption: this.offerPercentInfo.caption,
          users: this.offerPercentInfo.users.map((x) => x.value),
          percent: this.offerPercentInfo.percent,
          startDate: this.offerPercentInfo.startDate,
          endDate: this.offerPercentInfo.endDate,
        })
        .then((response) => {
          this.offerPercentInfo.title = "";
          this.offerPercentInfo.caption = "";
          this.offerPercentInfo.percent = "";
          this.offerPercentInfo.startDate = "";
          this.offerPercentInfo.endDate = "";
          this.offerPercentInfo.users = [];
          this.offerPercentDialog = false;
          this.getInfo();
        });
    },
    createOfferPrice() {
      this.$axios
        .post("panel/info/offer/price", {
          title: this.offerPriceInfo.title,
          caption: this.offerPriceInfo.caption,
          users: this.offerPriceInfo.users.map((x) => x.value),
          price: this.offerPriceInfo.price,
          startDate: this.offerPriceInfo.startDate,
          endDate: this.offerPriceInfo.endDate,
        })
        .then((response) => {
          this.offerPriceInfo.title = "";
          this.offerPriceInfo.caption = "";
          this.offerPriceInfo.price = "";
          this.offerPriceInfo.startDate = "";
          this.offerPriceInfo.endDate = "";
          this.offerPriceInfo.users = [];
          this.offerPriceDialog = false;
          this.getInfo();
        });
    },
    createMessageBoxClinic() {
      this.$axios
        .post("panel/info/messageBox/clinic", {
          title: this.messageBoxClinicInfo.title,
          caption: this.messageBoxClinicInfo.caption,
          clinics: this.messageBoxClinicInfo.clinics.map((x) => x.value),
        })
        .then((response) => {
          this.messageBoxClinicInfo.title = "";
          this.messageBoxClinicInfo.caption = "";
          this.messageBoxClinicInfo.users = [];
          this.messageBoxClinicDialog = false;
          this.getInfo();
        });
    },
    uploadFile(value, objectName) {
      var formData = new FormData();
      formData.set("file", value);
      this.$axios
        .post("/upload/file", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          this[objectName].avatar = response.data.data.file.filename;
          this[objectName].avatarSrc = response.data.data.file.url;
        });
    },
    openDeleteDialog(galleryId) {
      this.deleteGalleryDialog = true;
      this.galleryInfo.galleryId = galleryId;
    },
    deleteGallery() {
      this.$axios
        .delete(
          `panel/info/gallery/${this.galleryInfo.galleryId}`,
          this.galleryInfo
        )
        .then((response) => {
          this.gallery = response.data.data.item.gallery;
          this.deleteGalleryDialog = false;
        });
    },
    getPostList() {
      this.$axios.get("panel/post/article").then((response) => {
        this.articleList = response.data.data.items;
      });
      this.$axios.get("panel/post/news").then((response) => {
        this.newsList = response.data.data.items;
      });
      this.$axios.get("panel/post/notice").then((response) => {
        this.noticeList = response.data.data.items;
      });
      this.$axios.get("panel/post/page").then((response) => {
        this.pageList = response.data.data.items;
      });
    },
    createOrUpdatePost() {
      this.postInfo.tagsArr = this.postInfo.tags.map((x) => x.text);
      var data = Object.assign({}, this.postInfo);
      data.tags = this.postInfo.tagsArr;
      if (this.postInfo._id) {
        data["avatar"] = data.avatarSrc.substring(
          data.avatarSrc.lastIndexOf("/") + 1
        );
        this.$axios
          .put(
            `panel/post/${this.postInfo.postType}/${this.postInfo._id}`,
            data
          )
          .then((response) => {
            this.getPostList();
            this.postInfo.dialog = false;
          });
      } else {
        this.$axios
          .post(`panel/post/${this.postInfo.postType}`, data)
          .then((response) => {
            this.getPostList();
            this.postInfo.dialog = false;
          });
      }
    },
    changeStatus(postId, postType, status) {
      this.$axios
        .put(`panel/post/${postType}/${postId}/${status}`)
        .then((response) => {
          this.getPostList();
          this.postInfo.dialog = false;
        });
    },
    editPostDialog(postInfo) {
      this.postInfo.dialog = true;
      this.postInfo.title = postInfo.title;
      this.postInfo.tags = postInfo.tags.map((x) => {
        return { text: x, tiClasses: ["ti-valid"] };
      });
      this.postInfo.seoCaption = postInfo.seoCaption;
      this.postInfo.slug = postInfo.slug;
      this.postInfo.avatarSrc = postInfo.avatar;
      this.postInfo.content = postInfo.content;
      this.postInfo.postType = postInfo.class;
      this.postInfo._id = postInfo._id;
    },
  },
};
</script>
