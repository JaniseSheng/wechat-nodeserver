const express = require('express');
const router = express.Router();
const multer = require('multer');
const config = require('../config');
const path = require('path');
const imageTranslate = require('../lib/imageTranslate.js');
//关联主程序
const imageslist = require('../imagesManage/imageslist.js');


//图片上传配置
const upload = multer({
    dest: path.join(config.rootPath, 'public/', 'uploads/'),
    fileFilter: (req, file, cb) => {
        const mimetype = file.mimetype;
        if (mimetype.indexOf('image') > -1) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
});

/* GET home page. */
router.get('/', function (req, res, next) {

    console.log(req);

});

//查图片服务
router.get('/imageAll', function (req, res, next) {
    imageslist.imageAll(req, res, next);
});
//查图片服务
router.get('/iamgeLimt', function (req, res, next) {
    imageslist.iamgeLimt(req, res, next);
});
//查Id
router.get('/imageById', function (req, res, next) {
    imageslist.imageById(req, res, next);
});
//增加
router.post('/imageAdd', function (req, res, next) {
    imageslist.imageAdd(req, res, next);
});
//删除
router.get('/imageDelete', function (req, res, next) {
    imageslist.imageDeleteById(req, res, next);
});
//删除全部
router.get('/imageDeleteAll', function (req, res, next) {
    imageslist.imageDeleteAll(req, res, next);
});
//修改
router.post('/imageUpdate', upload.single('picture'), function (req, res, next) {
    imageslist.imageUpdate(req, res, next);
});

//删除全部
router.post('/wechatTest', function (req, res, next) {
    imageslist.wechatAddImage(req, res, next);
});


module.exports = router;