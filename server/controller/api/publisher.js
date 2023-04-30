const Publisher = require("../../model/publisher");
const response = require("../../response");
var config = require('../../config');
const Mentor = require('../../model/person').Mentor;
const Person = require('../../model/person').Person;
var moment = require('moment');
module.exports = {





    
    GET_PUBLISHER : (req,res,next) =>{

        Publisher.find({}).exec((err, docs) => {
            if(docs) {
                req.data.items = docs;
                response.ok(req, res, next);
            } else {
                res.send(err)
            }
        })
    },





};

