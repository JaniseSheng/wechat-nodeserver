/**
 * Created by cform on 17/1/10.
 */
const mysql = require('mysql');
const config = require('../config.js');
const $sql = require('./imagessql.js');
const path = require('path');
const fs = require('fs');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');

//使用连接池
const pool = mysql.createPool(config.mysql);

// 向前台返回JSON方法的简单封装
const jsonWrite = function (res, ret) {
    if (typeof ret === 'undefined') {
        res.json({
            code: '1',
            msg: '操作失败'
        });
    } else {
        res.json(ret);
    }
};

module.exports = {
    //查找所有
    imageAll: (req, res, next) => {
        pool.getConnection((err, connection) => {
            connection.query($sql.imageAll, function (err, result) {
                // jsonWrite(res, result);
                if (err) {
                    return next(err);
                }
                jsonWrite(res, result);
                connection.release();
            });
        });
    },

    //查找最新的图片张数
    iamgeLimt: (req, res, next) => {
        pool.getConnection((err, connection) => {
            const params = req.query;
            console.log($sql.imageLimt);
            connection.query($sql.imageLimt, [+params.limit, +params.offset], function (err, result) {
                if (err) {
                    res.json({
                        code: '0',
                        msg: '查询失败'
                    });
                    return;
                }
                jsonWrite(res,result);
                connection.release();
            });
        });
    },

    //根据Id查找
    imageById: (req, res, next) => {
        pool.getConnection((err, connection) => {
            const params = req.query;
            connection.query($sql.imageById, params.id, function (err, result) {
                if (err) {
                    res.json({
                        code: '0',
                        msg: '查询失败'
                    });
                    return;
                }
                // jsonWrite(res, result);
                jsonWrite(res, result);
                connection.release();
            });
        });
    },


    //添加商品
    imageAdd: (req, res, next) => {
        pool.getConnection((err, connection) => {
            console.log(req);
            const params = req.body;
            // 建立连接，向表中插入值
            // 'INSERT INTO user(id, name, age) VALUES(0,?,?)',
            if (err) return next(err);
            const url = req.file ? `http://${config.serverIp}:${config.port}/uploads/${req.file.filename}` : '';
            const originalName = req.file ? req.file.originalname : '';
            const fileName = req.file ? req.file.filename : '';
            connection.query($sql.imageinsert, [url, fileName, originalName, params.text], function (err, result) {
                if (result) {
                    result = {
                        url: url,
                        text: params.text,
                        success: true,
                        code: 200,
                        msg: 'add success',
                    }
                }
                jsonWrite(res, result);
                connection.release();
            })
        })
    },

    //删除商品
    imageDeleteById: (req, res, next) => {
        // delete by Id
        pool.getConnection(function (err, connection) {
            if (err) return next(err);
            const params = req.query;

            connection.query($sql.imageById, params.id, function (err, result) {
                if (err) {
                    res.json({
                        code: '0',
                        msg: '查询失败'
                    });
                    return;
                } else {
                    fs.exists(path.join(config.uploadDir, result[0].fileName), function(exists) {
                        if (exists) {
                            result[0].fileName && fs.unlink(path.join(config.uploadDir, result[0].fileName), (err) => {
                                if (err) throw err;
                                console.log(`successfully deleted ${result.fileName}`);
                            });
                        } else {
                           console.log(`not found file ** ${result[0].fileName} **`)
                        }
                    });

                    connection.query($sql.imagedelete, params.id, function (err, result) {
                        if (result.affectedRows > 0) {
                            result = {
                                code: 200,
                                msg: '删除成功'
                            };
                        } else {
                            result = void 0;
                        }
                        jsonWrite(res, result);
                        connection.release();
                    });
                }
            });

        });
    },

    //删除所有商品
    imageDeleteAll: (req, res, next) => {
        // delete All
        pool.getConnection(function (err, connection) {
            if (err) return next(err);
            const params = req.query;
            if (params.id != -1) {
                jsonWrite(res, {
                    status: false,
                    msg: '参数有误。'
                });
                return;
            }
            connection.query($sql.imageAll, function (err, result) {
                if (err) {
                    jsonWrite(res, {
                        status: false,
                        msg: '删除失败'
                    });
                    return next(err);
                } else {
                    const imgPath = config.uploadDir;
                    fs.readdirSync(imgPath).forEach(function(file,index){
                        fs.unlinkSync(imgPath + file);
                    });

                    result.forEach((item) => {
                        connection.query($sql.imagedelete, item.id);
                    });
                    jsonWrite(res, {
                        status: true,
                        code: 200,
                        msg: '全部删除成功'
                    });
                    connection.release();
                }
            });

        });
    },

    //修改商品
    imageUpdate: (req, res, next) => {
        // delete by Id
        pool.getConnection(function (err, connection) {
            if (err) return next(err);
            const params = req.body;
            connection.query($sql.imageById, params.id, function (err, result) {
                if (err) {
                    res.json({
                        code: '0',
                        msg: '查询失败'
                    });
                } else {
                    req.file && fs.unlink(path.join(config.uploadDir, result[0].fileName));
                    const url = req.file ? `http://${config.serverIp}:${config.port}/uploads/${req.file.filename}` : result[0].url;
                    const fileName = req.file ? req.file.filename : result[0].fileName;
                    const originalName = req.file ? req.file.originalname : result[0].originalName;
                    const text = params.text ? params.text : result[0].text;
                    connection.query($sql.imageupdate, [url, fileName, originalName, text, params.id], function (err, result) {
                        if (err) {
                            res.json({
                                code: '0',
                                msg: '修改失败'
                            });
                        }
                        jsonWrite(res, {
                            url: url,
                            text: params.text,
                            success: true,
                            msg: '修改成功'
                        });
                    });
                }
                connection.release();
            });
        });
    },


    wechatAddImage: (req, res, next) => {
        pool.getConnection((err, connection) => {
            console.log(req);
        });
    },

};
