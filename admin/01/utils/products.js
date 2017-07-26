import { http } from 'http.js'

let app = getApp()

/**
 * options = {
 *  cid: cid,
 *  nocache: false,
 * }
 */
function getProducts(options) {
  return new Promise(function (resolve, reject) {
    let cid = options.cid
    let cache = !options.nocache
    let Products = app.products || {}
    let products = Products['c' + cid]
    if (products && cache) {
      resolve(products)
    } else {
      getProductsFromServer(options)
        .then(function (products) {
          products = transformProducts(products, 'zh')
          let Products = app.products || {}
          Products['c' + cid] = products
          app.products = Products
          resolve(products)
        })
        .catch(function (res) {
          reject(res)
        })
    }
  })
}

function getProductsFromServer(options) {
  return new Promise(function (resolve, reject) {
    http.get({
      url: '_ftrade/product.php?m=getProducts',
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

function transformProducts(products, lang) {
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

function getProductsSync(options) {
  let cid = options.cid
  let Products = app.products
  let products = Products['c' + cid]
  return products
}

function getProduct(options) {
  let id = options.id
  let cid = options.cid
  let Products = app.products
  let products = Products['c' + cid]
  for (let i in products) {
    if (products[i].id == id) {
      return products[i]
    }
  }
}

function set(product, cb) {
  let id = product.id
  let cid = product.cid
  let products = getProductsSync({ cid })

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

  let Products = app.products
  Products['_' + cid] = products
  app.listener.trigger('products', products, product)

  /* server start */
  if (app.user.role == 'admin') {
    let id = product.id
    let cid = product.cid
    let sort = product.sort
    let title = product.title
    let images = product.images
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
      data: { id, cid, title, images, prices, props, sort }
    }).then(function (res) {
      cb && cb(res)
    })
  }
  /* server end */
}

function del(product, cb) {
  let id = product.id
  let cid = product.cid
  let products = getProductsSync({ cid })
  for (let i in products) {
    if (products[i].id == id) {
      products.splice(i, 1)
      break
    }
  }

  /* server start */
  if (app.user.role == 'admin') {
    http.get({
      url: '_ftrade/product.php?m=del',
      data: { id: id }
    }).then(function (res) {
      if (!res.error) {
        cb && cb(products, product)
        app.listener.trigger('products', products, product)
      }
    })
  }
  /* server end */
  return products
}

function sort(product, sourceIndex, targetIndex, cb) {
  let cid = product.cid
  let products = getProductsSync({ cid })
  if (sourceIndex < 0 || sourceIndex >= products.length) {
    return products
  }
  if (targetIndex < 0 || targetIndex >= products.length) {
    return products
  }
  products.splice(sourceIndex, 1)
  products.splice(targetIndex, 0, product)

  /* server start */
  if (app.user.role == 'admin') {
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
            app.listener.trigger('products', products)
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