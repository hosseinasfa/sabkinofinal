var mongoose = require("mongoose");
module.exports = {
    siteName: "پنل مدیریت نبی",
    mongooseOptions: {
        toObject: {
            getters: true,
            virtuals: true,
        },
        toJSON: {
            getters: true,
            virtuals: true,
        },
        timestamps: true,
    },
    mongooseUpdateOptions:{
        new:true,
        runValidators:true,
    },
    captchaOption: {
        noise: 2,
        size: 5,
        mathMin: 1,
        mathMax: 5,
        mathOperator: "+",
    },
    dataTableLanguage: {
        "sEmptyTable": "هیچ داده‌ای در جدول وجود ندارد",
        "sInfo": "نمایش _START_ تا _END_ از _TOTAL_ ردیف",
        "sInfoEmpty": "نمایش 0 تا 0 از 0 ردیف",
        "sInfoFiltered": "(فیلتر شده از _MAX_ ردیف)",
        "sInfoPostFix": "",
        "sInfoThousands": ",",
        "sLengthMenu": "نمایش _MENU_ ردیف",
        "sLoadingRecords": "در حال بارگزاری...",
        "sProcessing": "در حال پردازش...",
        "sSearch": "جستجو:",
        "sZeroRecords": "رکوردی با این مشخصات پیدا نشد",
        "oPaginate": {
            "sFirst": "برگه‌ی نخست",
            "sLast": "برگه‌ی آخر",
            "sNext": "بعدی",
            "sPrevious": "قبلی"
        },
        "oAria": {
            "sSortAscending": ": فعال سازی نمایش به صورت صعودی",
            "sSortDescending": ": فعال سازی نمایش به صورت نزولی"
        }
    },
    defaultProvinceId: '5f33679997b693f726a10eea',
    defaultCityId: '5f33677e97b693f726a10d9b',
    ObjectId: mongoose.Schema.Types.ObjectId,
    ObjectIdConvertor: mongoose.Types.ObjectId,
};