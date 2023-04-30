var rand = require("random-key");
const OTP = require("../model/otp");
var axios = require('axios');
module.exports = {
    sendSms: (phone) => {
        var code = rand.generateDigits(4);

        console.log('code :::: ',code);
        // var text = `کد شما: ${code}`;
        // var url=`http://sms.parsgreen.ir/UrlService/sendSMS.ashx?from=10002000080000&to=${phone}&text=${encodeURIComponent(text)}&signature=5ACB962A-6756-4E64-9AEF-15A1E3FDA9B1`

        
        // var url=`https://api.kavenegar.com/v1/63706E793050766836466F6A4B6C306149314C3574722F42574A732F4D62486D753655523176632F445A673D/verify/lookup.json?receptor=${phone}&token=${code}&template=sabkinoVerify`
        // axios.get(url)
        // .then(function (response) {})
        // .catch(function (error) {})
        // .finally(function () {});
        OTP.findOneAndUpdate({
            phone,
        }, {
            code,
        }, {
            new: true,
            upsert: true
        }).exec();
    },

    sendSmss: (phone) => {
        var code = rand.generateDigits(4);
        var token = 'محمد';
        var token2 = 'بزرگانی';
        var token3 = 'nfcx5165';
        // var text = `کد شما: ${code}`;
        // var url=`http://sms.parsgreen.ir/UrlService/sendSMS.ashx?from=10002000080000&to=${phone}&text=${encodeURIComponent(text)}&signature=5ACB962A-6756-4E64-9AEF-15A1E3FDA9B1`
        var url=`https://api.kavenegar.com/v1/63706E793050766836466F6A4B6C306149314C3574722F42574A732F4D62486D753655523176632F445A673D/verify/lookup.json?receptor=${phone}&token=${token}&token2=${token2}&token3=${code}&template=registerUser`
        axios.get(url)
        .then(function (response) {})
        .catch(function (error) {})
        .finally(function () {});
    }
}

