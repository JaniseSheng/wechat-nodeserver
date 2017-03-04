const qs=require('qs');
const TOKEN='access_token';

module.exports = {
    VerificationService: (req, res, next)=>{
        const params = req.query;
        console.log(params);
        const key=[TOKEN,params.timestamp,params.nonce].sort().join('');
        //将token （自己设置的） 、timestamp（时间戳）、nonce（随机数）三个参数进行字典排序
        const sha1=require('crypto').createHash('sha1');
        //将上面三个字符串拼接成一个字符串再进行sha1加密
        sha1.update(key);
        return sha1.digest('hex') == params.signature;
    }
}