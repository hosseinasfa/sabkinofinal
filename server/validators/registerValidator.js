const validator = require('./validator');
const { check } = require('express-validator');

class registerValidator extends validator {
    handle() {
       return [ 
        check('class').trim().not().isEmpty().isIn('user').withMessage('نقش شما دانش آموز انتخاب نشده است'),
        check('firstName').trim().not().isEmpty().withMessage('نام وارد نشده است'),
        check('lastName').trim().not().isEmpty().withMessage('نام خانوادگی وارد نشده است'),
        check('age').trim().not().isEmpty().withMessage('سن وارد نشده است').isLength({min: 2 , max: 2}).withMessage('سن فقط 2 رقم مجاز است'),
        check('personalCode').trim().not().isEmpty().withMessage('کد ملی وارد نشده است').isLength({min: 10 , max: 10}).withMessage('کد ملی حتما باید 10 رقم باشد'),
        check('birth').trim().not().isEmpty().withMessage('تاریخ تولد وارد نشده است'),
        check('provinceId').trim().not().isEmpty().withMessage('استان مشخص نشده است'),
        check('cityId').trim().not().isEmpty().withMessage('شهر مشخص نشده است'),
        check('educationalStageId').trim().not().isEmpty().withMessage('پایه  وارد نشده است'),
        check('educationalFieldId').trim().not().isEmpty().withMessage('رشته  وارد نشده است'),
            ]
    }

}

module.exports = new registerValidator();
