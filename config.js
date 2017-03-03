const path = require('path');

module.exports = {
    //根目录
    rootPath: path.join(__dirname, '/'),
    //图片上传路径
    uploadDir: path.join(__dirname, '/', 'public/uploads/'),
    //压缩文件路径
    imageminDir: path.join(__dirname, '/', 'public/imagemin/'),
    //server Ip
    serverIp: 'janisesheng.vicp.cc',
    port:'80',
    //sql - server地址
    table:'images',
    mysql: {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'wechat',
        port: 3306,
    },
};