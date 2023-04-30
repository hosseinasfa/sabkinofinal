const response = require("../../response");
require('dotenv').config()
module.exports={
    POST_FILE:(req,res,next)=>{
        if (req.file) {
            req.file.url=`${process.env.BASE_URL}/uploads/chat_content/chat_file/${req.file.filename}`;
            req.data.file=req.file;
            response.ok(req, res, next);
        } else {
            response.error(req, res, next);
        }
    },
}