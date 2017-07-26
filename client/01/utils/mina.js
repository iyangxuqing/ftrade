/**
 * config.js
 */

let version = 'v1.0.1'
let sid = '725945cd45'

let apiUrl = 'https://yixing01.applinzi.com/api/'

let youImage = {
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
  'networkFail': {
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

export var config = {
  version,
  sid,
  apiUrl,
  youImage,
  phrases,
}

/**
 * utils.js
 */

String.prototype.json = function () {
  let value = this
  let temp = ''
  for (let i = 0; i < value.length; i++) {
    let char = value[i]
    let ascii = value.charCodeAt(i)
    if (ascii === 0) char = 'u0000' //null
    else if (ascii === 8) char = 'u0008' //回退符 \b
    else if (ascii === 9) char = 'u0009' //制表符 \t
    else if (ascii == 10) char = 'u000A' //换行符 \r
    else if (ascii == 11) char = 'u000B' //制表符 \v
    else if (ascii == 12) char = 'u000C' //换页符 \f
    else if (ascii == 13) char = 'u000D' //回车符 \n
    // else if (ascii == 34) char = 'u0022' //双引号 \"
    // else if (ascii == 39) char = 'u0027' //单引号 \'
    else if (ascii == 92) char = 'u005C' //反斜杠 \\
    temp += char
  }
  try {
    let object = JSON.parse(temp, function (key, val) {
      if (key === '') return val
      if (typeof val == 'string') {
        val = val.replace(/u0000/g, '\0')
        val = val.replace(/u0008/g, '\b')
        val = val.replace(/u0009/g, '\t')
        val = val.replace(/u000A/g, '\r')
        val = val.replace(/u000B/g, '\v')
        val = val.replace(/u000C/g, '\f')
        val = val.replace(/u000D/g, '\n')
        val = val.replace(/u0022/g, '"')
        val = val.replace(/u0027/g, "'")
        val = val.replace(/u005C/g, '\\')
      }
      return val
    })
    return object
  } catch (e) {
    return null
  }
}

function formatDateTime(timeStamp) {
  var date = new Date(timeStamp)
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  return y + m + d + ' ' + h + ':' + minute + ':' + second;
}

let Utils = {
  formatDateTime: formatDateTime
}

/**
 * http.js
 */

function httpGet(options) {
  return new Promise(function (resolve, reject) {

    let startTime = Date.now()

    let requestTask = wx.request({
      url: config.apiUrl + options.url,
      header: {
        'sid': config.sid,
        'version': config.version,
        'Content-Type': 'application/json',
        'token': wx.getStorageSync('token'),
      },
      data: options.data,
      success: function (res) {
        if (res.data && res.data.errno === 0) {
          resolve(res.data)
        } else {
          reject(res)
        }
      },
      fail: function (res) {
        reject(res)
      },
      complete: function (res) {
        clearTimeout(timer)
        netlog(startTime, options, res.errMsg)
      }
    })

    let timer = setTimeout(function () {
      requestTask.abort()
      netlog(startTime, options, '30s timeout')
      reject('30s timeout')
    }, 70000)

  })
}

function netlog(startTime, options, status) {
  let endTime = Date.now()
  let dt = endTime - startTime
  let log = {
    startTime: Utils.formatDateTime(startTime),
    diffTime: endTime - startTime,
    url: options.url.split('/')[2],
    data: options.data || '',
    status: status
  }
  wx.request({
    url: config.apiUrl + '_ftrade/client/netlog.php?m=add',
    header: {
      'Content-Type': 'application/json',
      'token': wx.getStorageSync('token'),
    },
    data: log,
  })
}

let http = {
  get: httpGet,
}

/**
 * user.js
 */

function login() {
  wx.login({
    success: function (res) {
      if (res.code) {
        http.get({
          url: '_ftrade/client/user.php?m=login',
          data: {
            code: res.code,
            mina: 'client',
          }
        }).then(function (res) {
          if (res.errno === 0) {
            let token = res.token
            wx.setStorageSync('token', token)
          }
        })
      }
    }
  })
}

export var User = {
  login: login,
}

/**
 * shop.js
 */

/**
 * options = {
 *  nocache: false,
 * }
 */
function getShop(options = {}) {
  return new Promise(function (resolve, reject) {
    let lang = getApp().lang
    let shop = wx.getStorageSync('shop')
    let cache = !options.nocache
    if (shop && cache) {
      shop = transformShop(shop)
      resolve(shop)
    } else {
      http.get({
        url: '_ftrade/client/shop.php?m=get',
      }).then(function (res) {
        if (res.errno === 0) {
          let shop = res.shop
          wx.setStorageSync('shop', shop)
          shop = transformShop(shop, lang)
          resolve(shop)
        }
      })
    }
  })
}

function transformShop(shop, lang) {
  shop.name = shop.name || '[]'
  shop.name = shop.name.json()
  shop.name = shop.name[lang] || shop.name['zh']
  shop.address = shop.address || '[]'
  shop.address = shop.address.json()
  shop.address = shop.address[lang] || shop.address['zh']
  return shop
}

export var Shop = {
  get: getShop,
}

/**
 * categorys.js
 */

/**
 * options = {
 *  nocache: false,
 * }
 */
function getCategorys(options = {}) {
  return new Promise(function (resolve, reject) {
    let lang = getApp().lang
    let cache = !options.nocache
    let cates = wx.getStorageSync('cates')
    if (cates && cache) {
      cates = transformCategorys(cates, lang)
      resolve(cates)
      getCategorysRefresh(cates)
    } else {
      getCategorysFromServer(options).then(function (cates) {
        wx.setStorageSync('cates', cates)
        cates = transformCategorys(cates, lang)
        resolve(cates)
      }).catch(function (res) {
        reject(res)
      })
    }
  })
}

function getCategorysFromServer(options) {
  return new Promise(function (resolve, reject) {
    http.get({
      url: '_ftrade/client/category.php?m=get',
    }).then(function (res) {
      if (res.errno === 0) {
        let cates = res.categorys
        resolve(cates)
      } else {
        reject(res)
      }
    }).catch(function (res) {
      reject(res)
    })
  })
}

function getCategorysRefresh(cates) {
  let lastModified = 0
  for (let i in cates) {
    if (lastModified < cates[i].modified) lastModified = cates[i].modified
  }
  http.get({
    url: '_ftrade/client/category.php?m=refresh',
    data: {
      lastModified: lastModified
    }
  }).then(function (res) {
    if (res.errno === 0) {
      let cates = res.categorys
      if (cates) wx.setStorageSync('cates', cates)
    }
  })
}

function transformCategorys(cates, lang) {
  cates = JSON.parse(JSON.stringify(cates))
  for (let i in cates) {
    cates[i].title = cates[i].title.json()[lang]
  }
  let _cates = []
  for (let i in cates) {
    let cate = cates[i]
    if (cate.pid == 0) {
      cate.children = []
      _cates.push(cate)
    } else {
      for (let j in _cates) {
        if (cate.pid == _cates[j].id) {
          _cates[j].children.push(cate)
          break
        }
      }
    }
  }
  return _cates
}

export var Category = {
  getCategorys: getCategorys,
}

/**
 * products.js
 */

/**
 * options = {
 *  cid: cid,
 *  nocache: false,
 * }
 */
function getProducts(options) {
  return new Promise(function (resolve, reject) {
    let lang = getApp().lang
    let cache = !options.nocache
    let cid = options.cid
    let Products = wx.getStorageSync('products') || {}
    let products = transformProducts(Products, cid, lang)
    if (products && cache) {
      resolve(products)
      getProductsRefresh(cid, products)
    } else {
      getProductsFromServer(options)
        .then(function (products) {
          let Products = wx.getStorageSync('products') || {}
          Products['c' + cid] = products
          let storageSize = wx.getStorageInfoSync().currentSize
          let productsSize = JSON.stringify(products).length / 1000
          if (storageSize + productsSize < 950) {
            wx.setStorageSync('products', Products)
          }
          products = transformProducts(Products, cid, lang)
          resolve(products)
        })
        .catch(function (res) {
          reject(res)
        })
    }
  })
}

/**
 * options = {
 *  id: id,
 *  ids: [],
 * }
 */
function getProduct(options) {
  let lang = getApp().lang
  let Products = wx.getStorageSync('products') || {}
  let products = []
  if ('ids' in options) {
    let ids = options.ids
    for (let i in ids) {
      let id = ids[i]
      let product = null
      for (let j in Products) {
        for (let k in Products[j]) {
          if (Products[j][k].id == id) {
            product = Products[j][k]
            product = transformProduct(product, lang)
            break;
          }
        }
        if (product) break
      }
      if (product) products.push(product)
    }
    return products
  }
}

function getProductsFromServer(options) {
  return new Promise(function (resolve, reject) {
    http.get({
      url: '_ftrade/client/product.php?m=getProducts',
      data: { cid: options.cid },
    })
      .then(function (res) {
        if (res.errno === 0) {
          let products = res.products
          resolve(products)
        } else {
          reject(res)
        }
      })
      .catch(function (res) {
        reject(res)
      })
  })
}

function getProductsRefresh(cid, products) {
  let lastModified = 0
  for (let i in products) {
    if (lastModified < products[i].modified) lastModified = products[i].modified
  }
  http.get({
    url: '_ftrade/client/product.php?m=refreshProducts',
    data: {
      cid,
      lastModified,
    }
  }).then(function (res) {
    if (res.errno === 0) {
      let products = res.products
      if (products) {
        let storageSize = wx.getStorageInfoSync().currentSize
        let productsSize = JSON.stringify(products).length / 1000
        if (storageSize + productsSize < 950) {
          let Products = wx.getStorageSync('products') || {}
          Products['c' + cid] = products
          wx.setStorageSync('products', Products)
        }
      }
    }
  })
}

function transformProducts(products, cid, lang) {
  if (cid =='1496246400245'){

  }
  products = products['c' + cid]
  if (!products) return null
  let _products = []
  for (let i in products) {
    let product = transformProduct(products[i], lang)
    if (product.title) {
      _products.push(product)
    }
  }
  return _products
}

function transformProduct(product, lang) {
  product.title = product.title || '[]'
  product.title = product.title.json() || []
  product.title = product.title[lang]
  product.images = JSON.parse(product.images)

  let prices = product.prices || '[]'
  prices = prices.json() || []
  prices = prices[lang] || []
  let _prices = []
  for (let n = 0; n < prices.length; n += 2) {
    _prices.push({
      label: prices[Number(n) + 0],
      value: prices[Number(n) + 1],
    })
  }
  prices = _prices
  product.prices = prices

  let props = product.props || '[]'
  props = props.json() || []
  props = props[lang] || []
  let _props = []
  for (let n = 0; n < props.length; n += 2) {
    _props.push({
      label: props[Number(n) + 0],
      value: props[Number(n) + 1],
    })
  }
  props = _props
  product.props = props
  return product
}

export var Product = {
  getProducts: getProducts,
  getProduct: getProduct,
}