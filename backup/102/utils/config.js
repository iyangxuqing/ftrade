module.exports.version = "v1.0.1"
module.exports.sid = "725945cd45"

let apiUrl = 'https://yixing01.applinzi.com/api/'
module.exports.apiUrl = apiUrl;

let youImageHost = 'http://ftrade-1253299728.picsh.myqcloud.com/'
let array = []
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
module.exports.youImage = youImage;

let phrases = {
  'languages': {
    'zh': '中文',
    'en': 'English',
    'ara': ' عربي ',
    'kor': '한국어',
  },
  'networkFail':{
    'zh': '网络不给力，点击屏幕重试',
    'en': 'The network is weak \r\n Please click here to try again',
    'ara': ' الشبكة ضعيفة \r\n اضغط هنا من فضلك حاول مرة أخرى ',
    'kor': '네트워크 약하다 \r\n 부디 다시 한 번 누르십시오 ',
  },

  'productDetail': {
    'zh': '商品详情',
    'en': 'Commodity Details',
    'ara': ' تفاصيل المنتج ',
    'kor': '상품 설명',
  },
  'pricesTitle': {
    'zh': '批发价格',
    'en': 'Wholesale Price',
    'ara': ' سعر الجملة ',
    'kor': '도매 가격',
  },
  'propsTitle': {
    'zh': '商品属性',
    'en': 'Commodity Attribute',
    'ara': ' السلع صفة ',
    'kor': '상품 특성',
  },

  'productList': {
    'zh': '商品列表',
    'en': 'Product List',
    'ara': ' قائمة المنتجات ',
    'kor': '상품 목록',
  },
  'categoryEmpty': {
    'zh': '该类目下没有子类目',
    'en': 'There are no subcategories in this category',
    'ara': ' هذا  التصنيف  لا  تصنيف  فرعي ',
    'kor': '이 类目 다음 없는 사람 类目',
  },
  'productEmpty': {
    'zh': '该类目下没商品',
    'en': 'There is no goods under this category',
    'ara': ' هذا  التصنيف  لا  السلع ',
    'kor': '이 类目 다음 없는 상품',
  },
}

module.exports.phrases = phrases