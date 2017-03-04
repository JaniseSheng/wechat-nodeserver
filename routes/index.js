const express = require('express');
const router = express.Router();
const multer = require('multer');
const config = require('../config');
//关联主程序
const signature = require('../wechat_manage/signature');



/* GET home page. */
router.get('/', function (req, res, next) {
    signature.VerificationService(req, res, next);

});



module.exports = router;