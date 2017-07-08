let config = require('config.js')
import { http } from 'http.js'

function getProducts(cid, lang = 'zh', cache = true) {
  return new Promise(function (resolve, reject) {
    let products = getApp().products || {}
    if (products[lang] && products[lang]['_' + cid] && cache) {
      resolve(products[lang]['_' + cid])
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
        let Products = getApp().products || {}
        for (let lang in products) {
          if (!Products[lang]) Products[lang] = {}
          Products[lang]['_' + cid] = products[lang]
        }
        getApp().products = Products
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
        let l1 = JSON.stringify(res.products).length
        for (let i in res.products) {
          let product = res.products[i]
          let id = product.id
          let cid = product.cid
          let sort = product.sort
          let images = JSON.parse(product.images)
          for (let i in images) {
            images[i] = images[i] + config.youImage.mode_w300
          }
          let multi_title = product.title.json()
          let multi_prices = product.prices.json()
          let multi_props = product.props.json()
          for (let lang in multi_title) {
            if (!products[lang]) products[lang] = []
            let title = multi_title[lang]
            let prices = multi_prices[lang]
            let _prices = []
            for (let n = 0; n < prices.length; n += 2) {
              _prices.push({
                label: prices[Number(n) + 0],
                value: prices[Number(n) + 1],
              })
            }
            let props = multi_props[lang]
            let _props = []
            for (let n = 0; n < props.length; n += 2) {
              _props.push({
                label: props[Number(n) + 0],
                value: props[Number(n) + 1],
              })
            }
            prices = _prices
            props = _props
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
  let products = getApp().products
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

  let index = -1
  for (let i in products) {
    if (products[i].id == id) {
      index = i
      break
    }
  }
  if (index < 0) {
    let max = -1
    for (let i in products) {
      if (Number(products[i].sort) > max) {
        max = Number(products[i].sort)
      }
    }
    product.sort = max + 1
    products.push(product)
  } else {
    products[index] = product
  }

  let Products = getApp().products
  Products[lang]['_' + cid] = products
  getApp().listener.trigger('products', products, product)

  /* server start */
  if (getApp().user.role == 'admin') {
    let id = product.id
    let cid = product.cid
    let sort = product.sort
    let title = product.title
    let images = []
    let mode = config.youImage.mode_w300
    for (let i in product.images) {
      let image = product.images[i].replace(mode, '')
      images.push(image)
    }
    let prices = product.prices
    let props = product.props
    // 控制一下单种语言下各属性的长度，免得撑破数据库设计的字段长度
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
      url: '_ftrade/product.php?m=set',
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
  let Products = getApp().products
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

  return products
}

function sort(product, sourceIndex, targetIndex, cb) {
  let cid = product.cid
  let lang = product.lang || 'zh'
  let Products = getApp().products
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

  return products
}

export var Product = {
  getProducts: getProducts,
  getProduct: getProduct,
  set: set,
  del: del,
  sort: sort
}