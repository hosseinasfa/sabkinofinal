const autoBind = require('auto-bind');
const { validationResult } = require('express-validator');
const {
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
} = require("../../model/person")

module.exports = class controller {
    constructor() {
        autoBind(this);
        this.model = { Person , User , Admin , Teacher , Family , EducationalInstitutions , Mentor  , SchoolBoss , Support}
    }

    validationData(req , res) {
        let error = validationResult(req);
        if(! error.isEmpty()) {
                const errors = error.array();
                const messages = [];
    
                errors.forEach(err => messages.push(err.msg));
                
                if(errors) {
                    res.status(422).json({
                        message : errors.map(error =>{
                            return {
                                'field' : error.param,
                                'message' : error.msg
                            }
                        }),
                        success : false
                    });
                    return true;
                }

                // req.flash('errors' , messages)
    
                return true;
            }
    
      }

    escapeAndTrim(req , items) {
        items.split(' ').forEach(item => {
            req.sanitize(item).escape();
            req.sanitize(item).trim();
        })
    }
}