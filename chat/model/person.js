require('dotenv').config()

var mongoose = require("mongoose");
const config = require("../config");
var rand = require("random-key");
require('mongoose-schema-jsonschema')(mongoose);
var personSchema = new mongoose.Schema({

    referalCode: {
        type: String,
        unique: true,
        default: () => {
            return `${rand.generateDigits(5)}`
        }
    },


    isConfirmed: {
        type: Boolean,
    },
    
    identifierCode: {
        type: String,
        default: "",
    },
   
    fcmToken: {
        type: String
    },
    
    follower: {
        type: Number,
        default: 0,
    },
    
    following: {
        type: Number,
        default: 0,
    },
    rate: {
        type: Number,
        default: 0,
    },
    posts: {
        type: Number,
        default: 0,
    },
    
    expirePackageDate: {
        type: Date,
        default:Date.now(),
    },
    expireExamPackageDate: {
        type: Date,
        default:Date.now(),
    },
    
    isExit: {
        type: Boolean,
        default: false
    },
    
    isSkip: {
        type: Boolean,
        default: false
    },

    phone: {
        type: String,
        validate: {
            validator: function (v) {
                return /09\d{9}/.test(v);
            },
            message: (props) => `${props.value} is not a valid phone number!`,
        },
        required: [true, "شماره تماس نیاز است"],
        unique: true,
    },
    enName: {
        type: String,
        unique: true,
        minlength: 5,
        validate: {
            validator: function (v) {
                return /^[a-zA-Z0-9]+$/.test(v);
            },
            message: (props) => `enName like this Bmw121 or 22bbss`,
        },
    },
    password: {
        type: String,
        minlength: 6,
        bcrypt: true,
    },

    isPackage : {
            type: Boolean,
            default: false
    },

    info: {
        type: String,
        default: ""
    },
    notificationKey: {
        type: String,
        default: ""
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isDelete: {
        type: Boolean,
        default: false
    },
    
    isChannel: {
        type: Boolean,
        default: false,
    },
    walletBalance: {
        type: Number,
        default: 0,
    },
    isWalletActive: {
        type: Boolean,
        default: true,
    },
    isAll: {
        type: Boolean,
        default: false,
    },
    isChatNotification: {
        type: Boolean,
        default: false,
    },

    isPublicNotification: {
        type: Boolean,
        default: false,
    },

    isChannelNotification: {
        type: Boolean,
        default: false,
    },

    isAlarmNotification: {
        type: Boolean,
        default: false,
    },

    sheba: String,
    bankName : String,
}, {
    ...config.mongooseOptions,
    ...{
        discriminatorKey: 'class',
    }
});

personSchema.plugin(require("mongoose-bcrypt"));
var Person = mongoose.model("person", personSchema);

var userSchema = new mongoose.Schema({
    personalCode: {
        type: String,
        unique: true,
        required: [true, 'User personalCode required']
    },
    birth: {
        type: String,
        required: [true, 'User birth required']
    },
    age: {
        type: String,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: [true, 'User lastName required']
    },
    provinceId: {
        type: config.ObjectId,
        ref: "province",
        autopopulate: true,
        required: [true, 'User provinceId required']
    },
    cityId: {
        type: config.ObjectId,
        ref: "city",
        autopopulate: true,
        required: [true, 'User cityId required']
    },
    educationalStageId: {
        type: config.ObjectId,
        ref: "educationalStage",
        autopopulate: true,
        required: [true, 'User educationalStageId required']
    },
    educationalFieldId: {
        type: config.ObjectId,
        ref: "educationalField",
        autopopulate: true,
        required: [true, 'User educationalFieldId required']
    },
    avatar: {
        type: String,
        default: "defaultUser.jpg",
        get: (v) => {
            return `${process.env.BASE_URL}${process.env.UPLOAD_URL}/files/${v}`;
        }
    },
    schoolId: {
        type: config.ObjectId,
        ref: "school",
        autopopulate: true,
    },
    trialTest: String,
    trialTestLevel: String,
    schoolType: String,
    extracurricularClasses: String,
    avgStudyInHolyday: String,
    avgStudyInSchool: String,
    avgLastYear: String,
    expertLesson: String,
    weakLesson: String,
    favoriteLesson: String,
    hateLesson: String,
    mbti: String,
    isConfirmed: {
        type: Boolean,
        default: true,
    },
    
    channelId: {
        type: config.ObjectId,
        ref: "channel",
        autopopulate: true,

    },

    hasMentor: {
        type: config.ObjectId,
        ref: "person",
        autopopulate: true,

    },

    
    
}, {
    ...config.mongooseOptions,
    ...{
        discriminatorKey: 'class',
    }
})
var User = Person.discriminator('user', userSchema);

// var vendorSchema = new mongoose.Schema({
//     provinceId: {
//         type: config.ObjectId,
//         ref: "province",
//         autopopulate: true
//     },
//     cityId: {
//         type: config.ObjectId,
//         ref: "city",
//         autopopulate: true
//     },
//     rate: {
//         type: Number,
//         default: 0,
//     },
// }, {
//     ...config.mongooseOptions,
//     ...{
//         discriminatorKey: 'class',
//     }
// })

// var Vendor = Person.discriminator('vendor', vendorSchema);


var mentorSchema = new mongoose.Schema({
    personalCode: {
        type: String,
        unique: true,
        required: [true, 'mentor personalCode required']
    },
    birth: {
        type: String,
        required: [true, 'mentor birth required']
    },
    age: {
        type: String,
        required: [true, 'mentor age required']
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: [true, 'mentor lastName required']
    },
    provinceId: {
        type: config.ObjectId,
        ref: "province",
        autopopulate: true,
        required: [true, 'mentor provinceId required']
    },
    cityId: {
        type: config.ObjectId,
        ref: "city",
        autopopulate: true,
        required: [true, 'mentor cityId required']
    },

    channelId: {
        type: config.ObjectId,
        ref: "channel",
        autopopulate: true,
    },
    
    lastDegree: {
        type: String,
        required: [true, 'mentor lastDegree required']
    },

    workCv: {
        type: String,
        required: [true, 'mentor workCv required']
    },

    avatar: {
        type: String,
        default: "defaultUser.jpg",
        get: (v) => {
            return `${process.env.BASE_URL}${process.env.UPLOAD_URL}/files/${v}`;
        }
    },

    isConfirmed: {
        type: Boolean,
        default: false,
    },
    
   
    onlineCallScore: {
        type: Number,
        default: 0
    },

    onlineEducateScore: {
        type: Number,
        default: 0
    },

    isSetProgramAccess: {
        type: Boolean,
        default: true
    },

    lastPostPublished: {
        type: Date,
        default:Date.now(),
    },
   
    uniEducationField: String,
    uniName: String,
    uniAddress: String,

    workHistory: String,
    workHour: String,
    bankName: String,

    todayPostCount: {
        type: Number,
        default: 0,
    },

    supportCode: {
        type: String,
        unique: true,
        default: () => {
            return `${rand.generate(5)}`
        }
    },
    
    isSupport: {
        type: Boolean,
        default: false
    },
    
   
}, {
    ...config.mongooseOptions,
    ...{
        discriminatorKey: 'class',
    }
})

var Mentor = Person.discriminator('mentor', mentorSchema);

var educationalInstitutionsSchema = new mongoose.Schema({

    personalCode: {
        type: String,
        required: [true, 'educationalInstitution personalCode required']
    },
    // address: {
    //     type: String,
    //     required: [true, 'educationalInstitution address required']
    // },
    // companyName: {
    //     type: String,
    //     required: [true, 'educationalInstitution companyName required']
    // },

    // establishmentNumber: {
    //     type: String,
    //     required: [true, 'educationalInstitution establishmentNumber required']
    // },
    // fixedPhone: {
    //     type: String,
    //     required: [true, 'educationalInstitution fixedPhone required']
    // },
    cityId: {
        type: config.ObjectId,
        ref: "city",
        autopopulate: true,
        required: [true, 'educationalInstitution cityId required']
    },
    // type: {
    //     type: String,
    //     enum: ['online', 'physical'],
    //     required: [true, 'educationalInstitution type required']
    // },
    managerName: {
        type: String,
        required: [true, 'educationalInstitution managerName required']
    },
    
   
    // establishmentYear: {
    //     type: String,
    //     required: [true, 'educationalInstitution establishmentYear required']
    // },
   
    provinceId: {
        type: config.ObjectId,
        ref: "province",
        autopopulate: true,
        required: [true, 'educationalInstitution provinceId required']
    },
    

    isConfirmed: {
        type: Boolean,
        default: false,
    },
    
    avatar: {
        type: String,
        default: "defaultUser.jpg",
        get: (v) => {
            return `${process.env.BASE_URL}${process.env.UPLOAD_URL}/files/${v}`;
        }
    },
    cover: {
        type: String,
        default: "defaultUser.jpg",
        get: (v) => {
            return `${process.env.BASE_URL}${process.env.UPLOAD_URL}/files/${v}`;
        }
    },

    
    hasAcademy : {
        type: Boolean,
        default: false,
    },

   

}, {
    ...config.mongooseOptions,
    ...{
        discriminatorKey: 'class',
    }
})
var EducationalInstitutions = Person.discriminator('educationalInstitutions', educationalInstitutionsSchema);

var schoolBossSchema = new mongoose.Schema({
    
   
    managerName: {
        type: String,
        required: [true, 'schoolBoss managerName required']
    },
    personalCode: {
        type: String,
        required: [true, 'schoolBoss personalCode required']
    },
   
    provinceId: {
        type: config.ObjectId,
        ref: "province",
        autopopulate: true,
        required: [true, 'schoolBoss provinceId required']
    },
    cityId: {
        type: config.ObjectId,
        ref: "city",
        autopopulate: true,
        required: [true, 'schoolBoss cityId required']
    },

    

    isConfirmed: {
        type: Boolean,
        default: false,
    },

    avatar: {
        type: String,
        default: "defaultUser.jpg",
        get: (v) => {
            return `${process.env.BASE_URL}${process.env.UPLOAD_URL}/files/${v}`;
        }
    },
    cover: {
        type: String,
        default: "defaultUser.jpg",
        get: (v) => {
            return `${process.env.BASE_URL}${process.env.UPLOAD_URL}/files/${v}`;
        }
    },

    hasSchool : {
        type: Boolean,
        default: false,
    },

    
   
}, {
    ...config.mongooseOptions,
    ...{
        discriminatorKey: 'class',
    }
})
var SchoolBoss = Person.discriminator('schoolBoss', schoolBossSchema);

var familySchema = new mongoose.Schema({

    personalCode: {
        type: String,
        unique: true,
        required: [true, 'family personalCode required']
    },

    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: [true, 'family lastName required']
    },

    type: {
        type: String,
        enum: ['mother', 'father'],
        required: [true, 'family type required']
    },
    provinceId: {
        type: config.ObjectId,
        ref: "province",
        autopopulate: true,
        required: [true, 'family provinceId required']
    },
    cityId: {
        type: config.ObjectId,
        ref: "city",
        autopopulate: true,
        required: [true, 'family cityId required']
    },
    
    educationalFieldId: {
        type: config.ObjectId,
        ref: "educationalField",
        autopopulate: true,
        required: [true, 'family educationalFieldId required']
    },
    
    educationalStageId: {
        type: config.ObjectId,
        ref: "educationalStage",
        autopopulate: true,
        required: [true, 'family educationalStageId required']
    },

    isChildRegister: {
        type: Boolean,
        required: [true, 'family type required']
    },
   
    childSchool: {
        type: config.ObjectId,
        ref: "school",
        autopopulate: true
    },

    avatar: {
        type: String,
        default: "defaultUser.jpg",
        get: (v) => {
            return `${process.env.BASE_URL}${process.env.UPLOAD_URL}/files/${v}`;
        }
    },

    isConfirmed: {
        type: Boolean,
        default: true,
    },

    
    
}, {
    ...config.mongooseOptions,
    ...{
        discriminatorKey: 'class',
    }
})
var Family = Person.discriminator('family', familySchema);

var teacherSchema = new mongoose.Schema({

    personalCode: {
        type: String,
        unique: true,
        required: [true, 'teacher personalCode required']
    },

    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: [true, 'teacher lastName required']
    },

    birth: {
        type: String,
        required: [true, 'teacher birth required']
    },
    age: {
        type: String,
        required: [true, 'teacher age required']
    },

    provinceId: {
        type: config.ObjectId,
        ref: "province",
        autopopulate: true,
        required: [true, 'teacher provinceId required']
    },
    cityId: {
        type: config.ObjectId,
        ref: "city",
        autopopulate: true,
        required: [true, 'teacher cityId required']
    },
  
    uniEducationField: {
        type: String,
        required: [true, 'lastDegree age required']
    },

    lastDegree: {
        type: String,
        required: [true, 'lastDegree age required']
    },
    
    teachingHistory: {
        type: String,
        required: [true, 'teachingHistory age required']
    },

    teachingField: {
        type: String,
        required: [true, 'teachingField age required']
    },
    
   
    isConfirmed: {
        type: Boolean,
        default: false,
    },
    
    follower: {
        type: Number,
        default: 0,
    },
    following: {
        type: Number,
        default: 0,
    },

    posts: {
        type: Number,
        default: 0,
    },
    onlineCallScore: {
        type: Number,
        default: 0
    },
    onlineEducateScore: {
        type: Number,
        default: 0
    },

    lastPostPublished: {
        type: Date,
        default:Date.now(),
    },

    avatar: {
        type: String,
        default: "defaultUser.jpg",
        get: (v) => {
            return `${process.env.BASE_URL}${process.env.UPLOAD_URL}/files/${v}`;
        }
    },
    cv: String,
    workLocations: String,
    
    supportCode: {
        type: String,
        unique: true,
        default: () => {
            return `${rand.generate(5)}`
        }
    },

    todayPostCount: {
        type: Number,
        default: 0,
    },
    
    isSupport: {
        type: Boolean,
        default: false
    },

    

}, {
    ...config.mongooseOptions,
    ...{
        discriminatorKey: 'class',
    }
})
var Teacher = Person.discriminator('teacher', teacherSchema);

// ---------start support ----------------------


var supportSchema = new mongoose.Schema({

    supportMentorId: {
        type: config.ObjectId,
        ref: "person",
        required: [true, 'support supportMentorId required']
    },
    mode: {
        type: String,
        enum: ['pending', 'accept', 'reject','deport','deportPending'],
        default: 'pending',
        required: [true, 'support mode required']
    },
    identifierSupportCode: {
        type: String,
        required: [true, 'support identifierSupportCode required']
    },
    
    pendingTime: {
        type: Date,
    },

}, {
    ...config.mongooseOptions,
    ...{
        discriminatorKey: 'class',
    }
})
var Support = Person.discriminator('support', supportSchema);

// -------- end support ---------------------

var adminSchema = new mongoose.Schema({
    access: [String],
    personalCode: String,
    accessType: {
        type: String,
        enum: ['administrator', 'readOnly']
    }
}, {
    ...config.mongooseOptions,
    ...{
        discriminatorKey: 'class',
    }
})
var Admin = Person.discriminator('admin', adminSchema);

module.exports = {
    Person,
    User,
    Admin,
    // Vendor,
    Teacher,
    Family,
    EducationalInstitutions,
    Mentor,
    SchoolBoss,
    Support,
};