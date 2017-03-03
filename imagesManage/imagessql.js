/**
 * Created by cform on 17/1/10.
 */
const config = require('../config.js');


const images={
    //增
    imageinsert:`INSERT INTO ${config.table} (id,url,fileName,originalName,text) VALUES(0,?,?,?,?)`,
    //删
    imagedelete: `delete from ${config.table} where id=?`,
    //删所有
    imagedeleteall: `delete from ${config.table} where 1=1`,
    //改
    imageupdate:`UPDATE ${config.table} SET url=?,fileName=?,originalName=?,text=? WHERE id=?`,
    //查所有
    imageAll: `select * from ${config.table}`,
    //查所有
    imageLimt: `SELECT * FROM ${config.table} LIMIT ? OFFSET ?`,
    //根据ID查找
    imageById: `select * from ${config.table} where id=?`
}

module.exports=images;