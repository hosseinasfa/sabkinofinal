const { check, validationResult , body   } = require('express-validator');

exports.userValidator = [
    
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
];

exports.familyValidator = [
    
    check('class').trim().not().isEmpty().isIn('family').withMessage('نقش شما خانواده انتخاب نشده است'),
    check('firstName').trim().not().isEmpty().withMessage('نام وارد نشده است'),
    check('lastName').trim().not().isEmpty().withMessage('نام خانوادگی وارد نشده است'),
    check('personalCode').trim().not().isEmpty().withMessage('کد ملی وارد نشده است').isLength({min: 10 , max: 10}).withMessage('کد ملی حتما باید 10 رقم باشد'),
    check('provinceId').trim().not().isEmpty().withMessage('استان مشخص نشده است'),
    check('cityId').trim().not().isEmpty().withMessage('شهر مشخص نشده است'),
    check('educationalStageId').trim().not().isEmpty().withMessage('پایه فرزند وارد نشده است'),
    check('educationalFieldId').trim().not().isEmpty().withMessage('رشته فرزند وارد نشده است'),
    check('isChildRegister').trim().not().isEmpty().withMessage('ثبت نام فرزند در اپلیکیشن مشخص نشده است'),
    check('type').trim().not().isEmpty().withMessage('نسبت با دانش آموز مشخص نشده است'),

];

exports.mentorValidator = [
    
    check('class').trim().not().isEmpty().isIn('mentor').withMessage('نقش شما مشاور انتخاب نشده است'),
    check('firstName').trim().not().isEmpty().withMessage('نام وارد نشده است'),
    check('lastName').trim().not().isEmpty().withMessage('نام خانوادگی وارد نشده است'),
    check('age').trim().not().isEmpty().withMessage('سن وارد نشده است').isLength({min: 2 , max: 2}).withMessage('سن فقط 2 رقم مجاز است'),
    check('birth').trim().not().isEmpty().withMessage('تاریخ تولد وارد نشده است'),
    check('personalCode').trim().not().isEmpty().withMessage('کد ملی وارد نشده است').isLength({min: 10 , max: 10}).withMessage('کد ملی حتما باید 10 رقم باشد'),
    check('provinceId').trim().not().isEmpty().withMessage('استان مشخص نشده است'),
    check('cityId').trim().not().isEmpty().withMessage('شهر مشخص نشده است'),
    check('lastDegree').trim().not().isEmpty().withMessage('آخرین مدرک تحصیلی مشخص نشده است'),
    check('workCv').trim().not().isEmpty().withMessage('سابقه کار مشخص نشده است').isLength({min: 1 , max: 2}).withMessage('سابقه کار حتما باید  1 یا 2 رقم باشد'),
];


exports.teacherValidator = [
    
    check('class').trim().not().isEmpty().isIn('teacher').withMessage('نقش شما معلم انتخاب نشده است'),
    check('firstName').trim().not().isEmpty().withMessage('نام وارد نشده است'),
    check('lastName').trim().not().isEmpty().withMessage('نام خانوادگی وارد نشده است'),
    check('age').trim().not().isEmpty().withMessage('سن وارد نشده است').isLength({min: 2 , max: 2}).withMessage('سن فقط 2 رقم مجاز است'),
    check('birth').trim().not().isEmpty().withMessage('تاریخ تولد وارد نشده است'),
    check('personalCode').trim().not().isEmpty().withMessage('کد ملی وارد نشده است').isLength({min: 10 , max: 10}).withMessage('کد ملی حتما باید 10 رقم باشد'),
    check('provinceId').trim().not().isEmpty().withMessage('استان مشخص نشده است'),
    check('cityId').trim().not().isEmpty().withMessage('شهر مشخص نشده است'),
    check('lastDegree').trim().not().isEmpty().withMessage('آخرین مدرک تحصیلی مشخص نشده است'),
    check('uniEducationField').trim().not().isEmpty().withMessage('رشته تحصیلی مشخص نشده است'),
    check('teachingHistory').trim().not().isEmpty().withMessage('سابقه تدریس مشخص نشده است').isLength({min: 1 , max: 2}).withMessage('سابقه تدریس حتما باید  1 یا 2 رقم باشد'),
    check('teachingField').trim().not().isEmpty().withMessage('زمینه تدریس مشخص نشده است'),

];

exports.schoolBossValidator = [
    
    check('class').trim().not().isEmpty().isIn('schoolBoss').withMessage('نقش شما مدرسه انتخاب نشده است'),
    check('companyName').trim().not().isEmpty().withMessage('نام مدرسه وارد نشده است'),
    check('type').trim().not().isEmpty().withMessage('نوع مدرسه مشخص نشده است'),
    check('managerName').trim().not().isEmpty().withMessage('نام مدیر مدرسه وارد نشده است'),
    check('personalCode').trim().not().isEmpty().withMessage('کد ملی مدیر مدرسه وارد نشده است').isLength({min: 10 , max: 10}).withMessage('کد ملی حتما باید 10 رقم باشد'),
    check('establishmentNumber').trim().not().isEmpty().withMessage('شناسه مدرسه وارد نشده است').isLength({min: 10 , max: 10}).withMessage('شناسه مدرسه حتما باید 10 رقم باشد'),
    check('establishmentYear').trim().not().isEmpty().withMessage('سال تاسیس مدرسه وارد نشده است').isLength({min: 4 , max: 4}).withMessage('سال تاسیس مدرسه حتما باید 4 رقم باشد'),
    check('provinceId').trim().not().isEmpty().withMessage('استان مشخص نشده است'),
    check('cityId').trim().not().isEmpty().withMessage('شهر مشخص نشده است'),
    check('address').trim().not().isEmpty().withMessage('آدرس مدرسه وارد نشده است'),
    check('fixedPhone').trim().not().isEmpty().withMessage('تلفن تماس مدرسه وارد نشده است').isLength({min: 11 , max: 11}).withMessage('تلفن تماس مدرسه حتما باید 11 رقم باشد'),

];

exports.educationalInstitutionValidator = [
    
    check('class').trim().not().isEmpty().isIn('educationalInstitutions').withMessage('نقش شما آموزشگاه انتخاب نشده است'),
    check('companyName').trim().not().isEmpty().withMessage('نام آموزشگاه وارد نشده است'),
    check('type').trim().not().isEmpty().withMessage('نوع آموزشگاه مشخص نشده است'),
    check('managerName').trim().not().isEmpty().withMessage('نام موسس آموزشگاه وارد نشده است'),
    check('personalCode').trim().not().isEmpty().withMessage('کد ملی موسس آموزشگاه وارد نشده است').isLength({min: 10 , max: 10}).withMessage('کد ملی حتما باید 10 رقم باشد'),
    check('establishmentNumber').trim().not().isEmpty().withMessage('شماره ثبت آموزشگاه وارد نشده است').isLength({min: 8 , max: 8}).withMessage('شماره ثبت آموزشگاه حتما باید 8 رقم باشد'),
    check('establishmentYear').trim().not().isEmpty().withMessage('سال تاسیس آموزشگاه وارد نشده است').isLength({min: 4 , max: 4}).withMessage('سال تاسیس آموزشگاه حتما باید 4 رقم باشد'),
    check('provinceId').trim().not().isEmpty().withMessage('استان مشخص نشده است'),
    check('cityId').trim().not().isEmpty().withMessage('شهر مشخص نشده است'),
    check('address').trim().not().isEmpty().withMessage('آدرس آموزشگاه وارد نشده است'),
    check('fixedPhone').trim().not().isEmpty().withMessage('تلفن تماس آموزشگاه وارد نشده است').isLength({min: 11 , max: 11}).withMessage('تلفن تماس آموزشگاه حتما باید 11 رقم باشد'),

];

exports.supportValidator = [
    
    check('class').trim().not().isEmpty().isIn('support').withMessage('نقش شما پشتیبان انتخاب نشده است'),
    check('supportMentorId').trim().not().isEmpty().withMessage('آیدی مشاور/معلم وارد نشده است'),
    check('identifierSupportCode').trim().not().isEmpty().withMessage('کد پشتیبان مشاور/معلم وارد نشده است').isLength({min: 5 , max: 5}).withMessage('کد پشتیبان مشاور/معلم حتما باید 5 رقم باشد'),

];




exports.validate = (req,res,next) => {  
    const error = validationResult(req).array();
    if(error.length > 0){
        return res.json({error : error[0].msg})
    }

    next();
};