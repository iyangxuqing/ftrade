/**
 * 更新了缓存处理机制 2017.07.28
 */
module.exports.version = "v1.0.2"

module.exports.sid = "725945cd45"
module.exports.apiUrl = 'https://yixing01.applinzi.com/api/'
module.exports.youImage = {
  host: 'http://ftrade-1253299728.picsh.myqcloud.com/',
  mode: '?imageMogr2/thumbnail/300x/format/jpg/interlace/1/quality/50/gravity/center/crop/300x300',
}

let phrases = {
  'languages': {
    'zh': '中文',
    'en': 'English',
    'ara': ' عربي ',
    // 'kor': '한국어',
  },
  'networkFail':{
    'zh': '网络不给力，点击屏幕重试',
    'en': 'The network is weak \r\n Please click here to try again',
    'ara': ' الشبكة ضعيفة \r\n اضغط هنا من فضلك حاول مرة أخرى ',
    'kor': '네트워크 약하다 \r\n 부디 다시 한 번 누르십시오 ',
  },
  'myFavorite': {
    'zh': '我的收藏',
    'en': 'My Collection',
    'ara': ' المفضلة ',
    'kor': '내 모음집',
  },
  'myFavoriteEmpty': {
    'zh': '您还没有收藏任何商品',
    'en': "You haven't collected any merchandise yet",
    'ara': ' لم يكن لديك  جمع  أي سلعة ',
    'kor': '당신은 어떤 상품을 아직 모음집',
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