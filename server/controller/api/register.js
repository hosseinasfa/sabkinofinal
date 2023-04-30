const response = require('../../response');
const config = require('../../config');

const Person = require("../../model/person").Person;
const School = require('../../model/school');

const SERVER_KEY = process.env.SERVER_KEY;
var moment = require('jalali-moment');


function subscribeTokenToTopic(token, topic) {
    if (typeof token !== 'undefined' && token != null) {
        fetch('https://iid.googleapis.com/iid/v1/' + token + '/rel/topics/' + topic, {
            method: 'POST',
            headers: {
                'Authorization': 'key=' + SERVER_KEY
            }
        }).then(response => {
            if (response.status < 200 || response.status >= 400) {
                throw 'Error subscribing to topic: ' + response.status + ' - ' + response.text();
            }
            console.log('Subscribed to "' + topic + '"');
        }).catch(error => {
            console.error(error);
        })
    }
}


function checkNationalCode(meli_code) {
    return true;
    if (meli_code.length == 10) {
        if (meli_code == '0000000000' ||
            meli_code == '1111111111' ||
            meli_code == '2222222222' ||
            meli_code == '3333333333' ||
            meli_code == '4444444444' ||
            meli_code == '5555555555' ||
            meli_code == '6666666666' ||
            meli_code == '7777777777' ||
            meli_code == '8888888888' ||
            meli_code == '9999999999') {
            return false;
        }
        c = parseInt(meli_code.charAt(9));
        n = parseInt(meli_code.charAt(0)) * 10 +
            parseInt(meli_code.charAt(1)) * 9 +
            parseInt(meli_code.charAt(2)) * 8 +
            parseInt(meli_code.charAt(3)) * 7 +
            parseInt(meli_code.charAt(4)) * 6 +
            parseInt(meli_code.charAt(5)) * 5 +
            parseInt(meli_code.charAt(6)) * 4 +
            parseInt(meli_code.charAt(7)) * 3 +
            parseInt(meli_code.charAt(8)) * 2;
        r = n - parseInt(n / 11) * 11;
        if ((r == 0 && r == c) || (r == 1 && c == 1) || (r > 1 && c == 11 - r)) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}


module.exports =
{
    PUT_PRRSON_USER: (req, res, next) => {

        const
            {
                firstName,lastName,personalCode,birth,familyPhone,
            provinceId,cityId,schoolId,educationalStageId,educationalFieldId
        } = req.body;


        Person.findOne({ 'personalCode': personalCode }).exec((errPersonal, docPersonal) => {
            console.log(errPersonal,docPersonal);
            //if (errPersonal)
           // {
          //      res.send(404,{status:false,message:errPersonal});
         //   }
         //   if (docPersonal || docPersonal === undefined) {
         //       res.send(404,{status:false,message:'کد ملی وارد شده متعلق به شخص دیگری است'});
         //   }
            res.render('Mohsen',{status:false,message:'کد ملی وارد شده متعلق به شخص دیگری است'})
        })
        next()
    }


}


