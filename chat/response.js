const clean = require('obj-clean');
module.exports = {
    ok: (req, res, next) => {
        res.send({
            status: true,
            data: clean(req.data),
            message: ""
        })
    },
    error: (req, res, next, message = "") => {
        res.send({
            status: false,
            data: {},
            message
        })
    }
}