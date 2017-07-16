var version = "v1.0.1"
var sid = "725945cd45"

var apiUrl = 'https://yixing01.applinzi.com/api/'
var youImageHost = 'http://ftrade-1253299728.picsh.myqcloud.com/'
var array = []
array.push('?imageMogr2/')
array.push('thumbnail/300x/')
array.push('format/jpg/')
array.push('interlace/1/')
array.push('quality/50/')
array.push('gravity/center/')
array.push('crop/300x300')
var youImageMode = array.join('')

var youImage = {
  host: youImageHost,
  mode: youImageMode,
}

module.exports.version = version;
module.exports.sid = sid;
module.exports.apiUrl = apiUrl;
module.exports.youImage = youImage;