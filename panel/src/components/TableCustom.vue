<template>
  <div class="row q-col-gutter-md q-pt-md">
    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-card flat bordered>

        <q-table :loading="loading" row-key="index" :title="title" :data="data" :hide-header="mode === 'grid'"
          :table-class="$q.dark.isActive ? 'text-white' : 'text-grey-8'"
          :table-header-class="$q.dark.isActive ? 'text-white' : 'text-grey-9'" :columns="columns"
          :grid="mode == 'grid'" :filter="filter" :pagination.sync="pagination" :rows-per-page-options="[15]"
          @request="onRequest">


          <template v-slot:top-left="props">
            <q-btn flat round dense :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
              @click="props.toggleFullscreen" v-if="mode === 'list'" class="text-grey-7" v-show="canShow">
              <q-tooltip :disable="$q.platform.is.mobile" v-close-popup>
                {{ props.inFullscreen ? "خروج از تمام صفحه" : "تمام صفحه" }}
              </q-tooltip>
            </q-btn>

            <q-btn flat round dense :icon="mode === 'grid' ? 'list' : 'grid_on'" @click="
  mode = mode === 'grid' ? 'list' : 'grid';
separator = mode === 'grid' ? 'none' : 'horizontal';
            " v-if="!props.inFullscreen" class="text-grey-7" v-show="canShow">
              <q-tooltip :disable="$q.platform.is.mobile" v-close-popup>{{ mode === "grid" ? "لیست" : "جدول" }}
              </q-tooltip>
            </q-btn>

            <q-btn flat round dense icon="insert_drive_file" @click="exportTable" class="text-grey-7" v-show="canShow">
              <q-tooltip> خروجی CSV</q-tooltip>
            </q-btn>
            <q-btn v-show="canInsert" flat round dense icon="add" @click="openModal(-1)" class="text-grey-7">
              <q-tooltip> افزودن</q-tooltip>
            </q-btn>
            <q-input outlined dense debounce="300" v-model="filter" placeholder="جستجو..." v-show="canShow">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>



          <template v-slot:top-right="props">
            <div :class="$q.dark.isActive ? 'text-white' : 'text-grey-7'" class="text-h6">
              {{ title }}
            </div>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="text-center">
              <q-btn-group spread>
                <q-btn v-show="!readonly" size="sm" color="primary" icon="edit" @click="openModal(props.row.index)">
                  <q-tooltip v-close-popup> ویرایش</q-tooltip>
                </q-btn>
                <q-btn v-show="hasSubset" size="sm" color="primary" :to="subsetUrl.replace(':id', props.row._id)"
                  icon="remove_red_eye">
                  <q-tooltip v-close-popup> مشاهده</q-tooltip>
                </q-btn>

                <q-btn v-show="canConfirm" v-if="props.row.isConfirmed == false" @click="
  activeConfirm = true;
itemId = props.row._id;
                " size="sm" color="accent" icon="check">
                  <q-tooltip v-close-popup> تایید حساب کاربر</q-tooltip>
                </q-btn>


                <q-btn v-show="canActive" v-if="props.row.isActive == false" @click="
  activeConfirm = true;
itemId = props.row._id;
                " size="sm" color="accent" icon="check">
                  <q-tooltip v-close-popup> فعال کردن</q-tooltip>
                </q-btn>
                <q-btn v-show="canDeActive" v-else size="sm" color="red" @click="
  deActiveConfirm = true;
itemId = props.row._id;
                " icon="close">
                  <q-tooltip v-close-popup> غیر فعال کردن</q-tooltip>
                </q-btn>
              </q-btn-group>
            </q-td>
          </template>

          <template v-slot:body-cell-proDuct="props">
            <q-td :props="props" class="text-center">
              <q-btn-group spread>

                <q-btn v-show="hasSubsetProduct" size="sm" color="primary"
                  :to="subsetUrlProduct.replace(':id', props.row._id)">
                  فروشگاه
                </q-btn>

              </q-btn-group>
            </q-td>
          </template>

          <template v-slot:body-cell-ProDuct="props">
            <q-td :props="props" class="text-center">
              <q-btn-group spread>

                <q-btn v-show="hasSubsetShop" size="sm" color="primary"
                  :to="subsetUrlShop.replace(':id', props.row._id)">
                  محصولات
                </q-btn>

              </q-btn-group>
            </q-td>
          </template>

          <template v-slot:body-cell-period="props">
            <q-td :props="props" class="text-center">
              <q-btn-group spread>

                <q-btn v-show="hasSubsetPeriod" size="sm" color="primary"
                  :to="subsetUrlPeriod.replace(':id', props.row._id)">
                  دوره آنلاین
                </q-btn>

              </q-btn-group>
            </q-td>
          </template>

          <template v-slot:body-cell-vipPst="props">
            <q-td :props="props" class="text-center">
              <q-btn-group spread>

                <q-btn v-show="hasSubsetVipPst" size="sm" color="primary"
                  :to="subsetUrlVipPst.replace(':id', props.row._id)">
                  ویترین
                </q-btn>

              </q-btn-group>
            </q-td>
          </template>

          <template v-slot:body-cell-onlineCall="props">
            <q-td :props="props" class="text-center">
              <q-btn-group spread>

                <q-btn v-show="hasSubsetOnlineCall" size="sm" color="primary"
                  :to="subsetUrlOnlineCall.replace(':id', props.row._id)">
                  تماس آنلاین
                </q-btn>

              </q-btn-group>
            </q-td>
          </template>

          <template v-slot:body-cell-wallet="props">
            <q-td :props="props" class="text-center">
              <q-btn-group spread>

                <q-btn v-show="hasSubsetWallet" size="sm" color="primary"
                  :to="subsetUrlWallet.replace(':id', props.row._id)">
                  تاریخچه شارژها
                </q-btn>

              </q-btn-group>
            </q-td>
          </template>

          <template v-slot:body-cell-walletPayment="props">
            <q-td :props="props" class="text-center">
              <q-btn-group spread>

                <q-btn v-show="hasSubsetWalletPayment" size="sm" color="primary"
                  :to="subsetUrlWalletPayment.replace(':id', props.row._id)">
                  تاریخچه کیف پول
                </q-btn>

              </q-btn-group>
            </q-td>
          </template>

          <template v-slot:body-cell-setProgram="props">
            <q-td :props="props" class="text-center">
              <q-btn-group spread>

                <q-btn v-show="hasSubsetSetProgram" size="sm" color="primary"
                  :to="subsetUrlSetProgram.replace(':id', props.row._id)">
                  برنامه دادن
                </q-btn>

              </q-btn-group>
            </q-td>
          </template>

          <template v-slot:body-cell-channel="props">
            <q-td :props="props" class="text-center">
              <q-btn-group spread>

                <q-btn v-show="hasSubsetChannel" size="sm" color="primary"
                  :to="subsetUrlChannel.replace(':id', props.row._id)">
                  کانال
                </q-btn>

              </q-btn-group>
            </q-td>
          </template>

          <template v-slot:body-cell-support="props">
            <q-td :props="props" class="text-center">
              <q-btn-group spread>

                <q-btn v-show="hasSubsetSupport" size="sm" color="primary"
                  :to="subsetUrlSupport.replace(':id', props.row._id)">
                  پشتیبان
                </q-btn>

              </q-btn-group>
            </q-td>
          </template>



          <template v-slot:body-cell-frequentlyQuestion="props">
            <q-td :props="props" class="text-center">
              <q-btn-group spread>
                <q-btn v-show="true" size="sm" color="primary"
                  :to="subsetUrlFrequentlyQuestion.replace(':id', props.row._id)" icon="remove_red_eye">
                  <q-tooltip v-close-popup> افزودن سوال جدید</q-tooltip>
                </q-btn>

              </q-btn-group>
            </q-td>
          </template>


          <template v-slot:body-cell-channelUser="props">
            <q-td :props="props" class="text-center">
              <q-btn-group spread>

                <q-btn v-show="hasSubsetChannelUser" size="sm" color="primary"
                  :to="subsetUrlChannelUser.replace(':id', props.row._id)">
                  کانال
                </q-btn>

              </q-btn-group>
            </q-td>
          </template>

          <template v-slot:body-cell-postQuestion="props">
            <q-td :props="props" class="text-center">
              <q-btn-group spread>

                <q-btn v-show="hasSubsetPostQuestion" size="sm" color="primary"
                  :to="subsetUrlPostQuestion.replace(':id', props.row._id)">
                  پرسمان
                </q-btn>

              </q-btn-group>
            </q-td>
          </template>


        </q-table>

      </q-card>
      <!-- persistent -->
      <q-dialog v-model="dialog" :maximized="maximizedToggle" transition-show="slide-up" transition-hide="slide-down">
        <q-card>
          <q-bar>
            <q-space />
            <q-btn @click="saveModal" dense flat icon="save">
              <q-tooltip>ذخیره سازی</q-tooltip>
            </q-btn>

            <q-btn @click="saveModal2" dense flat icon="add_circle_outline">
              <q-tooltip>جدید</q-tooltip>
            </q-btn>
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip>بستن</q-tooltip>
            </q-btn>
          </q-bar>

          <q-card-section>
            <div class="text-h6">
              {{ isEdit ? "ویرایش اطلاعات" : "افزودن اطلاعات" }}
            </div>
          </q-card-section>

          <q-card-section>
            <div class="q-pa-md">
              <div class="row q-col-gutter-xs">
                <div v-for="(eachForm, index) in form.filter(
                  (x) => x.type == 'file'
                )" :key="eachForm.field" class="col-12 col-sm-6">
                  <q-file v-if="isEdit" filled :value="eachForm.model" @input="updateValue(eachForm.field, $event)"
                    bottom-slots :label="eachForm.label">
                    <template v-if="eachForm.isExternal" v-slot:before>
                      <q-avatar>
                        <q-icon name="open_in_new" @click="opemExternal(eachForm.src)" class="cursor-pointer" />
                      </q-avatar>
                    </template>
                    <template v-else v-slot:before>
                      <q-avatar>
                        <img :src="eachForm.src" />
                      </q-avatar>
                    </template>
                  </q-file>
                  <q-file v-else filled :value="eachForm.model" @input="updateValue(eachForm.field, $event)"
                    bottom-slots :label="eachForm.label">
                    <template v-if="eachForm.isExternal" v-slot:before>
                      <q-avatar>
                        <q-icon name="open_in_new" @click="opemExternal(eachForm.src)" class="cursor-pointer" />
                      </q-avatar>
                    </template>
                    <template v-else v-slot:before>
                      <q-avatar>
                        <img :src="eachForm.src" />
                      </q-avatar>
                    </template>
                  </q-file>
                </div>

                <div v-for="(eachForm, index) in form.filter(
                  (x) => x.type == 'q-input' || x.type == 'q-select'
                )" :key="eachForm.field" class="col-12 col-sm-6">
                  <component v-if="isEdit" :maxlength="eachForm.maxlength" :is="eachForm.type" :label="eachForm.label"
                    :options="eachForm.options" :value="eachForm.model" :url="eachForm.url"
                    @input="updateValue(eachForm.field, $event)" :disable="eachForm.disable" emit-value map-options
                    filled autogrow></component>
                  <component v-else :is="eachForm.type" :maxlength="eachForm.maxlength" :label="eachForm.label"
                    :options="eachForm.options" :value="eachForm.model" :url="eachForm.url"
                    @input="updateValue(eachForm.field, $event)" emit-value map-options filled autogrow></component>
                </div>
                <div v-for="(eachForm, index) in form.filter(
                  (x) => x.type == 'date'
                )" :key="eachForm.field" class="col-12 col-sm-6">
                  <q-input v-if="isEdit" @input="updateValue(eachForm.field, $event)" :label="eachForm.label" readonly
                    filled :value="eachForm.model">
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                          <q-date calendar="persian" today-btn :value="eachForm.model"
                            @input="updateValue(eachForm.field, $event)">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="تایید" color="primary" flat />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                  <q-input v-else @input="updateValue(eachForm.field, $event)" :label="eachForm.label" readonly filled
                    :value="eachForm.model">
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                          <q-date calendar="persian" today-btn :value="eachForm.model"
                            @input="updateValue(eachForm.field, $event)">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="تایید" color="primary" flat />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <div v-for="(eachForm, index) in form.filter(
                  (x) => x.type == 'time'
                )" :key="eachForm.field" class="col-12 col-sm-6">
                  <q-input v-if="isEdit" @input="updateValue(eachForm.field, $event)" :label="eachForm.label" readonly
                    filled :value="eachForm.model">
                    <template v-slot:append>
                      <q-icon name="access_time_filled" class="cursor-pointer">
                        <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                          <q-time calendar="persian" now-btn format24h :value="eachForm.model"
                            @input="updateValue(eachForm.field, $event)">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="تایید" color="primary" flat />
                            </div>
                          </q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                  <q-input v-else @input="updateValue(eachForm.field, $event)" :label="eachForm.label" readonly filled
                    :value="eachForm.model">
                    <template v-slot:append>
                      <q-icon name="access_time_filled" class="cursor-pointer">
                        <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                          <q-time calendar="persian" now-btn format24h :value="eachForm.model"
                            @input="updateValue(eachForm.field, $event)">

                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="تایید" color="primary" flat />
                            </div>
                          </q-time>

                        </q-popup-proxy>
                      </q-icon>

                    </template>
                  </q-input>
                </div>
                <div style="display: none" class="col-12">
                  <q-field filled label="تگ ها" stack-label>
                    <template v-slot:control>
                      <vue-tags-input placeholder="بنویسید..." v-model="tag" :tags="tags"
                        @tags-changed="(newTags) => (tags = newTags)" />
                    </template>
                  </q-field>

                  <q-editor v-model="qeditor" @paste.native="(evt) => pasteCapture(evt)"
                    @drop.native="(evt) => dropCapture(evt)" :dense="$q.screen.lt.md" :toolbar="[
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
                    ]" :fonts="{
                      arial: 'Arial',
                      arial_black: 'Arial Black',
                      comic_sans: 'Comic Sans MS',
                      courier_new: 'Courier New',
                      impact: 'Impact',
                      lucida_grande: 'Lucida Grande',
                      times_new_roman: 'Times New Roman',
                      verdana: 'Verdana',
                    }" />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-dialog v-model="activeConfirm" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="check" color="green" text-color="white" />
            <span class="q-ml-sm">آیا فعال شود؟</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="انصراف" color="red" v-close-popup />
            <q-btn flat label="تایید" color="primary" @click="activeModal" />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog v-model="deActiveConfirm" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="close" color="red" text-color="white" />
            <span class="q-ml-sm">آیا غیر فعال شود؟</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="انصراف" color="red" v-close-popup />
            <q-btn flat label="تایید" color="primary" @click="deActiveModal" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>


<script>
import { exportFile } from "quasar";
import VueTagsInput from "@johmun/vue-tags-input";

function wrapCsvValue(val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');

  return `"${formatted}"`;
}

export default {

  components: { VueTagsInput },
  data() {
    return {
      pagination: {
        page: 1,
        rowsPerPage: 15,
        rowsNumber: 100
      },
      tag: "",
      tags: [],
      qeditor: "",
      date: "",
      activeConfirm: false,
      deActiveConfirm: false,
      maximizedToggle: true,
      isEdit: true,
      dialog: false,
      itemId: "",
      expanded: false,
      group: [],
      options: [
        {
          label: "Battery too low",
          value: "bat",
        },
        {
          label: "Friend request",
          value: "friend",
          color: "green",
        },
        {
          label: "Picture uploaded",
          value: "upload",
          color: "red",
        },
      ],
      text: "",
    };
  },
  name: "Table",
  props: {
    form: {
      type: Array,
      default: function () {
        return [
          {
            type: "q-input",
            label: "شماره تماس",
            model: "09035020585",
          },
          {
            type: "q-select",
            label: "لیست من",
            model: "Google",
            options: [
              {
                label: "گوگل",
                value: "Google",
              },
            ],
          },
        ];
      },
    },
    initialPagination: {
      sortBy: 'name',
      descending: false,
      page: 3,
      rowsPerPage: 10
      // rowsNumber: xx if getting data from a server
    },
    loading: {
      type: Boolean,
      default: false,
    },

    title: {
      type: String,
      default: "",
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    canActive: {
      type: Boolean,
      default: true,
    },
    canConfirm: {
      type: Boolean,
      default: true,
    },
    canDeActive: {
      type: Boolean,
      default: true,
    },
    hasSubsetFrequentlyQuestion: {
      type: Boolean,
      default: false,
    },
    canInsert: {
      type: Boolean,
      default: false,
    },
    canShow: {
      type: Boolean,
      default: true,
    },
    hasSubset: {
      type: Boolean,
      default: false,
    },
    hasSubsetProduct: {
      type: Boolean,
      default: false,
    },
    hasSubsetShop: {
      type: Boolean,
      default: false,
    },
    hasSubsetPostQuestion: {
      type: Boolean,
      default: false,
    },
    hasSubsetPeriod: {
      type: Boolean,
      default: false,
    },
    hasSubsetVipPst: {
      type: Boolean,
      default: false,
    },
    hasSubsetOnlineCall: {
      type: Boolean,
      default: false,
    },
    hasSubsetSetProgram: {
      type: Boolean,
      default: false,
    },
    hasSubsetChannel: {
      type: String,
      default: "",
    },
    hasSubsetChannelUser: {
      type: String,
      default: "",
    },
    hasSubsetSupport: {
      type: String,
      default: "",
    },
    hasSubsetWallet: {
      type: String,
      default: "",
    },
    hasSubsetWalletPayment: {
      type: String,
      default: "",
    },
    subsetUrl: {
      type: String,
      default: "",
    },
    subsetUrlFrequentlyQuestion: {
      type: String,
      default: "",
    },
    subsetUrlProduct: {
      type: String,
      default: "",
    },
    subsetUrlShop: {
      type: String,
      default: "",
    },
    subsetUrlPeriod: {
      type: String,
      default: "",
    },
    subsetUrlVipPst: {
      type: String,
      default: "",
    },
    subsetUrlOnlineCall: {
      type: String,
      default: "",
    },
    subsetUrlWallet: {
      type: String,
      default: "",
    },
    subsetUrlWalletPayment: {
      type: String,
      default: "",
    },
    subsetUrlSetProgram: {
      type: String,
      default: "",
    },
    subsetUrlPostQuestion: {
      type: String,
      default: "",
    },
    subsetUrlChannel: {
      type: String,
      default: "",
    },
    subsetUrlChannelUser: {
      type: String,
      default: "",
    },
    subsetUrlSupport: {
      type: String,
      default: "",
    },
    filter: {
      type: String,
      default: "",
    },
    url: {
      type: String,
      default: "",
    },
    query: {
      type: Object,
      default: function () {
        return {};
      },
    },
    mode: {
      type: String,
      default: "",
    },
    columns: {
      type: Array,
      default: function () {
        return [];
      },
    },
    data: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  mounted() {


    this.data = this.data.sort(function (a, b) {
      return a.isActive - b.isActive
    }).reverse();


    this.$axios
      .get("/model/person-Person")
      .then((response) => {
        var filterList = [];
        response.data.data.items.forEach((element) => {
          filterList.push({
            label: element.phone,
            value: element._id,
          });
        });
        this.form.find((x) => x.field == "bossId").options = filterList;
      })
      .catch(() => {
      });


    this.$axios
      .get("/provinces")
      .then((response) => {
        var filterList = [];
        response.data.data.items.forEach((element) => {
          filterList.push({
            label: element.title,
            value: element._id,
          });
        });
        this.form.find((x) => x.field == "provinceId").options = filterList;
      })
      .catch(() => {
      });
    this.$axios
      .get("model/educationalStage")
      .then((response) => {
        var filterList = [];
        response.data.data.items.forEach((element) => {
          filterList.push({
            label: element.title,
            value: element._id,
          });
        });
        this.form.find((x) => x.field == "educationalStageId").options =
          filterList;
      })
      .catch(() => {
      });
    this.$axios
      .get("model/educationalField")
      .then((response) => {
        var filterList = [];
        response.data.data.items.forEach((element) => {
          filterList.push({
            label: element.title,
            value: element._id,
          });
        });
        this.form.find((x) => x.field == "educationalFieldId").options =
          filterList;
      })
      .catch(() => {
      });
    this.$root.$emit("updateTable", {});
  },
  // updated() {
  //   this.$axios
  //     .get("/provinces")
  //     .then((response) => {
  //       var filterList = [];
  //       response.data.data.items.forEach((element) => {
  //         filterList.push({
  //           label: element.title,
  //           value: element._id,
  //         });
  //       });
  //       this.form.find((x) => x.field == "provinceId").options = filterList;
  //     })
  //     .catch(() => {});
  //   this.$axios
  //     .get("model/educationalStage")
  //     .then((response) => {
  //       var filterList = [];
  //       response.data.data.items.forEach((element) => {
  //         filterList.push({
  //           label: element.title,
  //           value: element._id,
  //         });
  //       });
  //       this.form.find((x) => x.field == "educationalStageId").options =
  //         filterList;
  //     })
  //     .catch(() => {});
  //   this.$axios
  //     .get("model/educationalField")
  //     .then((response) => {
  //       var filterList = [];
  //       response.data.data.items.forEach((element) => {
  //         filterList.push({
  //           label: element.title,
  //           value: element._id,
  //         });
  //       });
  //       this.form.find((x) => x.field == "educationalFieldId").options =
  //         filterList;
  //     })
  //     .catch(() => {});
  // },
  methods: {
    updateNotification() {
      if (this.$route.name == "clinicProfile") {
        this.$router.push({
          name: "clinicProfile",
          query: {
            update: Date.now(),
          },
        });
      }
    },
    setTableFormEachModel(params) {
      var each = this.form.find((x) => x.field == params.field);
      each.model = params.model;
      if (each.isFile == true) {
        if (each.model) {
          var formData = new FormData();
          formData.set("file", each.model);
          var tok = localStorage.getItem("token");
          alert('شروع بارگذاری فایل');
          this.$axios
            .post("/upload/file", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
                "x-api-key": tok
              },
            })
            .then((response) => {
              this.setTableFormEachFile({
                field: params.field,
                file: response.data.data.file,
              });
              alert('فایل مورد نظر با موفقت آپلود شد');
            });
        }
      }
    },
    setTableFormEachFile(params) {
      var each = this.form.find((x) => x.field == params.field);
      each.src = params.file.url;
      each.filename = params.file.filename;
    },
    setTableFormOptions(params) {
      var filterList = [];
      if (this.form.find((x) => x.field == params.field).filter) {
        var filter = this.form.find((x) => x.field == params.field).filter;
        params.list.forEach((element) => {
          if (filter.includes(element._id)) {
            filterList.push({
              label: element.title,
              value: element._id,
            });
          }
        });
      } else {
        params.list.forEach((element) => {
          filterList.push({
            label: element.title,
            value: element._id,
          });
        });
      }

      this.form.find((x) => x.field == params.field).options = filterList;
      if (params.setEmpty == true) {
        this.form.find((x) => x.field == params.field).model = "";
      }
    },
    updateValue(key, value) {
      var tok = localStorage.getItem("token")
      let config = { 'x-api-key': tok };

      this.setTableFormEachModel({
        model: value,
        field: key,
      });
      if (key == "provinceId") {
        this.$axios
          .get(`/provinces/${value}/cities`, { headers: config })
          .then((response) => {
            this.setTableFormOptions({
              list: response.data.data.items,
              field: "cityId",
              setEmpty: true,
            });
          })
          .catch(() => {
          });
      }
    },
    setTableDataEach(params) {
      for (const [key, value] of Object.entries(params.data)) {
        this.data.find((x) => x._id == params.itemId)[key] = value;
      }
    },
    activeModal() {
      var tok = localStorage.getItem("token")
      let config = { 'x-api-key': tok };

      this.$axios
        .put(`${this.url}/${this.itemId}/active`, {}, { headers: config })
        .then((response) => {
          if (response.data.status == true) {
            this.setTableDataEach({
              data: {
                isActive: true,
              },
              itemId: this.itemId,
            });
            this.activeConfirm = false;
            this.updateNotification();
          } else {
            this.$q.notify({
              color: "negative",
              position: "top",
              message: response.data.message,
              icon: "report_problem",
            });
          }
        })
        .catch(() => {
          this.$q.notify({
            color: "negative",
            position: "top",
            message: this.$msg.network.fail,
            icon: "report_problem",
          });
        });
    },
    deActiveModal() {
      var tok = localStorage.getItem("token")
      let config = { 'x-api-key': tok };

      this.$axios
        .put(`${this.url}/${this.itemId}/deActive`, {}, { headers: config })
        .then((response) => {
          console.log(response)
          if (response.data.status == true) {
            this.setTableDataEach({
              data: {
                isActive: false,
              },
              itemId: this.itemId,
            });
            this.deActiveConfirm = false;
            this.updateNotification();
          } else {
            this.$q.notify({
              color: "negative",
              position: "top",
              message: response.data.message,
              icon: "report_problem",
            });
          }
        })
        .catch(() => {
          this.$q.notify({
            color: "negative",
            position: "top",
            message: this.$msg.network.fail,
            icon: "report_problem",
          });
        });
    },
    pushTableData(data) {
      this.data.push(data);
      this.updateNotification();
    },
    saveModal() {
      var tok = localStorage.getItem("token")
      let config = { 'x-api-key': tok };
      if (this.isEdit == true) {
        var updateQuery = {};
        this.form.forEach((element) => {
          if (element.canUpdate == true) {
            if (element.isFile) {
              updateQuery[element.field] = element.filename;
            } else if (element.type == "date") {
              updateQuery[element.field] = element.model.replaceAll("/", "-");
              var date = updateQuery[element.field]
                .split("-")
                .map((x) => Number(x));
              updateQuery[element.field] = new this.$persianDate([
                date[0],
                date[1],
                date[2],
                0,
                0,
              ])
                .toCalendar("gregorian")
                .toLocale("en")
                .format("YYYY-MM-DD");
            } else {
              updateQuery[element.field] = element.model;
            }
          }
        });
        this.$axios
          .put(`${this.url}/${this.itemId}`, updateQuery, { headers: config })
          .then((response) => {
            console.log("amin", response)
            if (response.data.status == true) {
              this.setTableDataEach({
                data: response.data.data.item,
                itemId: this.itemId,
              });
              this.dialog = false;
              this.updateNotification();
            } else {
              this.$q.notify({
                color: "negative",
                position: "top",
                message: response.data.message,
                icon: "report_problem",
              });
            }
          })
          .catch(() => {
            this.$q.notify({
              color: "negative",
              position: "top",
              message: this.$msg.network.fail,
              icon: "report_problem",
            });
          });
      } else {
        var insertQuery = {};
        this.form.forEach((element) => {
          if (element.isFile) {
            insertQuery[element.field] = element.filename;
          } else if (element.type == "date") {
            insertQuery[element.field] = element.model.replaceAll("/", "-");
            var date = insertQuery[element.field]
              .split("-")
              .map((x) => Number(x));
            insertQuery[element.field] = new this.$persianDate([
              date[0],
              date[1],
              date[2],
              0,
              0,
            ])
              .toCalendar("gregorian")
              .toLocale("en")
              .format("YYYY-MM-DD");
          } else if (element.iscat) {
            insertQuery[element.field] = element.ismin;
          } else {
            insertQuery[element.field] = element.model;
          }
        });
        var queryStr = '';
        if (this.query) {
          for (const [key, value] of Object.entries(this.query)) {
            insertQuery[key] = value;
          }
        }

        this.$axios
          .post(`${this.url}${queryStr}`, insertQuery, { headers: config })
          .then((response) => {
            if (response.data.status == true) {
              response.data.data.item["index"] = this.data.length + 1;
              this.pushTableData(response.data.data.item);
              this.dialog = false;
              this.updateNotification();
            } else {
              this.$q.notify({
                color: "negative",
                position: "top",
                message: response.data.message,
                icon: "report_problem",
              });
            }
          })
          .catch(() => {
            this.$q.notify({
              color: "negative",
              position: "top",
              message: this.$msg.network.fail,
              icon: "report_problem",
            });
          });
      }
    },
    saveModal2() {
      var tok = localStorage.getItem("token")
      let config = { 'x-api-key': tok };
      if (this.isEdit == true) {
        var updateQuery = {};
        this.form.forEach((element) => {
          if (element.canUpdate == true) {
            if (element.isFile) {
              updateQuery[element.field] = element.filename;
            } else if (element.type == "date") {
              updateQuery[element.field] = element.model.replaceAll("/", "-");
              var date = updateQuery[element.field]
                .split("-")
                .map((x) => Number(x));
              updateQuery[element.field] = new this.$persianDate([
                date[0],
                date[1],
                date[2],
                0,
                0,
              ])
                .toCalendar("gregorian")
                .toLocale("en")
                .format("YYYY-MM-DD");
            } else {

              updateQuery[element.field] = element.model;

            }

          }
        });
        var x = this.form[0].model
        var y = this.form[1].model

        if (y <= x) {
          this.$axios
            .post(`${this.url}`, updateQuery, { headers: config })
            .then((response) => {
              if (response.data.status == true) {
                this.setTableDataEach({
                  data: response.data.data.item,
                  // itemId: this.itemId,
                });
                this.dialog = false;
                this.updateNotification();
              } else {
                this.$q.notify({
                  color: "negative",
                  position: "top",
                  message: response.data.message,
                  icon: "report_problem",
                });
              }
            })
            .catch(() => {
              this.$q.notify({
                color: "negative",
                position: "top",
                message: this.$msg.network.fail,
                icon: "report_problem",
              });
            });
        } else {
          this.$q.notify({
            color: "negative",
            position: "top",
            message: "مبلغ وارد شده بیشتر از مبلغ قابل برداشت است",
            icon: "report_problem",
          });
        }


      } else {
        var insertQuery = {};
        this.form.forEach((element) => {
          if (element.isFile) {
            insertQuery[element.field] = element.filename;
          } else if (element.type == "date") {
            insertQuery[element.field] = element.model.replaceAll("/", "-");
            var date = insertQuery[element.field]
              .split("-")
              .map((x) => Number(x));
            insertQuery[element.field] = new this.$persianDate([
              date[0],
              date[1],
              date[2],
              0,
              0,
            ])
              .toCalendar("gregorian")
              .toLocale("en")
              .format("YYYY-MM-DD");
          } else if (element.iscat) {
            insertQuery[element.field] = element.ismin;
          } else {
            insertQuery[element.field] = element.model;
          }
        });
        var queryStr = '';
        if (this.query) {
          for (const [key, value] of Object.entries(this.query)) {
            insertQuery[key] = value;
          }
        }

        this.$axios
          .post(`${this.url}${queryStr}`, insertQuery, { headers: config })

          .then((response) => {
            if (response.data.status == true) {
              response.data.data.item["index"] = this.data.length + 1;
              this.pushTableData(response.data.data.item);
              this.dialog = false;
              this.updateNotification();
            } else {
              this.$q.notify({
                color: "negative",
                position: "top",
                message: response.data.message,
                icon: "report_problem",
              });
            }
          })
          .catch(() => {
            this.$q.notify({
              color: "negative",
              position: "top",
              message: this.$msg.network.fail,
              icon: "report_problem",
            });
          });
      }
    },
    setTableFormModelEmpty() {
      this.form.forEach((element) => {
        if (element.isFile) {
          element.model = null;
          element.filename = "";
          element.src = "";
        } else {
          element.model = "";
        }
      });
    },
    setTableFormFileEachModel(params) {
      this.form.find((x) => x.field == params.field).model = params.model;
      this.form.find((x) => x.field == params.field).src = params.src;
      this.form.find((x) => x.field == params.field).filename = params.filename;
    },
    setTableFormEachModel(params) {
      var each = this.form.find((x) => x.field == params.field);
      each.model = params.model;
      if (each.isFile == true) {
        if (each.model) {
          var formData = new FormData();
          formData.set("file", each.model);
          var tok = localStorage.getItem("token");
          alert('شروع بارگذاری فایل');
          this.$axios
            .post("/upload/file", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
                "x-api-key": tok
              },
            })
            .then((response) => {
              this.setTableFormEachFile({
                field: params.field,
                file: response.data.data.file,
              });
              alert('فایل مورد نظر با موفقت آپلود شد');
            });
        }
      }
    },
    openModal(index) {
      if (index == -1) {
        this.isEdit = false;
        this.setTableFormModelEmpty();
      } else {
        this.isEdit = true;
        var element = this.data[index - 1];
        this.itemId = element["_id"];
        for (let i = 0; i < Object.keys(element).length; i++) {
          var key = Object.keys(element)[i];
          for (let j = 0; j < this.form.length; j++) {
            var eachFrom = this.form[j];
            if (key == eachFrom.field) {
              if (eachFrom.isFile) {
                this.setTableFormFileEachModel({
                  model: null,
                  src: element[key],
                  field: key,
                  filename: element[key].split("/").pop(),
                });
              } else if (eachFrom.isObject) {
                this.setTableFormEachModel({
                  model: element[key]._id,
                  field: key,
                });
              } else if (eachFrom.type == "date") {
                this.setTableFormEachModel({
                  model: new this.$persianDate(Date.parse(element[key]))
                    .toLocale("en")
                    .format("YYYY/MM/DD"),
                  field: key,
                });
              } else {
                this.setTableFormEachModel({
                  model: !eachFrom.isSecret ? element[key] : "",
                  field: key,
                });
              }
            }
          }
        }

        if (this.form.find((x) => x.field == "provinceId")) {
          var provinceId = this.form.find((x) => x.field == "provinceId").model;
          this.$axios
            .get(`/provinces/${provinceId}/cities`)
            .then((response) => {
              this.setTableFormOptions({
                list: response.data.data.items,
                field: "cityId",
                setEmpty: false,
              });
            });
        }
      }
      this.dialog = true;
    },
    opemExternal(url) {
      window.open(url, "_blank");
    },
    exportTable() {
      // naive encoding to csv format
      const content = [this.columns.map((col) => wrapCsvValue(col.label))]
        .concat(
          this.data.map((row) =>
            this.columns
              .map((col) =>
                wrapCsvValue(
                  typeof col.field === "function"
                    ? col.field(row)
                    : row[col.field === void 0 ? col.name : col.field],
                  col.format
                )
              )
              .join(",")
          )
        )
        .join("\r\n");

      const status = exportFile("nabi.csv", content, "text/csv");

      if (status !== true) {
        this.$q.notify({
          message: "Browser denied file download...",
          color: "negative",
          icon: "warning",
        });
      }
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
<style lang="css">
/* style the background and the text color of the input ... */
.vue-tags-input {
  background: #ffffff00;
  max-width: 100% !important;
  width: 100% !important;
}

.vue-tags-input .ti-new-tag-input {
  background: transparent;
  color: #000;
}

.vue-tags-input .ti-input {
  padding: 4px 10px;
  transition: border-bottom 200ms ease;
}

/* we cange the border color if the user focuses the input */
.vue-tags-input.ti-focus .ti-input {
  border: 1px solid #ffffff00;
}

/* some stylings for the autocomplete layer */
.vue-tags-input .ti-autocomplete {
  background: #ffffff00;
  border: 1px solid #ffffff00;
  border-top: none;
}

.vue-tags-input .ti-input {
  background: #ffffff00;
  border: 1px solid #ffffff00;
}

/* the selected item in the autocomplete layer, should be highlighted */
.vue-tags-input .ti-item.ti-selected-item {
  background: #ffffff00;
  color: #ffffff00;
}

/* style the placeholders color across all browser */
.vue-tags-input ::-webkit-input-placeholder {
  color: #000;
}

.vue-tags-input ::-moz-placeholder {
  color: #000;
}

.vue-tags-input :-ms-input-placeholder {
  color: #000;
}

.vue-tags-input :-moz-placeholder {
  color: #000;
}

/* default styles for all the tags */
.vue-tags-input .ti-tag {
  position: relative;
  background: blue;
  color: white;
}

/* we defined a custom css class in the data model, now we are using it to style the tag */
.vue-tags-input .ti-tag.custom-class {
  background: transparent;
  border: 1px solid #ffffff00;
  color: #ffffff00;
  margin-right: 4px;
  border-radius: 0px;
  font-size: 13px;
}

/* the styles if a tag is invalid */
.vue-tags-input .ti-tag.ti-invalid {
  background-color: #e88a74;
}

/* if the user input is invalid, the input color should be red */
.vue-tags-input .ti-new-tag-input.ti-invalid {
  color: #e88a74;
}

/* if a tag or the user input is a duplicate, it should be crossed out */
.vue-tags-input .ti-duplicate span,
.vue-tags-input .ti-new-tag-input.ti-duplicate {
  text-decoration: line-through;
}

/* if the user presses backspace, the complete tag should be crossed out, to mark it for deletion */
.vue-tags-input .ti-tag:after {
  transition: transform 0.2s;
  position: absolute;
  content: "";
  height: 2px;
  width: 108%;
  left: -4%;
  top: calc(50% - 1px);
  background-color: #000;
  transform: scaleX(0);
}

.vue-tags-input .ti-deletion-mark:after {
  transform: scaleX(1);
}

.text-left:last-child {
  text-align: center !important;
}
</style>
