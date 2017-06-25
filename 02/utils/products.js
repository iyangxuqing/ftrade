import { http } from 'http.js'

function getProducts(cid, lang = 'zh', cache = false) {
  return new Promise(function (resolve, reject) {
    let products = wx.getStorageSync('localProducts') || {}
    if (products[lang] && products[lang]['_' + cid] && cache) {
      resolve(products[lang][_cid])
    } else {
      getProductsFromServer(cid).then(function (products) {
        /**
         * 需要对空数据进行处理，
         * 当该类目刚新建时，读取该类目下的商品，就得到的是空数据，
         * 由于翻译的滞后性，当某产品的某种语言未被翻译时，
         * 该语言下也会出现空数据。
         * 注意空数据和null的区别，空数据是有效数据。
         */
        if (!products[lang]) {
          products[lang] = []
        }
        let Products = wx.getStorageSync('localProducts') || {}
        for (let lang in products) {
          if (!Products[lang]) Products[lang] = {}
          Products[lang]['_' + cid] = products[lang]
        }
        wx.setStorageSync('localProducts', Products)
        resolve(products[lang])
      })
    }
  })
}

function getProductsFromServer(cid) {
  return new Promise(function (resolve, reject) {
    /**
     * 所有语言下的该cid类目的产品数据，构造为：
     * products = {
     *  'zh': [],
     *  'en': [],
     * }
     */
    let products = {}
    http.get({
      url: '_ftrade/product.php?m=get',
      data: { cid: cid }
    }).then(function (res) {
      if (res.errno === 0) {
        for (let i in res.products) {
          let product = res.products[i]
          let id = product.id
          let cid = product.cid
          let sort = product.sort
          let images = JSON.parse(product.images)
          let title = JSON.parse(product.title)
          let prices = JSON.parse(product.prices)
          let props = JSON.parse(product.props)
          for (let lang in title) {
            if (!products[lang]) products[lang] = []
            let _title = title[lang].escape(false)
            let _prices = prices[lang]
            let __prices = []
            for (let n = 0; n < _prices.length; n += 2) {
              __prices.push({
                label: _prices[Number(n) + 0].escape(false),
                value: _prices[Number(n) + 1].escape(false),
              })
            }
            let _props = props[lang]
            let __props = []
            for (let n = 0; n < _props.length; n += 2) {
              props.push({
                label: _props[Number(n) + 0].escape(false),
                value: _props[Number(n) + 1].escape(false),
              })
            }
            title = _title
            prices = __prices
            props = __props
            products[lang].push({
              id, cid, title, images, prices, props, sort
            })
          }
        }
        resolve(products)
      }
    })
  })
}

/**
 * 只有在确保本地存在该类目下产品数据的情况下，
 * 才可以使用getProductsSync同步取得产品数据，
 * 所有使用了getProductsSync函数的方法，也必须在同样的场景下应用。
 * 提供同步数据获取方法的目的是为了在数据明确存在时，简化相关代码。
 */
function getProductsSync(cid, lang = 'zh') {
  let products = wx.getStorageSync('localProducts')
  return products[lang]['_' + cid]
}

function getProduct(id, cid, lang = 'zh') {
  let products = getProductsSync(cid, lang)
  for (let i in products) {
    if (products[i].id == id) {
      return products[i]
    }
  }
}

function set(product, cb) {
  let id = product.id
  let cid = product.cid
  let lang = product.lang || 'zh'
  /**
   * 在增加或编辑产品信息时，调用set(product)方法
   * 在这时，该产品所属于的类目数据一定已经存在，
   * 所以此时可以使用同步方法取得数据。
   */
  let products = getProductsSync(cid, lang)

  let url = ''
  if (!id) {
    let max = -1
    for (let i in products) {
      if (Number(products[i].sort) > max) {
        max = Number(products[i].sort)
      }
    }
    product.id = Date.now()
    product.sort = max + 1
    products.push(product)
    url = '_ftrade/product.php?m=add'
  } else {
    for (let i in products) {
      if (products[i].id == id) {
        products[i] = product
        break
      }
    }
    url = '_ftrade/product.php?m=set'
  }

  let Products = wx.getStorageSync('localProducts')
  Products[lang]['_' + cid] = products
  wx.setStorageSync('localProducts', Products)
  getApp().listener.trigger('products', products, product)

  /* server start */
  if (getApp().user.role == 'admin') {
    let id = product.id
    console.log(id, product)
    let cid = product.cid
    let sort = product.sort
    let title = product.title.escape()
    let images = product.images
    let prices = product.prices
    for (let i in prices) {
      prices[i].label = prices[i].label.escape()
      prices[i].value = prices[i].value.escape()
    }
    let props = product.props
    for (let i in props) {
      props[i].label = props[i].label.escape()
      props[i].value = props[i].value.escape()
    }

    /**
     * 控制一下单种语言下各属性的长度，免得撑破数据库设计的字段长度
     */
    if (title.length > 20) {
      title = title.substr(0, 20)
    }
    while (JSON.stringify(images).length >= 500) {
      images.pop()
    }
    while (JSON.stringify(prices).length >= 200) {
      prices.pop()
    }
    while (JSON.stringify(props).length >= 500) {
      props.pop()
    }

    http.get({
      url: url,
      data: { id, cid, title, images, prices, props, sort, lang }
    }).then(function (res) {
      cb && cb(res)
    })
  }
  /* server end */
}

function del(product, cb) {
  let id = product.id
  let cid = product.cid
  let lang = product.lang || 'zh'
  let Products = wx.getStorageSync('localProducts')
  let products = Products[lang]['_' + cid]
  for (let i in products) {
    if (products[i].id == id) {
      products.splice(i, 1)
      break
    }
  }

  /* server start */
  if (getApp().user.role == 'admin') {
    http.get({
      url: '_ftrade/product.php?m=del',
      data: { id: id }
    }).then(function (res) {
      if (!res.error) {
        cb && cb(products, product)
        getApp().listener.trigger('products', products, product)
      }
    })
  }
  /* server end */

  Products[lang]['_' + cid] = products
  wx.setStorageSync('localProducts', Products)
  return products
}

function sort(product, sourceIndex, targetIndex, cb) {
  let cid = product.cid
  let lang = product.lang || 'zh'
  let Products = wx.getStorageSync('localProducts')
  let products = Products[lang]['_' + cid]
  if (sourceIndex < 0 || sourceIndex >= products.length) {
    return products
  }
  if (targetIndex < 0 || targetIndex >= products.length) {
    return products
  }
  products.splice(sourceIndex, 1)
  products.splice(targetIndex, 0, product)

  /* server start */
  if (getApp().user.role == 'admin') {
    for (let i in products) {
      if (products[i].sort != i) {
        products[i].sort = i
        http.get({
          url: '_ftrade/product.php?m=set',
          data: {
            id: products[i].id,
            sort: products[i].sort
          }
        }).then(function (res) {
          if (!res.error) {
            cb && cb(products, product)
            getApp().listener.trigger('products', products)
          }
        })
      }
    }
  }
  /* server end */

  Products[lang]['_' + cid] = products
  wx.setStorageSync('localProducts', Products)
  return products
}

export var Product = {
  getProducts: getProducts,
  getProduct: getProduct,
  set: set,
  del: del,
  sort: sort
}