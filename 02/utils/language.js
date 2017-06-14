var _language = 'en'

var _Phrases = {
  'productList': {
    'zh': '商品列表',
    'en': 'Product list',
    'ara': ' قائمة المنتجات ',
    'kor': '상품 목록',
  },
  'productDetails': {
    'zh': '商品详情',
    'en': 'Commodity details',
    'ara': ' تفاصيل المنتج ',
    'kor': '상품 설명',
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

export const Languages = {
  'zh': '中文',
  'en': 'English',
  'ara': ' عربي ',
  'kor': '한국어',
}

export function Language(language) {
  if (language) _language = language
  let phrases = {}
  for (let i in _Phrases) {
    phrases[i] = _Phrases[i][_language]
  }
  return phrases
}