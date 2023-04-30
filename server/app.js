require('app-module-path').addPath(__dirname);
require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const basicAuth = require('express-basic-auth')
var mongoose = require("mongoose");
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./api.yaml');
var cors = require('cors');
var app = express();
var session = require('express-session')

app.disable('etag');

// process.env.TZ = 'Asia/Tehran';
app.use(cors())
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true,
  serverSelectionTimeoutMS: 5000,
});
var db = mongoose.connection;
mongoose.plugin(require('mongoose-autopopulate'));

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("DB OK");
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use((req,res,next)=>{
  require('require-all')(__dirname + '/model');
  req.model = {};
  req.modelName="";
  req.data = {};
  next();
})

const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
  secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
  saveUninitialized:true,
  cookie: { maxAge: oneDay,secure : false },
  resave: false,
}));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/api/public/getAllFiles', (req, res) => {
  const testFolder = './public/uploads/files';
        const fs = require('fs');

        fs.readdir(testFolder, (err, files) => {
            const amin = files.map(e => e);
            res.send(amin)
        });
      
});
app.use('/api-doc', basicAuth({
  users: {
    'pouya': '123qwe'
  },
  challenge: true,
  realm: 'Imb4T3st4pp',
}))
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//app.use('/api/model/:model/:modelId/child', require('./routes/apiByChild'));
app.use('/api/auth/phone-code', require('./routes/auth-phone-code'))
app.use('/api/auth/auth-panel', require('./routes/auth-panel'))
app.use('/api/model/:modelName', require('./routes/apiByModel'));
app.use('/api/education/:itemId', require('./routes/educationWordList'));
app.use('/api/importanceOfLessons/:itemId', require('./routes/importanceOfLessons'));
app.use('/api/entranceExam/:itemId', require('./routes/entranceExam'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/reasonList', require('./routes/reasonList'));
app.use('/api/uploadPst', require('./routes/uploadPst'));
app.use('/api/callLog', require('./routes/callLog'));
app.use('/api/mentorAvailableTime', require('./routes/mentorAvailableTime'));
app.use('/api/itemCommentRate', require('./routes/itemCommentRate'));
app.use('/api/itemComment', require('./routes/itemComment'));
app.use('/api/periodMentor', require('./routes/periodMentor'));
app.use('/api/periodMentorMediaComment', require('./routes/periodMentorMediaComment'));
app.use('/api/periodMentorComment', require('./routes/periodMentorComment'));
app.use('/api/periodMentorBookmark', require('./routes/periodMentorBookmark'));
app.use('/api/periodMentorMedia', require('./routes/periodMentorMedia'));
app.use('/api/periodMentorMediaFile', require('./routes/periodMentorMediaFile'));
app.use('/api/periodMentorPriceList', require('./routes/periodMentorPriceList'));
app.use('/api/periodMentorReport', require('./routes/periodMentorReport'));
app.use('/api/uploadPeriodMentorImage', require('./routes/uploadPeriodMentorImage'));
app.use('/api/uploadPeriodMentorVideo', require('./routes/uploadPeriodMentorVideo'));
app.use('/api/uploadPeriodMentorMedia', require('./routes/uploadPeriodMentorMedia'));
app.use('/api/uploadPeriodMentorMediaFile', require('./routes/uploadPeriodMentorMediaFile'));
app.use('/api/postComment', require('./routes/postComment'));

app.use('/api/categories', require('./routes/categories'));
app.use('/api/uploadChatImage', require('./routes/uploadChatImage'));
app.use('/api/uploadChatVideo', require('./routes/uploadChatVideo'));
app.use('/api/uploadChatFile', require('./routes/uploadChatFile'));
app.use('/api/uploadChatVoice', require('./routes/uploadChatVoice'));
app.use('/api/uploadDocument', require('./routes/uploadDocument'));

app.use('/api/payment', require('./routes/payment'));
app.use('/api/post', require('./routes/post'));
app.use('/api/provinces', require('./routes/provinces'));
app.use('/api/mentorPackageList', require('./routes/mentorPackageList'));
app.use('/api/malisonLists', require('./routes/malisonLists'));
app.use('/api/onlineCallMentor', require('./routes/onlineCallMentor'));
app.use('/api/onlineCallPackage', require('./routes/onlineCallPackage'));
app.use('/api/feedbackCall', require('./routes/feedbackCall'));
app.use('/api/feedbackCallUser', require('./routes/feedbackCallUser'));
app.use('/api/formula', require('./routes/formula'));
app.use('/api/userList', require('./routes/userList'));
app.use('/api/chatList', require('./routes/chatList'));
app.use('/api/chatContent', require('./routes/chatContent'));
app.use('/api/ads', require('./routes/ads'));
app.use('/api/notificationHistory', require('./routes/notificationHistory'));
app.use('/api/userNumber', require('./routes/userNumber'));
app.use('/api/percentageHolder', require('./routes/percentageHolder'));
app.use('/api/frequentlyQuestion', require('./routes/frequentlyQuestion'));
app.use('/api/frequentlyQuestionCategories', require('./routes/frequentlyQuestionCategories'));
app.use('/api/examPackage', require('./routes/examPackage'));
app.use('/api/examPayment', require('./routes/examPayment'));
app.use('/api/document', require('./routes/document'));
app.use('/api/workBook', require('./routes/workBook'));
app.use('/api/workBookDetail', require('./routes/workBookDetail'));
app.use('/api/userBookMark', require('./routes/userBookMark'));
app.use('/api/hashtag', require('./routes/hashtag'));
app.use('/api/vipHashtag', require('./routes/vipHashtag'));
app.use('/api/periodMentorHashtag', require('./routes/periodMentorHashtag'));
app.use('/api/shopComment', require('./routes/shopComment'));
app.use('/api/academyComment', require('./routes/academyComment'));
app.use('/api/schoolComment', require('./routes/schoolComment'));
app.use('/api/bookComment', require('./routes/bookComment'));
app.use('/api/crashReporter', require('./routes/crashReporter'));


app.use('/api/banner', require('./routes/banner'));
app.use('/api/package', require('./routes/package'));
app.use('/api/motto', require('./routes/motto'));
app.use('/api/onlineCall', require('./routes/onlineCall'));
app.use('/api/shoppingPrice', require('./routes/shoppingPrice'));
app.use('/api/provinces/:provinceId/cities', require('./routes/cities'));
app.use('/api/walletPackage', require('./routes/walletPackage'));
app.use('/api/walletPayment', require('./routes/walletPayment'));
app.use('/api/callPayment', require('./routes/callPayment'));
app.use('/api/package', require('./routes/package'));
app.use('/api/packageList', require('./routes/packageList'));
app.use('/api/supportfield', require('./routes/supportfield'));
app.use('/api/channel', require('./routes/channel'));
app.use('/api/report', require('./routes/report'));
app.use('/api/publisherseries', require('./routes/publisherseries'));
app.use('/api/publisherseriesbook', require('./routes/publisherseriesbooks'));
app.use('/api/publisherSeriesRate', require('./routes/publisherSeriesRate'));
app.use('/api/educationalFilm', require('./routes/educationalFilm'));
app.use('/api/product', require('./routes/product'));
app.use('/api/productRate', require('./routes/productRate'));
app.use('/api/deming', require('./routes/deming'));
app.use('/api/financial', require('./routes/financial'));
app.use('/api/ambassador', require('./routes/ambassador'));
app.use('/api/setProgramList', require('./routes/setProgramList'));
app.use('/api/setProgramListReport', require('./routes/setProgramListReport'));
app.use('/api/productPayment', require('./routes/productPayment'));
app.use('/api/notification', require('./routes/notification'));
app.use('/api/school', require('./routes/school'));
app.use('/api/academy', require('./routes/academy'));
app.use('/api/importanceOfLessonsComment', require('./routes/importanceOfLessonsComment'));
app.use('/api/fieldComment', require('./routes/fieldComment'));
app.use('/api/postBookmark', require('./routes/postBookmark'));
app.use('/api/userPanel', require('./routes/panelSupport'));
app.use('/api/field', require('./routes/field'));
app.use('/api/publisher', require('./routes/publisher'));



app.use('/api/user', require('./routes/user'));
app.use('/', require('./routes/index'));
app.use('/api/vipUserData', require('./routes/vipUser'));
app.use('/api/vipUserFollow', require('./routes/vipUserFollow'));
app.use('/api/vipPstLike', require('./routes/vipPstLike'));
app.use('/api/vipPstSave', require('./routes/vipPstSave'));
app.use('/api/vipPst', require('./routes/vipPst'));
app.use('/api/vipPstMedia', require('./routes/vipPstMedia'));
app.use('/api/vipPstComment', require('./routes/vipPstComment'));
app.use('/api/vipPstReport', require('./routes/vipPstReport'));
app.use('/api/uploadVipPstMedia', require('./routes/uploadVipPstMedia'));
app.use('/api/setProgramPayment', require('./routes/setProgramPayment'));
app.use('/api/periodMentorRate', require('./routes/periodMentorRate'));
app.use('/api/periodMentorPayment', require('./routes/periodMentorPayment'));
app.use('/api/setProgramExitUser', require('./routes/setProgramExitUser'));
app.use('/api/setting', require('./routes/setting'));
app.use('/api/mentor', require('./routes/mentor'));
app.use('/api/demoTour', require('./routes/demoTour'));

app.use('/api/updateApp', require('./routes/updateApp'));

app.use('/api/register',require('./routes/register'));

//New Api's
app.use('/api/entranceTest', require('./routes/entranceTest'));
app.use('/api/entranceTestFile', require('./routes/entranceTestFile'));



// catch 404 and forward to error handlers
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};



  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
