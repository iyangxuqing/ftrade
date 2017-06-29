var debug = true;
var versionNumber = "1.0";
var version = "weApp/" + versionNumber;
var sid = "725945cd45";

var apiUrl = 'https://yixing01.applinzi.com/api/';
var imagesUrl = 'http://yixing01-images.stor.sinaapp.com/';
var uploadDir = 'upload/ftrade/' + sid + '/';

var youImageHost = 'http://ftrade-1253299728.picsh.myqcloud.com/';
var array = []
array.push('?imageMogr2/')
array.push('thumbnail/300x/')
array.push('format/jpg/')
array.push('interlace/1/')
array.push('quality/50/')
array.push('gravity/center/')
array.push('crop/300x300')
var youImageMode_w300 = array.join('')
var youImageMode_w300_a = '/w300'

var youImage = {
  host: youImageHost,
  mode_w300: youImageMode_w300,
  mode_w300_a: youImageMode_w300_a,
}

module.exports.debug = debug;
module.exports.versionNumber = versionNumber;
module.exports.version = version;
module.exports.sid = sid;
module.exports.apiUrl = apiUrl;
module.exports.imagesUrl = imagesUrl;
module.exports.uploadDir = uploadDir;
module.exports.youImage = youImage;