/**
 * Created by cform on 17/1/10.
 */
const mysql = require('mysql');
const $conf = require('../config.js');
const $util = require('../util/util.js');
const $sql = require('./goodsql.js');
//使用连接池
const pool = mysql.createPool($conf.mysql);

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
    goodAll: (req, res, next) => {
        pool.getConnection((err, conn) => {
            conn.query($sql.goodAll, function (err, result) {
                if (err) {
                    return next(err);
                }
                jsonWrite(res, result);
                conn.release();
            });
        });
    },

    //根据Id查找
    goodById: (req, res, next) => {
        pool.getConnection((err, conn) => {
            const params = req.query;
            conn.query($sql.goodById, params.id, function (err, result) {
                if(err){
                    res.json({
                        code: '0',
                        msg: '查询失败'
                    });
                    return ;
                }
                // jsonWrite(res, result);
                jsonWrite(res, result);
                conn.release();
            });
        });
    },


    //添加商品
    goodAdd: (req, res, next) => {
        pool.getConnection((err, conn) => {
            const params = req.body;
            // 建立连接，向表中插入值
            // 'INSERT INTO user(id, name, age) VALUES(0,?,?)',
            if (err) return next(err);
            conn.query($sql.goodinsert, [params.name, params.desc, params.price, params.sum], function (err, result) {
                if (result) {
                    result = {
                        code: 200,
                        msg: 'add success',
                    }
                }

                jsonWrite(res, result);
                conn.release();
            })
        })
    },

    //删除商品
    goodDelete: (req, res, next) => {
        // delete by Id
        pool.getConnection(function (err, connection) {
            if(err) return next(err);
            const params = req.query;
            connection.query($sql.gooddelete, params.id, function (err, result) {
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
        });
    },

    //修改商品
    goodUpdate: (req, res, next) => {
        // delete by Id
        pool.getConnection(function (err, connection) {
            if(err) return next(err);
            const params = req.body;
            connection.query($sql.goodupdate, [params.name, params.desc, params.price, params.sum, params.id], function (err, result) {
                if (result) {
                    result = {
                        code: 200,
                        msg: '修改成功'
                    };
                }
                jsonWrite(res, result);
                connection.release();
            });
        });
    }
};
